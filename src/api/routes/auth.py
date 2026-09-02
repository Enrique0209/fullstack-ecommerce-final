"""
Autenticación: registro, login, verificación de email, y ruta de prueba.
"""
from datetime import datetime, timedelta
from flask import request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from api.models import db, User, CarItem, EmailVerification
from api.routes import api
from api.email_service import send_verification_email

bcrypt = Bcrypt()

# Tiempo mínimo entre reenvíos de verificación, para evitar que alguien
# spamee el endpoint y agote la cuota de Resend.
RESEND_COOLDOWN_MINUTES = 2


# ─── RUTA DE PRUEBA ───────────────────────────────────────────────────────────

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


# ─── AUTENTICACIÓN ────────────────────────────────────────────────────────────

def _create_and_send_verification(user):
    """
    Crea una fila EmailVerification para el usuario y dispara el correo.
    Reutilizada por register() y por resend-verification.
    Devuelve True si Resend aceptó el envío, False si falló (el usuario
    y el token igual quedan creados; solo el correo pudo no llegar).
    """
    verification = EmailVerification(user_id=user.id)
    db.session.add(verification)
    db.session.commit()
    return send_verification_email(user, verification.token)


@api.route('/register', methods=['POST'])
def register():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")
    name = body.get("name")

    if not email or not password or not name:
        return jsonify({"message": "Faltan campos obligatorios"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user is not None:
        return jsonify({"message": "Ya existe una cuenta con este email"}), 409

    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=password_hash, name=name)
    db.session.add(new_user)
    db.session.commit()

    # El registro ya quedó exitoso en este punto. Si el correo falla,
    # no revertimos nada — el usuario puede pedir reenvío después.
    email_sent = _create_and_send_verification(new_user)

    if not email_sent:
        return jsonify({
            "message": "Registro exitoso, pero no pudimos enviar el correo de verificación. Puedes pedir que te lo reenviemos desde tu perfil."
        }), 201

    return jsonify({"message": "Registro exitoso :) Revisa tu correo para verificar tu cuenta."}), 201


@api.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    verification = EmailVerification.query.filter_by(token=token).first()

    if verification is None:
        return jsonify({"message": "Link de verificación inválido"}), 404

    if verification.used:
        return jsonify({"message": "Este link ya fue utilizado"}), 400

    if verification.is_expired():
        return jsonify({"message": "Este link expiró. Solicita uno nuevo desde tu perfil."}), 400

    user = User.query.get(verification.user_id)
    user.email_verified = True
    verification.used = True
    db.session.commit()

    return jsonify({"message": "Correo verificado correctamente"}), 200


@api.route('/resend-verification', methods=['POST'])
def resend_verification():
    body = request.get_json()
    email = body.get("email")

    if not email:
        return jsonify({"message": "Falta el email"}), 400

    generic_response = jsonify({
        "message": "Si el correo existe en nuestro sistema, te enviamos un nuevo link de verificación."
    })

    user = User.query.filter_by(email=email).first()

    # No revelamos si el correo existe o no — mismo mensaje en ambos casos.
    if user is None:
        return generic_response, 200

    if user.email_verified:
        return jsonify({"message": "Este correo ya está verificado."}), 200

    # Rate limiting: revisamos el último token creado para este usuario.
    last_verification = (
        EmailVerification.query
        .filter_by(user_id=user.id)
        .order_by(EmailVerification.created_at.desc())
        .first()
    )
    if last_verification:
        time_since_last = datetime.utcnow() - last_verification.created_at
        if time_since_last < timedelta(minutes=RESEND_COOLDOWN_MINUTES):
            seconds_left = int((timedelta(minutes=RESEND_COOLDOWN_MINUTES) - time_since_last).total_seconds())
            return jsonify({
                "message": f"Espera {seconds_left} segundos antes de pedir otro reenvío."
            }), 429

    _create_and_send_verification(user)
    return generic_response, 200


def _merge_guest_cart_into_user(user_id, guest_token):
    """
    Transfiere los CarItem de un guest_token al user_id que acaba de loguearse.
    Si el usuario ya tenía el mismo product_id en su carrito, suma cantidades
    y borra el item de invitado (evita duplicar filas).
    """
    if not guest_token:
        return

    guest_items = CarItem.query.filter_by(guest_token=guest_token).all()
    for guest_item in guest_items:
        existing_item = CarItem.query.filter_by(
            user_id=user_id, product_id=guest_item.product_id
        ).first()

        if existing_item:
            existing_item.quantity += guest_item.quantity
            db.session.delete(guest_item)
        else:
            guest_item.user_id = user_id
            guest_item.guest_token = None

    db.session.commit()


@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")
    user = User.query.filter_by(email=email).first()
    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Credenciales incorrectas"}), 401

    # Mismo header que usa cart.py: si el frontend manda un carrito de
    # invitado activo, lo fusionamos al carrito del usuario recién logueado.
    guest_token = request.headers.get("X-Guest-Token")
    _merge_guest_cart_into_user(user.id, guest_token)

    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.serialize()}), 200
"""
Autenticación: registro, login, y ruta de prueba.
"""
from flask import request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from api.models import db, User, CarItem
from api.routes import api

bcrypt = Bcrypt()


# ─── RUTA DE PRUEBA ───────────────────────────────────────────────────────────

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


# ─── AUTENTICACIÓN ────────────────────────────────────────────────────────────

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
    return jsonify({"message": "Registro exitoso :)"}), 201


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
"""
Perfil de usuario: consulta, actualización y borrado de la propia cuenta.
"""
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, User, EmailVerification
from api.routes import api
from api.email_service import send_verification_email


@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"message": "Usuario no encontrado"}), 404
    return jsonify(user.serialize()), 200


@api.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"message": "Usuario no encontrado"}), 404

    body = request.get_json()
    new_email = body.get("email", user.email)

    # Si el email realmente cambió, el correo anterior ya no es garantía
    # de nada: hay que volver a verificar el nuevo antes de dejarlo
    # comprar "con cuenta" otra vez.
    email_changed = new_email != user.email

    user.name = body.get("name", user.name)
    user.email = new_email

    if email_changed:
        user.email_verified = False

    db.session.commit()

    if email_changed:
        verification = EmailVerification(user_id=user.id)
        db.session.add(verification)
        db.session.commit()
        send_verification_email(user, verification.token)
        return jsonify({
            "message": "Perfil actualizado. Como cambiaste tu email, necesitas verificarlo de nuevo — revisa tu correo."
        }), 200

    return jsonify({"message": "Perfil actualizado exitosamente :)"}), 200


@api.route('/profile', methods=['DELETE'])
@jwt_required()
def delete_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"message": "Usuario no encontrado"}), 404
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "Perfil eliminado exitosamente :)"}), 200
"""
Carrito de compra: soporta usuarios logueados (JWT) e invitados (X-Guest-Token).
Exactamente uno de los dos identifica al dueño del carrito en cada request.
"""
import uuid
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, CarItem
from api.routes import api


def get_cart_owner():
    """
    Devuelve una tupla (user_id, guest_token) según quién sea el dueño
    del carrito en esta request. Exactamente uno de los dos es no-None.
    Devuelve (None, None) si no se pudo identificar a nadie (caller debe
    responder 400 en ese caso).
    """
    user_id = get_jwt_identity()  # None si no hay JWT válido (optional=True)
    if user_id is not None:
        return user_id, None

    guest_token = request.headers.get("X-Guest-Token")
    if not guest_token:
        return None, None

    # Validamos que sea un UUID real antes de tocar la DB.
    # Evita que cualquiera mande strings arbitrarios como token
    # y nos llene la tabla de basura sin control.
    try:
        uuid.UUID(guest_token)
    except (ValueError, AttributeError, TypeError):
        return None, None

    return None, guest_token


@api.route('/cart', methods=['GET'])
@jwt_required(optional=True)
def get_cart():
    user_id, guest_token = get_cart_owner()
    if user_id is None and guest_token is None:
        return jsonify({"message": "Se requiere sesión o X-Guest-Token"}), 400

    if user_id is not None:
        items = CarItem.query.filter_by(user_id=user_id).all()
    else:
        items = CarItem.query.filter_by(guest_token=guest_token).all()

    return jsonify([item.serialize() for item in items]), 200


@api.route('/cart', methods=['POST'])
@jwt_required(optional=True)
def add_to_cart():
    user_id, guest_token = get_cart_owner()
    if user_id is None and guest_token is None:
        return jsonify({"message": "Se requiere sesión o X-Guest-Token"}), 400

    body = request.get_json()
    product_id = body.get("product_id")
    quantity = body.get("quantity", 1)

    if user_id is not None:
        existing_item = CarItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    else:
        existing_item = CarItem.query.filter_by(guest_token=guest_token, product_id=product_id).first()

    if existing_item:
        existing_item.quantity += quantity
    else:
        new_item = CarItem(
            user_id=user_id,
            guest_token=guest_token,
            product_id=product_id,
            quantity=quantity,
        )
        db.session.add(new_item)

    db.session.commit()
    return jsonify({"message": "Producto agregado al carrito exitosamente :)"}), 201


@api.route('/cart/<int:item_id>', methods=['DELETE'])
@jwt_required(optional=True)
def remove_from_cart(item_id):
    user_id, guest_token = get_cart_owner()
    if user_id is None and guest_token is None:
        return jsonify({"message": "Se requiere sesión o X-Guest-Token"}), 400

    if user_id is not None:
        item = CarItem.query.filter_by(id=item_id, user_id=user_id).first()
    else:
        item = CarItem.query.filter_by(id=item_id, guest_token=guest_token).first()

    if item is None:
        return jsonify({"message": "Item no encontrado en el carrito"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Producto eliminado del carrito exitosamente :)"}), 200


@api.route('/cart/<int:item_id>', methods=['PUT'])
@jwt_required(optional=True)
def update_cart_item(item_id):
    user_id, guest_token = get_cart_owner()
    if user_id is None and guest_token is None:
        return jsonify({"message": "Se requiere sesión o X-Guest-Token"}), 400

    if user_id is not None:
        item = CarItem.query.filter_by(id=item_id, user_id=user_id).first()
    else:
        item = CarItem.query.filter_by(id=item_id, guest_token=guest_token).first()

    if item is None:
        return jsonify({"message": "Item no encontrado en el carrito"}), 404

    body = request.get_json()
    quantity = body.get("quantity")
    if quantity is None or quantity < 1:
        return jsonify({"message": "Cantidad inválida"}), 400

    item.quantity = quantity
    db.session.commit()
    return jsonify({"message": "Cantidad actualizada exitosamente :)"}), 200
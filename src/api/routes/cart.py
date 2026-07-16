"""
Carrito de compra: siempre requiere sesión (jwt_required), es propio de cada usuario.
"""
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, CarItem
from api.routes import api


@api.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    items = CarItem.query.filter_by(user_id=user_id).all()
    return jsonify([item.serialize() for item in items]), 200


@api.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    body = request.get_json()
    product_id = body.get("product_id")
    quantity = body.get("quantity", 1)
    existing_item = CarItem.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing_item:
        existing_item.quantity += quantity
    else:
        new_item = CarItem(user_id=user_id, product_id=product_id, quantity=quantity)
        db.session.add(new_item)
    db.session.commit()
    return jsonify({"message": "Producto agregado al carrito exitosamente :)"}), 201


@api.route('/cart/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_from_cart(item_id):
    user_id = get_jwt_identity()
    item = CarItem.query.filter_by(id=item_id, user_id=user_id).first()
    if item is None:
        return jsonify({"message": "Item no encontrado en el carrito"}), 404
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Producto eliminado del carrito exitosamente :)"}), 200


@api.route('/cart/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    user_id = get_jwt_identity()
    item = CarItem.query.filter_by(id=item_id, user_id=user_id).first()
    if item is None:
        return jsonify({"message": "Item no encontrado en el carrito"}), 404

    body = request.get_json()
    quantity = body.get("quantity")
    if quantity is None or quantity < 1:
        return jsonify({"message": "Cantidad inválida"}), 400

    item.quantity = quantity
    db.session.commit()
    return jsonify({"message": "Cantidad actualizada exitosamente :)"}), 200
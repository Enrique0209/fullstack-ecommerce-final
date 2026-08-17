"""
Productos: consulta pública, actualización y borrado (solo admin).
"""
from flask import request, jsonify
from api.models import db, Product, CarItem
from api.decorators import admin_required
from api.routes import api


@api.route('/product', methods=['GET'])
def get_products():
    products = Product.query.all()
    serialized_products = [product.serialize() for product in products]
    return jsonify(serialized_products), 200


@api.route('/product/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if product is None:
        return jsonify({"message": "Producto no encontrado"}), 404
    return jsonify(product.serialize()), 200


@api.route('/product/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    product = Product.query.get(product_id)
    if product is None:
        return jsonify({"message": "Producto no encontrado"}), 404

    body = request.get_json()
    new_sku = body.get("sku", product.sku)

    if not new_sku or not new_sku.strip():
        return jsonify({"message": "El SKU es obligatorio"}), 400

    if new_sku != product.sku:
        existing = Product.query.filter_by(sku=new_sku).first()
        if existing is not None:
            return jsonify({"message": "Ya existe un producto con ese SKU"}), 409

    product.sku = new_sku
    product.name = body.get("name", product.name)
    product.price = body.get("price", product.price)
    product.price_horeca = body.get("price_horeca", product.price_horeca)
    product.description = body.get("description", product.description)
    product.stock = body.get("stock", product.stock)
    product.subcategory_id = body.get("subcategory_id", product.subcategory_id)
    product.image_url = body.get("image_url", product.image_url)
    db.session.commit()
    return jsonify({"message": "Producto actualizado exitosamente :)"}), 200


@api.route('/product/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    product = Product.query.get(product_id)
    if product is None:
        return jsonify({"message": "Producto no encontrado"}), 404

    CarItem.query.filter_by(product_id=product_id).delete()

    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Producto eliminado exitosamente :)"}), 200
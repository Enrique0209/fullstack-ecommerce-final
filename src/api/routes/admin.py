"""
Panel de admin: creación de categorías, subcategorías y productos.
Todo bajo /admin/* y protegido con @admin_required.
"""
from flask import request, jsonify
from api.models import db, Category, SubCategory, Product
from api.decorators import admin_required
from api.routes import api


@api.route('/admin/category', methods=['POST'])
@admin_required
def admin_create_category():
    body = request.get_json()
    name = body.get("name")
    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()
    return jsonify({"message": "Categoría creada exitosamente :)"}), 201


@api.route('/admin/subcategory', methods=['POST'])
@admin_required
def admin_create_subcategory():
    body = request.get_json()
    name = body.get("name")
    category_id = body.get("category_id")
    new_subcategory = SubCategory(name=name, category_id=category_id)
    db.session.add(new_subcategory)
    db.session.commit()
    return jsonify({"message": "Subcategoría creada exitosamente :)"}), 201


@api.route('/admin/product', methods=['POST'])
@admin_required
def admin_create_product():
    body = request.get_json()
    sku = body.get("sku")
    name = body.get("name")
    price = body.get("price")
    price_horeca = body.get("price_horeca")
    description = body.get("description")
    stock = body.get("stock")
    subcategory_id = body.get("subcategory_id")
    image_url = body.get("image_url")

    if not sku or not sku.strip():
        return jsonify({"message": "El SKU es obligatorio"}), 400

    existing = Product.query.filter_by(sku=sku).first()
    if existing is not None:
        return jsonify({"message": "Ya existe un producto con ese SKU"}), 409

    new_product = Product(sku=sku, name=name, price=price, price_horeca=price_horeca,
                          description=description, stock=stock,
                          subcategory_id=subcategory_id, image_url=image_url)
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Producto creado exitosamente :)"}), 201


# ─── Hacer admin temporal ────────────────────────────────────────────────────────
# @api.route('/make-admin/<email>', methods=['GET'])
# def make_admin(email):
#     user = User.query.filter_by(email=email).first()
#     if user is None:
#         return jsonify({"message": "Usuario no encontrado"}), 404
#     user.is_admin = True
#     db.session.commit()
#     return jsonify({"message": "Usuario actualizado a admin", "email": user.email}), 200
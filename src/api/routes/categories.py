"""
Categorías y subcategorías: consulta pública, creación solo admin.
"""
from flask import request, jsonify
from api.models import db, Category, SubCategory
from api.decorators import admin_required
from api.routes import api


# ─── CATEGORÍAS ───────────────────────────────────────────────────────────────

@api.route('/category', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    return jsonify([c.serialize() for c in categories]), 200


@api.route('/category', methods=['POST'])
@admin_required
def create_category():
    body = request.get_json()
    name = body.get("name")
    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()
    return jsonify({"message": "Categoría creada exitosamente :)"}), 201


# ─── SUBCATEGORÍAS ────────────────────────────────────────────────────────────

@api.route('/subcategory', methods=['GET'])
def get_subcategories():
    subcategories = SubCategory.query.all()
    return jsonify([s.serialize() for s in subcategories]), 200


@api.route('/subcategory', methods=['POST'])
@admin_required
def create_subcategory():
    body = request.get_json()
    name = body.get("name")
    category_id = body.get("category_id")
    new_subcategory = SubCategory(name=name, category_id=category_id)
    db.session.add(new_subcategory)
    db.session.commit()
    return jsonify({"message": "Subcategoría creada exitosamente :)"}), 201
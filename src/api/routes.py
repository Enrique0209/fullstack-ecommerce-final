"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Product, Category, SubCategory
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token


bcrypt = Bcrypt()

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/register', methods=['POST'])
def register():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")
    name = body.get("name")
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(email=email, password=password_hash, name=name)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Registro exitoso :)"}), 201


@api.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")
    user = User.query.filter_by(email=email).first()
    if user is None or not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Credenciales incorrectas"}), 401
    token = create_access_token(identity=str(user.id))
    return jsonify({"token": token, "user": user.serialize()}), 200
   
   
    
@api.route('/product', methods=['GET'])
def get_products():
    products = Product.query.all()
    serialized_products = [product.serialize() for product in products]
    return jsonify(serialized_products), 200

@api.route('/product', methods=['POST'])
def create_product():
    body = request.get_json()
    name = body.get("name")
    price = body.get("price")
    price_horeca = body.get("price_horeca")
    description = body.get("description")
    stock = body.get("stock")
    subcategory_id = body.get("subcategory_id")
    new_product = Product(name=name, price=price, price_horeca=price_horeca, 
                         description=description, stock=stock, 
                         subcategory_id=subcategory_id)
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Producto creado exitosamente :)"}), 201

@api.route('/product/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    if product is None:
        return jsonify({"message": "Producto no encontrado"}), 404
    return jsonify(product.serialize()), 200

@api.route('/category', methods=['POST'])
def create_category():
    body = request.get_json()
    name = body.get("name")
    new_category = Category(name=name)
    db.session.add(new_category)
    db.session.commit()
    return jsonify({"message": "Categoría creada exitosamente :)"}), 201

@api.route('/subcategory', methods=['POST'])
def create_subcategory():
    body = request.get_json()
    name = body.get("name")
    category_id = body.get("category_id")
    new_subcategory = SubCategory(name=name, category_id=category_id)
    db.session.add(new_subcategory)
    db.session.commit()
    return jsonify({"message": "Subcategoría creada exitosamente :)"}), 201


"""
Registro central del Blueprint 'api'.

Cada módulo de dominio (auth, products, categories, cart, profile, admin)
importa este 'api' y le agrega sus propias rutas con @api.route(...).

Los imports van al final a propósito: el Blueprint 'api' debe existir
primero para que los módulos de dominio puedan importarlo sin generar
un import circular.
"""
from flask import Blueprint
from flask_cors import CORS

api = Blueprint('api', __name__)
CORS(api)

# Importa cada módulo de dominio para que registren sus rutas en 'api'.
# El orden no importa funcionalmente, se mantiene el orden original.
from api.routes import auth
from api.routes import products
from api.routes import categories
from api.routes import cart
from api.routes import profile
from api.routes import admin
from api.routes import order
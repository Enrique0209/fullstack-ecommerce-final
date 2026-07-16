"""
Decoradores reutilizables para la API.
"""
from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import User


def admin_required(fn):
    """
    Combina @jwt_required() + verificación de is_admin en un solo decorador.
    Uso: reemplaza el patrón repetido de

        @jwt_required()
        def algo():
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user.is_admin:
                return jsonify({"message": "Acceso denegado"}), 403
            ...

    por simplemente:

        @admin_required
        def algo():
            ...
    """
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if user is None or not user.is_admin:
            return jsonify({"message": "Acceso denegado"}), 403
        return fn(*args, **kwargs)
    return wrapper
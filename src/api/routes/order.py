"""
Pedidos: creación con verificación de pago contra la API de PayPal.
El backend nunca confía en el total que envía el frontend — siempre
recalcula desde los precios reales en la base de datos.
"""
import os
import requests
from datetime import datetime
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.models import db, CarItem, Product, Order, OrderItem, User
from api.routes import api


PAYPAL_MODE = os.getenv("PAYPAL_MODE", "sandbox")
PAYPAL_BASE_URL = (
    "https://api-m.sandbox.paypal.com" if PAYPAL_MODE == "sandbox"
    else "https://api-m.paypal.com"
)


def get_paypal_access_token():
    """Se autentica con PayPal usando Client ID + Secret y devuelve un token temporal."""
    client_id = os.getenv("PAYPAL_CLIENT_ID")
    client_secret = os.getenv("PAYPAL_CLIENT_SECRET")

    response = requests.post(
        f"{PAYPAL_BASE_URL}/v1/oauth2/token",
        auth=(client_id, client_secret),
        headers={"Accept": "application/json", "Accept-Language": "en_US"},
        data={"grant_type": "client_credentials"}
    )

    if response.status_code != 200:
        return None

    return response.json().get("access_token")


def verify_paypal_order(paypal_order_id, access_token):
    """Consulta el pedido en PayPal y devuelve su estado + monto pagado, o None si falla."""
    response = requests.get(
        f"{PAYPAL_BASE_URL}/v2/checkout/orders/{paypal_order_id}",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    if response.status_code != 200:
        return None

    data = response.json()
    status = data.get("status")

    purchase_units = data.get("purchase_units", [])
    if not purchase_units:
        return None

    amount = purchase_units[0].get("amount", {}).get("value")

    return {"status": status, "amount": amount}


@api.route('/order', methods=['POST'])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"message": "Usuario no encontrado"}), 404

    body = request.get_json()
    paypal_order_id = body.get("paypal_order_id")

    if not paypal_order_id:
        return jsonify({"message": "Falta el ID de la orden de PayPal"}), 400

    # Evitar procesar dos veces el mismo pago (protección extra además del unique en DB)
    existing_order = Order.query.filter_by(paypal_order_id=paypal_order_id).first()
    if existing_order is not None:
        return jsonify({"message": "Este pago ya fue procesado"}), 409

    # ── Datos de dirección ──────────────────────────────────────────────
    shipping_address = body.get("shipping_address")
    shipping_address2 = body.get("shipping_address2")
    shipping_postal_code = body.get("shipping_postal_code")
    shipping_city = body.get("shipping_city")
    shipping_province = body.get("shipping_province")
    shipping_phone = body.get("shipping_phone")

    required_shipping = [shipping_address, shipping_postal_code, shipping_city, shipping_province, shipping_phone]
    if not all(required_shipping):
        return jsonify({"message": "Faltan datos de la dirección de entrega"}), 400

    billing_same_as_shipping = body.get("billing_same_as_shipping", True)
    billing_address = None
    billing_postal_code = None
    billing_city = None
    billing_province = None
    billing_cif = None
    billing_name = None

    if not billing_same_as_shipping:
        billing_address = body.get("billing_address")
        billing_postal_code = body.get("billing_postal_code")
        billing_city = body.get("billing_city")
        billing_province = body.get("billing_province")
        billing_cif = body.get("billing_cif")
        billing_name = body.get("billing_name")

        required_billing = [billing_address, billing_postal_code, billing_city, billing_province, billing_name]
        if not all(required_billing):
            return jsonify({"message": "Faltan datos de la dirección de facturación"}), 400

    # ── Verificación del pago contra PayPal ─────────────────────────────
    access_token = get_paypal_access_token()
    if access_token is None:
        return jsonify({"message": "No se pudo verificar el pago con PayPal"}), 502

    paypal_data = verify_paypal_order(paypal_order_id, access_token)
    if paypal_data is None:
        return jsonify({"message": "No se pudo verificar la orden de PayPal"}), 502

    if paypal_data["status"] != "COMPLETED":
        return jsonify({"message": "El pago no está completado"}), 400

    # ── Leer carrito y calcular total real desde la DB ──────────────────
    cart_items = CarItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"message": "El carrito está vacío"}), 400

    calculated_total = 0
    order_items_data = []

    for item in cart_items:
        product = Product.query.get(item.product_id)
        if product is None:
            return jsonify({"message": f"Producto no encontrado (id {item.product_id})"}), 404

        if product.stock < item.quantity:
            return jsonify({
                "message": f"Lo sentimos, en estos momentos no hay stock suficiente de '{product.name}'"
            }), 409

        unit_price = product.price_horeca if user.is_horeca else product.price
        calculated_total += unit_price * item.quantity

        order_items_data.append({
            "product": product,
            "quantity": item.quantity,
            "unit_price": unit_price
        })

    calculated_total = round(calculated_total, 2)
    paypal_amount = round(float(paypal_data["amount"]), 2)

    if calculated_total != paypal_amount:
        return jsonify({
            "message": "El monto pagado no coincide con el total del carrito. Contacta con soporte."
        }), 400

    # ── Todo válido: crear el pedido ────────────────────────────────────
    new_order = Order(
        user_id=user_id,
        created_at=datetime.utcnow(),
        total=calculated_total,
        status="paid",
        paypal_order_id=paypal_order_id,
        shipping_address=shipping_address,
        shipping_address2=shipping_address2,
        shipping_postal_code=shipping_postal_code,
        shipping_city=shipping_city,
        shipping_province=shipping_province,
        shipping_phone=shipping_phone,
        billing_same_as_shipping=billing_same_as_shipping,
        billing_address=billing_address,
        billing_postal_code=billing_postal_code,
        billing_city=billing_city,
        billing_province=billing_province,
        billing_cif=billing_cif,
        billing_name=billing_name,
    )
    db.session.add(new_order)
    db.session.flush()  # para obtener new_order.id antes del commit final

    for item_data in order_items_data:
        product = item_data["product"]
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"]
        )
        db.session.add(order_item)
        product.stock -= item_data["quantity"]

    CarItem.query.filter_by(user_id=user_id).delete()

    db.session.commit()

    return jsonify({
        "message": "Pedido creado exitosamente :)",
        "order": new_order.serialize()
    }), 201


@api.route('/order', methods=['GET'])
@jwt_required()
def get_my_orders():
    user_id = get_jwt_identity()
    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    return jsonify([order.serialize() for order in orders]), 200
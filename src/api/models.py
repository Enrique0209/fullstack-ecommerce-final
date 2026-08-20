from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import String, Boolean, ForeignKey, Float, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)
    is_horeca: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=False)
    is_admin: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=False)
    name: Mapped[str]= mapped_column(String(80), nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_horeca": self.is_horeca,
            "name": self.name,
            "is_admin": self.is_admin,
            # do not serialize the password, its a security breach
        }
    
class Category(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]= mapped_column(String(80), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
        }
        
class SubCategory(db.Model):
    __tablename__ = "subcategory"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]= mapped_column(String(80), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("category.id"), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "category_id": self.category_id,
        }
    
class Product(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    sku: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name: Mapped[str]= mapped_column(String(80), nullable=False)
    description: Mapped[str]= mapped_column(String(), nullable=True)
    price: Mapped[float]=mapped_column(Float(), nullable=False)
    price_horeca: Mapped[float]=mapped_column(Float(), nullable=False)
    stock: Mapped[int]=mapped_column(Integer(),nullable=False)
    image_url: Mapped[str] = mapped_column(String(), nullable=True)
    subcategory_id: Mapped[int] = mapped_column(ForeignKey("subcategory.id"), nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "sku": self.sku,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "price_horeca": self.price_horeca,
            "stock": self.stock,
            "image_url": self.image_url,
            "subcategory_id": self.subcategory_id,
            
        }
    
class CarItem(db.Model):
    __tablename__ = "cart_item"
    id: Mapped[int] = mapped_column(primary_key=True)
    # Nullable ahora: un item de carrito pertenece a un user_id (logueado)
    # O a un guest_token (invitado), nunca ambos, nunca ninguno.
    # Esa regla se valida en cart.py, no aquí a nivel DB, para no complicar
    # la migración con un CheckConstraint.
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=True)
    guest_token: Mapped[str] = mapped_column(String(36), nullable=True, index=True)
    product_id: Mapped[int] = mapped_column(ForeignKey("product.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "guest_token": self.guest_token,
            "product_id": self.product_id,
            "quantity": self.quantity,
            
        }
    
class Order(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    # Nullable ahora: un pedido pertenece a un user_id (logueado) O a un
    # guest_name/guest_email (invitado), nunca ambos, nunca ninguno.
    # Misma regla que en CarItem, validada en order.py.
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=True)
    guest_name: Mapped[str] = mapped_column(String(150), nullable=True)
    guest_email: Mapped[str] = mapped_column(String(120), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False)
    total: Mapped[float] = mapped_column(Float(), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)
    paypal_order_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    # Dirección de entrega (obligatoria)
    shipping_address: Mapped[str] = mapped_column(String(200), nullable=False)
    shipping_address2: Mapped[str] = mapped_column(String(100), nullable=True)
    shipping_postal_code: Mapped[str] = mapped_column(String(10), nullable=False)
    shipping_city: Mapped[str] = mapped_column(String(80), nullable=False)
    shipping_province: Mapped[str] = mapped_column(String(80), nullable=False)
    shipping_phone: Mapped[str] = mapped_column(String(20), nullable=False)

    # Facturación
    billing_same_as_shipping: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=True)
    billing_address: Mapped[str] = mapped_column(String(200), nullable=True)
    billing_postal_code: Mapped[str] = mapped_column(String(10), nullable=True)
    billing_city: Mapped[str] = mapped_column(String(80), nullable=True)
    billing_province: Mapped[str] = mapped_column(String(80), nullable=True)
    billing_cif: Mapped[str] = mapped_column(String(20), nullable=True)
    billing_name: Mapped[str] = mapped_column(String(150), nullable=True)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "guest_name": self.guest_name,
            "guest_email": self.guest_email,
            "created_at": self.created_at,
            "total": self.total,
            "status": self.status,
            "paypal_order_id": self.paypal_order_id,
            "shipping_address": self.shipping_address,
            "shipping_address2": self.shipping_address2,
            "shipping_postal_code": self.shipping_postal_code,
            "shipping_city": self.shipping_city,
            "shipping_province": self.shipping_province,
            "shipping_phone": self.shipping_phone,
            "billing_same_as_shipping": self.billing_same_as_shipping,
            "billing_address": self.billing_address,
            "billing_postal_code": self.billing_postal_code,
            "billing_city": self.billing_city,
            "billing_province": self.billing_province,
            "billing_cif": self.billing_cif,
            "billing_name": self.billing_name,
        }
    
class OrderItem(db.Model):
    __tablename__ = "order_item"
    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("order.id"), nullable=False)
    product_id: Mapped[int] = mapped_column(ForeignKey("product.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer(), nullable=False)
    unit_price: Mapped[float]=mapped_column(Float(), nullable=False)
   

    def serialize(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            "unit_price": self.unit_price,
        }
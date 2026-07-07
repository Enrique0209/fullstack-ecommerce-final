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
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    product_id: Mapped[int] = mapped_column(ForeignKey("product.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "product_id": self.product_id,
            "quantity": self.quantity,
            
        }
    
class Order(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(), nullable=False)
    total: Mapped[float] = mapped_column(Float(), nullable=False)
    status: Mapped[str] = mapped_column(String(50), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "created_at": self.created_at,
            "total": self.total,
            "status": self.status,
            
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
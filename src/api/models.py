from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    is_horeca: Mapped[bool] = mapped_column(Boolean(), nullable=False, default=False)
    name: Mapped[str]= mapped_column(String(80), nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "is_horeca": self.is_horeca,
            "name": self.name,
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
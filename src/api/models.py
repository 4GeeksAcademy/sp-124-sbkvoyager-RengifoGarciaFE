from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date

db = SQLAlchemy()


class AdminUser(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email
        }


class Ubication(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    country: Mapped[str] = mapped_column(nullable=False)
    city: Mapped[str] = mapped_column(nullable=False)
    zip_code: Mapped[int] = mapped_column(nullable=False)
    street: Mapped[str] = mapped_column(nullable=False)
    number: Mapped[int] = mapped_column(nullable=False)

    users: Mapped[list["User"]] = relationship(back_populates="ubication")

    def serialize(self):
        return {
            "id": self.id,
            "country": self.country,
            "city": self.city,
            "zip_code": self.zip_code,
            "street": self.street,
            "number": self.number
        }


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nickname: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    surname: Mapped[str] = mapped_column(String(120), nullable=False)
    birthdate: Mapped[date] = mapped_column(Date, nullable=False)
    is_professional_dancer: Mapped[bool] = mapped_column(
        Boolean(), nullable=False)
    ubication_id: Mapped[int] = mapped_column(
        ForeignKey("ubication.id"), nullable=False)

    ubication: Mapped["Ubication"] = relationship(back_populates="users")

    def serialize(self):
        return {
            "id": self.id,
            "nickname": self.nickname,
            "email": self.email,
            "name": self.name,
            "surname": self.surname,
            "birthdate": self.birthdate.isoformat(),
            "is_professional_dancer": self.is_professional_dancer,
            "ubication": self.ubication.serialize() if self.ubication else None
        }


class Post(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str] = mapped_column(
        String(10), nullable=False)
    event_date: Mapped[date] = mapped_column(Date, nullable=False)
    schedule: Mapped[str] = mapped_column(
        String(15), nullable=False)
    styles: Mapped[str] = mapped_column(String(120),nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    contact_number: Mapped[int] = mapped_column(nullable=False)
    owner_name: Mapped[str] = mapped_column(
        String(120), nullable=False)
    description: Mapped[str] = mapped_column(
        String(120), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "type": self.type,
            "event_date": self.event_date.isoformat(),
            "schedule": self.schedule,
            "styles": self.styles,
            "name": self.name,
            "contact_number":self.contact_number,
            "owner_name": self.owner_name,
            "description": self.description
        }

class Comment(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    text: Mapped[str] = mapped_column(db.String(255), nullable=False)
    puntuation: Mapped[int] = mapped_column(nullable=False)
    
    def serialize(self):
        return {
            "id": self.id,
            "texto": self.text,
            "puntuacion": self.puntuation
        }
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

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import date

db = SQLAlchemy()


# ======================
# ADMIN
# ======================
class AdminUser(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email
        }


# ======================
# UBICATION
# ======================
class Ubication(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    country: Mapped[str] = mapped_column(nullable=False)
    city: Mapped[str] = mapped_column(nullable=False)
    zip_code: Mapped[int] = mapped_column(nullable=False)
    street: Mapped[str] = mapped_column(nullable=False)
    number: Mapped[int] = mapped_column(nullable=False)

    users: Mapped[list["User"]] = relationship(back_populates="ubication")
    posts: Mapped[list["Post"]] = relationship(back_populates="ubication")

    def serialize(self):
        return {
            "id": self.id,
            "country": self.country,
            "city": self.city,
            "zip_code": self.zip_code,
            "street": self.street,
            "number": self.number
        }


# ======================
# USER
# ======================
class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    nickname: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    surname: Mapped[str] = mapped_column(String(120), nullable=False)
    birthdate: Mapped[date] = mapped_column(Date, nullable=False)
    is_professional_dancer: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    ubication_id: Mapped[int] = mapped_column(
        ForeignKey("ubication.id"), nullable=False
    )

    ubication: Mapped["Ubication"] = relationship(back_populates="users")
    posts: Mapped[list["Post"]] = relationship(back_populates="user")
    comments: Mapped[list["Comment"]] = relationship(back_populates="user")

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


# ======================
# POST
# ======================
class Post(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    type: Mapped[str] = mapped_column(String(10), nullable=False)
    event_date: Mapped[date] = mapped_column(Date, nullable=False)
    schedule: Mapped[str] = mapped_column(String(15), nullable=False)
    styles: Mapped[str] = mapped_column(String(120), nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    
    contact_number: Mapped[str] = mapped_column(String(20), nullable=False)
    owner_name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=False)
    is_approved: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False
    )
    ubication_id: Mapped[int] = mapped_column(
        ForeignKey("ubication.id"), nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="posts")
    ubication: Mapped["Ubication"] = relationship(back_populates="posts")
    comments: Mapped[list["Comment"]] = relationship(
        back_populates="post", cascade="all, delete"
    )
    images: Mapped[list["ImagePost"]] = relationship(
        back_populates="post", cascade="all, delete"
    )

    def serialize(self):
        return {
            "id": self.id,
            "type": self.type,
            "event_date": self.event_date.isoformat(),
            "schedule": self.schedule,
            "styles": self.styles,
            "name": self.name,
            "contact_number": self.contact_number,
            "owner_name": self.owner_name,
            "description": self.description,
            "is_approved": self.is_approved,
            "user_id": self.user_id,
            "ubication_id": self.ubication_id,
            "user": self.user.serialize() if self.user else None,
            "ubication": self.ubication.serialize() if self.ubication else None
        }


# ======================
# COMMENT
# ======================
class Comment(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    text: Mapped[str] = mapped_column(String(255), nullable=False)
    puntuation: Mapped[int] = mapped_column(nullable=False)

    post_id: Mapped[int] = mapped_column(
        ForeignKey("post.id"), nullable=False
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), nullable=False
    )

    post: Mapped["Post"] = relationship(back_populates="comments")
    user: Mapped["User"] = relationship(back_populates="comments")

    def serialize(self):
        return {
            "id": self.id,
            "text": self.text,
            "puntuation": self.puntuation,
            "post_id": self.post_id,
            "user_id": self.user_id
        }


# ======================
# IMAGE POST
# ======================
class ImagePost(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    url: Mapped[str] = mapped_column(String(255), nullable=False)

    post_id: Mapped[int] = mapped_column(
        ForeignKey("post.id"), nullable=False
    )

    post: Mapped["Post"] = relationship(back_populates="images")

    def serialize(self):
        return {
            "id": self.id,
            "url": self.url,
            "post_id": self.post_id
        }

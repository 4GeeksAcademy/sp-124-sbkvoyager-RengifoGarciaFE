"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, AdminUser, Ubication
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from datetime import date

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

# ver todos los admin


@api.route('/admin-user', methods=['GET'])
def get_admins():
    adminsUser = AdminUser.query.all()
    return jsonify([user.serialize() for user in adminsUser]), 200


# ver un admin
@api.route('/admin-user/<int:admin_user_id>', methods=['GET'])
def get_user(admin_user_id):
    adminUser = AdminUser.query.get(admin_user_id)
    if adminUser is None:
        return jsonify({"msg": "Admin not found"}), 404
    return jsonify(adminUser.serialize()), 200


# #crear un admin
@api.route('/admin-user', methods=['POST'])
def add_user():
    data = request.json

    required_fields = ["email", "password"]
    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"Missing field: {field}"}), 400

    existing_admin_user = AdminUser.query.filter_by(
        email=data["email"]).first()
    if existing_admin_user:
        return jsonify({"msg": "Email already registered"}), 400

    new_admin_user = AdminUser(
        email=data["email"],
        password=data["password"],
        is_active=True
    )

    db.session.add(new_admin_user)
    db.session.commit()

    return jsonify(new_admin_user.serialize()), 201

# #editar un admin


@api.route('/admin-user/<int:admin_user_id>', methods=['PUT'])
def update_admin_user(admin_user_id):
    adminUser = AdminUser.query.get(admin_user_id)
    if adminUser is None:
        return jsonify({"msg": "Admin not found"}), 404

    data = request.json
    adminUser.email = data.get("email", adminUser.email)

    db.session.commit()

    return jsonify(adminUser.serialize()), 200


# #eliminar un admin
@api.route('/admin-user/<int:admin_user_id>', methods=['DELETE'])
def delete_user(admin_user_id):
    adminUser = AdminUser.query.get(admin_user_id)
    if adminUser is None:
        return jsonify({"msg": "User not found"}), 404

    db.session.delete(adminUser)
    db.session.commit()

    return jsonify({"msg": "Admin deleted"}), 200


# ver todos los users
@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.serialize() for u in users]), 200

# ver un user


@api.route('/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify(user.serialize()), 200

# crear user


@api.route('/users', methods=['POST'])
def create_user():
    data = request.json

    required_fields = [
        "nickname",
        "email",
        "password",
        "name",
        "surname",
        "birthdate",
        "is_professional_dancer",
        "ubication_id"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"Missing field: {field}"}), 400

    # comprobar ubication
    ubication = Ubication.query.get(data["ubication_id"])
    if not ubication:
        return jsonify({"msg": "Ubication not found"}), 404

    new_user = User(
        nickname=data["nickname"],
        email=data["email"],
        password=data["password"],  # luego hash
        name=data["name"],
        surname=data["surname"],
        birthdate=date.fromisoformat(data["birthdate"]),
        is_professional_dancer=data["is_professional_dancer"],
        ubication_id=data["ubication_id"]
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.serialize()), 201


# editar user
@api.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.json

    if "ubication_id" in data:
        ubication = Ubication.query.get(data["ubication_id"])
        if not ubication:
            return jsonify({"msg": "Ubication not found"}), 404
        user.ubication_id = data["ubication_id"]

    user.nickname = data.get("nickname", user.nickname)
    user.email = data.get("email", user.email)
    user.name = data.get("name", user.name)
    user.surname = data.get("surname", user.surname)
    user.is_professional_dancer = data.get(
        "is_professional_dancer",
        user.is_professional_dancer
    )

    if "birthdate" in data:
        user.birthdate = date.fromisoformat(data["birthdate"])

    db.session.commit()
    return jsonify(user.serialize()), 200

# eliminar user


@api.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "User deleted"}), 200


# ver todas las ubicaciones
@api.route('/ubications', methods=['GET'])
def get_ubications():
    ubications = Ubication.query.all()
    return jsonify([u.serialize() for u in ubications]), 200

# ver una ubicacion


@api.route('/ubications/<int:ubication_id>', methods=['GET'])
def get_ubication(ubication_id):
    u = Ubication.query.get(ubication_id)
    if not u:
        return jsonify({"msg": "Ubication not found"}), 404
    return jsonify(u.serialize()), 200

# crear ubicacion


@api.route('/ubications', methods=['POST'])
def create_ubication():
    data = request.json
    required_fields = ["country", "city", "zip_code", "street", "number"]

    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"Missing field: {field}"}), 400

    new_ub = Ubication(
        country=data["country"],
        city=data["city"],
        zip_code=data["zip_code"],
        street=data["street"],
        number=data["number"]
    )
    db.session.add(new_ub)
    db.session.commit()
    return jsonify(new_ub.serialize()), 201

# actualizar ubicacion


@api.route('/ubications/<int:ubication_id>', methods=['PUT'])
def update_ubication(ubication_id):
    u = Ubication.query.get(ubication_id)
    if not u:
        return jsonify({"msg": "Ubication not found"}), 404

    data = request.json
    u.country = data.get("country", u.country)
    u.city = data.get("city", u.city)
    u.zip_code = data.get("zip_code", u.zip_code)
    u.street = data.get("street", u.street)
    u.number = data.get("number", u.number)

    db.session.commit()
    return jsonify(u.serialize()), 200

# eliminar ubicacion


@api.route('/ubications/<int:ubication_id>', methods=['DELETE'])
def delete_ubication(ubication_id):
    u = Ubication.query.get(ubication_id)
    if not u:
        return jsonify({"msg": "Ubication not found"}), 404

    db.session.delete(u)
    db.session.commit()
    return jsonify({"msg": "Ubication deleted"}), 200

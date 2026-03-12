""" This module takes care of starting the API Server, Loading the DB and Adding the endpoints """

from flask import request, jsonify, Blueprint
from api.models import db, User, AdminUser, Ubication, Post, Comment, ImagePost
from flask_cors import CORS
from datetime import date
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


# -----------------------------
# ADMIN USERS
# -----------------------------
@api.route('/admin-user', methods=['GET'])
def get_admins():
    admins_user = AdminUser.query.all()
    return jsonify([user.serialize() for user in admins_user]), 200


@api.route('/admin-user/<int:admin_user_id>', methods=['GET'])
def get_admin(admin_user_id):
    admin_user = AdminUser.query.get(admin_user_id)
    if admin_user is None:
        return jsonify({"msg": "Admin not found"}), 404
    return jsonify(admin_user.serialize()), 200


@api.route('/admin-user', methods=['POST'])
def add_admin_user():
    data = request.json or {}
    required_fields = ["email", "password"]

    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"Missing field: {field}"}), 400

    existing_admin_user = AdminUser.query.filter_by(email=data["email"]).first()
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


@api.route('/admin-user/<int:admin_user_id>', methods=['PUT'])
def update_admin_user(admin_user_id):
    admin_user = AdminUser.query.get(admin_user_id)
    if admin_user is None:
        return jsonify({"msg": "Admin not found"}), 404

    data = request.json or {}
    admin_user.email = data.get("email", admin_user.email)
    admin_user.password = data.get("password", admin_user.password)
    admin_user.is_active = data.get("is_active", admin_user.is_active)

    db.session.commit()
    return jsonify(admin_user.serialize()), 200


@api.route('/admin-user/<int:admin_user_id>', methods=['DELETE'])
def delete_admin_user(admin_user_id):
    admin_user = AdminUser.query.get(admin_user_id)
    if admin_user is None:
        return jsonify({"msg": "Admin not found"}), 404

    db.session.delete(admin_user)
    db.session.commit()
    return jsonify({"msg": "Admin deleted"}), 200


# -----------------------------
# USERS
# -----------------------------
@api.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([u.serialize() for u in users]), 200


@api.route('/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify(user.serialize()), 200


@api.route('/users', methods=['POST'])
def create_user():
    data = request.json or {}
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

    existing_user = User.query.filter_by(email=data["email"]).first()
    if existing_user:
        return jsonify({"msg": "Email already registered"}), 400

    ubication = Ubication.query.get(data["ubication_id"])
    if not ubication:
        return jsonify({"msg": "Ubication not found"}), 404

    new_user = User(
        nickname=data["nickname"],
        email=data["email"],
        password=data["password"],
        name=data["name"],
        surname=data["surname"],
        birthdate=date.fromisoformat(data["birthdate"]),
        is_professional_dancer=data["is_professional_dancer"],
        ubication_id=data["ubication_id"]
    )

    db.session.add(new_user)
    db.session.commit()
    return jsonify(new_user.serialize()), 201


@api.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.json or {}

    if "ubication_id" in data:
        ubication = Ubication.query.get(data["ubication_id"])
        if not ubication:
            return jsonify({"msg": "Ubication not found"}), 404
        user.ubication_id = data["ubication_id"]

    user.nickname = data.get("nickname", user.nickname)
    user.email = data.get("email", user.email)
    user.password = data.get("password", user.password)
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


@api.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user_by_id(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"msg": "User deleted"}), 200


# -----------------------------
# UBICATIONS
# -----------------------------
@api.route('/ubications', methods=['GET'])
def get_ubications():
    ubications = Ubication.query.all()
    return jsonify([u.serialize() for u in ubications]), 200


@api.route('/ubications/<int:ubication_id>', methods=['GET'])
def get_ubication(ubication_id):
    ubication = Ubication.query.get(ubication_id)
    if not ubication:
        return jsonify({"msg": "Ubication not found"}), 404
    return jsonify(ubication.serialize()), 200


@api.route('/ubications', methods=['POST'])
def create_ubication():
    data = request.json or {}
    required_fields = ["country", "city", "zip_code", "street", "number"]

    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"Missing field: {field}"}), 400

    new_ubication = Ubication(
        country=data["country"],
        city=data["city"],
        zip_code=data["zip_code"],
        street=data["street"],
        number=data["number"]
    )

    db.session.add(new_ubication)
    db.session.commit()
    return jsonify(new_ubication.serialize()), 201


@api.route('/ubications/<int:ubication_id>', methods=['PUT'])
def update_ubication(ubication_id):
    ubication = Ubication.query.get(ubication_id)
    if not ubication:
        return jsonify({"msg": "Ubication not found"}), 404

    data = request.json or {}
    ubication.country = data.get("country", ubication.country)
    ubication.city = data.get("city", ubication.city)
    ubication.zip_code = data.get("zip_code", ubication.zip_code)
    ubication.street = data.get("street", ubication.street)
    ubication.number = data.get("number", ubication.number)

    db.session.commit()
    return jsonify(ubication.serialize()), 200


@api.route('/ubications/<int:ubication_id>', methods=['DELETE'])
def delete_ubication(ubication_id):
    ubication = Ubication.query.get(ubication_id)
    if not ubication:
        return jsonify({"msg": "Ubication not found"}), 404

    db.session.delete(ubication)
    db.session.commit()
    return jsonify({"msg": "Ubication deleted"}), 200


# -----------------------------
# POSTS
# -----------------------------
@api.route('/posts', methods=['GET'])
def get_posts():
    posts = Post.query.all()
    return jsonify([p.serialize() for p in posts]), 200


@api.route('/posts/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"msg": "Post not found"}), 404
    return jsonify(post.serialize()), 200


@api.route('/posts/<int:post_id>/comments', methods=['GET'])
def get_comments_by_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"msg": "Post not found"}), 404

    comments = Comment.query.filter_by(post_id=post_id).all()
    return jsonify([c.serialize() for c in comments]), 200


@api.route('/posts', methods=['POST'])
@jwt_required()
def create_post():
    data = request.json or {}

    required_fields = [
        "type",
        "event_date",
        "schedule",
        "styles",
        "name",
        "contact_number",
        "owner_name",
        "description",
        "ubication_id"
    ]

    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"Missing field: {field}"}), 400

    current_user_id = int(get_jwt_identity())

    ubication = Ubication.query.get(data["ubication_id"])
    if not ubication:
        return jsonify({"msg": "Ubication not found"}), 404

    new_post = Post(
        type=data["type"],
        event_date=date.fromisoformat(data["event_date"]),
        schedule=data["schedule"],
        styles=data["styles"],
        name=data["name"],
        contact_number=data["contact_number"],
        owner_name=data["owner_name"],
        description=data["description"],
        user_id=current_user_id,
        ubication_id=data["ubication_id"]
    )

    db.session.add(new_post)
    db.session.commit()
    return jsonify(new_post.serialize()), 201


@api.route('/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"msg": "Post not found"}), 404

    data = request.json or {}

    if "ubication_id" in data:
        ubication = Ubication.query.get(data["ubication_id"])
        if not ubication:
            return jsonify({"msg": "Ubication not found"}), 404
        post.ubication_id = data["ubication_id"]

    post.type = data.get("type", post.type)
    if "event_date" in data:
        post.event_date = date.fromisoformat(data["event_date"])
    post.schedule = data.get("schedule", post.schedule)
    post.styles = data.get("styles", post.styles)
    post.name = data.get("name", post.name)
    post.contact_number = data.get("contact_number", post.contact_number)
    post.owner_name = data.get("owner_name", post.owner_name)
    post.description = data.get("description", post.description)

    db.session.commit()
    return jsonify(post.serialize()), 200


@api.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"msg": "Post not found"}), 404

    db.session.delete(post)
    db.session.commit()
    return jsonify({"msg": "Post deleted"}), 200


# -----------------------------
# COMMENTS
# -----------------------------
@api.route('/comments', methods=['GET'])
def get_comments():
    comments = Comment.query.all()
    return jsonify([c.serialize() for c in comments]), 200


@api.route('/comments/<int:comment_id>', methods=['GET'])
def get_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"msg": "Comment not found"}), 404
    return jsonify(comment.serialize()), 200


@api.route('/comments', methods=['POST'])
@jwt_required()
def create_comment():
    data = request.json or {}

    required_fields = ["text", "puntuation", "post_id"]

    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"Missing field: {field}"}), 400

    current_user_id = int(get_jwt_identity())

    post = Post.query.get(data["post_id"])
    if not post:
        return jsonify({"msg": "Post not found"}), 404

    new_comment = Comment(
        text=data["text"],
        puntuation=data["puntuation"],
        post_id=data["post_id"],
        user_id=current_user_id
    )

    db.session.add(new_comment)
    db.session.commit()
    return jsonify(new_comment.serialize()), 201


@api.route('/comments/<int:comment_id>', methods=['PUT'])
def update_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"msg": "Comment not found"}), 404

    data = request.json or {}

    if "post_id" in data:
        post = Post.query.get(data["post_id"])
        if not post:
            return jsonify({"msg": "Post not found"}), 404
        comment.post_id = data["post_id"]

    comment.text = data.get("text", comment.text)
    comment.puntuation = data.get("puntuation", comment.puntuation)

    db.session.commit()
    return jsonify(comment.serialize()), 200


@api.route('/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"msg": "Comment not found"}), 404

    db.session.delete(comment)
    db.session.commit()
    return jsonify({"msg": "Comment deleted"}), 200


# -----------------------------
# IMAGES POST
# -----------------------------
@api.route('/images-post', methods=['GET'])
def get_images():
    images = ImagePost.query.all()
    return jsonify([image.serialize() for image in images]), 200


@api.route('/images-post/<int:image_id>', methods=['GET'])
def get_image(image_id):
    image = ImagePost.query.get(image_id)
    if not image:
        return jsonify({"msg": "Image not found"}), 404
    return jsonify(image.serialize()), 200


@api.route('/images-post', methods=['POST'])
def create_image():
    data = request.json or {}
    required_fields = ["url", "post_id"]

    for field in required_fields:
        if field not in data:
            return jsonify({"msg": f"Missing field: {field}"}), 400

    post = Post.query.get(data["post_id"])
    if not post:
        return jsonify({"msg": "Post not found"}), 404

    new_image = ImagePost(
        url=data["url"],
        post_id=data["post_id"]
    )

    db.session.add(new_image)
    db.session.commit()
    return jsonify(new_image.serialize()), 201


@api.route('/images-post/<int:image_id>', methods=['PUT'])
def update_image(image_id):
    image = ImagePost.query.get(image_id)
    if not image:
        return jsonify({"msg": "Image not found"}), 404

    data = request.json or {}

    if "post_id" in data:
        post = Post.query.get(data["post_id"])
        if not post:
            return jsonify({"msg": "Post not found"}), 404
        image.post_id = data["post_id"]

    image.url = data.get("url", image.url)

    db.session.commit()
    return jsonify(image.serialize()), 200


@api.route('/images-post/<int:image_id>', methods=['DELETE'])
def delete_image(image_id):
    image = ImagePost.query.get(image_id)
    if not image:
        return jsonify({"msg": "Image not found"}), 404

    db.session.delete(image)
    db.session.commit()
    return jsonify({"msg": "Image deleted"}), 200


# -----------------------------
# AUTH USER
# -----------------------------
@api.route('/token', methods=['POST'])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if email is None or password is None:
        return jsonify({"msg": "Email and password are required"}), 400

    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": access_token,
        "user_id": user.id
    }), 200


@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)

    if user is None:
        return jsonify({"msg": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "nickname": user.nickname,
        "email": user.email
    }), 200
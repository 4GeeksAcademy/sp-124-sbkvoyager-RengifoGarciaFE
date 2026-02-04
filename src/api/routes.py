"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User,AdminUser
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST','GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

#ver todos los admin
@api.route('/admin-user', methods=['GET'])
def get_admins():
    adminsUser = AdminUser.query.all() 
    return jsonify([user.serialize() for user in adminsUser]), 200


#ver un admin
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
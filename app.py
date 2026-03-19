from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os

app = Flask(__name__)

# 配置
app.config['SECRET_KEY'] = 'your-secret-key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pets.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 初始化扩展
db = SQLAlchemy(app)
jwt = JWTManager(app)

# 数据模型
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)

class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    breed = db.Column(db.String(50), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    habit = db.Column(db.String(200), nullable=False)
    characterDesc = db.Column(db.String(500), nullable=False)
    image = db.Column(db.String(200), nullable=False)

class AdoptionRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    reason = db.Column(db.String(500), nullable=False)
    contact = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(20), default='pending')

# 创建数据库
db.create_all()

# 注册接口
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    phone = data.get('phone')
    
    # 检查用户名是否已存在
    if User.query.filter_by(username=username).first():
        return jsonify({'message': '用户名已存在'}), 400
    
    # 创建新用户
    new_user = User(username=username, password=password, phone=phone)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': '注册成功'}), 201

# 登录接口
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # 验证用户
    user = User.query.filter_by(username=username, password=password).first()
    if not user:
        return jsonify({'message': '账号密码错误'}), 401
    
    # 创建访问令牌
    access_token = create_access_token(identity=user.id)
    return jsonify({'message': '登录成功', 'access_token': access_token}), 200

# 宠物列表（首页）
@app.route('/api/pets', methods=['GET'])
def get_pets():
    pets = Pet.query.all()
    pet_list = []
    for pet in pets:
        pet_list.append({
            'id': pet.id,
            'name': pet.name,
            'breed': pet.breed,
            'age': pet.age,
            'image': pet.image
        })
    return jsonify(pet_list), 200

# 宠物详情
@app.route('/api/pet/detail/<int:id>', methods=['GET'])
def get_pet_detail(id):
    pet = Pet.query.get(id)
    if not pet:
        return jsonify({'message': '宠物不存在'}), 404
    
    return jsonify({
        'id': pet.id,
        'name': pet.name,
        'breed': pet.breed,
        'age': pet.age,
        'gender': pet.gender,
        'habit': pet.habit,
        'characterDesc': pet.characterDesc,
        'image': pet.image
    }), 200

# 领养申请
@app.route('/api/adopt', methods=['POST'])
@jwt_required()
def adopt_pet():
    user_id = get_jwt_identity()
    data = request.get_json()
    pet_id = data.get('petId')
    reason = data.get('reason')
    contact = data.get('contact')
    
    # 检查宠物是否存在
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({'message': '宠物不存在'}), 404
    
    # 创建领养申请
    new_request = AdoptionRequest(
        user_id=user_id,
        pet_id=pet_id,
        reason=reason,
        contact=contact
    )
    db.session.add(new_request)
    db.session.commit()
    
    return jsonify({'message': '申请成功'}), 201

# 领养历史
@app.route('/api/adoption-history', methods=['GET'])
@jwt_required()
def get_adoption_history():
    user_id = get_jwt_identity()
    requests = AdoptionRequest.query.filter_by(user_id=user_id).all()
    
    history = []
    for req in requests:
        pet = Pet.query.get(req.pet_id)
        history.append({
            'id': req.id,
            'pet_name': pet.name if pet else '未知宠物',
            'reason': req.reason,
            'contact': req.contact,
            'status': req.status
        })
    
    return jsonify(history), 200

# 宠物上新
@app.route('/api/pet/add', methods=['POST'])
def add_pet():
    data = request.get_json()
    name = data.get('name')
    breed = data.get('breed')
    age = data.get('age')
    gender = data.get('gender')
    habit = data.get('habit')
    characterDesc = data.get('characterDesc')
    image = data.get('image')
    
    # 创建新宠物
    new_pet = Pet(
        name=name,
        breed=breed,
        age=age,
        gender=gender,
        habit=habit,
        characterDesc=characterDesc,
        image=image
    )
    db.session.add(new_pet)
    db.session.commit()
    
    return jsonify({'message': '上新成功'}), 201

if __name__ == '__main__':
    app.run(debug=True)

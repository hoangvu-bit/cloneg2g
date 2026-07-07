from flask import Flask, request, jsonify
from flasgger import Swagger
from flask_cors import CORS
import pyodbc
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
import re

app = Flask(__name__)
app.config["SECRET_KEY"] = "my_super_secret_key_2026"
CORS(app)

# Cấu hình Swagger template hỗ trợ Authorization header Bearer token
swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "Shop API",
        "version": "1.0"
    },
    "securityDefinitions": {
        "Bearer": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "Nhập: Bearer <Access Token>"
        }
    }
}

swagger = Swagger(app, template=swagger_template)

# Cấu hình kết nối SQL Server của HoangVu
conn_str = (
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=192.168.31.107;"
    "Database=ShopBanHang;"
    "UID=hoanvu;"
    "PWD=Vu@123123;"
)

def get_db_connection():
    return pyodbc.connect(conn_str)

def is_valid_email(mail):
    return bool(re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", mail or ""))

def is_valid_phone(phone):
    normalized_phone = re.sub(r"[\s-]", "", phone or "")
    return bool(re.match(r"^\+?\d{8,15}$", normalized_phone))

def check_db_schema():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check and add 'Role' column
        cursor.execute("""
            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'Role'
        """)
        if not cursor.fetchone():
            print("Adding 'Role' column to 'Users' table...")
            cursor.execute("ALTER TABLE Users ADD Role VARCHAR(50) DEFAULT 'regular'")
            cursor.execute("UPDATE Users SET Role = 'regular' WHERE Role IS NULL")
            conn.commit()
            
        # Check and add 'CompanyName' column
        cursor.execute("""
            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'CompanyName'
        """)
        if not cursor.fetchone():
            print("Adding 'CompanyName' column to 'Users' table...")
            cursor.execute("ALTER TABLE Users ADD CompanyName NVARCHAR(255)")
            conn.commit()

        # Check and add 'TaxId' column
        cursor.execute("""
            SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_NAME = 'Users' AND COLUMN_NAME = 'TaxId'
        """)
        if not cursor.fetchone():
            print("Adding 'TaxId' column to 'Users' table...")
            cursor.execute("ALTER TABLE Users ADD TaxId VARCHAR(100)")
            conn.commit()
            
        conn.close()
        print("Database schema check completed successfully!")
    except Exception as e:
        print(f"Error checking/updating database schema: {e}")


def is_valid_account(mail):
    normalized_mail = re.sub(r"[\s-]", "", mail or "")
    return normalized_mail if is_valid_email(normalized_mail) or is_valid_phone(normalized_mail) else ""

def is_valid_name(name):    
    return bool(name and name.strip())

def is_valid_password(password):
    return bool(
        password
        and len(password) >= 8
        and re.search(r"[A-Z]", password)
        and re.search(r"\d", password)
        and re.search(r"[^A-Za-z0-9]", password)
    )

@app.route("/")
def home():
    """
    Trang chủ API
    ---
    tags:
      - Home
    responses:
      200:
        description: API hoạt động bình thường
    """
    return {"message": "Hello Flask"}

@app.route('/register', methods=['POST'])
def register():
    """
    Đăng ký tài khoản
    ---
    tags:
      - Authentication
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
              example: Nguyễn Văn A
            mail:
              type: string
              example: abc@gmail.com
            password:
              type: string
              example: Abc@1234
    responses:
      201:
        description: Đăng ký thành công
      400:
        description: Dữ liệu không hợp lệ
      409:
        description: Tài khoản đã tồn tại
    """
    data = request.json
    name = (data.get('name') or '').strip()
    mail = is_valid_account(data.get('mail') or '')
    password = data.get('password') or ''
    role = (data.get('role') or 'regular').strip()
    company_name = (data.get('company_name') or '').strip() or None
    tax_id = (data.get('tax_id') or '').strip() or None

    if role not in ['regular', 'business']:
        role = 'regular'

    if not is_valid_name(name):
        return jsonify({"message": "Vui lòng nhập tên hiển thị"}), 400

    if not mail:
        return jsonify({"message": "Email hoặc số điện thoại không đúng định dạng"}), 400

    if not is_valid_password(password): 
        return jsonify({"message": "Mật khẩu phải có ít nhất 8 ký tự, có chữ hoa, số và ký tự đặc biệt"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT 1 FROM Users WHERE Mail = ?", (mail,))
        existing_user = cursor.fetchone()

        if existing_user:
            conn.close()
            return jsonify({"message": "Tài khoản đã tồn tại"}), 409

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        cursor.execute(
            "INSERT INTO Users (Name, Mail, Password, CreatedAt, Role, CompanyName, TaxId) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (name, mail, hashed.decode('utf-8'), datetime.now(), role, company_name, tax_id),
        )
        conn.commit()
        conn.close()
        return jsonify({
            "message": "Đăng ký thành công", 
            "user": {
                "mail": mail, 
                "name": name,
                "role": role
            }
        }), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    """
    Đăng nhập
    ---
    tags:
      - Authentication
    consumes:
      - application/json
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            mail:
              type: string
              example: abc@gmail.com
            password:
              type: string
              example: Abc@123456
    responses:
      200:
        description: Đăng nhập thành công
      400:
        description: Thiếu dữ liệu
      401:
        description: Sai email hoặc mật khẩu
    """
    data = request.json
    print(f"Dữ liệu nhận được: {data}")
    mail = is_valid_account(data.get('mail') or '')
    password = data.get('password') or ''

    if not mail:
        return jsonify({"message": "Email hoặc số điện thoại không đúng định dạng"}), 400

    if not password:
        return jsonify({"message": "Nhập mật khẩu"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT Id, Name, Password, Role FROM Users WHERE Mail = ?", (mail,))
    user = cursor.fetchone()
    conn.close()

    if user and bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):
        payload = {
            "user_id": user[0],
            "user_name": user[1],
            "mail": mail,
            "role": user[3] or 'regular',
            "exp": datetime.now(timezone.utc) + timedelta(hours=1)
        }

        token = jwt.encode(
            payload,
            app.config["SECRET_KEY"],
            algorithm="HS256"
        )

        return jsonify({
            "message": "Đăng nhập thành công",
            "access_token": token,
            "user": {
                "id": user[0],
                "mail": mail,
                "name": user[1],
                "role": user[3] or 'regular'
            }
        }), 200
    else:
        return jsonify({"message": "Sai email hoặc mật khẩu"}), 401

if __name__ == '__main__':
    check_db_schema()
    app.run(debug=True, port=5000)
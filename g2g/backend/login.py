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

# Cấu hình kết nối SQL Server
conn_str_original = (
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=192.168.31.107;"
    "Database=ShopBanHang;"
    "UID=hoanvu;"
    "PWD=Vu#123;"
)

conn_str_local = (
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=.\\SQLEXPRESS;"
    "Database=ShopBanHang;"
    "Trusted_Connection=yes;"
)

def get_db_connection():
    try:
        # Thử kết nối từ xa
        return pyodbc.connect(conn_str_original, timeout=2)
    except Exception:
        # Dự phòng kết nối local SQLEXPRESS sử dụng Windows Authentication
        return pyodbc.connect(conn_str_local)

def is_valid_email(mail):
    return bool(re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", mail or ""))

def is_valid_phone(phone):
    normalized_phone = re.sub(r"[\s-]", "", phone or "")
    return bool(re.match(r"^\+?\d{8,15}$", normalized_phone))

def check_db_schema():
    # 1. Khởi tạo cơ sở dữ liệu nếu chưa tồn tại
    for conn_str in [conn_str_original, conn_str_local]:
        try:
            server = ""
            auth = ""
            for part in conn_str.split(';'):
                if part.lower().startswith('server='):
                    server = part
                elif part.lower().startswith('trusted_connection='):
                    auth = part
                elif part.lower().startswith('uid='):
                    auth += ";" + part
                elif part.lower().startswith('pwd='):
                    auth += ";" + part
            
            master_str = f"Driver={{ODBC Driver 17 for SQL Server}};{server};Database=master;{auth}"
            m_conn = pyodbc.connect(master_str, autocommit=True, timeout=2)
            cursor = m_conn.cursor()
            cursor.execute("SELECT name FROM sys.databases WHERE name = 'ShopBanHang'")
            if not cursor.fetchone():
                print("Creating ShopBanHang database...")
                cursor.execute("CREATE DATABASE ShopBanHang")
            m_conn.close()
            break
        except Exception as e:
            print(f"Checking database master failed for connection: {e}")

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Tạo bảng Users nếu chưa tồn tại
        cursor.execute("""
            SELECT 1 FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_NAME = 'Users'
        """)
        if not cursor.fetchone():
            print("Creating 'Users' table...")
            cursor.execute("""
                CREATE TABLE Users (
                    Id INT IDENTITY(1,1) PRIMARY KEY,
                    Name NVARCHAR(255) NOT NULL,
                    Mail VARCHAR(255) NOT NULL UNIQUE,
                    Password VARCHAR(255) NOT NULL,
                    CreatedAt DATETIME DEFAULT GETDATE(),
                    Role VARCHAR(50) DEFAULT 'regular',
                    CompanyName NVARCHAR(255),
                    TaxId VARCHAR(100)
                )
            """)
            conn.commit()
            
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
    print(f"Data received: {data}")
    mail = is_valid_account(data.get('mail') or '')
    password = data.get('password') or ''

    if not mail:
        return jsonify({"message": "Email hoặc số điện thoại không đúng định dạng"}), 400

    if not password:
        return jsonify({"message": "Nhập mật khẩu"}), 400
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT Id, Name, Password, Role FROM Users WHERE Mail = ?", (mail,))
        user = cursor.fetchone()
        conn.close()
    except Exception as e:
        return jsonify({"message": f"Lỗi kết nối cơ sở dữ liệu: {str(e)}"}), 500

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

@app.route('/upgrade-seller', methods=['POST'])
def upgrade_seller():
    """
    Nâng cấp tài khoản lên người bán (Seller)
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
    responses:
      200:
        description: Nâng cấp thành công
      400:
        description: Yêu cầu không hợp lệ
      444:
        description: Không tìm thấy tài khoản
    """
    data = request.json
    mail = is_valid_account(data.get('mail') or '')

    if not mail:
        return jsonify({"message": "Email hoặc số điện thoại không đúng định dạng"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1 FROM Users WHERE Mail = ?", (mail,))
        if not cursor.fetchone():
            conn.close()
            return jsonify({"message": "Tài khoản không tồn tại"}), 404

        cursor.execute("UPDATE Users SET Role = 'seller' WHERE Mail = ?", (mail,))
        conn.commit()
        conn.close()
        return jsonify({"message": "Nâng cấp người bán thành công", "role": "seller"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

if __name__ == '__main__':
    check_db_schema()
    app.run(debug=True, port=5000)
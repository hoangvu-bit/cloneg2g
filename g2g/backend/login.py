import os
from urllib.parse import urlparse
from flask import Flask, request, jsonify
from flasgger import Swagger
from flask_cors import CORS
import pyodbc
import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
import re
from functools import wraps
from flask.json.provider import DefaultJSONProvider
from decimal import Decimal

app = Flask(__name__)
app.config["SECRET_KEY"] = os.environ.get("JWT_SECRET") or os.environ.get("SECRET_KEY")
if not app.config["SECRET_KEY"]:
    raise RuntimeError("Missing JWT_SECRET or SECRET_KEY environment variable")

allowed_origins = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if origin.strip()
]
CORS(app, resources={r"/*": {"origins": allowed_origins}})
class CustomJSONProvider(DefaultJSONProvider):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        return super().default(o)
app.json = CustomJSONProvider(app)

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

conn_str = os.environ.get("DATABASE_URL") or (
        "Driver={ODBC Driver 17 for SQL Server};"
        "Server=KHAIAI\\KHAAI;"
        "Database=ShopBanHang;"
        "Trusted_Connection=yes;"
    )

def get_db_connection():
      return pyodbc.connect(conn_str)


def server_error(message="Loi may chu"):
      return jsonify({"message": message}), 500


def to_float(value, default=0.0):
      return float(value) if value is not None else default


def get_user_by_id(user_id):
      conn = get_db_connection()
      try:
          cursor = conn.cursor()
          cursor.execute(
              "SELECT Id, Name, Mail, Role, Balance FROM Users WHERE Id = ?",
              (user_id,),
          )
          return cursor.fetchone()
      finally:
          conn.close()


def row_to_user(row):
      return {
          "id": row[0],
          "name": row[1],
          "mail": row[2],
          "role": row[3] or "user",
          "balance": to_float(row[4]),
      }


def create_access_token(user_id):
      payload = {
          "user_id": user_id,
          "iat": datetime.now(timezone.utc),
          "exp": datetime.now(timezone.utc) + timedelta(hours=1),
      }
      return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")


def parse_positive_decimal(value):
      if isinstance(value, bool):
          return None
      try:
          number = Decimal(str(value))
      except Exception:
          return None
      return number if number > 0 else None


def parse_positive_int(value):
      if isinstance(value, bool):
          return None
      try:
          number = int(value)
      except (TypeError, ValueError):
          return None
      return number if number > 0 else None


def is_valid_http_url(value):
      if not value:
          return True
      if len(value) > 500:
          return False
      parsed = urlparse(value)
      return parsed.scheme in ("http", "https") and bool(parsed.netloc)


def is_valid_email(mail):
      return bool(re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", mail or ""))


def is_valid_phone(phone):
      normalized_phone = re.sub(r"[\s-]", "", phone or "")
      return bool(re.match(r"^(?:\+?84|0)\d{9}$", normalized_phone))


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
def seller_required(f):
      @wraps(f)
      def decorated(user, *args, **kwargs):

          if (user.get("role") or "").lower() != "seller":
              return jsonify({
                  "message": "Chỉ người bán mới được thực hiện chức năng này"
              }), 403

          return f(user, *args, **kwargs)

      return decorated
@app.route("/public")
def public():
        return jsonify({
            "message":"API này không cần đăng nhập"
        })
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
        data = request.get_json(silent=True)
        if not data:
          return jsonify({"message": "Không nhận được dữ liệu JSON"}), 400
        name = (data.get('name') or '').strip()
        mail = is_valid_account(data.get('mail') or '')
        password = data.get('password') or ''

        if not is_valid_name(name ):
            return jsonify({"message": "Vui lòng nhập tên hiển thị"}), 400

        if not mail:
            return jsonify({"message": "Email hoặc số điện thoại không đúng định dạng"}), 400

        if not is_valid_password(password): 
            return jsonify({"message": "Mật khẩu phải có ít nhất 8 ký tự, có chữ hoa, số và ký tự đặc biệt"}), 400

        conn = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()

            cursor.execute("SELECT 1 FROM Users WHERE Mail = ?", (mail,))
            existing_user = cursor.fetchone()

            if existing_user:
                conn.close()
                conn = None
                return jsonify({"message": "Tài khoản đã tồn tại"}), 409

            hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            cursor.execute(
                "INSERT INTO Users (Name, Mail, Password, CreatedAt, Role) VALUES (?, ?, ?, ?, ?)",
                (name, mail, hashed.decode('utf-8'), datetime.now(), 'user'),
            )
            conn.commit()
            conn.close()
            conn = None
            return jsonify({"message": "Đăng ký thành công", "user": {"mail": mail, "name": name, "role": "user"}}), 201
        except Exception:
            if conn:
                conn.rollback()
            return jsonify({"message": "Khong the xu ly yeu cau"}), 400
        finally:
            if conn:
                conn.close()
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
        data = request.get_json(silent=True)
        if not data:
          return jsonify({"message": "Không nhận được dữ liệu"}), 400
        mail = is_valid_account(data.get('mail') or '')
        password = data.get('password') or ''

        if not mail:
            return jsonify({"message": "Email hoặc số điện thoại không đúng định dạng"}), 400

        if not password:
            return jsonify({"message": "Nhập mật khẩu"}), 400
        
        conn = None
        try:
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT Id, Name, Password, Role, Balance FROM Users WHERE Mail = ?", (mail,))
            user = cursor.fetchone()
        except Exception:
            return server_error()
        finally:
            if conn:
                conn.close()

        if not user:
            return jsonify({"message": "Sai email hoac mat khau"}), 401

        balance_val = float(user[4]) if user[4] is not None else 0.0
        if user and bcrypt.checkpw(password.encode('utf-8'), user[2].encode('utf-8')):

          token = create_access_token(user[0])

          return jsonify({
            "message": "Đăng nhập thành công",
            "access_token": token,
            "user": {
                "id": user[0],
                "mail": mail,
                "name": user[1],
                "role": user[3] or 'user',
                "balance": balance_val
            }
        }), 200

        else:
            return jsonify({"message": "Sai email hoặc mật khẩu"}), 401
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"message": "Thiếu token"}), 401

        try:
            token = auth_header.split(" ", 1)[1].strip()
            if not token:
                return jsonify({"message": "Thieu token"}), 401

            data = jwt.decode(
                token,
                app.config["SECRET_KEY"],
                algorithms=["HS256"]
            )
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token da het han"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token khong hop le"}), 401

        current_user = get_user_by_id(data.get("user_id"))
        if not current_user:
            return jsonify({"message": "Khong tim thay nguoi dung"}), 404

        return f(row_to_user(current_user), *args, **kwargs)

    return decorated


@app.route('/register-seller', methods=['POST'])
@token_required
def register_seller(user):
      """
      Nâng cấp tài khoản thành người bán
      ---
      tags:
        - Authentication

      security:
        - Bearer: []

      responses:
        200:
          description: Cập nhật role thành công

        401:
          description: Chưa đăng nhập hoặc token không hợp lệ
      """
      try:
          conn = get_db_connection()
          cursor = conn.cursor()

          # Lấy thông tin người dùng
          cursor.execute(
              "SELECT Id, Name, Mail, Role, Balance FROM Users WHERE Id = ?",
              (user["id"],)
          )
          existing_user = cursor.fetchone()

          if not existing_user:
              conn.close()
              return jsonify({"message": "Không tìm thấy người dùng"}), 404

          # Nếu chưa phải seller thì cập nhật
          if (existing_user[3] or "").lower() != "seller":
              conn.close()
              return jsonify({
                  "message": "Yeu cau dang ky nguoi ban da duoc ghi nhan, can admin duyet truoc khi kich hoat"
              }), 202

          conn.close()

          # Tạo Access Token mới với role seller
          new_token = create_access_token(existing_user[0])

          return jsonify({
              "message": "Đăng ký người bán thành công",
              "access_token": new_token,
              "user": {
                  "id": existing_user[0],
                  "name": existing_user[1],
                  "mail": existing_user[2],
                  "role": "seller",
                  "balance": float(existing_user[4]) if existing_user[4] is not None else 0.0
              }
          }), 200

      except Exception:
          return jsonify({"message": "Khong the xu ly yeu cau"}), 400

@app.route("/products", methods=["GET"])
def get_products():
        """
        Lấy danh sách sản phẩm gần đây
        ---
        tags:
        - Products

        responses:
          200:
            description: Danh sách sản phẩm gần đây
        """
        try:
          conn = get_db_connection()
          cursor = conn.cursor()
          cursor.execute("""
            SELECT TOP 10
              p.Id,
              p.SellerId,
              ISNULL(u.Name, N'Người bán') AS SellerName,
              p.Title,
              p.Description,
              p.Price,
              p.Quantity,
              p.ImageUrl,
              p.Status,
              p.CreatedAt
            FROM Products p
            LEFT JOIN Users u ON u.Id = p.SellerId
            WHERE ISNULL(p.Status, 'active') = 'active'
            ORDER BY p.CreatedAt DESC, p.Id DESC
          """)
          rows = cursor.fetchall()
          conn.close()

          products = []
          for row in rows:
            products.append({
              "id": row[0],
              "sellerId": row[1],
              "sellerName": row[2],
              "title": row[3],
              "description": row[4],
              "price": float(row[5]) if row[5] is not None else 0,
              "quantity": int(row[6]) if row[6] is not None else 0,
              "imageUrl": row[7],
              "status": row[8],
              "createdAt": row[9].strftime("%d/%m/%Y %H:%M") if row[9] else None,
            })

          return jsonify({
            "message": "Lấy danh sách sản phẩm thành công",
            "products": products
          }), 200
        except Exception:
          return jsonify({
            "message": "Loi may chu"
          }), 500

@app.route("/products", methods=["POST"])
@token_required
@seller_required
def create_product(user):
    """
    Đăng sản phẩm mới
    ---
    tags:
      - Products

    security:
      - Bearer: []

    consumes:
      - application/json

    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
              example: Acc Valorant Rank Radiant

            description:
              type: string
              example: Full mail, đổi được thông tin.

            price:
              type: number
              example: 500000

            quantity:
              type: integer
              example: 1

            image:
              type: string
              example: https://abc.com/image.jpg

    responses:
      201:
        description: Đăng sản phẩm thành công

      403:
        description: Chỉ seller mới được đăng sản phẩm
    """

    data = request.get_json()

    if not data:
        return jsonify({
            "message": "Thiếu dữ liệu"
        }),400

    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()
    price = data.get("price")
    quantity = data.get("quantity")
    image = (data.get("image") or "").strip()
    price_value = parse_positive_decimal(price)
    quantity_value = parse_positive_int(quantity)

    if title == "":
        return jsonify({
            "message":"Tên sản phẩm không được để trống"
        }),400
    if price_value is None:
        return jsonify({
            "message":"Chưa nhập giá"
        }),400
    if quantity_value is None:
        return jsonify({
            "message":"Chưa nhập số lượng"
        }),400
    if len(title) > 150:
        return jsonify({"message": "Ten san pham qua dai"}), 400
    if len(description) > 2000:
        return jsonify({"message": "Mo ta san pham qua dai"}), 400
    if not is_valid_http_url(image):
        return jsonify({"message": "URL hinh anh khong hop le"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO Products
            (
                SellerId,
                Title,
                Description,
                Price,
                Quantity,
                ImageUrl
            )
            VALUES
            (
                ?,?,?,?,?,?
            )
        """,
        (
            user["id"],
            title,
            description,
            price_value,
            quantity_value,
            image
        ))
        conn.commit()
        conn.close()
        return jsonify({
            "message":"Đăng sản phẩm thành công"
        }),201
    except Exception:
        return server_error()
@app.route("/deposit", methods=["POST"])
@token_required
def deposit(user):
    """
    Nạp tiền vào tài khoản
    ---
    tags:
      - Người dùng
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        schema:
          type: object
          required:
            - amount
          properties:
            amount:
              type: number
              description: Số tiền muốn nạp
    responses:
      200:
        description: Nạp tiền thành công
      400:
        description: Số tiền không hợp lệ
      500:
        description: Lỗi máy chủ
    """
    if os.environ.get("ENABLE_UNSAFE_DEPOSIT", "").lower() != "true":
        return jsonify({"message": "Nap tien truc tiep da bi tat; hay dung cong thanh toan hoac webhook tin cay"}), 403

    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"message": "Thieu du lieu"}), 400
        amount = data.get("amount")

        # Kiểm tra số tiền hợp lệ
        if amount is None or not isinstance(amount, (int, float)) or amount <= 0:
            return jsonify({"message": "Số tiền nạp phải là một số dương"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Cập nhật số dư trong CSDL (cộng dồn vào số dư hiện tại)
        cursor.execute("""
            UPDATE Users
            SET Balance = Balance + ?
            WHERE Id = ?
        """, (amount, user["id"]))

        conn.commit()
        
        # Kiểm tra xem có bản ghi nào được cập nhật không
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({"message": "Người dùng không tồn tại"}), 404

        conn.close()

        return jsonify({
            "message": "Nạp tiền thành công",
            "amount_added": amount
        }), 200

    except Exception:
        return server_error()
@app.route("/profile", methods=["GET"])
@token_required
def profile(user):
    """
    Lấy thông tin người dùng
    ---
    tags:
      - Người dùng

    security:
      - Bearer: []

    responses:
      200:
        description: Thành công
      401:
        description: Token không hợp lệ
      404:
        description: Không tìm thấy người dùng
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT Id, Name, Mail, Role, Balance
            FROM Users
            WHERE Id = ?
        """, (user["id"],))

        row = cursor.fetchone()
        conn.close()

        if not row:
            return jsonify({"message": "Không tìm thấy người dùng"}), 404

        return jsonify({
            "message": "Lấy thông tin thành công",
            "user": {
                "id": row[0],
                "name": row[1],
                "mail": row[2],
                "role": row[3],
                "balance": float(row[4]) if row[4] is not None else 0
            }
        }), 200

    except Exception:
        return server_error()
@app.route('/purchase', methods=['POST'])
@token_required
def purchase(user):
    """
    API Mua Hàng
    ---
    tags:
      - Transaction
    security:
      - Bearer: []
    description: Thực hiện mua sản phẩm, trừ tiền và trừ số lượng kho
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            product_id:
              type: integer
              example: 1
            quantity:
              type: integer
              example: 1
    responses:
      200:
        description: Mua hàng thành công
      400:
        description: Lỗi logic (không đủ tiền, hết hàng)
    """
    user_id = user.get("id") 
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Thieu du lieu"}), 400

    product_id = parse_positive_int(data.get('product_id'))
    quantity = parse_positive_int(data.get('quantity'))

    if not all([user_id, product_id, quantity]) or quantity <= 0:
        return jsonify({"error": "Dữ liệu không hợp lệ"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()

    try:

        # 1. Kiểm tra sản phẩm và lấy giá
        cursor.execute("SELECT Price, Quantity, SellerId FROM Products WHERE Id = ? AND ISNULL(Status, 'active') = 'active'", (product_id,))
        product = cursor.fetchone()
        # 2. Kiểm tra người dùng và số dư
        cursor.execute("SELECT Balance FROM Users WHERE Id = ?", (user_id,))
        user = cursor.fetchone()

        if not product:
            return jsonify({"error": "Sản phẩm không tồn tại"}), 404
        if not user:
            return jsonify({"error": "Người dùng không tồn tại"}), 404

        price, stock, seller_id = product
        balance = user[0]
        total_cost = price * quantity

        # 3. Kiểm tra logic nghiệp vụ
        if seller_id == user_id:
            return jsonify({"error": "Khong the mua san pham cua chinh minh"}), 400
        if stock < quantity:
            return jsonify({"error": "Không đủ số lượng hàng"}), 400
        if balance < total_cost:
            return jsonify({"error": "Số dư không đủ"}), 400
        # 4. Thực hiện cập nhật
        cursor.execute(
            "UPDATE Products SET Quantity = Quantity - ? WHERE Id = ? AND Quantity >= ? AND ISNULL(Status, 'active') = 'active'",
            (quantity, product_id, quantity)
        )
        if cursor.rowcount == 0:
            conn.rollback()
            return jsonify({"error": "Khong du so luong hang"}), 400
        cursor.execute(
            "UPDATE Users SET Balance = Balance - ? WHERE Id = ? AND Balance >= ?",
            (total_cost, user_id, total_cost)
        )
        if cursor.rowcount == 0:
            conn.rollback()
            return jsonify({"error": "So du khong du"}), 400
        cursor.execute("INSERT INTO Transactions (UserId, ProductId, Quantity, TotalPrice) VALUES (?, ?, ?, ?)", 
                       (user_id, product_id, quantity, total_cost))
        conn.commit()

        return jsonify({"message": "Mua hàng thành công!"}), 200
        
    except Exception:
        conn.rollback()
        return jsonify({"error": "Loi may chu"}), 500
    finally:
        conn.close()     
if __name__ == "__main__":
    debug_enabled = os.environ.get("FLASK_ENV") == "development" or os.environ.get("FLASK_DEBUG") == "1"
    app.run(
        host=os.environ.get("HOST", "127.0.0.1"),
        port=int(os.environ.get("PORT", 5000)),
        debug=debug_enabled
    )

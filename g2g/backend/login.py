import os
import logging
import secrets
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
logging.basicConfig(
    level=os.environ.get("LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("g2g.backend")
is_production = os.environ.get("FLASK_ENV") == "production"
app.config["SECRET_KEY"] = os.environ.get("JWT_SECRET") or os.environ.get("SECRET_KEY")
if not app.config["SECRET_KEY"]:
    if is_production:
        raise RuntimeError("Missing JWT_SECRET or SECRET_KEY environment variable")
    app.config["SECRET_KEY"] = "dev-only-change-this-secret"

allowed_origins = [
    origin.strip()
    for origin in os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
    if origin.strip()
]
CORS(app, resources={r"/*": {"origins": allowed_origins}}, supports_credentials=True)
COOKIE_SECURE = os.environ.get("COOKIE_SECURE", "").lower() == "true"
COOKIE_SAMESITE = os.environ.get("COOKIE_SAMESITE", "Lax")
ACCESS_TOKEN_COOKIE = "access_token"
CSRF_TOKEN_COOKIE = "csrf_token"
CSRF_HEADER = "X-CSRF-Token"
STATE_CHANGING_METHODS = {"POST", "PUT", "PATCH", "DELETE"}
ALLOW_BEARER_AUTH = os.environ.get("ALLOW_BEARER_AUTH", "").lower() == "true"
VALID_DB_ROLES = {"user", "seller", "admin"}
TOKEN_NOT_BEFORE = int(datetime.now(timezone.utc).timestamp())


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
            "CookieAuth": {
                "type": "apiKey",
                "name": "access_token",
                "in": "cookie",
                "description": "JWT được gửi bằng cookie httpOnly sau khi đăng nhập"
            },
            "CsrfToken": {
                "type": "apiKey",
                "name": "X-CSRF-Token",
                "in": "header",
                "description": "Header CSRF cho request thay đổi dữ liệu"
            },
            "Bearer": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header",
                "description": "Chỉ dùng khi bật ALLOW_BEARER_AUTH=true"
            }
        }
  }

swagger = Swagger(app, template=swagger_template)


SWAGGER_CSRF_SCRIPT = """
<!-- swagger-csrf-auto-header -->
<script>
(function () {
  function getCookie(name) {
    return document.cookie
      .split("; ")
      .find(function (row) { return row.startsWith(name + "="); })
      ?.split("=")[1];
  }

  function csrfToken() {
    var value = getCookie("csrf_token");
    return value ? decodeURIComponent(value) : "";
  }

  var unsafeMethods = { POST: true, PUT: true, PATCH: true, DELETE: true };

  var originalFetch = window.fetch;
  if (originalFetch) {
    window.fetch = function (input, init) {
      init = init || {};
      var method = (init.method || (input && input.method) || "GET").toUpperCase();
      if (unsafeMethods[method]) {
        init.headers = new Headers(init.headers || (input && input.headers) || {});
        var token = csrfToken();
        if (token && !init.headers.has("X-CSRF-Token")) {
          init.headers.set("X-CSRF-Token", token);
        }
        init.credentials = init.credentials || "include";
      }
      return originalFetch.call(this, input, init);
    };
  }

  var originalOpen = XMLHttpRequest.prototype.open;
  var originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method) {
    this._csrfMethod = (method || "GET").toUpperCase();
    return originalOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function () {
    if (unsafeMethods[this._csrfMethod]) {
      var token = csrfToken();
      if (token) {
        this.setRequestHeader("X-CSRF-Token", token);
      }
    }
    return originalSend.apply(this, arguments);
  };
})();
</script>
</body>
"""


@app.after_request
def inject_swagger_csrf(response):
      if request.path.startswith("/apidocs") and response.content_type.startswith("text/html"):
          html = response.get_data(as_text=True)
          if "swagger-csrf-auto-header" not in html and "</body>" in html:
              response.set_data(html.replace("</body>", SWAGGER_CSRF_SCRIPT))
              response.headers["Content-Length"] = str(len(response.get_data()))
      return response

conn_str = os.environ.get("DATABASE_URL") or (
        "Driver={ODBC Driver 17 for SQL Server};"
        "Server=KHAIAI\\KHAAI;"
        "Database=ShopBanHang;"
        "Trusted_Connection=yes;"
    )

def get_db_connection():
      return pyodbc.connect(conn_str)


def server_error(message="Lỗi máy chủ"):
      return jsonify({"message": message}), 500


def to_float(value, default=0.0):
      return float(value) if value is not None else default


def normalize_role(role):
      normalized = (role or "user").strip().lower()
      if normalized in {"regular", "customer", "member"}:
          return "user"
      return normalized if normalized in VALID_DB_ROLES else "user"


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
          "role": normalize_role(row[3]),
          "balance": to_float(row[4]),
      }


def create_access_token(user_id):
      payload = {
          "user_id": user_id,
          "iat": datetime.now(timezone.utc),
          "exp": datetime.now(timezone.utc) + timedelta(hours=1),
      }
      return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")


def set_access_cookie(response, token):
      response.set_cookie(
          ACCESS_TOKEN_COOKIE,
          token,
          httponly=True,
          secure=COOKIE_SECURE,
          samesite=COOKIE_SAMESITE,
          max_age=60 * 60,
          path="/",
      )
      return response


def set_csrf_cookie(response):
      csrf_token = secrets.token_urlsafe(32)
      response.set_cookie(
          CSRF_TOKEN_COOKIE,
          csrf_token,
          httponly=False,
          secure=COOKIE_SECURE,
          samesite=COOKIE_SAMESITE,
          max_age=60 * 60,
          path="/",
      )
      return response


def clear_auth_cookies(response):
      response.delete_cookie(ACCESS_TOKEN_COOKIE, path="/")
      response.delete_cookie(CSRF_TOKEN_COOKIE, path="/")
      return response


def guest_profile_response(message="Khách, vui lòng đăng nhập"):
      return jsonify({
          "message": message,
          "authenticated": False,
          "user": {
              "id": None,
              "name": "Khách",
              "mail": None,
              "role": "guest",
              "balance": 0,
          }
      })


def decode_access_token(token):
      data = jwt.decode(
          token,
          app.config["SECRET_KEY"],
          algorithms=["HS256"]
      )
      issued_at = data.get("iat")
      if issued_at is None or int(issued_at) < TOKEN_NOT_BEFORE:
          raise jwt.InvalidTokenError("Token được tạo từ phiên máy chủ cũ")
      return data


def current_user_from_request():
      auth_header = request.headers.get("Authorization", "")
      token = request.cookies.get(ACCESS_TOKEN_COOKIE)
      if ALLOW_BEARER_AUTH and auth_header.startswith("Bearer "):
          token = auth_header.split(" ", 1)[1].strip()
      if not token:
          return None, None

      data = decode_access_token(token)
      current_user = get_user_by_id(data.get("user_id"))
      return row_to_user(current_user) if current_user else None, token


def csrf_protect(f):
      @wraps(f)
      def decorated(*args, **kwargs):
          if request.method in STATE_CHANGING_METHODS:
              cookie_token = request.cookies.get(CSRF_TOKEN_COOKIE)
              header_token = request.headers.get(CSRF_HEADER)
              if not cookie_token or not header_token or not secrets.compare_digest(cookie_token, header_token):
                  return jsonify({"message": "CSRF token không hợp lệ"}), 403
          return f(*args, **kwargs)

      return decorated


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


def normalize_optional_text(value, max_length):
      text = (value or "").strip()
      return text[:max_length] if text else None


def normalize_required_text(value, max_length):
      text = (value or "").strip()
      return text[:max_length] if text else ""


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


def verify_password(password, password_hash):
      if not password or not password_hash:
          return False
      if isinstance(password_hash, str):
          password_hash = password_hash.encode("utf-8")
      try:
          return bcrypt.checkpw(password.encode("utf-8"), password_hash)
      except (TypeError, ValueError):
          return False


def seller_required(f):
      @wraps(f)
      def decorated(user, *args, **kwargs):

          if (user.get("role") or "").lower() != "seller":
              return jsonify({
                  "message": "Chỉ người bán mới được thực hiện chức năng này"
              }), 403

          return f(user, *args, **kwargs)

      return decorated


def admin_required(f):
      @wraps(f)
      def decorated(user, *args, **kwargs):
          if (user.get("role") or "").lower() != "admin":
              return jsonify({"message": "Chỉ admin mới được thực hiện chức năng này"}), 403
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
            return jsonify({"message": "Không thể xử lý yêu cầu"}), 400
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
            return jsonify({"message": "Sai email hoặc mật khẩu"}), 401

        balance_val = float(user[4]) if user[4] is not None else 0.0
        if verify_password(password, user[2]):

          token = create_access_token(user[0])

          response = jsonify({
            "message": "Đăng nhập thành công",
            "user": {
                "id": user[0],
                "mail": mail,
                "name": user[1],
                "role": normalize_role(user[3]),
                "balance": balance_val
            }
        })
          set_access_cookie(response, token)
          set_csrf_cookie(response)
          return response, 200

        else:
            logger.warning("login_failed_invalid_password_or_hash", extra={"user_id": user[0], "mail": mail})
            return jsonify({"message": "Sai email hoặc mật khẩu"}), 401
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            current_user, token = current_user_from_request()
            if not token:
                return jsonify({"message": "Thiếu token"}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token đã hết hạn"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token không hợp lệ"}), 401

        if not current_user:
            return jsonify({"message": "Không tìm thấy người dùng"}), 404

        return f(current_user, *args, **kwargs)

    return decorated


@app.route('/register-seller', methods=['POST'])
@token_required
@csrf_protect
def register_seller(user):
      """
      Nâng cấp tài khoản thành người bán
      ---
      tags:
        - Authentication

      security:
        - CookieAuth: []
        - CsrfToken: []

      consumes:
        - application/json

      parameters:
        - in: body
          name: body
          required: true
          schema:
            type: object
            required:
              - shop_name
              - address
              - phone
              - id_card_front_url
              - id_card_back_url
            properties:
              shop_name:
                type: string
                example: Shop Acc Game Uy Tin
              address:
                type: string
                example: 123 Nguyen Trai, Quan 1, TP HCM
              phone:
                type: string
                example: "0912345678"
              id_card_front_url:
                type: string
                example: https://example.com/cccd-front.jpg
              id_card_back_url:
                type: string
                example: https://example.com/cccd-back.jpg
              note:
                type: string
                example: Dang ky ban hang tren he thong

      responses:
        202:
          description: Đã tạo yêu cầu seller, chờ admin duyệt

        400:
          description: Thiếu hoặc sai thông tin đăng ký

        200:
          description: Tài khoản đã là seller

        401:
          description: Chưa đăng nhập hoặc token không hợp lệ
      """
      conn = None
      try:
          data = request.get_json(silent=True) or {}
          shop_name = normalize_required_text(data.get("shop_name") or data.get("shopName"), 150)
          address = normalize_required_text(data.get("address"), 300)
          phone = normalize_required_text(data.get("phone"), 30)
          id_card_front_url = normalize_required_text(
              data.get("id_card_front_url") or data.get("idCardFrontUrl"),
              500,
          )
          id_card_back_url = normalize_required_text(
              data.get("id_card_back_url") or data.get("idCardBackUrl"),
              500,
          )
          note = normalize_optional_text(data.get("note"), 500)

          if not shop_name:
              return jsonify({"message": "Vui lòng nhập tên shop"}), 400
          if len(shop_name) < 3:
              return jsonify({"message": "Tên shop phải có ít nhất 3 ký tự"}), 400
          if not address:
              return jsonify({"message": "Vui lòng nhập địa chỉ shop"}), 400
          if len(address) < 10:
              return jsonify({"message": "Địa chỉ shop phải có ít nhất 10 ký tự"}), 400
          if not phone:
              return jsonify({"message": "Vui lòng nhập số điện thoại"}), 400
          if not is_valid_phone(phone):
              return jsonify({"message": "Số điện thoại không đúng định dạng"}), 400
          if not id_card_front_url:
              return jsonify({"message": "Vui lòng gửi ảnh căn cước mặt trước"}), 400
          if not is_valid_http_url(id_card_front_url):
              return jsonify({"message": "URL ảnh căn cước mặt trước không hợp lệ"}), 400
          if not id_card_back_url:
              return jsonify({"message": "Vui lòng gửi ảnh căn cước mặt sau"}), 400
          if not is_valid_http_url(id_card_back_url):
              return jsonify({"message": "URL ảnh căn cước mặt sau không hợp lệ"}), 400

          conn = get_db_connection()
          cursor = conn.cursor()

          cursor.execute(
              "SELECT Id, Name, Mail, Role, Balance FROM Users WHERE Id = ?",
              (user["id"],)
          )
          existing_user = cursor.fetchone()

          if not existing_user:
              return jsonify({"message": "Không tìm thấy người dùng"}), 404

          existing_role = normalize_role(existing_user[3])
          if existing_role == "seller":
              new_token = create_access_token(existing_user[0])
              response = jsonify({
                  "message": "Tài khoản đã là người bán",
                  "user": {
                      "id": existing_user[0],
                      "name": existing_user[1],
                      "mail": existing_user[2],
                      "role": "seller",
                      "balance": float(existing_user[4]) if existing_user[4] is not None else 0.0
                  }
              })
              set_access_cookie(response, new_token)
              set_csrf_cookie(response)
              return response, 200

          cursor.execute("""
              SELECT TOP 1 Id, Status, CreatedAt
              FROM SellerRequests
              WHERE UserId = ? AND Status = ?
              ORDER BY CreatedAt DESC, Id DESC
          """, (user["id"], "pending"))
          pending_request = cursor.fetchone()
          if pending_request:
              return jsonify({
                  "message": "Bạn đã gửi yêu cầu đăng ký người bán, vui lòng chờ admin duyệt",
                  "seller_request": {
                      "id": pending_request[0],
                      "status": pending_request[1],
                      "createdAt": pending_request[2].isoformat() if pending_request[2] else None,
                  }
              }), 202

          cursor.execute("""
              INSERT INTO SellerRequests (
                  UserId,
                  ShopName,
                  Address,
                  Phone,
                  IdCardFrontUrl,
                  IdCardBackUrl,
                  Note,
                  Status,
                  CreatedAt
              )
              OUTPUT INSERTED.Id
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          """, (
              user["id"],
              shop_name,
              address,
              phone,
              id_card_front_url,
              id_card_back_url,
              note,
              "pending",
              datetime.now(),
          ))
          request_id = cursor.fetchone()[0]
          conn.commit()

          return jsonify({
              "message": "Yêu cầu đăng ký người bán đã được ghi nhận, cần admin duyệt trước khi kích hoạt",
              "seller_request": {
                  "id": request_id,
                  "userId": user["id"],
                  "shopName": shop_name,
                  "address": address,
                  "phone": phone,
                  "idCardFrontUrl": id_card_front_url,
                  "idCardBackUrl": id_card_back_url,
                  "note": note,
                  "status": "pending",
              }
          }), 202

      except Exception:
          if conn:
              conn.rollback()
          logger.exception("register_seller_failed")
          return jsonify({"message": "Không thể xử lý yêu cầu"}), 400
      finally:
          if conn:
              conn.close()


@app.route("/logout", methods=["POST"])
def logout():
      response = jsonify({"message": "Đăng xuất thành công"})
      clear_auth_cookies(response)
      return response, 200


@app.route("/csrf-token", methods=["GET"])
def csrf_token():
      response = jsonify({"message": "CSRF token đã được cấp"})
      set_csrf_cookie(response)
      return response, 200


@app.route("/admin/seller-requests", methods=["GET"])
@token_required
@admin_required
def list_seller_requests(user):
      """
      Admin xem danh sách yêu cầu đăng ký người bán
      ---
      tags:
        - Admin Sellers
      security:
        - CookieAuth: []
      parameters:
        - in: query
          name: status
          required: false
          type: string
          enum: [pending, approved, rejected, cancelled, all]
          default: pending
          description: Lọc yêu cầu theo trạng thái
      responses:
        200:
          description: Danh sách yêu cầu đăng ký seller
        400:
          description: Trạng thái không hợp lệ
        403:
          description: Không phải admin
      """
      status = (request.args.get("status") or "pending").strip().lower()
      allowed_statuses = {"pending", "approved", "rejected", "cancelled", "all"}
      if status not in allowed_statuses:
          return jsonify({"message": "Trạng thái không hợp lệ"}), 400

      conn = None
      try:
          conn = get_db_connection()
          cursor = conn.cursor()
          base_query = """
              SELECT TOP 100
                  sr.Id,
                  sr.UserId,
                  u.Name,
                  u.Mail,
                  sr.ShopName,
                  sr.Address,
                  sr.Phone,
                  sr.IdCardFrontUrl,
                  sr.IdCardBackUrl,
                  sr.Note,
                  sr.Status,
                  sr.CreatedAt,
                  sr.ApprovedBy,
                  sr.ApprovedAt
              FROM SellerRequests sr
              LEFT JOIN Users u ON u.Id = sr.UserId
          """
          if status == "all":
              cursor.execute(base_query + " ORDER BY sr.CreatedAt DESC, sr.Id DESC")
          else:
              cursor.execute(base_query + " WHERE sr.Status = ? ORDER BY sr.CreatedAt DESC, sr.Id DESC", (status,))

          rows = cursor.fetchall()
          seller_requests = []
          for row in rows:
              seller_requests.append({
                  "id": row[0],
                  "userId": row[1],
                  "userName": row[2],
                  "userMail": row[3],
                  "shopName": row[4],
                  "address": row[5],
                  "phone": row[6],
                  "idCardFrontUrl": row[7],
                  "idCardBackUrl": row[8],
                  "note": row[9],
                  "status": row[10],
                  "createdAt": row[11].isoformat() if row[11] else None,
                  "approvedBy": row[12],
                  "approvedAt": row[13].isoformat() if row[13] else None,
              })

          return jsonify({"seller_requests": seller_requests}), 200
      except Exception:
          logger.exception("list_seller_requests_failed")
          return server_error()
      finally:
          if conn:
              conn.close()


@app.route("/admin/seller-requests/<int:request_id>/approve", methods=["POST"])
@token_required
@csrf_protect
@admin_required
def approve_seller_request(user, request_id):
      """
      Admin duyệt yêu cầu đăng ký người bán
      ---
      tags:
        - Admin Sellers
      security:
        - CookieAuth: []
        - CsrfToken: []
      parameters:
        - in: path
          name: request_id
          required: true
          type: integer
          description: Id của SellerRequests cần duyệt
      responses:
        200:
          description: Đã duyệt, user được chuyển role thành seller
        400:
          description: Yêu cầu đã được xử lý
        403:
          description: Không phải admin hoặc CSRF không hợp lệ
        404:
          description: Không tìm thấy yêu cầu
      """
      conn = None
      try:
          conn = get_db_connection()
          cursor = conn.cursor()
          cursor.execute("""
              SELECT Id, UserId, Status
              FROM SellerRequests
              WHERE Id = ?
          """, (request_id,))
          seller_request = cursor.fetchone()
          if not seller_request:
              return jsonify({"message": "Không tìm thấy yêu cầu đăng ký người bán"}), 404
          if (seller_request[2] or "").lower() != "pending":
              return jsonify({"message": "Yêu cầu đăng ký người bán đã được xử lý"}), 400

          cursor.execute(
              "UPDATE Users SET Role = ? WHERE Id = ?",
              ("seller", seller_request[1]),
          )
          if cursor.rowcount == 0:
              conn.rollback()
              return jsonify({"message": "Không tìm thấy người dùng"}), 404

          cursor.execute("""
              UPDATE SellerRequests
              SET Status = ?, ApprovedBy = ?, ApprovedAt = ?
              WHERE Id = ? AND Status = ?
          """, ("approved", user["id"], datetime.now(), request_id, "pending"))
          if cursor.rowcount == 0:
              conn.rollback()
              return jsonify({"message": "Yêu cầu đăng ký người bán đã được xử lý trước đó"}), 409

          conn.commit()
          return jsonify({
              "message": "Đã duyệt người bán",
              "seller_request_id": request_id,
              "user_id": seller_request[1],
          }), 200
      except Exception:
          if conn:
              conn.rollback()
          logger.exception("approve_seller_request_failed")
          return server_error()
      finally:
          if conn:
              conn.close()


@app.route("/admin/seller-requests/<int:request_id>/reject", methods=["POST"])
@token_required
@csrf_protect
@admin_required
def reject_seller_request(user, request_id):
      """
      Admin từ chối yêu cầu đăng ký người bán
      ---
      tags:
        - Admin Sellers
      security:
        - CookieAuth: []
        - CsrfToken: []
      parameters:
        - in: path
          name: request_id
          required: true
          type: integer
          description: Id của SellerRequests cần từ chối
      responses:
        200:
          description: Đã từ chối yêu cầu
        403:
          description: Không phải admin hoặc CSRF không hợp lệ
        404:
          description: Không tìm thấy yêu cầu pending
      """
      conn = None
      try:
          conn = get_db_connection()
          cursor = conn.cursor()
          cursor.execute("""
              UPDATE SellerRequests
              SET Status = ?, ApprovedBy = ?, ApprovedAt = ?
              WHERE Id = ? AND Status = ?
          """, ("rejected", user["id"], datetime.now(), request_id, "pending"))
          if cursor.rowcount == 0:
              conn.rollback()
              return jsonify({"message": "Không tìm thấy yêu cầu pending hoặc yêu cầu đã được xử lý"}), 404

          conn.commit()
          return jsonify({
              "message": "Đã từ chối yêu cầu đăng ký người bán",
              "seller_request_id": request_id,
          }), 200
      except Exception:
          if conn:
              conn.rollback()
          logger.exception("reject_seller_request_failed")
          return server_error()
      finally:
          if conn:
              conn.close()

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
            "message": "Lỗi máy chủ"
          }), 500

@app.route("/products", methods=["POST"])
@token_required
@csrf_protect
@seller_required
def create_product(user):
    """
    Đăng sản phẩm mới
    ---
    tags:
      - Products

    security:
      - CookieAuth: []

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
        return jsonify({"message": "Tên sản phẩm quá dài"}), 400
    if len(description) > 2000:
        return jsonify({"message": "Mô tả sản phẩm quá dài"}), 400
    if not is_valid_http_url(image):
        return jsonify({"message": "URL hình ảnh không hợp lệ"}), 400

    conn = None
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
        return jsonify({
            "message":"Đăng sản phẩm thành công"
        }),201
    except Exception:
        if conn:
            conn.rollback()
        logger.exception("create_product_failed")
        return server_error()
    finally:
        if conn:
            conn.close()
@app.route("/deposit", methods=["POST"])
@token_required
@csrf_protect
def deposit(user):
    """
    Tạo yêu cầu nạp tiền để admin xét duyệt
    ---
    tags:
      - Payments
    security:
      - CookieAuth: []
      - CsrfToken: []
    description: Tạo bản ghi PaymentRequests trạng thái pending. API này không cộng tiền trực tiếp vào Balance.
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - amount
          properties:
            amount:
              type: number
              example: 100000
              description: Số tiền muốn nạp, phải lớn hơn 0
            provider:
              type: string
              example: manual
              description: Kênh thanh toán hoặc ghi chú nguồn nạp tiền
    responses:
      202:
        description: Đã tạo yêu cầu nạp tiền, chờ admin xét duyệt
      400:
        description: Dữ liệu không hợp lệ
      401:
        description: Chưa đăng nhập hoặc token không hợp lệ
      403:
        description: CSRF token không hợp lệ
      500:
        description: Lỗi máy chủ
    """
    conn = None
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"message": "Thiếu dữ liệu"}), 400
        amount = parse_positive_decimal(data.get("amount"))
        provider = (data.get("provider") or "manual").strip()[:50]
        if amount is None:
            return jsonify({"message": "Số tiền nạp phải là số dương"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO PaymentRequests (UserId, Amount, Provider, Status, CreatedAt)
            OUTPUT INSERTED.Id
            VALUES (?, ?, ?, ?, ?)
        """, (user["id"], amount, provider, "pending", datetime.now()))
        payment_id = cursor.fetchone()[0]
        conn.commit()
        return jsonify({
            "message": "Yêu cầu nạp tiền đã được tạo và đang chờ duyệt",
            "payment_request": {
                "id": payment_id,
                "amount": float(amount),
                "provider": provider,
                "status": "pending",
            }
        }), 202
    except Exception:
        if conn:
            conn.rollback()
        logger.exception("create_payment_request_failed")
        return server_error()
    finally:
        if conn:
            conn.close()

@app.route("/admin/payment-requests/<int:payment_id>/approve", methods=["POST"])
@token_required
@csrf_protect
@admin_required
def approve_payment_request(user, payment_id):
    """
    Admin duyệt yêu cầu nạp tiền
    ---
    tags:
      - Admin Payments
    security:
      - CookieAuth: []
      - CsrfToken: []
    parameters:
      - in: path
        name: payment_id
        required: true
        type: integer
        description: Id của PaymentRequests cần duyệt
    responses:
      200:
        description: Đã duyệt, cộng Balance cho user và ghi BalanceAuditLogs
      400:
        description: Yêu cầu không ở trạng thái pending
      403:
        description: Không phải admin hoặc CSRF không hợp lệ
      404:
        description: Không tìm thấy yêu cầu nạp tiền
      409:
        description: Yêu cầu đã được xử lý trước đó
    """
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT Id, UserId, Amount, Status
            FROM PaymentRequests
            WHERE Id = ?
        """, (payment_id,))
        payment = cursor.fetchone()
        if not payment:
            return jsonify({"message": "Không tìm thấy yêu cầu nạp tiền"}), 404
        if (payment[3] or "").lower() != "pending":
            return jsonify({"message": "Yêu cầu nạp tiền không ở trạng thái pending"}), 400

        cursor.execute(
            "UPDATE Users SET Balance = Balance + ? WHERE Id = ?",
            (payment[2], payment[1]),
        )
        if cursor.rowcount == 0:
            conn.rollback()
            return jsonify({"message": "Không tìm thấy người dùng"}), 404
        cursor.execute("""
            UPDATE PaymentRequests
            SET Status = ?, ApprovedBy = ?, ApprovedAt = ?
            WHERE Id = ? AND Status = ?
        """, ("approved", user["id"], datetime.now(), payment_id, "pending"))
        if cursor.rowcount == 0:
            conn.rollback()
            return jsonify({"message": "Yêu cầu nạp tiền đã được xử lý trước đó"}), 409
        cursor.execute("""
            INSERT INTO BalanceAuditLogs (UserId, Amount, Action, ReferenceType, ReferenceId, CreatedBy, CreatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (payment[1], payment[2], "topup_approved", "PaymentRequests", payment_id, user["id"], datetime.now()))
        conn.commit()
        return jsonify({"message": "Đã duyệt nạp tiền", "payment_id": payment_id}), 200
    except Exception:
        if conn:
            conn.rollback()
        logger.exception("approve_payment_request_failed")
        return server_error()
    finally:
        if conn:
            conn.close()


@app.route("/admin/payment-requests", methods=["GET"])
@token_required
@admin_required
def list_payment_requests(user):
    """
    Admin xem danh sách yêu cầu nạp tiền
    ---
    tags:
      - Admin Payments
    security:
      - CookieAuth: []
    parameters:
      - in: query
        name: status
        required: false
        type: string
        enum: [pending, approved, rejected, cancelled, all]
        default: pending
        description: Lọc theo trạng thái yêu cầu
    responses:
      200:
        description: Danh sách PaymentRequests gần nhất
      400:
        description: Trạng thái không hợp lệ
      403:
        description: Không phải admin
    """
    status = (request.args.get("status") or "pending").strip().lower()
    allowed_statuses = {"pending", "approved", "rejected", "cancelled", "all"}
    if status not in allowed_statuses:
        return jsonify({"message": "Trạng thái không hợp lệ"}), 400

    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        if status == "all":
            cursor.execute("""
                SELECT TOP 100
                    pr.Id,
                    pr.UserId,
                    u.Name,
                    u.Mail,
                    pr.Amount,
                    pr.Provider,
                    pr.Status,
                    pr.CreatedAt,
                    pr.ApprovedBy,
                    pr.ApprovedAt
                FROM PaymentRequests pr
                LEFT JOIN Users u ON u.Id = pr.UserId
                ORDER BY pr.CreatedAt DESC, pr.Id DESC
            """)
        else:
            cursor.execute("""
                SELECT TOP 100
                    pr.Id,
                    pr.UserId,
                    u.Name,
                    u.Mail,
                    pr.Amount,
                    pr.Provider,
                    pr.Status,
                    pr.CreatedAt,
                    pr.ApprovedBy,
                    pr.ApprovedAt
                FROM PaymentRequests pr
                LEFT JOIN Users u ON u.Id = pr.UserId
                WHERE pr.Status = ?
                ORDER BY pr.CreatedAt DESC, pr.Id DESC
            """, (status,))

        rows = cursor.fetchall()
        requests = []
        for row in rows:
            requests.append({
                "id": row[0],
                "userId": row[1],
                "userName": row[2],
                "userMail": row[3],
                "amount": float(row[4]) if row[4] is not None else 0,
                "provider": row[5],
                "status": row[6],
                "createdAt": row[7].isoformat() if row[7] else None,
                "approvedBy": row[8],
                "approvedAt": row[9].isoformat() if row[9] else None,
            })

        return jsonify({"payment_requests": requests}), 200
    except Exception:
        logger.exception("list_payment_requests_failed")
        return server_error()
    finally:
        if conn:
            conn.close()
@app.route("/profile", methods=["GET"])
def profile():
    """
    Lấy thông tin người dùng
    ---
    tags:
      - Người dùng

    security:
      - CookieAuth: []

    responses:
      200:
        description: Trả thông tin người dùng nếu đã đăng nhập, nếu không trả trạng thái khách
      500:
        description: Lỗi máy chủ
    """
    token = request.cookies.get(ACCESS_TOKEN_COOKIE)
    conn = None
    try:
        user, _ = current_user_from_request()
        if not user:
            response = guest_profile_response()
            if token:
                clear_auth_cookies(response)
            return response, 200

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT Id, Name, Mail, Role, Balance
            FROM Users
            WHERE Id = ?
        """, (user["id"],))

        row = cursor.fetchone()

        if not row:
            response = guest_profile_response("Khách, vui lòng đăng nhập")
            clear_auth_cookies(response)
            return response, 200

        return jsonify({
            "message": "Lấy thông tin thành công",
            "authenticated": True,
            "user": {
                "id": row[0],
                "name": row[1],
                "mail": row[2],
                "role": normalize_role(row[3]),
                "balance": float(row[4]) if row[4] is not None else 0
            }
        }), 200

    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        response = guest_profile_response()
        clear_auth_cookies(response)
        return response, 200
    except Exception:
        return server_error()
    finally:
        if conn:
            conn.close()
@app.route('/purchase', methods=['POST'])
@token_required
@csrf_protect
def purchase(user):
    """
    API Mua hàng
    ---
    tags:
      - Transaction
    security:
      - CookieAuth: []
      - CsrfToken: []
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
        return jsonify({"error": "Thiếu dữ liệu"}), 400

    product_id = parse_positive_int(data.get('product_id'))
    quantity = parse_positive_int(data.get('quantity'))

    if not all([user_id, product_id, quantity]) or quantity <= 0:
        return jsonify({"error": "Dữ liệu không hợp lệ"}), 400
    
    conn = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT Price, Quantity, SellerId
            FROM Products WITH (UPDLOCK, ROWLOCK)
            WHERE Id = ? AND ISNULL(Status, 'active') = 'active'
        """, (product_id,))
        product = cursor.fetchone()
        cursor.execute("SELECT Balance FROM Users WITH (UPDLOCK, ROWLOCK) WHERE Id = ?", (user_id,))
        buyer = cursor.fetchone()

        if not product:
            return jsonify({"error": "Sản phẩm không tồn tại"}), 404
        if not buyer:
            return jsonify({"error": "Người dùng không tồn tại"}), 404

        price, stock, seller_id = product
        balance = buyer[0]
        total_cost = price * quantity

        if seller_id == user_id:
            return jsonify({"error": "Không thể mua sản phẩm của chính mình"}), 400
        if stock < quantity:
            return jsonify({"error": "Không đủ số lượng hàng"}), 400
        if balance < total_cost:
            return jsonify({"error": "Số dư không đủ"}), 400

        cursor.execute(
            "UPDATE Products SET Quantity = Quantity - ? WHERE Id = ? AND Quantity >= ? AND ISNULL(Status, 'active') = 'active'",
            (quantity, product_id, quantity)
        )
        if cursor.rowcount == 0:
            conn.rollback()
            return jsonify({"error": "Không đủ số lượng hàng"}), 400
        cursor.execute(
            "UPDATE Users SET Balance = Balance - ? WHERE Id = ? AND Balance >= ?",
            (total_cost, user_id, total_cost)
        )
        if cursor.rowcount == 0:
            conn.rollback()
            return jsonify({"error": "Số dư không đủ"}), 400

        cursor.execute(
            "UPDATE Users SET Balance = Balance + ? WHERE Id = ?",
            (total_cost, seller_id)
        )
        if cursor.rowcount == 0:
            conn.rollback()
            return jsonify({"error": "Không tìm thấy người bán"}), 404

        cursor.execute("""
            INSERT INTO Orders (UserId, SellerId, TotalPrice, Status, CreatedAt)
            OUTPUT INSERTED.Id
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, seller_id, total_cost, "paid", datetime.now()))
        order_id = cursor.fetchone()[0]

        cursor.execute("""
            INSERT INTO OrderItems (OrderId, ProductId, Quantity, UnitPrice, TotalPrice)
            VALUES (?, ?, ?, ?, ?)
        """, (order_id, product_id, quantity, price, total_cost))

        cursor.execute(
            "INSERT INTO Transactions (UserId, ProductId, Quantity, TotalPrice) VALUES (?, ?, ?, ?)",
            (user_id, product_id, quantity, total_cost)
        )

        cursor.execute("""
            INSERT INTO BalanceAuditLogs (UserId, Amount, Action, ReferenceType, ReferenceId, CreatedBy, CreatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, -total_cost, "purchase_paid", "Orders", order_id, user_id, datetime.now()))
        cursor.execute("""
            INSERT INTO BalanceAuditLogs (UserId, Amount, Action, ReferenceType, ReferenceId, CreatedBy, CreatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (seller_id, total_cost, "sale_received", "Orders", order_id, user_id, datetime.now()))

        conn.commit()

        return jsonify({
            "message": "Mua hàng thành công!",
            "order": {
                "id": order_id,
                "productId": product_id,
                "quantity": quantity,
                "totalPrice": float(total_cost),
                "sellerId": seller_id,
            }
        }), 200
        
    except Exception:
        if conn:
            conn.rollback()
        logger.exception("purchase_failed")
        return jsonify({"error": "Lỗi máy chủ"}), 500
    finally:
        if conn:
            conn.close()     
if __name__ == "__main__":
    debug_enabled = os.environ.get("FLASK_ENV") == "development" or os.environ.get("FLASK_DEBUG") == "1"
    app.run(
        host=os.environ.get("HOST", "127.0.0.1"),
        port=int(os.environ.get("PORT", 5000)),
        debug=debug_enabled
    )


import os
import bcrypt
import jwt

from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import Flask, request, jsonify
from flasgger import Swagger
from flask_cors import CORS
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SECRET_KEY"] = os.getenv("JWT_SECRET")

if not app.config["SECRET_KEY"]:
    raise RuntimeError("Thiếu JWT_SECRET trong file .env")

swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "Shop API",
        "version": "1.0"
    },
    "securityDefinitions": {
        "BearerAuth": {
            "type": "apiKey",
            "name": "Authorization",
            "in": "header",
            "description": "Nhập: Bearer <JWT token>"
        }
    }
}

swagger = Swagger(app, template=swagger_template)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Thiếu SUPABASE_URL hoặc SUPABASE_KEY trong file .env")

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

#tạo access token
def create_access_token(user):
    payload = {
        "user_id": user["id"],
        "mail": (user.get("mail") or "").strip(),
        "role": str(user.get("role") or "").strip(),
        "iat": datetime.now(timezone.utc),
        "exp": datetime.now(timezone.utc) + timedelta(hours=1)
    }

    token = jwt.encode(
        payload,
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )

    return token
#==========================================

#token_required decorator: yêu cầu có token hợp lệ để truy cập endpoint
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return jsonify({
                "message": "Thiếu token"
            }), 401

        token = auth_header.split(" ", 1)[1].strip()

        if not token:
            return jsonify({
                "message": "Token không hợp lệ"
            }), 401

        try:
            # Giải mã JWT
            payload = jwt.decode(
                token,
                app.config["SECRET_KEY"],
                algorithms=["HS256"]
            )

            # Tìm user
            result = (
                supabase
                .table("users")
                .select("id, name, mail, role, balance")
                .eq("id", payload["user_id"])
                .limit(1)
                .execute()
            )

            if not result.data:
                return jsonify({
                    "message": "Không tìm thấy người dùng"
                }), 404

            current_user = result.data[0]

            # QUAN TRỌNG:
            # truyền user + toàn bộ args + kwargs
            return f(current_user, *args, **kwargs)

        except jwt.ExpiredSignatureError:
            return jsonify({
                "message": "Token đã hết hạn"
            }), 401

        except jwt.InvalidTokenError:
            return jsonify({
                "message": "Token không hợp lệ"
            }), 401

        except Exception as e:
            print("TOKEN ERROR:", repr(e))

            return jsonify({
                "message": "Lỗi xác thực token",
                "error": str(e)
            }), 500

    return decorated
#=========================================

#token_required decorator: yêu cầu có token admin
def admin_required(f):
    @wraps(f)
    def decorated(user, *args, **kwargs):

        if (user.get("role") or "").lower() != "admin":
            return jsonify({
                "message": "Chỉ admin mới được thực hiện chức năng này"
            }), 403

        return f(user, *args, **kwargs)

    return decorated
#=========================================

#Đăng ký tài khoản
@app.route("/register", methods=["POST"])
def register():
    """
    Đăng ký tài khoản
    ---
    tags:
      - Authentication

    consumes:
      - application/json

    produces:
      - application/json

    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - name
            - mail
            - password
          properties:
            name:
              type: string
              example: Nguyen Van A

            mail:
              type: string
              example: test@gmail.com

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

      500:
        description: Lỗi máy chủ
    """
    try:
        # 1. Nhận dữ liệu JSON
        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "message": "Không nhận được dữ liệu JSON"
            }), 400

        # 2. Lấy dữ liệu
        name = (data.get("name") or "").strip()
        mail = (data.get("mail") or "").strip()
        password = data.get("password") or ""

        # 3. Kiểm tra dữ liệu
        if not name:
            return jsonify({
                "message": "Vui lòng nhập tên"
            }), 400

        if not mail:
            return jsonify({
                "message": "Vui lòng nhập email hoặc số điện thoại"
            }), 400

        if not password:
            return jsonify({
                "message": "Vui lòng nhập mật khẩu"
            }), 400

        if len(password) < 8:
            return jsonify({
                "message": "Mật khẩu phải có ít nhất 8 ký tự"
            }), 400

        # 4. Kiểm tra tài khoản đã tồn tại chưa
        existing = (
            supabase
            .table("users")
            .select("id")
            .eq("mail", mail)
            .limit(1)
            .execute()
        )

        if existing.data:
            return jsonify({
                "message": "Tài khoản đã tồn tại"
            }), 409

        # 5. Băm mật khẩu bằng bcrypt
        hashed_password = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        # 6. Thêm user vào Supabase
        result = (
            supabase
            .table("users")
            .insert({
                "name": name,
                "mail": mail,
                "password": hashed_password,
                "role": "user",
                "balance": 0
            })
            .execute()
        )

        if not result.data:
            return jsonify({
                "message": "Không thể tạo tài khoản"
            }), 500

        new_user = result.data[0]

        # 7. Trả kết quả
        return jsonify({
            "message": "Đăng ký thành công",
            "user": {
                "id": new_user["id"],
                "name": new_user["name"],
                "mail": new_user["mail"],
                "role": new_user["role"],
                "balance": float(new_user["balance"])
            }
        }), 201

    except Exception as e:
        print("REGISTER ERROR:", e)

        return jsonify({
            "message": "Lỗi máy chủ",
            "error": str(e)
        }), 500
#==========================================

#Đăng nhập tài khoản
@app.route("/login", methods=["POST"])
def login():
    """
    Đăng nhập
    ---
    tags:
      - Authentication

    consumes:
      - application/json

    produces:
      - application/json

    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - mail
            - password
          properties:
            mail:
              type: string
              example: test@gmail.com
            password:
              type: string
              example: Abc@1234

    responses:
      200:
        description: Đăng nhập thành công

      400:
        description: Thiếu dữ liệu

      401:
        description: Sai email hoặc mật khẩu

      500:
        description: Lỗi máy chủ
    """

    try:
        print("========== LOGIN ==========")
        data = request.get_json(silent=True)


        if not data:
            return jsonify({
                "message": "Không nhận được dữ liệu JSON"
            }), 400

        mail = (data.get("mail") or "").strip()
        password = data.get("password") or ""
        if not mail:
            return jsonify({
                "message": "Vui lòng nhập email hoặc số điện thoại"
            }), 400

        if not password:
            return jsonify({
                "message": "Vui lòng nhập mật khẩu"
            }), 400

        result = (
            supabase
            .table("users")
            .select("id, name, mail, password, role, balance")
            .eq("mail", mail)
            .limit(1)
            .execute()
        )


        if not result.data:
            return jsonify({
                "message": "Sai email hoặc mật khẩu"
            }), 401

        user = result.data[0]

        stored_password = user.get("password")

        if not stored_password:
            return jsonify({
                "message": "Tài khoản không có mật khẩu hợp lệ"
            }), 401

        try:
            password_valid = bcrypt.checkpw(
                password.encode("utf-8"),
                stored_password.encode("utf-8")
            )
        except Exception:
            password_valid = False

        if not password_valid:
            print("BƯỚC 4: Password sai")

            return jsonify({
                "message": "Sai email hoặc mật khẩu"
            }), 401


        token = create_access_token(user)

        return jsonify({
            "message": "Đăng nhập thành công",

            "token": token,

            "user": {
                "id": user["id"],
                "name": user["name"],
                "mail": user["mail"],
                "role": user["role"],
                "balance": (
                    float(user["balance"])
                    if user["balance"] is not None
                    else 0
                )
            }
        }), 200

    except Exception as e:

        print("========================================")
        print("LOGIN ERROR:")
        print(repr(e))
        print("========================================")

        return jsonify({
            "message": "Lỗi máy chủ",
            "error": str(e)
        }), 500
#==========================================

#Đăng ký tài khoảng seller
@app.route("/register-seller", methods=["POST"])
@token_required
def register_seller(user):
    """
    Đăng ký người bán
    ---
    tags:
      - Seller

    security:
      - BearerAuth: []

    consumes:
      - application/json

    produces:
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
        description: Đã gửi yêu cầu, chờ admin duyệt

      200:
        description: Tài khoản đã là seller

      400:
        description: Dữ liệu không hợp lệ

      401:
        description: Thiếu hoặc token không hợp lệ

      409:
        description: Đã có yêu cầu pending

      500:
        description: Lỗi máy chủ
    """

    try:
        print("========== REGISTER SELLER ==========")

        # =========================================
        # BƯỚC 1: NHẬN DỮ LIỆU
        # =========================================

        data = request.get_json(silent=True)

        if not data:
            return jsonify({
                "message": "Không nhận được dữ liệu JSON"
            }), 400

        shop_name = (data.get("shop_name") or "").strip()
        address = (data.get("address") or "").strip()
        phone = (data.get("phone") or "").strip()
        id_card_front_url = (
            data.get("id_card_front_url") or ""
        ).strip()
        id_card_back_url = (
            data.get("id_card_back_url") or ""
        ).strip()
        note = (data.get("note") or "").strip()

        # =========================================
        # BƯỚC 2: KIỂM TRA DỮ LIỆU
        # =========================================

        if not shop_name:
            return jsonify({
                "message": "Vui lòng nhập tên shop"
            }), 400

        if len(shop_name) < 3:
            return jsonify({
                "message": "Tên shop phải có ít nhất 3 ký tự"
            }), 400

        if not address:
            return jsonify({
                "message": "Vui lòng nhập địa chỉ shop"
            }), 400

        if not phone:
            return jsonify({
                "message": "Vui lòng nhập số điện thoại"
            }), 400

        if not id_card_front_url:
            return jsonify({
                "message": "Vui lòng gửi ảnh CCCD mặt trước"
            }), 400

        if not id_card_back_url:
            return jsonify({
                "message": "Vui lòng gửi ảnh CCCD mặt sau"
            }), 400

        # =========================================
        # BƯỚC 3: LẤY THÔNG TIN USER HIỆN TẠI
        # =========================================

        user_result = (
            supabase
            .table("users")
            .select("id, name, mail, role, balance")
            .eq("id", user["id"])
            .limit(1)
            .execute()
        )

        if not user_result.data:
            return jsonify({
                "message": "Không tìm thấy người dùng"
            }), 404

        current_user = user_result.data[0]

        # =========================================
        # BƯỚC 4: KIỂM TRA ĐÃ LÀ SELLER CHƯA
        # =========================================

        if (current_user.get("role") or "").lower() == "seller":

            return jsonify({
                "message": "Tài khoản đã là người bán",
                "user": {
                    "id": current_user["id"],
                    "name": current_user["name"],
                    "mail": current_user["mail"],
                    "role": current_user["role"],
                    "balance": (
                        float(current_user["balance"])
                        if current_user["balance"] is not None
                        else 0
                    )
                }
            }), 200

        # =========================================
        # BƯỚC 5: KIỂM TRA YÊU CẦU PENDING
        # =========================================

        pending_result = (
            supabase
            .table("seller_requests")
            .select("id, status, created_at")
            .eq("user_id", user["id"])
            .eq("status", "pending")
            .order("created_at", desc=True)
            .limit(1)
            .execute()
        )

        if pending_result.data:

            pending_request = pending_result.data[0]

            return jsonify({
                "message": "Bạn đã gửi yêu cầu đăng ký người bán, vui lòng chờ admin duyệt",
                "seller_request": {
                    "id": pending_request["id"],
                    "status": pending_request["status"],
                    "createdAt": pending_request["created_at"]
                }
            }), 409

        # =========================================
        # BƯỚC 6: TẠO SELLER REQUEST
        # =========================================

        print("Tạo seller request...")

        result = (
            supabase
            .table("seller_requests")
            .insert({
                "user_id": user["id"],
                "shop_name": shop_name,
                "address": address,
                "phone": phone,
                "id_card_front_url": id_card_front_url,
                "id_card_back_url": id_card_back_url,
                "note": note if note else None,
                "status": "pending"
            })
            .execute()
        )

        if not result.data:
            return jsonify({
                "message": "Không thể tạo yêu cầu đăng ký seller"
            }), 500

        seller_request = result.data[0]

        # =========================================
        # BƯỚC 7: TRẢ KẾT QUẢ
        # =========================================

        return jsonify({
            "message": "Yêu cầu đăng ký người bán đã được ghi nhận, chờ admin duyệt",

            "seller_request": {
                "id": seller_request["id"],
                "userId": seller_request["user_id"],
                "shopName": seller_request["shop_name"],
                "address": seller_request["address"],
                "phone": seller_request["phone"],
                "idCardFrontUrl": seller_request["id_card_front_url"],
                "idCardBackUrl": seller_request["id_card_back_url"],
                "note": seller_request["note"],
                "status": seller_request["status"],
                "createdAt": seller_request["created_at"]
            }
        }), 202

    except Exception as e:

        return jsonify({
            "message": "Lỗi máy chủ",
            "error": str(e)
        }), 500
#==========================================

#xem danh xach yeu cau seller
@app.route("/admin/seller-requests", methods=["GET"])
@token_required
@admin_required
def get_seller_requests(user):
    """
    Admin xem danh sách yêu cầu đăng ký seller
    ---
    tags:
      - Admin Seller

    security:
      - BearerAuth: []

    produces:
      - application/json

    responses:
      200:
        description: Lấy danh sách yêu cầu thành công

      401:
        description: Thiếu hoặc token không hợp lệ

      403:
        description: Không có quyền admin

      500:
        description: Lỗi máy chủ
    """
    try:
        result = (
            supabase
            .table("seller_requests")
            .select(
                "id, user_id, shop_name, address, phone, "
                "id_card_front_url, id_card_back_url, note, status, "
                "created_at, approved_by, approved_at"
            )
            .order("created_at", desc=True)
            .execute()
        )

        requests = result.data or []

        return jsonify({
            "message": "Lấy danh sách yêu cầu seller thành công",
            "seller_requests": requests
        }), 200

    except Exception as e:
        return jsonify({
            "message": "Lỗi máy chủ",
            "error": str(e)
        }), 500
#=========================================

#Duyệt seller
@app.route(
    "/admin/seller-requests/<int:request_id>/approve",
    methods=["POST"]
)
@token_required
@admin_required
def approve_seller_request(user, request_id):
    """
    Admin duyệt yêu cầu đăng ký seller
    ---
    tags:
      - Admin Seller

    security:
      - BearerAuth: []

    parameters:
      - name: request_id
        in: path
        required: true
        type: integer
        example: 1

    responses:
      200:
        description: Duyệt seller thành công

      401:
        description: Thiếu hoặc token không hợp lệ

      403:
        description: Không có quyền admin

      404:
        description: Không tìm thấy yêu cầu

      500:
        description: Lỗi máy chủ
    """

    try:

        # 1. Tìm yêu cầu seller
        request_result = (
            supabase
            .table("seller_requests")
            .select("id, user_id, status")
            .eq("id", request_id)
            .limit(1)
            .execute()
        )

        if not request_result.data:
            return jsonify({
                "message": "Không tìm thấy yêu cầu đăng ký người bán"
            }), 404

        seller_request = request_result.data[0]

        # 2. Kiểm tra trạng thái
        if seller_request["status"] != "pending":
            return jsonify({
                "message": "Yêu cầu đã được xử lý"
            }), 400

        seller_user_id = seller_request["user_id"]

        # 3. Đổi role user thành seller
        update_user = (
            supabase
            .table("users")
            .update({
                "role": "seller"
            })
            .eq("id", seller_user_id)
            .execute()
        )

        if not update_user.data:
            return jsonify({
                "message": "Không thể cập nhật role seller"
            }), 500

        # 4. Xóa yêu cầu seller sau khi duyệt thành công
        delete_request = (
            supabase
            .table("seller_requests")
            .delete()
            .eq("id", request_id)
            .eq("status", "pending")
            .execute()
        )

        if not delete_request.data:
            return jsonify({
                "message": "Không thể xóa yêu cầu seller sau khi duyệt"
            }), 409

        # 5. Thành công
        return jsonify({
            "message": "Đã duyệt người bán và xóa yêu cầu duyệt",
            "seller_request_id": request_id,
            "user_id": seller_user_id,
            "role": "seller",
            "status": "approved"
        }), 200

    except Exception as e:
        # print("APPROVE SELLER ERROR:", repr(e))

        return jsonify({
            "message": "Lỗi máy chủ",
            "error": str(e)
        }), 500
#=========================================

#Xem thông tin tài khoản hiện tại
@app.route("/me", methods=["GET"])
@token_required
def get_current_user(user):
    """
    Lấy thông tin tài khoản hiện tại
    ---
    tags:
      - User

    security:
      - BearerAuth: []

    produces:
      - application/json

    responses:
      200:
        description: Lấy thông tin thành công

      401:
        description: Thiếu hoặc token không hợp lệ

      500:
        description: Lỗi máy chủ
    """
    try:
        return jsonify({
            "message": "Lấy thông tin tài khoản thành công",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "mail": user["mail"],
                "role": user["role"],
                "balance": (
                    float(user["balance"])
                    if user.get("balance") is not None
                    else 0
                )
            }
        }), 200

    except Exception as e:
        return jsonify({
            "message": "Lỗi máy chủ",
            "error": str(e)
        }), 500
#=========================================

#Xem danh sách sản phẩm
@app.route("/products", methods=["GET"])
def get_products():
    """
    Lấy danh sách sản phẩm hiện có
    ---
    tags:
      - Product

    produces:
      - application/json

    responses:
      200:
        description: Lấy danh sách sản phẩm thành công

      500:
        description: Lỗi máy chủ
    """
    try:
        result = (
            supabase
            .table("products")
            .select("*")
            .execute()
        )

        products = result.data or []

        return jsonify({
            "message": "Lấy danh sách sản phẩm thành công",
            "products": products
        }), 200

    except Exception as e:
        return jsonify({
            "message": "Lỗi máy chủ",
            "error": str(e)
        }), 500
#=========================================
#Đăng sản phẩm mới
@app.route("/products", methods=["POST"])
@token_required
def create_product(user):
    """
    Đăng sản phẩm mới
    ---
    tags:
      - Product

    security:
      - BearerAuth: []

    consumes:
      - application/json

    produces:
      - application/json

    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required:
            - name
            - price
            - stock
          properties:
            name:
              type: string
              example: Áo thun nam

            description:
              type: string
              example: Áo cotton 100%

            price:
              type: number
              example: 250000

            stock:
              type: integer
              example: 20

            image_url:
              type: string
              example: https://example.com/product.jpg

    responses:
      201:
        description: Đăng sản phẩm thành công

      400:
        description: Dữ liệu không hợp lệ

      401:
        description: Thiếu hoặc token không hợp lệ

      403:
        description: Không có quyền đăng sản phẩm

      500:
        description: Lỗi máy chủ
    """
    try:
        role = (user.get("role") or "").lower()
        if role not in ["seller", "admin"]:
            return jsonify({
                "message": "Chỉ seller hoặc admin mới được đăng sản phẩm"
            }), 403

        data = request.get_json(silent=True)
        if not data:
            return jsonify({
                "message": "Không nhận được dữ liệu JSON"
            }), 400

        title = (data.get("title") or data.get("name") or "").strip()
        description = (data.get("description") or "").strip()
        price = data.get("price")
        quantity = data.get("quantity")
        if quantity is None:
            quantity = data.get("stock")
        image_url = (data.get("image_url") or "").strip()
        status = (data.get("status") or "active").strip() or "active"

        if not title:
            return jsonify({
                "message": "Vui lòng nhập tên sản phẩm"
            }), 400

        if price is None:
            return jsonify({
                "message": "Vui lòng nhập giá sản phẩm"
            }), 400

        if quantity is None:
            return jsonify({
                "message": "Vui lòng nhập số lượng sản phẩm"
            }), 400

        try:
            price = float(price)
            quantity = int(quantity)
        except (TypeError, ValueError):
            return jsonify({
                "message": "Giá và số lượng phải là số hợp lệ"
            }), 400

        if price < 0:
            return jsonify({
                "message": "Giá sản phẩm không được âm"
            }), 400

        if quantity < 0:
            return jsonify({
                "message": "Số lượng sản phẩm không được âm"
            }), 400

        product_payload = {
            "seller_id": user["id"],
            "title": title,
            "description": description,
            "price": price,
            "quantity": quantity,
            "image_url": image_url,
            "status": status
        }

        result = (
            supabase
            .table("products")
            .insert(product_payload)
            .execute()
        )

        if not result.data:
            return jsonify({
                "message": "Không thể đăng sản phẩm"
            }), 500

        product = result.data[0]

        return jsonify({
            "message": "Đăng sản phẩm thành công",
            "product": product
        }), 201

    except Exception as e:
        return jsonify({
            "message": "Lỗi máy chủ",
            "error": str(e)
        }), 500
#========================================

#Nạp tiền vào tài khoản

#========================================

#Danh sách yêu cầu nạp tiền

#========================================

#Admin duyệt yêu cầu nạp tiền

#========================================

#Mua sản phẩm

#========================================

#Đăng xuất

#========================================   
if __name__ == "__main__":
    app.run(debug=True)
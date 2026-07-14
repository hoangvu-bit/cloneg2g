# Test luong dang ky seller

## 1. Chay migration

Chay file SQL nay trong database `ShopBanHang`:

```text
D:\cloneg2g\g2g\backend\migrations\001_security_payments_orders.sql
```

Kiem tra bang da ton tai:

```sql
SELECT TOP 10 * FROM dbo.SellerRequests ORDER BY Id DESC;
```

## 2. Login bang user thuong

```http
POST /login
Content-Type: application/json

{
  "mail": "user@example.com",
  "password": "User@123"
}
```

Sau khi login thanh cong, browser/Postman se co cookie `access_token` va `csrf_token`.

## 3. User gui yeu cau dang ky seller

```http
POST /register-seller
Content-Type: application/json
X-CSRF-Token: <gia_tri_cookie_csrf_token>

{
  "shop_name": "Shop test",
  "address": "123 Nguyen Trai, Quan 1, TP HCM",
  "phone": "0912345678",
  "id_card_front_url": "https://example.com/cccd-front.jpg",
  "id_card_back_url": "https://example.com/cccd-back.jpg",
  "note": "Dang ky ban hang"
}
```

Ket qua dung:

```json
{
  "message": "Yeu cau dang ky nguoi ban da duoc ghi nhan, can admin duyet truoc khi kich hoat",
  "seller_request": {
    "id": 1,
    "userId": 2,
    "shopName": "Shop test",
    "address": "123 Nguyen Trai, Quan 1, TP HCM",
    "phone": "0912345678",
    "idCardFrontUrl": "https://example.com/cccd-front.jpg",
    "idCardBackUrl": "https://example.com/cccd-back.jpg",
    "note": "Dang ky ban hang",
    "status": "pending"
  }
}
```

Kiem tra trong SQL Server:

```sql
SELECT * FROM dbo.SellerRequests WHERE Id = 1;
```

## 4. Login bang admin

```http
POST /login
Content-Type: application/json

{
  "mail": "admin@example.com",
  "password": "Admin@123"
}
```

Dung cookie va CSRF token cua admin cho cac buoc tiep theo.

## 5. Admin xem danh sach yeu cau pending

```http
GET /admin/seller-requests?status=pending
```

Lay `id` trong `seller_requests`.

## 6. Admin duyet yeu cau

```http
POST /admin/seller-requests/1/approve
X-CSRF-Token: <gia_tri_cookie_csrf_token_cua_admin>
```

Ket qua dung:

```json
{
  "message": "Da duyet nguoi ban",
  "seller_request_id": 1,
  "user_id": 2
}
```

Kiem tra database:

```sql
SELECT Id, Role FROM dbo.Users WHERE Id = 2;
SELECT Id, UserId, Status, ApprovedBy, ApprovedAt FROM dbo.SellerRequests WHERE Id = 1;
```

## 7. Admin tu choi yeu cau

Chi dung khi yeu cau con `pending`.

```http
POST /admin/seller-requests/1/reject
X-CSRF-Token: <gia_tri_cookie_csrf_token_cua_admin>
```

Ket qua dung:

```json
{
  "message": "Da tu choi yeu cau dang ky nguoi ban",
  "seller_request_id": 1
}
```

## Loi hay gap

- Neu `/register-seller` khong tra `seller_request.id`, backend dang chay code cu. Hay restart Flask.
- Neu khong thay bang `SellerRequests`, ban chua chay migration.
- Neu thieu `shop_name`, `address`, `phone`, `id_card_front_url`, `id_card_back_url`, API se tra 400.
- Neu API tra 403 `CSRF token khong hop le`, hay gui header `X-CSRF-Token` bang gia tri cookie `csrf_token`.
- Neu admin khong xem/duyet duoc, kiem tra `Users.Role` cua admin co dung la `admin` khong.

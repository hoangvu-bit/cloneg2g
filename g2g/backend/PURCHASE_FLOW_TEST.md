# Test luong mua hang

## 1. Dieu kien truoc khi test

- Da chay migration:

```text
D:\cloneg2g\g2g\backend\migrations\001_security_payments_orders.sql
```

- Buyer co `Balance` du tien.
- Product co `Quantity > 0`, `Status = active` hoac `Status IS NULL`.
- Buyer khong duoc mua san pham cua chinh minh.

## 2. Login buyer

```http
POST /login
Content-Type: application/json

{
  "mail": "buyer@example.com",
  "password": "Buyer@123"
}
```

Lay cookie `access_token` va `csrf_token`.

## 3. Goi API mua hang

```http
POST /purchase
Content-Type: application/json
X-CSRF-Token: <gia_tri_cookie_csrf_token>

{
  "product_id": 1,
  "quantity": 1
}
```

Ket qua dung:

```json
{
  "message": "Mua hang thanh cong!",
  "order": {
    "id": 1,
    "productId": 1,
    "quantity": 1,
    "totalPrice": 100000,
    "sellerId": 2
  }
}
```

## 4. Kiem tra database

Thay `1` bang `order.id` trong response:

```sql
SELECT * FROM dbo.Orders WHERE Id = 1;
SELECT * FROM dbo.OrderItems WHERE OrderId = 1;
SELECT * FROM dbo.Transactions ORDER BY Id DESC;
SELECT * FROM dbo.BalanceAuditLogs WHERE ReferenceType = 'Orders' AND ReferenceId = 1;
```

Kiem tra tien va kho:

```sql
SELECT Id, Balance FROM dbo.Users WHERE Id IN (<buyer_id>, <seller_id>);
SELECT Id, Quantity FROM dbo.Products WHERE Id = <product_id>;
```

Ket qua mong doi:

- `Products.Quantity` giam theo so luong mua.
- Buyer bi tru tien.
- Seller duoc cong tien.
- Co ban ghi trong `Orders`.
- Co ban ghi trong `OrderItems`.
- Co ban ghi trong `Transactions`.
- Co 2 ban ghi audit: `purchase_paid` cho buyer va `sale_received` cho seller.

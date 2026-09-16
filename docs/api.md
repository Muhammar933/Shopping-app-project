# THREADLY REST API Reference

Base URL: `http://localhost:3000/api`

All JSON responses adhere to the standard envelope:
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 22 }
}
```

---

## 1. Authentication
- `POST /api/auth/register`
  - Body: `{ "email": "user@example.com", "password": "SecurePassword123!", "firstName": "Marcus", "lastName": "Vance" }`
  - Returns: `{ "user": { ... }, "token": "jwt..." }`
- `POST /api/auth/login`
  - Body: `{ "email": "user@example.com", "password": "SecurePassword123!" }`
  - Returns: `{ "user": { ... }, "token": "jwt..." }`
- `GET /api/auth/me` *(Protected)*
  - Header: `Authorization: Bearer <token>`
  - Returns: Current user profile and addresses
- `POST /api/auth/logout` *(Protected)*
  - Returns: Logout confirmation

---

## 2. Products & Categories
- `GET /api/categories`
  - Returns list of clothing categories
- `GET /api/products`
  - Query parameters:
    - `category`: Category slug (e.g. `heavyweight-essentials`)
    - `search`: Full text search across name and description
    - `isFeatured`: `true` | `false`
    - `isBestSeller`: `true` | `false`
    - `isNew`: `true` | `false`
    - `minPrice`: Number
    - `maxPrice`: Number
    - `sort`: `newest` | `price_asc` | `price_desc` | `popular`
    - `page`, `limit`
- `GET /api/products/:id`
  - Returns full product object with variants and user reviews
- `POST /api/products` *(Admin)*
- `PUT /api/products/:id` *(Admin)*
- `DELETE /api/products/:id` *(Admin)*

---

## 3. Cart Management
- `GET /api/cart` *(Protected)*
  - Returns active cart with server-calculated subtotals and shipping.
- `POST /api/cart/items` *(Protected)*
  - Body: `{ "productId": "...", "variantId": "...", "quantity": 1 }`
- `PUT /api/cart/items/:id` *(Protected)*
  - Body: `{ "quantity": 2 }`
- `DELETE /api/cart/items/:id` *(Protected)*

---

## 4. Orders & Checkout
- `POST /api/orders` *(Protected)*
  - Body: `{ "addressId": "..." }`
  - Verifies inventory, runs `PaymentService.processPayment`, creates order, clears cart.
- `GET /api/orders` *(Protected)*
  - Returns user's order history.
- `GET /api/orders/:id` *(Protected)*
- `PUT /api/orders/:id/status` *(Admin)*
  - Body: `{ "status": "SHIPPED" }`

---

## 5. Virtual Try-On
- `POST /api/try-on` *(Protected)*
  - Multipart form data:
    - `productId`: ID of chosen T-shirt
    - `image`: User photo (JPEG/PNG/WEBP, up to 10MB)
  - Returns: `{ "id": "session-uuid", "status": "PENDING" | "PROCESSING" }`
- `GET /api/try-on/:id` *(Protected)*
  - Polls session status and retrieves generated look once `COMPLETED`.

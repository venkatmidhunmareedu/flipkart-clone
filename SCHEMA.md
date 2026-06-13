# Database Schema

Prisma schema for the Flipkart Clone. All monetary values stored as **integers in paise** (₹1 = 100 paise) to avoid floating-point errors.

---

## Conventions

- Primary keys: `String @id @default(cuid())`
- Money columns: suffix `(paise)` in comments — e.g. `mrp Int` stores ₹499 as `49900`
- Discount %: computed as `round((mrp - sellingPrice) / mrp * 100)`
- Timestamps: `createdAt DateTime @default(now())`, `updatedAt DateTime @updatedAt`
- Unique constraints on join tables prevent duplicate cart/wishlist entries

---

## Full Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  phone         String?
  firstName     String
  lastName      String?
  gender        String?
  passwordHash  String
  emailVerified Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  addresses     Address[]
  cartItems     CartItem[]
  orders        Order[]
  wishlistItems WishlistItem[]
  otps          OTP[]
}

model OTP {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  code      String
  type      OTPType
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())
}

enum OTPType {
  EMAIL_VERIFY
  PASSWORD_RESET
}

// ─────────────────────────────────────────────
// CATALOG
// ─────────────────────────────────────────────

model Category {
  id       String     @id @default(cuid())
  name     String
  slug     String     @unique
  image    String?
  parentId String?
  parent   Category?  @relation("SubCategories", fields: [parentId], references: [id])
  children Category[] @relation("SubCategories")

  products Product[]
}

model Product {
  id           String   @id @default(cuid())
  title        String
  slug         String   @unique
  description  String
  brand        String
  categoryId   String
  category     Category @relation(fields: [categoryId], references: [id])

  images       String[] // array of image URLs

  // Money stored in paise (₹1 = 100 paise)
  mrp          Int
  sellingPrice Int
  stock        Int      @default(0)

  rating      Float   @default(0)
  reviewCount Int     @default(0)
  isFeatured  Boolean @default(false)
  isAssured   Boolean @default(false)

  // Flexible variant attributes e.g. {"size":["S","M","L"],"color":["Red","Blue"]}
  attributes Json?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  cartItems     CartItem[]
  orderItems    OrderItem[]
  wishlistItems WishlistItem[]
}

// ─────────────────────────────────────────────
// ADDRESSES
// ─────────────────────────────────────────────

model Address {
  id        String      @id @default(cuid())
  userId    String
  user      User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  phone     String
  line1     String
  line2     String?
  city      String
  state     String
  pincode   String      // 6-digit Indian pincode, validated as /^\d{6}$/
  type      AddressType @default(HOME)
  isDefault Boolean     @default(false)
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  orders Order[]
}

enum AddressType {
  HOME
  WORK
  OTHER
}

// ─────────────────────────────────────────────
// CART
// ─────────────────────────────────────────────

model CartItem {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantity  Int      @default(1)

  // Snapshot of sellingPrice at the time the item was added (paise)
  priceAtAdd Int

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, productId])
}

// ─────────────────────────────────────────────
// ORDERS
// ─────────────────────────────────────────────

model Order {
  id    String @id @default(cuid())
  userId String
  user  User   @relation(fields: [userId], references: [id])

  addressId String
  address   Address @relation(fields: [addressId], references: [id])

  items OrderItem[]

  // One-way status transitions: PENDING → CONFIRMED → SHIPPED → DELIVERED
  status        OrderStatus   @default(PENDING)
  paymentStatus PaymentStatus @default(PENDING)

  // Razorpay identifiers
  razorpayOrderId String?
  paymentId       String?

  // Total in paise (recalculated server-side, never trusted from client)
  totalAmount Int

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId String
  product   Product @relation(fields: [productId], references: [id])

  quantity Int

  // Price snapshot at time of order (paise)
  price Int
  mrp   Int
}

// ─────────────────────────────────────────────
// WISHLIST
// ─────────────────────────────────────────────

model WishlistItem {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  productId String
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@unique([userId, productId])
}
```

---

## Entity Relationship Diagram

```
User ──< OTP            (one user, many OTPs)
User ──< Address        (one user, many addresses)
User ──< CartItem       (one user, many cart items)
User ──< Order          (one user, many orders)
User ──< WishlistItem   (one user, many wishlist items)

Category ──< Category   (self-join: parent → children)
Category ──< Product    (one category, many products)

Product ──< CartItem    (one product in many carts)
Product ──< OrderItem   (one product in many order lines)
Product ──< WishlistItem

Order ──< OrderItem     (one order, many line items)
Address ──< Order       (one address used in many orders)
```

---

## Key Business Rules (encoded in schema)

| Rule | Implementation |
|------|---------------|
| Money as integers | All price/amount fields are `Int` (paise) |
| Cart price snapshot | `CartItem.priceAtAdd` captured at insert time |
| Order price snapshot | `OrderItem.price` and `OrderItem.mrp` frozen at order time |
| No duplicate cart entries | `@@unique([userId, productId])` on `CartItem` |
| No duplicate wishlist entries | `@@unique([userId, productId])` on `WishlistItem` |
| Indian pincode | `Address.pincode String` — validated `/^\d{6}$/` in service layer |
| One-way order status | Enforced in service layer; schema stores current state only |
| Cascade deletes | User delete cascades to OTP, Address, CartItem, WishlistItem |

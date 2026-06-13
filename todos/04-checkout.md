# Module 04 — Checkout & Orders

Address selection, order summary review, Razorpay payment, and order confirmation.

---

## Backend — Address API

- [x] **04-B-01** Create `apps/backend/src/services/address.service.ts`:
  - `getAddresses(userId)` — list all addresses for user
  - `addAddress(userId, data)` — create; if `isDefault: true`, unset existing defaults
  - `updateAddress(userId, addressId, data)` — partial update; handle default logic
  - `deleteAddress(userId, addressId)` — delete; reassign default if deleted was default
  - `setDefaultAddress(userId, addressId)` — unset all, set one

- [x] **04-B-02** Create `apps/backend/src/routes/addresses.routes.ts`:
  - `GET    /api/addresses`
  - `POST   /api/addresses`
  - `PATCH  /api/addresses/:id`
  - `DELETE /api/addresses/:id`
  - `PATCH  /api/addresses/:id/default`
  - All routes protected by `authMiddleware`

## Backend — Orders API

- [x] **04-B-03** Install Razorpay SDK:
  ```bash
  cd apps/backend
  pnpm add razorpay
  pnpm add -D @types/razorpay
  ```

- [x] **04-B-04** Create `apps/backend/src/services/order.service.ts`:
  - `createRazorpayOrder(amount)` — creates Razorpay order via SDK, returns `{ id, amount, currency }`
  - `placeOrder(userId, { addressId, cartItems?, productId?, quantity? })`:
    1. Fetch cart from DB (never trust client prices)
    2. Re-validate all product stock levels
    3. Create `Order` record with status `PENDING`
    4. Create `OrderItem` records with price/mrp snapshots from DB
    5. Decrement `Product.stock` for each item
    6. Clear cart items (`clearCart(userId)`)
    7. Return `{ orderId, razorpayOrderId, amount }`
  - `verifyPayment(orderId, razorpayPaymentId, razorpaySignature)`:
    - Verify HMAC-SHA256 signature: `razorpay_order_id + "|" + razorpay_payment_id` with `RAZORPAY_KEY_SECRET`
    - On success: update `Order.paymentStatus = PAID`, `Order.status = CONFIRMED`, store `paymentId`
    - On failure: update `Order.paymentStatus = FAILED`
  - `getOrders(userId)` — list all orders with items and product thumbnails, latest first
  - `getOrderById(userId, orderId)` — single order detail

- [x] **04-B-05** Create `apps/backend/src/routes/orders.routes.ts`:
  - `POST /api/orders/initiate` — returns Razorpay order ID
  - `POST /api/orders/confirm` — verifies payment + marks order confirmed
  - `GET  /api/orders` — order history
  - `GET  /api/orders/:id` — order detail
  - All routes protected by `authMiddleware`

- [x] **04-B-06** Send order confirmation email via Nodemailer after successful payment:
  - Subject: "Order Confirmed — Order #XYZ"
  - Body: order items, total, estimated delivery date (today + 5 days), address

## Frontend — Checkout Flow

The checkout flow has 3 logical steps:
1. **Select/Add Address** — choose delivery address
2. **Order Summary** — review items before paying
3. **Payment** — Razorpay popup
4. **Confirmation** — order ID + success message

- [x] **04-F-01** Install Razorpay frontend script type:
  ```bash
  pnpm add -D @types/razorpay
  ```

- [x] **04-F-02** Create `apps/frontend/app/checkout/page.tsx` — multi-step checkout page (Client Component)
  - Step indicator: Address → Order Summary → Payment
  - Reads cart data from `useCart()`

### Step 1 — Address

- [x] **04-F-03** Create `apps/frontend/components/checkout/address-step.tsx`:
  - Lists saved addresses as selectable radio cards
  - Matches `design/addresses.png` card layout (type badge: HOME/WORK, name, phone, full address, pincode)
  - "Add a New Address" expandable form at bottom
  - "Deliver Here" button on selected card → advances to step 2

- [x] **04-F-04** Create `apps/frontend/components/checkout/address-form.tsx`:
  - Fields: Name, Phone (10-digit Indian mobile), Flat/House No., Area/Street/Sector, City, State, Pincode (6-digit)
  - Address type selector: Home / Work / Other
  - "Save and Deliver Here" button

### Step 2 — Order Summary

- [x] **04-F-05** Create `apps/frontend/components/checkout/order-summary-step.tsx`:
  - Shows all cart items (thumbnail, name, qty, price)
  - Price details panel: MRP, discount, fees, total
  - "Continue" button → triggers Razorpay

### Step 3 — Payment (Razorpay)

- [x] **04-F-06** Create `apps/frontend/lib/razorpay.ts`:
  - `loadRazorpayScript()` — dynamically loads `https://checkout.razorpay.com/v1/checkout.js`
  - `openRazorpayCheckout(options)` — opens Razorpay modal with prefilled name, email, contact

- [x] **04-F-07** On "Place Order" in order summary:
  1. Call `POST /api/orders/initiate` → receive `razorpayOrderId`, `amount`
  2. Load Razorpay script
  3. Open Razorpay modal with `key`, `amount`, `order_id`, `prefill` from session
  4. On `payment.success` handler: call `POST /api/orders/confirm` with payment details
  5. On success: redirect to `/order-confirmation/[orderId]`
  6. On `payment.failed`: show toast error, stay on page

### Step 4 — Confirmation

- [x] **04-F-08** Create `apps/frontend/app/order-confirmation/[orderId]/page.tsx`:
  - Green checkmark animation
  - "Order Placed Successfully!" heading
  - Order ID displayed prominently: `#ORD-XXXXXXXX`
  - Order items summary
  - Estimated delivery date
  - "Continue Shopping" button → `/`
  - "View Orders" button → `/account/orders`

---

## Design Details from `design/checkout.png` — Additional Todos

### Step Progress Indicator

- [x] **04-F-11** Create `apps/frontend/components/checkout/step-indicator.tsx`:
  - 3 steps: **Address** → **Order Summary** → **Payment**
  - Each step has a number circle (1, 2, 3) connected by a line
  - Completed step: blue filled circle with a white checkmark (✓), line turns blue
  - Active step: blue circle with white number, bold label
  - Future step: grey circle with number, grey label
  - Matches the step bar visible at top of `design/checkout.png`

### Step 2 — Order Summary (expanded from `04-F-05`)

- [x] **04-F-12** Add deliverability warning banner in `order-summary-step.tsx`:
  - Dark blue/navy banner: **"N items are not deliverable to {pincode}. Please try changing the address."**
  - Shown when backend returns any item with `deliverable: false` for the selected address pincode
  - Tappable "Change" link re-opens address step (step 1)

- [x] **04-F-13** Add "Deliver to" address recap bar inside order summary:
  - Line 1: `Deliver to:` label — `{Name}` + type badge pill (e.g. **HOME** in blue) — `Change` link (right-aligned)
  - Line 2: Full address (line1, area, city, pincode)
  - Line 3: Phone number

- [x] **04-F-14** Add pincode mismatch inline warning card:
  - Amber/orange-tinted box: **"Pincode does not match the address"**
  - `Check & Confirm` button on the right (outlined blue)
  - Shown when the address pincode doesn't match the delivery area of at least one item
  - Clicking `Check & Confirm` calls `POST /api/addresses/:id` to update pincode and re-validates deliverability

- [x] **04-F-15** Expand order summary item card in `order-summary-step.tsx` to match design:
  - Product thumbnail (left)
  - Product name (bold, truncated)
  - **Variant/size line**: e.g. `Size: L` or `78 cm x 62 cm` — rendered from `product.attributes`
  - Star rating + review count
  - Discount % (green, downward arrow) + MRP strikethrough + selling price bold
  - Qty stepper (same as cart)
  - **"Currently out of stock for {pincode}"** — red text shown per-item when that SKU can't be delivered to the pincode
  - **BESTSELLER** badge (green pill) + **Hot Deal** badge when applicable
  - **Assured** badge (blue tick) for verified products — add `isAssured: Boolean @default(false)` field to `Product` schema

### Backend — Deliverability Validation

- [x] **04-B-07** Add `checkDeliverability(pincode, productIds[])` in `order.service.ts`:
  - For MVP: checks `Product.stock > 0` per item; marks `deliverable: false` for out-of-stock items
  - Returns `{ deliverable: boolean, items: { productId, deliverable, reason? }[] }`
  - Future: can integrate a real pin-serviceability API

- [x] **04-B-08** Add endpoint `POST /api/orders/check-delivery`:
  - Body: `{ pincode, productIds[] }`
  - Returns deliverability result per product
  - Protected by `authMiddleware`

### Price Details Panel (right column — expanded)

- [x] **04-F-16** Expand `apps/frontend/components/checkout/price-details-panel.tsx` (split from `order-summary-step.tsx`):
  - **MRP (Incl. of all taxes)** — sum of all `mrp × qty`
  - **Fees** row — expandable (chevron) showing platform/handling fee breakdown; default ₹40–₹145 based on order value
  - **Discounts** row — expandable (chevron), shown in green (`-₹X,XXX`)
  - **Total Amount** — bold
  - Green savings banner: **"You will save ₹X,XXX on this order"**
  - Shield icon + "Safe and secure payments. Easy returns. 100% Authentic products."
  - Bottom section: strikethrough MRP small text + bold total large text
  - **"Continue"** button (yellow/grey depending on deliverability — disabled grey if any item undeliverable)
  - **"View price details"** text link below Continue (expands full breakdown in a modal/sheet)

## Frontend — Order API Hooks

- [x] **04-F-09** Create `apps/frontend/lib/order-api.ts`:
  - `initiateOrder(addressId)` — `POST /api/orders/initiate`
  - `confirmOrder(orderId, paymentId, signature)` — `POST /api/orders/confirm`
  - `getOrders()` — `GET /api/orders`
  - `getOrderById(id)` — `GET /api/orders/:id`

- [x] **04-F-10** Create `apps/frontend/hooks/use-orders.ts`:
  - `useOrders()` — list for account page
  - `useOrder(id)` — single order detail

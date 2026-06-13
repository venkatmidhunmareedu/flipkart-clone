# Module 03 — Shopping Cart

View, update, and remove cart items. Price summary panel with totals.

> Design reference: `design/cart.png` (empty state), `design/cart_listing.png` (filled cart), `design/on_add_to_cart.png` (add confirmation)

---

## Backend — Cart API

- [x] **03-B-01** Create `apps/backend/src/services/cart.service.ts`:
  - `getCart(userId)` — fetch all `CartItem` records with product details; compute totals server-side
    - Return `{ items, summary: { mrpTotal, discount, total, itemCount } }` (all in paise)
  - `addToCart(userId, productId, quantity?)` — upsert using `@@unique([userId, productId])`
    - Capture `priceAtAdd = product.sellingPrice` at insert time
    - Throw `400` if `product.stock < quantity`
  - `updateCartQuantity(userId, productId, quantity)` — update quantity; throw `400` if quantity < 1 or > stock
  - `removeFromCart(userId, productId)` — delete cart item
  - `clearCart(userId)` — delete all cart items for user (used after order placement)

- [x] **03-B-02** Create `apps/backend/src/controllers/cart.controller.ts`:
  - `GET  /api/cart` — get cart (requires auth middleware)
  - `POST /api/cart` — add item `{ productId, quantity? }`
  - `PATCH /api/cart/:productId` — update quantity `{ quantity }`
  - `DELETE /api/cart/:productId` — remove item
  - `DELETE /api/cart` — clear all items

- [x] **03-B-03** Create `apps/backend/src/routes/cart.routes.ts` and mount at `/api/cart`

- [x] **03-B-04** Create `apps/backend/src/middleware/auth.middleware.ts`:
  - Reads `Authorization: Bearer <token>` header
  - Verifies JWT signed with `JWT_SECRET`
  - Attaches `req.user = { id, email }` to request
  - Returns `401` if missing or invalid

- [x] **03-B-05** Apply `authMiddleware` to all cart routes

## Frontend — Cart State (Client)

- [x] **03-F-01** Install TanStack Query (already added) — create `apps/frontend/lib/cart-api.ts`:
  - `fetchCart()` — `GET /api/cart`
  - `addToCart(productId, quantity?)` — `POST /api/cart`
  - `updateQuantity(productId, quantity)` — `PATCH /api/cart/:productId`
  - `removeFromCart(productId)` — `DELETE /api/cart/:productId`

- [x] **03-F-02** Create `apps/frontend/hooks/use-cart.ts`:
  - `useCart()` — TanStack Query `useQuery` for cart data
  - `useAddToCart()` — `useMutation` with optimistic update + cache invalidation
  - `useUpdateQuantity()` — `useMutation`
  - `useRemoveFromCart()` — `useMutation`
  - All mutations invalidate `["cart"]` query key on settle

- [x] **03-F-03** Create `apps/frontend/components/cart/cart-count-badge.tsx`:
  - Reads cart item count from `useCart()`
  - Displayed on cart icon in header navbar

## Frontend — Cart Page (`/cart`)

> Design: Left panel — list of cart items with product image, name, rating, price, quantity stepper, "Save for later", "Remove", "Buy this now". Right panel — "Price Details" box with MRP total, discounts, fees, total amount, "Place Order" button. Matches `design/cart_listing.png`.

- [x] **03-F-04** Create `apps/frontend/app/cart/page.tsx` (Client Component — needs session + cart query):
  - Show empty cart state (`design/cart.png`) with "Login" CTA if unauthenticated
  - Show "Continue Shopping" link pointing to `/`
  - Render `<CartItemList />` + `<CartSummary />` in two-column layout

- [x] **03-F-05** Create `apps/frontend/components/cart/cart-item-list.tsx`:
  - Header: "Deliver to: Hyderabad - 500019 · Change" (uses default address pincode)
  - Maps over cart items and renders `<CartItem />`

- [x] **03-F-06** Create `apps/frontend/components/cart/cart-item.tsx`:
  - Product thumbnail (50×50) with Zoom label badge
  - Product name (truncated, links to `/p/[slug]`)
  - Brand name
  - Star rating + review count
  - Discount % in green + MRP strikethrough + selling price
  - UPI offer line ("₹X with UPI offer + more")
  - "Hot Deal" badge if applicable
  - Delivery estimate ("Delivery by Jun 18, Thu" — computed +5 days from today)
  - **Quantity stepper**: minus button / quantity display / plus button
    - Minus button: if quantity = 1, shows removal confirmation
    - Plus button: disabled when quantity = stock
  - Action row:
    - "Save for later" (moves to wishlist)
    - "Remove" (removes from cart)
    - "Buy this now" (goes to `/checkout?direct=productId`)

- [x] **03-F-07** Create `apps/frontend/components/cart/cart-summary.tsx`:
  - "Price Details" header (sticky on desktop scroll)
  - Rows: MRP (incl. of all taxes), Discount (in green), Delivery Fee (free or ₹40), Total Amount (bold)
  - Green savings banner: "You will save ₹X,XXX on this order"
  - Security note: "Safe and secure payments. Easy returns. 100% Authentic products." with shield icon
  - Strikethrough MRP + bold total at bottom
  - "Place Order" yellow button → navigates to `/checkout`

- [x] **03-F-08** Create `apps/frontend/components/cart/empty-cart.tsx`:
  - Flipkart bag illustration (SVG)
  - "Missing Cart items?" heading
  - "Login" button (primary blue)
  - "Continue Shopping" text link

## Frontend — Add-to-Cart Interaction

- [x] **03-F-09** Create `apps/frontend/components/cart/add-to-cart-toast.tsx`:
  - Modal/sheet overlay triggered on successful `useAddToCart` mutation
  - Matches `design/on_add_to_cart.png`:
    - Green checkmark + "Hooray! 1 item added to the cart"
    - Product name subtitle
    - "Go to Cart" full-width button at bottom
  - Auto-dismisses after 4 seconds or on background click

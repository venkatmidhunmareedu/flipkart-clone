# Module 05 — Wishlist

Add/remove products from wishlist, toggle heart icon on product cards, and dedicated wishlist page.

> Design reference: `design/wishlist.png`, `design/product_view.png` (heart icon top-right of image gallery)

---

## Backend — Wishlist API

- [x] **05-B-01** Create `apps/backend/src/services/wishlist.service.ts`:
  - `getWishlist(userId)` — return all `WishlistItem` records with product details (id, title, slug, images, mrp, sellingPrice, brand, stock, rating)
  - `addToWishlist(userId, productId)` — upsert (ignore if already exists); return created item
  - `removeFromWishlist(userId, productId)` — delete by `userId + productId`; return 404 if not found
  - `isInWishlist(userId, productId)` — boolean check (used for rendering heart icon state)
  - `getWishlistProductIds(userId)` — returns `string[]` of productIds (efficient for bulk heart-state rendering)

- [x] **05-B-02** Create `apps/backend/src/controllers/wishlist.controller.ts`

- [x] **05-B-03** Create `apps/backend/src/routes/wishlist.routes.ts` and mount at `/api/wishlist`:
  - `GET    /api/wishlist` — full wishlist with product details
  - `GET    /api/wishlist/ids` — array of product IDs only
  - `POST   /api/wishlist` — add item `{ productId }`
  - `DELETE /api/wishlist/:productId` — remove item
  - All routes protected by `authMiddleware`

## Frontend — Wishlist State

- [x] **05-F-01** Create `apps/frontend/lib/wishlist-api.ts`:
  - `fetchWishlist()` — `GET /api/wishlist`
  - `fetchWishlistIds()` — `GET /api/wishlist/ids`
  - `addToWishlist(productId)` — `POST /api/wishlist`
  - `removeFromWishlist(productId)` — `DELETE /api/wishlist/:productId`

- [x] **05-F-02** Create `apps/frontend/hooks/use-wishlist.ts`:
  - `useWishlistIds()` — `useQuery(["wishlist-ids"])` — returns `Set<string>` for O(1) lookup
  - `useWishlist()` — `useQuery(["wishlist"])` — full list with product details
  - `useToggleWishlist()` — `useMutation`:
    - If productId is in set → call remove
    - If not → call add
    - Optimistic update on `wishlist-ids` cache
    - Invalidate both `["wishlist"]` and `["wishlist-ids"]` on settle

## Frontend — Heart Icon Component

- [x] **05-F-03** Create `apps/frontend/components/wishlist/wishlist-button.tsx`:
  - Props: `productId: string`
  - Reads from `useWishlistIds()` to determine filled (red heart) vs outline state
  - Calls `useToggleWishlist()` on click
  - If unauthenticated: redirects to `/login?callbackUrl=current-url`
  - Animation: heart scale pulse on toggle
  - Accessible: `aria-label="Add to wishlist"` / `"Remove from wishlist"`

- [x] **05-F-04** Integrate `<WishlistButton productId={...} />` into:
  - `apps/frontend/components/catalog/product-card.tsx` — top-right corner absolute position
  - `apps/frontend/components/product/product-info.tsx` — beside product title
  - `apps/frontend/components/product/product-image-gallery.tsx` — top-right overlay on main image (matches `design/product_view.png` heart + share icons)

## Frontend — Wishlist Page (`/wishlist`)

> Design: Left sidebar with user avatar, nav links (My Orders, Account Settings, Payments, My Stuff). Right panel: "My Wishlist (N)" header, list of products. Matches `design/wishlist.png`.

- [x] **05-F-05** Create `apps/frontend/app/wishlist/page.tsx` (Server Component):
  - Protected by middleware
  - Fetches wishlist from backend
  - Renders `<AccountSidebar />` + `<WishlistPanel />`

- [x] **05-F-06** Create `apps/frontend/components/wishlist/wishlist-panel.tsx`:
  - Header: "My Wishlist (N)"
  - List of wishlist items as horizontal cards:
    - Product thumbnail (80×80)
    - Product title (links to `/p/[slug]`)
    - MRP strikethrough + selling price + discount %
    - Delete icon (trash) on right
  - Empty state: "Your wishlist is empty — Start adding items you love"
  - "Continue Shopping" link

- [x] **05-F-07** Create `apps/frontend/components/wishlist/wishlist-item.tsx`:
  - Individual wishlist row matching `design/wishlist.png`
  - Remove button calls `useToggleWishlist()`

## Frontend — "Save for Later" from Cart

- [x] **05-F-08** In `apps/frontend/components/cart/cart-item.tsx`, wire "Save for later" button:
  - Calls `addToWishlist(productId)` + `removeFromCart(productId)` in sequence
  - Shows loading state on button during mutation
  - On success: refetch both cart and wishlist queries

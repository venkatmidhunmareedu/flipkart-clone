# Module 02 — Product Catalog

Product listing page, product detail page, search, and category filtering.

> Design reference: `design/home_page.png`, `design/product_lisiting.png`, `design/product_view.png`, `design/similar_products_under_product_view.png`

---

## Backend — Products API

- [x] **02-B-01** Create `apps/backend/src/services/product.service.ts`:
  - `getProducts({ categorySlug?, search?, page?, limit?, sortBy? })` — paginated product list
    - `sortBy` options: `relevance` | `price_asc` | `price_desc` | `rating` | `newest`
    - Filter by `categoryId` (include children categories via recursive slug lookup)
    - Full-text search on `title` and `brand` using Prisma `contains` (case-insensitive)
    - Returns `{ products, total, page, totalPages }`
  - `getProductBySlug(slug)` — single product with category breadcrumb
  - `getSimilarProducts(productId, categoryId, limit?)` — products in same category, excluding current
  - `getFeaturedProducts(limit?)` — `isFeatured: true` products
  - `getCategories()` — all top-level categories with children
  - `getCategoryBySlug(slug)` — category with parent chain (for breadcrumb)

- [x] **02-B-02** Create `apps/backend/src/controllers/product.controller.ts`:
  - `GET /api/products` — list with query params `?category=&search=&page=&limit=&sort=`
  - `GET /api/products/:slug` — single product detail
  - `GET /api/products/:slug/similar` — similar products carousel
  - `GET /api/products/featured` — featured products for homepage

- [x] **02-B-03** Create `apps/backend/src/routes/products.routes.ts` and mount at `/api/products`

- [x] **02-B-04** Create `apps/backend/src/routes/categories.routes.ts`:
  - `GET /api/categories` — full category tree
  - `GET /api/categories/:slug` — single category with children

- [x] **02-B-05** Add response transform helper `formatProduct(product)`:
  - Converts `mrp` and `sellingPrice` from paise to rupees for API consumers
  - Computes `discountPercent = Math.round((mrp - sellingPrice) / mrp * 100)`
  - Adds `inStock: product.stock > 0`

## Frontend — Home Page (`/`)

> Design: Blue category navbar, hero banner with sale coupon, horizontal scroll sections "Suggested for You", "End of Season Sale", etc.

- [x] **02-F-01** Update `apps/frontend/app/page.tsx` (Server Component):
  - Fetch featured products from backend
  - Fetch all categories
  - Render `<HeroBanner />`, `<CategoryNav />`, `<ProductCarousel title="Suggested for You" />`

- [x] **02-F-02** Create `apps/frontend/components/home/hero-banner.tsx`:
  - Yellow/blue Flipkart-style promotional banner matching `design/home_page.png`
  - Static content for now (coupon, sale period text)

- [x] **02-F-03** Create `apps/frontend/components/home/product-carousel.tsx`:
  - Horizontal scroll row of product cards
  - Prev/Next arrow buttons at edges
  - Accepts `title`, `products[]` props

## Frontend — Product Listing Page (`/search` and `/category/[slug]`)

> Design: Grid of cards with product image, rating stars, name, MRP strikethrough, selling price, discount %, "Hot Deal" badge. Matches `design/product_lisiting.png`.

- [x] **02-F-04** Create `apps/frontend/app/search/page.tsx` (Server Component):
  - Reads `?q=`, `?category=`, `?sort=`, `?page=` from searchParams
  - Fetches products from backend
  - Renders `<ProductGrid />` alongside `<FilterSidebar />`

- [x] **02-F-05** Create `apps/frontend/app/category/[slug]/page.tsx` — same structure as search page, pre-filtered by category

- [x] **02-F-06** Create `apps/frontend/components/catalog/product-card.tsx`:
  - White card with subtle shadow
  - Product image (square, object-cover)
  - Star rating display (filled/half/empty)
  - Product title (truncated to 2 lines)
  - MRP with strikethrough + selling price in bold
  - Green discount percentage badge
  - "Hot Deal" label badge when discount ≥ 50%
  - Wishlist heart icon (top-right corner)
  - Links to `/p/[slug]`

- [x] **02-F-07** Create `apps/frontend/components/catalog/product-grid.tsx`:
  - Responsive CSS grid: 2 cols (mobile) → 3 cols (tablet) → 4–5 cols (desktop)
  - Skeleton loading state (shimmer cards)
  - "No products found" empty state

- [x] **02-F-08** Create `apps/frontend/components/catalog/filter-sidebar.tsx`:
  - Category filter (radio group)
  - Price range slider (min/max in ₹)
  - Brand checkboxes
  - Rating filter (≥4★, ≥3★, etc.)
  - "Apply Filters" / "Clear All" buttons
  - Filters update URL query params (no page reload — `useRouter().push`)

- [x] **02-F-09** Create `apps/frontend/components/catalog/sort-select.tsx`:
  - Dropdown: Relevance | Price: Low to High | Price: High to Low | Customer Rating | Newest First

- [x] **02-F-10** Create `apps/frontend/components/catalog/pagination.tsx`:
  - Page number buttons with ellipsis for large ranges

## Frontend — Product Detail Page (`/p/[slug]`)

> Design: Left image gallery, right: breadcrumb, title, rating, price with UPI offer, Add to Cart + Buy Now buttons. Matches `design/product_view.png` and `design/similar_products_under_product_view.png`.

- [x] **02-F-11** Create `apps/frontend/app/p/[slug]/page.tsx` (Server Component):
  - Fetch product by slug
  - Fetch similar products
  - Render page components

- [x] **02-F-12** Create `apps/frontend/components/product/product-image-gallery.tsx`:
  - Left: vertical thumbnail strip (4–5 thumbnails)
  - Main: large selected image with zoom-on-hover
  - Matches Flipkart's two-column image layout from `design/product_view.png`

- [x] **02-F-13** Create `apps/frontend/components/product/product-info.tsx`:
  - Breadcrumb navigation (Home > Category > Subcategory > Product)
  - Product title + brand
  - Star rating with review count
  - Price section: discount% in green arrow, MRP strikethrough, selling price in bold, UPI cashback offer line
  - Offer section: "WOW DEAL — Apply offers for maximum savings" expandable panel
  - "Add to Cart" button (grey/blue) + "Buy Now" button (yellow — Flipkart style)
  - Wishlist heart icon button
  - Stock status badge (In Stock / Only N left / Out of Stock)

- [x] **02-F-14** Create `apps/frontend/components/product/product-specs.tsx`:
  - Renders `product.attributes` JSON as a key-value specification table
  - Product description section

- [x] **02-F-15** Create `apps/frontend/components/product/similar-products.tsx`:
  - Horizontal scroll carousel labelled "Similar Products"
  - Uses same `<ProductCard />` component

- [x] **02-F-16** Create `apps/frontend/components/product/add-to-cart-drawer.tsx`:
  - Slide-in overlay on "Add to Cart" success matching `design/on_add_to_cart.png`
  - Shows: "Hooray! 1 item added to the cart", product name, "Go to Cart" CTA button

## Frontend — Shared Utilities

- [x] **02-F-17** Create `apps/frontend/lib/format.ts`:
  ```ts
  // paise → "₹1,499"
  export function formatPrice(paise: number): string
  // 0-100 → "60% off"
  export function formatDiscount(mrp: number, sellingPrice: number): string
  ```

- [x] **02-F-18** Create `apps/frontend/lib/api.ts`:
  - Typed fetch wrapper for backend calls with `NEXT_PUBLIC_API_URL` base
  - Exports: `getProducts()`, `getProductBySlug()`, `getCategories()`, `getSimilarProducts()`

## SEO

- [x] **02-F-19** Add `generateMetadata` to `/p/[slug]/page.tsx` — product name + description in `<head>`
- [x] **02-F-20** Add `generateMetadata` to `/category/[slug]/page.tsx`

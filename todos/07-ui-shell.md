# Module 07 — UI Shell (Header, Navbar, Layout, Responsive)

Global layout shell: Flipkart-style header with search, category navbar, and footer. Applied across all pages.

> Design reference: `design/home_page.png`, `design/product_view.png`, `design/wishlist.png` (for logged-in header state)

---

## Global Layout

- [x] **07-F-01** Update `apps/frontend/app/layout.tsx`:
  - Wrap in `<SessionProvider>` (from `components/session-provider.tsx`)
  - Wrap in `<QueryClientProvider>` (already scaffolded)
  - Render `<Header />` and `<Footer />` around `{children}`
  - Apply `font-sans` base and Flipkart blue CSS custom property `--primary: #2874f0`

- [x] **07-F-02** Update `apps/frontend/app/globals.css`:
  - Define CSS variables:
    ```css
    :root {
      --primary: #2874f0;
      --primary-dark: #1a5fd1;
      --accent: #ffe500;
      --success: #388e3c;
      --danger: #d32f2f;
      --text-primary: #212121;
      --text-secondary: #878787;
      --border: #e0e0e0;
      --surface: #f1f3f6;
    }
    ```
  - Base font: Inter (already in layout or swap to system-ui for speed)
  - Remove default Next.js placeholder styles

## Header Component

> Design: Top row — Flipkart logo (yellow F on blue), "Explore Plus" tag; Search bar (full-width); Login dropdown with avatar, "More" chevron, cart icon with badge. Matches `design/home_page.png` and `design/product_view.png`.

- [x] **07-F-03** Create `apps/frontend/components/layout/header.tsx`:
  - Blue background (`#2874f0`), white text
  - Three sections (flex row):

### Logo Section
  - Flipkart wordmark (SVG) with "Explore Plus" sub-label in yellow italic
  - Links to `/`

### Search Bar
  - Full-width `<input>` with magnifying glass icon button
  - Placeholder: "Search for Products, Brands and More"
  - On submit: `router.push("/search?q=encodeURIComponent(query)")`
  - On mobile: search icon only, expands to full overlay on tap
  - Autocomplete dropdown (optional — can be static for now)

### User Actions
  - **Unauthenticated**:
    - "Login" button with dropdown:
      - "New Customer? Sign Up" → `/register`
      - Menu items: My Profile, Flipkart Plus Zone, Orders, Wishlist, My Chats
  - **Authenticated**:
    - User avatar circle with initials + name dropdown:
      - My Profile → `/account/profile`
      - My Orders → `/account/orders`
      - My Wishlist → `/wishlist`
      - Manage Addresses → `/account/addresses`
      - Sign Out → calls `signOut()`
  - **Cart icon**:
    - White cart SVG icon
    - Count badge (red circle, from `<CartCountBadge />`)
    - "Cart" label
    - Links to `/cart`

- [x] **07-F-04** Create `apps/frontend/components/layout/search-bar.tsx` (extracted from header):
  - Controlled input with debounced value
  - Reads `?q=` from current URL to pre-populate on `/search` page
  - Keyboard: `Enter` → submit, `Escape` → blur

- [x] **07-F-05** Create `apps/frontend/components/layout/user-menu.tsx`:
  - Uses `useSession()` to determine auth state
  - Dropdown rendered with Radix UI or native `<details>` for accessibility
  - Sign Out calls NextAuth `signOut({ callbackUrl: "/" })`

## Category Navbar

> Design: Horizontal scrollable icon-row below the main header. Categories: For You, Fashion, Mobiles, Beauty, Electronics, Home, Appliances, Toys & Ba..., Food & H..., Auto Acc..., 2 Wheele..., Sports &..., Books &..., Furniture. Each has an icon above the label, underline on hover/active. Matches `design/home_page.png`.

- [x] **07-F-06** Create `apps/frontend/components/layout/category-nav.tsx`:
  - Fetches categories from `GET /api/categories` (or static list for top-level)
  - White background bar, `overflow-x: auto`, hide scrollbar
  - Each item: category icon (SVG or image) + label (truncated at ~8 chars with ellipsis)
  - Active category underlined in `--primary` blue
  - Clicking a category navigates to `/category/[slug]`

- [x] **07-F-07** Create category icons as SVG components in `apps/frontend/components/icons/`:
  - One SVG per category: electronics, fashion, mobiles, beauty, home, appliances, etc.
  - Can use inline SVG or an icon sprite sheet

## Footer

- [x] **07-F-08** Create `apps/frontend/components/layout/footer.tsx`:
  - Dark grey background (`#172337`)
  - Four-column grid:
    - **ABOUT**: Contact Us, About Us, Careers, Press
    - **HELP**: Payments, Shipping, Returns, FAQ
    - **CONSUMER POLICY**: Cancellation, Terms, Privacy Policy
    - **SOCIAL**: icons for Facebook, Twitter, YouTube
  - Bottom row: "© 2026 Flipkart Clone — SDE Assignment"
  - Responsive: single column on mobile

## Layout Variants

- [x] **07-F-09** Create `apps/frontend/app/(auth)/layout.tsx`:
  - No header/footer — clean centered layout for login, register, verify pages

- [x] **07-F-10** Ensure checkout pages `apps/frontend/app/checkout/layout.tsx`:
  - Simplified header (logo + step indicator only, no search/cart)
  - No footer — reduces distraction during checkout

## Responsive Design

- [x] **07-F-11** Header mobile behaviour:
  - Logo + search icon + cart icon in top bar
  - Search expands to full-width overlay on tap
  - Bottom tab bar: Home | Categories | Wishlist | Account

- [x] **07-F-12** Apply responsive utility classes throughout:
  - Product grid: `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`
  - Cart layout: stacked on mobile, two-column on desktop
  - Account layout: stacked on mobile, sidebar on ≥768px
  - Checkout steps: full-width on mobile

- [x] **07-F-13** Test and fix layout at breakpoints: 375px (iPhone SE), 768px (iPad), 1280px (desktop)

## Toast / Notification System

- [x] **07-F-14** Install and configure a toast library:
  ```bash
  pnpm add sonner
  ```
  Add `<Toaster />` in `app/layout.tsx`

- [x] **07-F-15** Use `toast.success()` / `toast.error()` for:
  - Add to cart success
  - Remove from cart
  - Wishlist toggle
  - Auth errors
  - Order placement success/failure

## Shared UI Components

- [x] **07-F-16** Create or verify these exist in `apps/frontend/components/ui/`:
  - `button.tsx` (already scaffolded) — variants: `primary` (blue), `secondary`, `outline`, `ghost`
  - `badge.tsx` — small label pill (used for discounts, order status, address type)
  - `skeleton.tsx` — animated shimmer placeholder for loading states
  - `dialog.tsx` — modal wrapper (used for delete confirmation, add-to-cart overlay)
  - `input.tsx` — styled input field with label + error message
  - `spinner.tsx` — loading indicator

## Performance

- [x] **07-F-17** Add `next/image` for all product images with proper `width`/`height` and `priority` on above-fold images
- [x] **07-F-18** Add `loading="lazy"` / `fetchpriority="high"` appropriately
- [x] **07-F-19** Ensure `next.config.ts` has image domains configured for product image CDN hosts

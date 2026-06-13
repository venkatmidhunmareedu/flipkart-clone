# Module 06 — Account & Order History

User profile editing, address management, and order history with the left sidebar layout.

> Design reference: `design/profile.png`, `design/addresses.png`, `design/wishlist.png` (sidebar layout shared across account pages)

---

## Backend — User Profile API

- [x] **06-B-01** Create `apps/backend/src/services/user.service.ts`:
  - `getUserProfile(userId)` — return safe user fields (exclude `passwordHash`)
  - `updateProfile(userId, { firstName, lastName, gender })` — partial update
  - `updateEmail(userId, newEmail)` — update email, set `emailVerified: false`, trigger new OTP
  - `changePassword(userId, { currentPassword, newPassword })` — verify current, hash + update new

- [x] **06-B-02** Create `apps/backend/src/routes/users.routes.ts` (replace/extend existing):
  - `GET   /api/users/me` — current user profile
  - `PATCH /api/users/me` — update profile fields
  - `PATCH /api/users/me/email` — change email (triggers re-verification OTP)
  - `PATCH /api/users/me/password` — change password
  - All routes protected by `authMiddleware`

## Backend — Order History API

Already covered in `04-checkout.md` (tasks `04-B-05`). Ensure these are in place:
- [x] **06-B-03** Verify `GET /api/orders` returns orders sorted by `createdAt DESC` with:
  - `id`, `status`, `paymentStatus`, `totalAmount`, `createdAt`
  - `items` array: product `title`, `images[0]`, `quantity`, `price`
  - `address` snapshot: city, state, pincode

- [x] **06-B-04** Verify `GET /api/orders/:id` returns full order detail with all `OrderItem` data

## Frontend — Account Layout

> Design: Two-column layout. Left: user avatar circle, "Hello, {Name}", sidebar nav with sections: MY ORDERS, ACCOUNT SETTINGS (Profile, Manage Addresses), PAYMENTS (Gift Cards, Saved UPI, Saved Cards), MY STUFF (Coupons, Reviews, etc.)

- [x] **06-F-01** Create `apps/frontend/components/account/account-sidebar.tsx`:
  - User avatar (initials-based colored circle if no photo)
  - "Hello, {firstName}" greeting
  - Navigation sections matching `design/profile.png`:
    - **MY ORDERS** → `/account/orders`
    - **ACCOUNT SETTINGS**:
      - Profile Information → `/account/profile`
      - Manage Addresses → `/account/addresses`
    - **MY STUFF**:
      - My Wishlist → `/wishlist`
  - Active link highlighted in blue

- [x] **06-F-02** Create `apps/frontend/app/account/layout.tsx`:
  - Two-column: `<AccountSidebar />` (left, fixed width 250px) + `{children}` (right, flex-grow)
  - Responsive: sidebar collapses to top nav on mobile

## Frontend — Profile Page (`/account/profile`)

> Design: "Personal Information" section with Edit button, name fields, gender radio, Email Address section, Mobile Number section. Matches `design/profile.png`.

- [x] **06-F-03** Create `apps/frontend/app/account/profile/page.tsx` (Client Component)

- [x] **06-F-04** Create `apps/frontend/components/account/profile-form.tsx`:
  - **Personal Information** card:
    - First Name + Last Name inputs (inline, disabled until "Edit" clicked)
    - Gender: Male / Female radio buttons
    - "Save" button appears in edit mode
  - **Email Address** card:
    - Displays current email
    - "Edit" button → shows new email input with "Save & Verify" (triggers re-verification OTP flow)
  - **Mobile Number** card (optional, display only)
  - All updates call `PATCH /api/users/me`

## Frontend — Manage Addresses (`/account/addresses`)

> Design: List of address cards with type badge (HOME/WORK), name, phone, full address, pincode highlighted in bold. "+ ADD A NEW ADDRESS" at top. Three-dot menu on each card (Edit, Delete, Set as Default). Matches `design/addresses.png`.

- [x] **06-F-05** Create `apps/frontend/app/account/addresses/page.tsx` (Client Component)

- [x] **06-F-06** Create `apps/frontend/components/account/address-list.tsx`:
  - "+ ADD A NEW ADDRESS" row at top (expands inline form on click)
  - Renders `<AddressCard />` for each address

- [x] **06-F-07** Create `apps/frontend/components/account/address-card.tsx`:
  - Type badge: `HOME` / `WORK` / `OTHER` (small label pill)
  - Name + phone on same line
  - Full address on next line (line1, line2, city, state)
  - Pincode bolded at end
  - Three-dot `⋮` menu:
    - Edit → opens inline `<AddressForm />` pre-filled
    - Delete → confirmation dialog then `DELETE /api/addresses/:id`
    - Set as Default → `PATCH /api/addresses/:id/default`
  - Default address has a subtle "Default" badge

- [x] **06-F-08** Reuse `apps/frontend/components/checkout/address-form.tsx` (from module 04) for add/edit inline form

## Frontend — Order History (`/account/orders`)

- [x] **06-F-09** Create `apps/frontend/app/account/orders/page.tsx` (Client Component)

- [x] **06-F-10** Create `apps/frontend/components/account/order-list.tsx`:
  - "MY ORDERS" heading
  - Each order rendered as `<OrderCard />`
  - Empty state: "No orders placed yet — Start shopping!"

- [x] **06-F-11** Create `apps/frontend/components/account/order-card.tsx`:
  - Product thumbnail(s) in a row
  - Product name(s) (first item + "and N more")
  - Order date formatted as "Ordered on Jun 10, 2026"
  - Status chip: color-coded
    - `PENDING` → grey
    - `CONFIRMED` → blue
    - `SHIPPED` → orange
    - `DELIVERED` → green
    - `CANCELLED` → red
  - Total amount
  - "View Details" link → `/account/orders/[id]`

- [x] **06-F-12** Create `apps/frontend/app/account/orders/[id]/page.tsx`:
  - Full order detail view
  - Delivery address card
  - All order items with price breakdown
  - Payment status + payment ID
  - Order timeline (status progression indicator)

## Frontend — Hooks

- [x] **06-F-13** Create `apps/frontend/hooks/use-user.ts`:
  - `useUser()` — `useQuery(["user"])` fetching `GET /api/users/me`
  - `useUpdateProfile()` — `useMutation` calling `PATCH /api/users/me`, invalidates `["user"]`

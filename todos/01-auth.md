# Module 01 — Authentication

NextAuth.js with credentials (email + password) and email OTP verification.
Matches the login page design: blue left panel with illustration, mobile-number/email field on right.

> Design reference: `design/login_page.png`, `design/profile.png`

---

## Backend — Auth Routes

- [x] **01-B-01** Install dependencies:
  ```bash
  cd apps/backend
  pnpm add bcryptjs nodemailer
  pnpm add -D @types/bcryptjs @types/nodemailer
  ```
- [x] **01-B-02** Create `apps/backend/src/services/auth.service.ts`:
  - `registerUser({ email, password, firstName, lastName })` — hash password with bcrypt (rounds: 12), create User with `emailVerified: false`
  - `loginUser({ email, password })` — lookup user, compare hash, return user object (no token, NextAuth handles sessions)
  - `sendEmailOTP(userId, email)` — generate 6-digit code, save `OTP` record (type: `EMAIL_VERIFY`, expires in 15 min), send via Nodemailer/Gmail SMTP
  - `verifyEmailOTP(userId, code)` — find unexpired unused OTP, mark `used: true`, set `User.emailVerified = true`
  - `sendPasswordResetOTP(email)` — same pattern with type `PASSWORD_RESET`, expires 10 min
  - `resetPassword(email, code, newPassword)` — verify OTP, hash new password, update user
- [x] **01-B-03** Create `apps/backend/src/controllers/auth.controller.ts` with handlers:
  - `POST /api/auth/register`
  - `POST /api/auth/verify-email`
  - `POST /api/auth/resend-otp`
  - `POST /api/auth/forgot-password`
  - `POST /api/auth/reset-password`
  - `POST /api/auth/login` (for NextAuth credentials)
- [x] **01-B-04** Create `apps/backend/src/routes/auth.routes.ts` and mount in `app.ts` at `/api/auth`
- [x] **01-B-05** Add input validation middleware (zod) on all auth routes:
  - `email` — valid email format
  - `password` — min 8 chars, at least one uppercase, one digit
  - `otp` — exactly 6 digits
- [x] **01-B-06** Create `apps/backend/src/lib/mailer.ts` — Nodemailer transporter using Gmail App Password:
  ```ts
  // Returns a configured transporter; throws if env vars missing
  ```

## Frontend — NextAuth Setup

- [x] **01-F-01** Install NextAuth in frontend:
  ```bash
  cd apps/frontend
  pnpm add next-auth
  ```
- [x] **01-F-02** Create `apps/frontend/app/api/auth/[...nextauth]/route.ts` with:
  - `CredentialsProvider` — calls `POST /api/auth/login` on backend (Express), returns user object
  - Session strategy: `jwt`
  - `callbacks.jwt` — embed `id`, `email`, `emailVerified` into token
  - `callbacks.session` — expose token fields on `session.user`
- [x] **01-F-03** Create `apps/frontend/lib/auth.ts` — re-export `authOptions` for use in server components
- [x] **01-F-04** Wrap root layout in `SessionProvider` (client component wrapper in `components/session-provider.tsx`)

## Frontend — Login Page

> Design: Two-panel card. Left panel: blue background (`#2874f0`), "Looks like you're new here!" text + illustration. Right panel: email/password inputs.

- [x] **01-F-05** Create `apps/frontend/app/(auth)/login/page.tsx`:
  - Two-column layout matching `design/login_page.png`
  - Left: blue panel with heading + subtext + SVG illustration
  - Right: `<LoginForm />` component
  - Redirect to `/` if already authenticated
- [x] **01-F-06** Create `apps/frontend/components/auth/login-form.tsx`:
  - Email input + Password input
  - Submit calls `signIn("credentials", { email, password })`
  - Shows error toast on invalid credentials
  - "New User? Create account" link → `/register`

## Frontend — Register Page

- [x] **01-F-07** Create `apps/frontend/app/(auth)/register/page.tsx` (same two-panel shell as login)
- [x] **01-F-08** Create `apps/frontend/components/auth/register-form.tsx`:
  - Fields: First Name, Last Name, Email, Password, Confirm Password
  - On success → redirect to `/verify-email?email=...`

## Frontend — Email OTP Verification Page

- [x] **01-F-09** Create `apps/frontend/app/(auth)/verify-email/page.tsx`:
  - Shows "Enter the 6-digit OTP sent to {email}"
  - 6 individual digit input boxes (auto-advance on input)
  - Resend OTP button (disabled for 60s countdown)
  - On success → redirect to `/login`

## Frontend — Forgot / Reset Password

- [x] **01-F-10** Create `apps/frontend/app/(auth)/forgot-password/page.tsx` — email entry form
- [x] **01-F-11** Create `apps/frontend/app/(auth)/reset-password/page.tsx` — OTP + new password form

## Frontend — Auth Guards

- [x] **01-F-12** Create `apps/frontend/middleware.ts`:
  - Protect routes: `/account/*`, `/cart`, `/checkout/*`, `/orders/*`, `/wishlist`
  - Redirect unauthenticated users to `/login?callbackUrl=...`
- [x] **01-F-13** In protected pages, use `getServerSession(authOptions)` to access user data server-side

## Email Template

- [x] **01-B-07** Create `apps/backend/src/lib/email-templates.ts`:
  - `otpEmailHtml(code, type)` — HTML template matching Flipkart style (blue header, 6-digit code in bold box, 15-min expiry note)

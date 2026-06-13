import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/account/:path*",
    "/cart",
    "/checkout",
    "/checkout/:path*",
    "/order-confirmation/:path*",
    "/orders/:path*",
    "/wishlist",
  ],
};

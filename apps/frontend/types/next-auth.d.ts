import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    emailVerified?: boolean;
    accessToken?: string;
  }

  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      emailVerified?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    emailVerified?: boolean;
    accessToken?: string;
  }
}

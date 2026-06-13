import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const loginUrl = `${API_URL}/api/auth/login`;
        const response = await fetch(loginUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        const contentType = response.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) {
          console.error(
            `[auth] Expected JSON from ${loginUrl}, got ${response.status} (${contentType || "no content-type"})`,
          );
          return null;
        }

        let json: {
          data?: {
            user: {
              id: string;
              email: string;
              firstName: string;
              lastName?: string | null;
              emailVerified: boolean;
            };
            token: string;
          };
        };

        try {
          json = (await response.json()) as typeof json;
        } catch (error) {
          console.error(`[auth] Failed to parse login response from ${loginUrl}`, error);
          return null;
        }

        if (!response.ok || !json.data?.user || !json.data.token) {
          return null;
        }

        const user = json.data.user;
        return {
          id: user.id,
          email: user.email,
          name: [user.firstName, user.lastName].filter(Boolean).join(" "),
          emailVerified: user.emailVerified,
          accessToken: json.data.token,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.emailVerified = Boolean(user.emailVerified);
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.emailVerified = Boolean(token.emailVerified);
      }
      session.accessToken = token.accessToken as string | undefined;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

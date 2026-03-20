import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { db } from "~/server/db";

type SessionUserRole = "USER" | "MODERATOR" | "ORGANIZER" | "ADMIN";

type TokenWithRole = {
  role?: SessionUserRole;
};

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: SessionUserRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: SessionUserRole;
  }
}

export const authConfig = {
  adapter: PrismaAdapter(db),

  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      const nextToken = token as typeof token & TokenWithRole;

      // 🔥 Au login → injecte le rôle
      if (user) {
        nextToken.role = user.role ?? "USER";
      }

      return nextToken;
    },

    async session({ session, token }) {
      const tokenWithRole = token as typeof token & TokenWithRole;

      if (!session.user) {
        throw new Error("Session user missing");
      }

      if (!token.sub) {
        throw new Error("Token sub missing");
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub, // ✅ toujours string
          role: tokenWithRole.role ?? "USER", // ✅ jamais null
        },
      };
    },
  },
} satisfies NextAuthConfig;

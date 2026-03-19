import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { db } from "~/server/db";

type SessionUserRole = "USER" | "ORGANIZER" | "ADMIN" | null;

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
    role?: SessionUserRole;
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
    jwt: ({ token, user }) => {
      const nextToken = token as typeof token & TokenWithRole;

      if (user) {
        nextToken.role = user.role ?? null;
      }

      console.log("[auth][jwt] token:", nextToken);
      return nextToken;
    },
    session: ({ session, token }) => {
      const tokenWithRole = token as typeof token & TokenWithRole;

      const nextSession = {
        ...session,
        user: {
          ...session.user,
          id: token.sub ?? "",
          role: tokenWithRole.role ?? null,
        },
      };

      console.log("[auth][session] session:", nextSession);
      return nextSession;
    },
  },
} satisfies NextAuthConfig;

import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: string | null;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  adapter: PrismaAdapter(db),

  session: {
    strategy: "jwt", // 🔥 IMPORTANT
  },

  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.role = (user as { role?: string | null }).role ?? null;
      }
      return token;
    },

    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub!,
        role: (token as { role?: string | null }).role ?? null,
      },
    }),
  },
} satisfies NextAuthConfig;

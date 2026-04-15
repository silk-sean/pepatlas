import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = String(credentials?.email || "").toLowerCase().trim();
      const password = String(credentials?.password || "");
      if (!email || !password) return null;

      const user = await db.user.findUnique({ where: { email } });
      if (!user || !user.passwordHash) return null;

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name ?? user.username ?? null,
        image: user.image ?? null,
      };
    },
  }),
];

// Add Google only if both env vars set — prevents crash on local dev without OAuth creds
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(Google);
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" }, // jwt required for credentials provider
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

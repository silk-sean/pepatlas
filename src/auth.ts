import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const providers: NextAuthConfig["providers"] = [
  Credentials({
    name: "Credentials",
    credentials: {
      identifier: { label: "Email or Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const identifier = String(credentials?.identifier || "").trim();
      const password = String(credentials?.password || "");
      if (!identifier || !password) return null;

      const isEmail = identifier.includes("@");
      const user = isEmail
        ? await db.user.findUnique({ where: { email: identifier.toLowerCase() } })
        : await db.user.findUnique({ where: { username: identifier } });
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
    async signIn({ user, account }) {
      // On Google sign-in, ensure the user has a username (required by forum
      // for /profile/[username] links). We derive one from email if missing.
      if (account?.provider === "google" && user.email && user.id) {
        const existing = await db.user.findUnique({
          where: { id: user.id },
          select: { username: true },
        });
        if (existing && !existing.username) {
          const base = user.email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24) || "user";
          let candidate = base;
          let n = 0;
          // Find an available username
          while (await db.user.findUnique({ where: { username: candidate } })) {
            n += 1;
            candidate = `${base}${n}`;
            if (n > 50) { candidate = `${base}${user.id.slice(0, 6)}`; break; }
          }
          await db.user.update({ where: { id: user.id }, data: { username: candidate } });
        }
      }
      return true;
    },
  },
});

import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/email";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

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

// Magic link sign-in via Resend (uses our existing sendMail helper, not SMTP)
if (process.env.RESEND_API_KEY) {
  providers.push(
    Nodemailer({
      // Resend is HTTP-based — we override sendVerificationRequest instead of using SMTP
      server: { host: "unused", port: 25, auth: { user: "n/a", pass: "n/a" } },
      from: process.env.EMAIL_FROM || `${SITE_NAME} <noreply@pepatlas.com>`,
      async sendVerificationRequest({ identifier, url, provider }) {
        const brandName = SITE_NAME;
        const subject = `Sign in to ${brandName}`;
        const text = `Sign in to ${brandName}\n\n${url}\n\nIf you did not request this, you can ignore this email.`;
        const html = `<!doctype html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#C5C5D4;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="margin-bottom:32px;">
      <a href="${SITE_URL}" style="color:#FF2D78;font-size:32px;font-weight:800;text-decoration:none;letter-spacing:-0.02em;">${brandName}</a>
    </div>
    <h1 style="color:#fff;font-size:22px;margin:0 0 16px;">Your sign-in link</h1>
    <p style="color:#C5C5D4;font-size:15px;line-height:1.6;margin:0 0 28px;">
      Click the button below to sign in to <strong style="color:#fff;">${brandName}</strong>. This link expires in 24 hours.
    </p>
    <a href="${url}" style="display:inline-block;background:#FF2D78;color:#fff;text-decoration:none;padding:14px 24px;border-radius:10px;font-weight:700;font-size:15px;">Sign in to ${brandName}</a>
    <p style="color:#666;font-size:12px;margin-top:40px;line-height:1.6;">
      If the button doesn't work, paste this URL in your browser:<br>
      <span style="color:#9E9EAF;word-break:break-all;">${url}</span>
    </p>
    <p style="color:#666;font-size:11px;margin-top:32px;border-top:1px solid #1a1a1a;padding-top:20px;">
      If you did not request this sign-in link, you can safely ignore this email.
    </p>
  </div>
</body></html>`;
        const ok = await sendMail({ to: identifier, subject, html, text });
        if (!ok) throw new Error(`Failed to send sign-in email to ${identifier}`);
      },
    })
  );
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
      // For Google + magic-link (nodemailer) sign-ins, ensure the user has a
      // username. The Credentials provider already requires one at registration.
      const isPasswordlessProvider =
        account?.provider === "google" || account?.provider === "nodemailer";
      if (isPasswordlessProvider && user.email && user.id) {
        const email = user.email;
        const userId = user.id;
        const existing = await db.user.findUnique({
          where: { id: userId },
          select: { username: true },
        });
        if (existing && !existing.username) {
          const base = email.split("@")[0].replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 24) || "user";
          let candidate = base;
          let n = 0;
          // Find an available username
          while (await db.user.findUnique({ where: { username: candidate } })) {
            n += 1;
            candidate = `${base}${n}`;
            if (n > 50) { candidate = `${base}${userId.slice(0, 6)}`; break; }
          }
          await db.user.update({ where: { id: userId }, data: { username: candidate } });
        }
      }
      return true;
    },
  },
});

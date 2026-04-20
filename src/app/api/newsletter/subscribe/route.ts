import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { sendMail } from "@/lib/email";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    email?: string;
    source?: string;
  } | null;

  const email = (body?.email ?? "").trim().toLowerCase();
  const source = (body?.source ?? "").trim().slice(0, 50) || null;

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Rate-limit the same email to once per minute to prevent abuse
  const existing = await db.newsletterSubscriber.findUnique({
    where: { email },
  });

  // If they're already verified + still subscribed, tell them
  if (existing?.verifiedAt && !existing.unsubscribedAt) {
    return NextResponse.json({
      ok: true,
      alreadySubscribed: true,
    });
  }

  // Generate a fresh verify token (always rotate on re-signup attempts)
  const verifyToken = crypto.randomBytes(32).toString("hex");

  if (existing) {
    await db.newsletterSubscriber.update({
      where: { email },
      data: {
        verifyToken,
        unsubscribedAt: null, // resurrect unsubscribed
        source: existing.source ?? source,
      },
    });
  } else {
    await db.newsletterSubscriber.create({
      data: { email, verifyToken, source },
    });
  }

  const confirmUrl = `${SITE_URL}/api/newsletter/confirm?t=${verifyToken}`;
  const subject = `Confirm your ${SITE_NAME} subscription`;
  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#0A0A0A;font-family:-apple-system,sans-serif;color:#C5C5D4;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <a href="${SITE_URL}" style="color:#FF2D78;font-size:32px;font-weight:800;text-decoration:none;letter-spacing:-0.02em;">${SITE_NAME}</a>
    <h1 style="color:#fff;font-size:22px;margin:24px 0 16px;">One click to confirm</h1>
    <p style="color:#C5C5D4;font-size:15px;line-height:1.6;margin:0 0 24px;">
      Thanks for signing up for the ${SITE_NAME} weekly digest. Click below to confirm your email.
    </p>
    <a href="${confirmUrl}" style="display:inline-block;background:#FF2D78;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:700;font-size:14px;">Confirm my email</a>
    <p style="color:#666;font-size:12px;margin-top:40px;">
      If that button doesn't work, paste this URL in your browser:<br>
      <span style="word-break:break-all;">${confirmUrl}</span>
    </p>
    <p style="color:#666;font-size:11px;margin-top:30px;border-top:1px solid #1a1a1a;padding-top:20px;">
      Didn't sign up? Ignore this email — you won't hear from us again.
    </p>
  </div>
</body></html>`;
  const text = `Confirm your ${SITE_NAME} subscription: ${confirmUrl}`;

  // Fire-and-forget — don't block success if email send fails
  sendMail({ to: email, subject, html, text }).catch((e) =>
    console.error("[newsletter] send failed:", e)
  );

  return NextResponse.json({ ok: true });
}

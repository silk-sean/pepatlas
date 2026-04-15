import { Resend } from "resend";
import { SITE_URL, SITE_NAME } from "@/lib/constants";

const FROM = process.env.EMAIL_FROM || "PepAtlas <noreply@pepatlas.com>";
const REPLY_TO = process.env.EMAIL_REPLY_TO;

/** Lazy client so missing API key doesn't crash at import time. */
function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

interface SendParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendMail(params: SendParams): Promise<boolean> {
  const c = client();
  if (!c) {
    // No RESEND_API_KEY in env — log and skip silently so local dev doesn't blow up.
    console.warn("[email] RESEND_API_KEY not set — skipping:", params.subject);
    return false;
  }
  try {
    const { error } = await c.emails.send({
      from: FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      ...(REPLY_TO ? { replyTo: REPLY_TO } : {}),
    });
    if (error) {
      console.error("[email] send error:", error);
      return false;
    }
    return true;
  } catch (e) {
    console.error("[email] exception:", e);
    return false;
  }
}

/** Email template: new reply on a thread the user is subscribed to. */
export function replyNotificationEmail(opts: {
  recipientName: string;
  threadTitle: string;
  threadUrl: string;
  replyBody: string;
  replierName: string;
  unsubscribeUrl: string;
}): { subject: string; html: string; text: string } {
  const snippet = opts.replyBody.length > 400
    ? opts.replyBody.slice(0, 400).trim() + "…"
    : opts.replyBody;
  const subject = `Re: ${opts.threadTitle}`;
  const text = `Hi ${opts.recipientName},

${opts.replierName} replied to a thread you're following on ${SITE_NAME}.

"${snippet}"

View and reply: ${opts.threadUrl}

Unsubscribe from this thread: ${opts.unsubscribeUrl}
`;

  const html = `<!doctype html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#C5C5D4;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="margin-bottom:24px;">
      <a href="${SITE_URL}" style="color:#FF2D78;font-size:28px;font-weight:800;text-decoration:none;letter-spacing:-0.02em;">${SITE_NAME}</a>
    </div>
    <p style="color:#9E9EAF;font-size:14px;margin:0 0 16px;">Hi ${opts.recipientName},</p>
    <p style="color:#C5C5D4;font-size:15px;line-height:1.5;margin:0 0 20px;">
      <strong style="color:#fff;">${opts.replierName}</strong> replied to a thread you're following.
    </p>
    <div style="background:#111;border:1px solid #333;border-radius:12px;padding:16px 18px;margin:0 0 20px;">
      <div style="color:#9E9EAF;font-size:12px;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Thread</div>
      <div style="color:#fff;font-size:16px;font-weight:600;margin-bottom:12px;">${escapeHtml(opts.threadTitle)}</div>
      <div style="color:#C5C5D4;font-size:14px;line-height:1.5;white-space:pre-wrap;">${escapeHtml(snippet)}</div>
    </div>
    <a href="${opts.threadUrl}" style="display:inline-block;background:#FF2D78;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;font-size:14px;">View &amp; reply</a>
    <p style="color:#666;font-size:12px;margin-top:40px;border-top:1px solid #1a1a1a;padding-top:20px;">
      <a href="${opts.unsubscribeUrl}" style="color:#666;">Unsubscribe from this thread</a>
    </p>
  </div>
</body></html>`;

  return { subject, html, text };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

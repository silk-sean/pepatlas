import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

const MIN_PASSWORD_LENGTH = 8;
const USERNAME_RE = /^[a-zA-Z0-9_-]{3,30}$/;

export async function POST(req: Request) {
  let body: { email?: string; username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email || "").toLowerCase().trim();
  const username = String(body.username || "").trim();
  const password = String(body.password || "");

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (!USERNAME_RE.test(username)) {
    return NextResponse.json(
      { error: "Username must be 3-30 chars (letters, numbers, _ or -)" },
      { status: 400 },
    );
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
      { status: 400 },
    );
  }

  // Check uniqueness
  const existingEmail = await db.user.findUnique({ where: { email } });
  if (existingEmail) {
    return NextResponse.json(
      { error: "An account with this email already exists" },
      { status: 409 },
    );
  }
  const existingUsername = await db.user.findUnique({ where: { username } });
  if (existingUsername) {
    return NextResponse.json(
      { error: "Username already taken" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await db.user.create({
    data: {
      email,
      username,
      passwordHash,
      name: username,
    },
    select: { id: true, email: true, username: true },
  });

  return NextResponse.json({ ok: true, user });
}

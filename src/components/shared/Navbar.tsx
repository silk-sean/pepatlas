import Link from "next/link";
import { SITE_NAME, SUPPLIER_URL } from "@/lib/constants";
import { GlobeIcon } from "./GlobeIcon";
import { auth, signOut } from "@/auth";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;
  const username = user?.name || user?.email?.split("@")[0];

  return (
    <header
      className="sticky top-0 z-50 border-b-2 border-[#FF2D78]"
      style={{
        backgroundColor: "#0A0A0A",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 h-20 flex items-center justify-between relative z-[1] gap-4">
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <Link
            href="/"
            className="inline-flex items-center gap-3 shrink-0"
          >
            <GlobeIcon className="w-[44px] h-[44px] block flex-shrink-0 drop-shadow-[0_0_10px_rgba(255,45,120,0.18)]" />
            <span
              className="text-3xl sm:text-4xl inline-block"
              style={{
                fontFamily: "var(--font-brand)",
                color: "#FF2D78",
                textShadow: "0px 0px 10px rgba(255, 45, 120, 0.5)",
                transform: "rotate(-2deg)",
              }}
            >
              {SITE_NAME}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {[
              { href: "/forum", label: "Forum" },
              { href: "/articles", label: "Articles" },
              { href: "/tools", label: "Tools" },
              { href: SUPPLIER_URL, label: "Sources", external: true },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="px-3 lg:px-4 py-2 rounded-full text-[#9E9EAF] hover:bg-[rgba(255,45,120,0.1)] hover:text-[#FF2D78] transition-all text-sm lg:text-base"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-[#9E9EAF] hover:text-[#FF2D78]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                {username}
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="text-xs text-[#6E6E7F] hover:text-[#FF2D78] transition-colors"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-[#9E9EAF] hover:text-[#FF2D78]"
                style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full px-5 py-2 text-white text-sm"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  backgroundColor: "#FF2D78",
                  boxShadow: "0px 0px 15px rgba(255, 45, 120, 0.4)",
                }}
              >
                Join
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

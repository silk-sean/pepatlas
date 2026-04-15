import Link from "next/link";
import { SITE_NAME, SUPPLIER_URL } from "@/lib/constants";
import { GlobeIcon } from "./GlobeIcon";

export function Navbar() {
  return (
    <header
      className="sticky top-0 z-50 border-b-2 border-[#FF2D78]"
      style={{
        backgroundColor: "#0A0A0A",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
      }}
    >
      <div className="mx-auto max-w-[1400px] px-8 h-20 flex items-center justify-between relative z-[1]">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="inline-flex items-center gap-3"
            style={{ flexShrink: 0 }}
          >
            <GlobeIcon className="w-[44px] h-[44px] block flex-shrink-0 drop-shadow-[0_0_10px_rgba(255,45,120,0.18)]" />
            <span
              className="text-4xl inline-block"
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

          <nav className="hidden md:flex items-center gap-2">
            {[
              { href: "/articles", label: "Articles" },
              { href: "/forum", label: "Community Forum" },
              { href: "/tools", label: "Tools" },
              { href: SUPPLIER_URL, label: "Sources", external: true },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                {...(link.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="px-4 py-2 rounded-full text-[#9E9EAF] hover:bg-[rgba(255,45,120,0.1)] hover:text-[#FF2D78] transition-all"
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search compounds..."
            className="w-[250px] rounded-full border border-[rgba(255,45,120,0.3)] bg-[#111118] px-6 py-2 text-white placeholder-white/40 focus:border-[#FF2D78] focus:outline-none focus:shadow-[0_0_10px_rgba(255,45,120,0.2)] transition-all"
          />
          <Link
            href="/register"
            className="rounded-full px-6 py-2.5 text-white"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              backgroundColor: "#FF2D78",
              boxShadow: "0px 0px 15px rgba(255, 45, 120, 0.4)",
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}

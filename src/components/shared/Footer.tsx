import Link from "next/link";
import {
  SITE_NAME,
  PEPPERPEDIA_NAME,
  PEPCALC_NAME,
  SUPPLIER_NAME,
  DISCLAIMER_TEXT,
  pepperpediaUrl,
  pepcalcUrl,
  supplierUrl,
} from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,45,120,0.15)] relative z-[1]" style={{ backgroundColor: "#0A0A0A" }}>
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#FF2D78] mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link href="/forum" className="text-sm text-[#9E9EAF] hover:text-white transition-colors">Forums</Link></li>
              <li><Link href="/articles" className="text-sm text-[#9E9EAF] hover:text-white transition-colors">Articles</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#FF2D78] mb-4">Tools</h3>
            <ul className="space-y-2">
              <li>
                <a href={pepcalcUrl("", "footer")} target="_blank" rel="noopener noreferrer" className="text-sm text-[#9E9EAF] hover:text-white transition-colors">
                  {PEPCALC_NAME} Dose Calculator
                </a>
              </li>
              <li><Link href="/tools/protocol-builder" className="text-sm text-[#9E9EAF] hover:text-white transition-colors">Protocol Builder</Link></li>
              <li><Link href="/tools/cost-calculator" className="text-sm text-[#9E9EAF] hover:text-white transition-colors">Cost Calculator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#7B2FFF] mb-4">Knowledge</h3>
            <ul className="space-y-2">
              <li><a href={pepperpediaUrl("", "footer")} target="_blank" rel="noopener noreferrer" className="text-sm text-[#9E9EAF] hover:text-white transition-colors">{PEPPERPEDIA_NAME}</a></li>
              <li><a href={pepperpediaUrl("/glossary", "footer")} target="_blank" rel="noopener noreferrer" className="text-sm text-[#9E9EAF] hover:text-white transition-colors">Glossary</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#FF2D78] mb-4">Trusted Partners</h3>
            <ul className="space-y-2">
              <li>
                <a href={supplierUrl("footer")} target="_blank" rel="noopener noreferrer" className="text-sm text-[#9E9EAF] hover:text-[#FF2D78] transition-colors">
                  {SUPPLIER_NAME}
                </a>
              </li>
              <li>
                <a href={pepperpediaUrl("", "footer-partner")} target="_blank" rel="noopener noreferrer" className="text-sm text-[#9E9EAF] hover:text-[#FF2D78] transition-colors">
                  {PEPPERPEDIA_NAME}
                </a>
              </li>
              <li>
                <a href={pepcalcUrl("", "footer-partner")} target="_blank" rel="noopener noreferrer" className="text-sm text-[#9E9EAF] hover:text-[#FF2D78] transition-colors">
                  {PEPCALC_NAME}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-[rgba(255,255,255,0.05)] pt-6">
          <p className="text-xs text-[#9E9EAF]/60">{DISCLAIMER_TEXT}</p>
          <p className="mt-3 text-xs text-[#9E9EAF]/40">&copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

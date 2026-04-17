import Link from "next/link";
import {
  FORUM_CATEGORIES,
  PEPPERPEDIA_URL,
  SUPPLIER_URL,
  SUPPLIER_NAME,
} from "@/lib/constants";
import { HotTopicsBox } from "@/components/forum/HotTopicsBox";

// Homepage renders dynamically so Hot Topics / Newest are fresh on each visit
export const dynamic = "force-dynamic";

const TOOLS = [
  { name: "Dose Calculator", description: "Calculate exact injection volumes.", href: "/tools/dose-calculator" },
  { name: "Protocol Builder", description: "Get personalized protocol suggestions.", href: "/tools/protocol-builder" },
  { name: "Cost Calculator", description: "Estimate your protocol cost.", href: "/tools/cost-calculator" },
];

const FEATURED_ARTICLES = [
  { title: "Healing Protocols: New Data on Tendon Repair", tags: ["Research", "BPC-157"], excerpt: "A comprehensive review of the latest studies regarding BPC-157's mechanism of action in tissue repair.", author: "Editorial", date: "2 days ago" },
  { title: "Synergistic Effects: Combining GHK-Cu and Tirzepatide", tags: ["Guide", "Stacking"], excerpt: "Exploring the theoretical and practical applications of combining copper peptides with GLP-1 agonists.", author: "Community", date: "4 days ago" },
  { title: "Understanding Peptide Reconstitution", tags: ["Beginner", "Methods"], excerpt: "Everything you need to know about properly reconstituting lyophilized peptides for research use.", author: "Editorial", date: "1 week ago" },
];

export default async function HomePage() {
  return (
    <div className="mx-auto max-w-[1400px] px-8">
      {/* Hero squiggle */}
      <svg className="absolute top-24 left-0 w-[300px] opacity-30 pointer-events-none z-0" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,50 C40,10 60,90 90,50 C120,10 140,90 190,50" fill="none" stroke="rgba(255, 45, 120, 0.2)" strokeWidth="12" strokeLinecap="round" />
        <path d="M10,50 C40,10 60,90 90,50 C120,10 140,90 190,50" fill="none" stroke="#7B2FFF" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Latest Insights */}
      <section>
        <div className="flex items-end justify-between mt-12 mb-6">
          <h2 className="section-title">
            Latest<br />Insights
          </h2>
          <Link href="/articles" className="pa-tag pa-tag-solid">
            View All Articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {FEATURED_ARTICLES.map((article, i) => (
            <article key={i} className="pa-card cursor-pointer">
              <div className="pa-card-image" />
              <div className="p-6">
                <div className="flex gap-2 mb-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`pa-tag ${tag === "Research" || tag === "Beginner" ? "pa-tag-pink" : "pa-tag-purple"}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3
                  className="text-2xl font-extrabold mb-3 leading-tight text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {article.title}
                </h3>
                <p className="text-[#9E9EAF] text-sm mb-3">{article.excerpt}</p>
                <div className="text-xs text-[#9E9EAF]">
                  By {article.author} · {article.date}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* What's Happening — Hot Topics + Newest Threads */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <h2 className="section-title" style={{ color: "#FF2D78" }}>
            What&apos;s<br />Happening
          </h2>
          <Link href="/forum" className="pa-tag pa-tag-solid">
            All Discussions →
          </Link>
        </div>
        <HotTopicsBox />
      </section>

      {/* Community Hub */}
      <div className="flex items-end justify-between mb-6">
        <h2 className="section-title" style={{ color: "#FF2D78" }}>
          Community<br />Hub
        </h2>
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-8 mb-16">
        {/* Forum threads */}
        <div className="pa-card overflow-hidden">
          <div className="pa-forum-header flex justify-between items-center">
            <span>Active Discussions</span>
            <span className="text-xs opacity-60 font-medium">Updated Just Now</span>
          </div>

          {FORUM_CATEGORIES.slice(0, 4).map((cat, i) => (
            <Link key={cat.slug} href={`/forum/${cat.slug}`}>
              <div className="pa-thread flex items-center gap-4">
                <div className={`pa-avatar ${i % 2 === 1 ? "pink" : ""}`}>
                  {cat.name[0]}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white">{cat.name}</div>
                  <div className="text-sm text-[#9E9EAF]">{cat.description}</div>
                </div>
                <div className="pa-stats">→</div>
              </div>
            </Link>
          ))}

          <div className="p-4 text-center" style={{ background: "#0A0A0F" }}>
            <Link href="/forum" className="text-[#FF2D78] font-semibold text-sm">
              View Full Directory
            </Link>
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-6">
          {/* Tools widget */}
          <div className="pa-widget">
            <h3
              className="text-white font-extrabold mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Free Tools
            </h3>
            <div className="space-y-3">
              {TOOLS.map((tool) => (
                <Link key={tool.href} href={tool.href}>
                  <div className="flex items-center justify-between py-2 hover:text-[#FF2D78] transition-colors">
                    <span className="text-sm font-semibold">{tool.name}</span>
                    <span className="text-[#9E9EAF] text-xs">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Knowledge widget */}
          <div className="pa-widget alt">
            <h3
              className="text-white font-extrabold mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Peptide Encyclopedia
            </h3>
            <p className="text-sm text-[#9E9EAF] mb-3">
              Deep-dive into compounds, mechanisms, and research on Pepperpedia.
            </p>
            <a
              href={PEPPERPEDIA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-[#7B2FFF] hover:text-[#FF2D78] transition-colors"
            >
              Browse Pepperpedia →
            </a>
          </div>

          {/* Supplier widget */}
          <div className="pa-widget">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FF2D78] shadow-[0_0_8px_#FF2D78]" />
              <span className="text-xs font-semibold text-[#FF2D78] uppercase">
                Verified Supplier
              </span>
            </div>
            <h4 className="text-white font-semibold">{SUPPLIER_NAME}</h4>
            <p className="text-xs text-[#9E9EAF] mt-1 mb-3">
              Research-grade peptides with third-party COA testing.
            </p>
            <a
              href={SUPPLIER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-[#FF2D78] hover:underline"
            >
              Visit Store →
            </a>
          </div>
        </div>
      </div>

      {/* Cross-site banner — Visit Pepperpedia */}
      <div className="mb-16 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #7B2FFF, #FF2D78)", boxShadow: "0 12px 40px rgba(123, 47, 255, 0.3)" }}>
        <div className="px-10 py-10 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-2">Powered by Research</p>
            <h3 className="text-3xl font-extrabold text-white" style={{ fontFamily: "var(--font-display)" }}>
              Visit Our Wiki — Pepperpedia
            </h3>
            <p className="text-white/80 mt-2 max-w-lg">
              283+ in-depth articles on peptide compounds, mechanisms, protocols, and research. The most comprehensive peptide encyclopedia online.
            </p>
          </div>
          <a
            href={PEPPERPEDIA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-white px-8 py-3 font-extrabold text-[#7B2FFF] hover:bg-white/90 transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Browse Pepperpedia →
          </a>
        </div>
      </div>
    </div>
  );
}

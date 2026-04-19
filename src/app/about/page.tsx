import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  SITE_NAME,
  SITE_URL,
  PEPPERPEDIA_URL,
  PEPCALC_URL,
} from "@/lib/constants";

export const metadata: Metadata = {
  title: "About PepAtlas",
  description:
    "PepAtlas is an online community and reference platform for peptide research discussion. Editorial articles, forum threads, and free reference tools — no products sold.",
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <div className="text-xs font-semibold uppercase tracking-wider text-[#FF2D78] mb-2">
          About
        </div>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          What {SITE_NAME} is
        </h1>
        <p className="mt-4 text-lg text-[#C5C5D4] leading-relaxed">
          {SITE_NAME} is an online community and reference platform where
          researchers and wellness enthusiasts share notes, protocols, and
          educational material on peptide research. We publish editorial
          articles, host moderated forum discussions, and provide free
          reference tools.
        </p>
      </header>

      <Card className="mb-6">
        <CardContent className="py-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#FF2D78] mb-3">
            What we do
          </h2>
          <ul className="space-y-3 text-[#C5C5D4]">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF2D78]" />
              <span>
                <strong className="text-white">Forum discussions</strong> —
                categorized sub-forums covering peptide protocols, personal
                logs, bloodwork and metrics, beginner questions, optimization
                strategies, and compound-specific threads.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7B2FFF]" />
              <span>
                <strong className="text-white">Editorial articles</strong> —
                deep-dives on compounds, methods, and the science behind
                peptide mechanisms. Written for community readers, not
                marketing copy.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d6ff00]" />
              <span>
                <strong className="text-white">Free reference tools</strong> —
                a dose calculator, cost estimator, protocol builder, and other
                utilities for research planning. No account required to use
                them.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="py-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#7B2FFF] mb-3">
            What we don&apos;t do
          </h2>
          <ul className="space-y-3 text-[#C5C5D4]">
            <li className="flex items-start gap-3">
              <span className="mt-1.5 text-[#7B2FFF]">×</span>
              <span>
                We <strong>don&apos;t sell peptides or any products</strong> on
                this site. There is no cart, no checkout, no inventory.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 text-[#7B2FFF]">×</span>
              <span>
                We <strong>don&apos;t provide medical advice</strong>. All
                content is educational. Any health decisions should involve a
                qualified healthcare provider.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1.5 text-[#7B2FFF]">×</span>
              <span>
                We <strong>don&apos;t recommend specific vendors in forum
                posts</strong>. Community guidelines prohibit vendor shilling,
                price comparisons, and sourcing solicitations in threads.
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="py-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#d6ff00] mb-3">
            Editorial standards
          </h2>
          <p className="text-[#C5C5D4] leading-relaxed">
            Our editorial articles are written in a neutral, community-informed
            voice. We focus on mechanisms, published research, and real user
            experience from the community — not hype, not affiliate pitches,
            not clickbait framing. When research is limited or conflicting, we
            say so. When claims outrun evidence, we flag them. Contributors
            are credited by byline.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="py-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#FF2D78] mb-3">
            Our community
          </h2>
          <p className="text-[#C5C5D4] leading-relaxed mb-4">
            {SITE_NAME} is home to researchers, biohackers, patients on
            physician-supervised protocols, fitness enthusiasts, and students.
            The forum is moderated. Threads that provide personal medical
            advice, promote unverified vendors, or violate community
            guidelines are removed. See our{" "}
            <Link
              href="/community-guidelines"
              className="text-[#FF2D78] hover:underline"
            >
              community guidelines
            </Link>{" "}
            for details.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-10">
        <CardContent className="py-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#7B2FFF] mb-3">
            Related projects
          </h2>
          <p className="text-[#C5C5D4] leading-relaxed mb-4">
            {SITE_NAME} is part of a small network of peptide-related
            reference resources:
          </p>
          <ul className="space-y-2 text-[#C5C5D4]">
            <li>
              <a
                href={PEPPERPEDIA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF2D78] hover:underline font-medium"
              >
                Pepperpedia
              </a>{" "}
              — the encyclopedia: compound profiles, mechanisms, research
              summaries.
            </li>
            <li>
              <a
                href={PEPCALC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF2D78] hover:underline font-medium"
              >
                Peppercalc
              </a>{" "}
              — the dose math tool: reconstitution, concentration, syringe
              volume calculation.
            </li>
          </ul>
        </CardContent>
      </Card>

      <div className="rounded-xl border border-[#333] bg-[#0f0f0f] p-5 text-xs text-[#9E9EAF] leading-relaxed">
        <strong className="text-white">Disclaimer:</strong> Content on{" "}
        {SITE_NAME} is provided for educational and research purposes only. It
        does not constitute medical advice, diagnosis, or treatment
        recommendation. Always consult a qualified healthcare professional
        before making any health-related decisions. Individual user posts
        represent the opinions of the author and not of {SITE_NAME}.
      </div>
    </div>
  );
}

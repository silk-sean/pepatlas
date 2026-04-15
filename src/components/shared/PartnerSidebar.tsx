import {
  SUPPLIER_NAME,
  PEPPERPEDIA_NAME,
  PEPCALC_NAME,
  pepperpediaUrl,
  pepcalcUrl,
  supplierUrl,
} from "@/lib/constants";

interface CardProps {
  href: string;
  eyebrow: string;
  eyebrowColor: string; // hex
  title: string;
  description: string;
  icon: React.ReactNode;
}

function PartnerCard({ href, eyebrow, eyebrowColor, title, description, icon }: CardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl border border-[#333] bg-[#1a1a1a] p-4 hover:border-[rgba(214,255,0,0.5)] transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full"
          style={{ backgroundColor: `${eyebrowColor}33` }}
        >
          <span className="h-3 w-3 flex items-center justify-center" style={{ color: eyebrowColor }}>
            {icon}
          </span>
        </span>
        <span className="text-xs font-medium" style={{ color: eyebrowColor }}>
          {eyebrow}
        </span>
      </div>
      <p className="text-sm font-medium text-white">{title}</p>
      <p className="text-xs text-[#666] mt-1">{description}</p>
    </a>
  );
}

const CheckIcon = (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const BookIcon = (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.25v13.5m0-13.5A6.75 6.75 0 005.25 3v13.5A6.75 6.75 0 0112 13.25m0-7a6.75 6.75 0 016.75-3.25v13.5A6.75 6.75 0 0012 13.25" />
  </svg>
);

const CalcIcon = (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m-6 4h6m-6 4h2m4-10a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V7a2 2 0 012-2h8z" />
  </svg>
);

export function PartnerSidebar({ utm = "sidebar" }: { utm?: string }) {
  return (
    <div className="space-y-4">
      <PartnerCard
        href={supplierUrl(utm)}
        eyebrow="Verified Supplier"
        eyebrowColor="#d6ff00"
        title={SUPPLIER_NAME}
        description="Research-grade peptides with third-party COA testing"
        icon={CheckIcon}
      />
      <PartnerCard
        href={pepperpediaUrl("", utm)}
        eyebrow="Knowledge Base"
        eyebrowColor="#FF2D78"
        title={PEPPERPEDIA_NAME}
        description="The peptide encyclopedia — compounds, mechanisms, protocols"
        icon={BookIcon}
      />
      <PartnerCard
        href={pepcalcUrl("", utm)}
        eyebrow="Dose Tool"
        eyebrowColor="#7B2FFF"
        title={PEPCALC_NAME}
        description="Reconstitution and dose math — units, mcg/mg, syringe volume"
        icon={CalcIcon}
      />
    </div>
  );
}

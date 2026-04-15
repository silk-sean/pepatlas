import { SUPPLIER_URL, SUPPLIER_NAME } from "@/lib/constants";

export function SupplierBadge() {
  return (
    <a
      href={SUPPLIER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-2xl border border-[#333] bg-[#1a1a1a] p-4 hover:border-[#d6ff00]/50 transition-all"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d6ff00]/20">
          <svg className="h-3 w-3 text-[#d6ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span className="text-xs font-medium text-[#d6ff00]">Verified Supplier</span>
      </div>
      <p className="text-sm font-medium text-white">{SUPPLIER_NAME}</p>
      <p className="text-xs text-[#666] mt-1">Research-grade peptides with third-party COA testing</p>
    </a>
  );
}

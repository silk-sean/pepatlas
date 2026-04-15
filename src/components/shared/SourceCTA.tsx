import { SUPPLIER_URL, SUPPLIER_NAME } from "@/lib/constants";

interface SourceCTAProps {
  compoundName?: string;
}

export function SourceCTA({ compoundName }: SourceCTAProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <p className="text-sm text-gray-700">
        {compoundName
          ? `Looking for research-grade ${compoundName}?`
          : "Looking for research-grade peptides?"}
      </p>
      <a
        href={SUPPLIER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        View at {SUPPLIER_NAME}
      </a>
    </div>
  );
}

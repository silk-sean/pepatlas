import type { UserStack } from "@/lib/stack";

interface Props {
  stack: UserStack | null | undefined;
  username: string;
}

/**
 * Displayed under every post, similar to GolfWRX's "What's in the bag"
 * signature block. Shows the user's current peptide stack.
 */
export function StackSignature({ stack, username }: Props) {
  if (!stack || !stack.items || stack.items.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-gray-800 text-[11px] text-gray-500">
      <div className="uppercase tracking-wider mb-1 flex items-center gap-2">
        <span className="text-gray-600">└</span>
        <span className="font-semibold text-gray-400">
          {stack.title || `${username}'s stack`}
        </span>
      </div>
      <ul className="space-y-0.5 pl-4 font-mono">
        {stack.items.map((item, i) => (
          <li key={i} className="leading-snug">
            <span className="text-gray-300">{item.compound}</span>
            {item.dose && <span className="text-pink-400"> · {item.dose}</span>}
            {item.frequency && <span> · {item.frequency}</span>}
            {item.route && <span> · {item.route}</span>}
            {item.notes && <span className="text-gray-500"> ({item.notes})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

import type { Reaction, ReactionType } from "@prisma/client";
import type { ReactionCount } from "@/components/forum/Reactions";

/**
 * Given all reactions for a target (thread or reply) and the current viewer's
 * user ID, build the `ReactionCount[]` shape the Reactions component expects.
 */
export function buildReactionCounts(
  reactions: Pick<Reaction, "type" | "userId">[],
  viewerId: string | undefined,
): ReactionCount[] {
  const grouped = new Map<ReactionType, { count: number; reacted: boolean }>();
  for (const r of reactions) {
    const entry = grouped.get(r.type) ?? { count: 0, reacted: false };
    entry.count += 1;
    if (viewerId && r.userId === viewerId) entry.reacted = true;
    grouped.set(r.type, entry);
  }
  return Array.from(grouped.entries()).map(([type, v]) => ({
    type: type as ReactionCount["type"],
    count: v.count,
    reacted: v.reacted,
  }));
}

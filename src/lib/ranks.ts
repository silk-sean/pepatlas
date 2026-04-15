/**
 * Forum rank/title based on post count — GolfWRX-style.
 * Tweak thresholds once we have real usage data.
 */

export interface ForumRank {
  name: string;
  minPosts: number;
  color: string; // tailwind text color class
  badge?: string;
}

export const RANKS: ForumRank[] = [
  { name: "New Member", minPosts: 0, color: "text-gray-400" },
  { name: "Member", minPosts: 10, color: "text-gray-200" },
  { name: "Regular", minPosts: 50, color: "text-blue-300" },
  { name: "Contributor", minPosts: 150, color: "text-cyan-300", badge: "✦" },
  { name: "Veteran", minPosts: 500, color: "text-pink-400", badge: "✦✦" },
  { name: "Elite", minPosts: 1500, color: "text-yellow-300", badge: "★" },
  { name: "Legend", minPosts: 5000, color: "text-yellow-200", badge: "★★★" },
];

export function rankFor(postCount: number): ForumRank {
  // Walk from top down to first match
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (postCount >= RANKS[i].minPosts) return RANKS[i];
  }
  return RANKS[0];
}

export function nextRank(postCount: number): ForumRank | null {
  const current = rankFor(postCount);
  const idx = RANKS.indexOf(current);
  return idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
}

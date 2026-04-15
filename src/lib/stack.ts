/**
 * Stack signature — peptide equivalent of GolfWRX's "What's in the bag" (WITB).
 * Displayed under every post so other users see what you're running.
 */

export interface StackItem {
  compound: string;   // "BPC-157"
  dose?: string;       // "500mcg"
  frequency?: string;  // "2x/day"
  route?: string;      // "subQ", "IM", "oral"
  notes?: string;      // "week 4 of cycle"
}

export interface UserStack {
  title?: string;     // "Current Stack" — optional header
  items: StackItem[];
  /** Optional date-updated stamp we set server-side */
  updatedAt?: string;
}

export const MAX_STACK_ITEMS = 15;

export function isValidStack(raw: unknown): raw is UserStack {
  if (!raw || typeof raw !== "object") return false;
  const obj = raw as Partial<UserStack>;
  if (!Array.isArray(obj.items)) return false;
  if (obj.items.length > MAX_STACK_ITEMS) return false;
  for (const item of obj.items) {
    if (!item || typeof item !== "object") return false;
    if (typeof item.compound !== "string" || item.compound.length < 1 || item.compound.length > 60) return false;
    for (const field of ["dose", "frequency", "route", "notes"] as const) {
      const v = item[field];
      if (v !== undefined && (typeof v !== "string" || v.length > 80)) return false;
    }
  }
  if (obj.title && (typeof obj.title !== "string" || obj.title.length > 40)) return false;
  return true;
}

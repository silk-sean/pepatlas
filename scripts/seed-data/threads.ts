import type { SeedThread } from "./types";
import { THREADS_BEGINNER } from "./categories/beginner-questions";
import { THREADS_PROTOCOLS } from "./categories/protocol-discussions";
import { THREADS_LOGS } from "./categories/personal-logs";
import { THREADS_BLOODWORK } from "./categories/bloodwork-metrics";
import { THREADS_OPTIMIZATION } from "./categories/optimization";
import { THREADS_GENERAL } from "./categories/general";

export const THREADS_BY_CATEGORY: Record<string, SeedThread[]> = {
  "beginner-questions": THREADS_BEGINNER,
  "protocol-discussions": THREADS_PROTOCOLS,
  "personal-logs": THREADS_LOGS,
  "bloodwork-metrics": THREADS_BLOODWORK,
  "optimization": THREADS_OPTIMIZATION,
  "general": THREADS_GENERAL,
};

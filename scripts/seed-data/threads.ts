import type { SeedThread } from "./types";
import { THREADS_BEGINNER } from "./categories/beginner-questions";
import { THREADS_PROTOCOLS } from "./categories/protocol-discussions";
import { THREADS_LOGS } from "./categories/personal-logs";
import { THREADS_BLOODWORK } from "./categories/bloodwork-metrics";
import { THREADS_OPTIMIZATION } from "./categories/optimization";
import { THREADS_GENERAL } from "./categories/general";
import { THREADS_BPC157, THREADS_TB500 } from "./categories/compound-bpc-tb";
import {
  THREADS_GHKCU,
  THREADS_OTHER,
} from "./categories/compound-ghkcu-other";
import {
  THREADS_SEMAGLUTIDE,
  THREADS_TIRZEPATIDE,
} from "./categories/compound-glp1";
import {
  THREADS_RETATRUTIDE,
  THREADS_GHS,
} from "./categories/compound-reta-ghs";
import {
  THREADS_NOOTROPICS,
  THREADS_LONGEVITY,
} from "./categories/compound-noots-longevity";

export const THREADS_BY_CATEGORY: Record<string, SeedThread[]> = {
  // Top-level forum categories
  "beginner-questions": THREADS_BEGINNER,
  "protocol-discussions": THREADS_PROTOCOLS,
  "personal-logs": THREADS_LOGS,
  "bloodwork-metrics": THREADS_BLOODWORK,
  "optimization": THREADS_OPTIMIZATION,
  "general": THREADS_GENERAL,
  // Compound Discussions sub-forums
  "bpc-157": THREADS_BPC157,
  "tb-500": THREADS_TB500,
  "ghk-cu": THREADS_GHKCU,
  "other-compounds": THREADS_OTHER,
  "semaglutide": THREADS_SEMAGLUTIDE,
  "tirzepatide": THREADS_TIRZEPATIDE,
  "retatrutide": THREADS_RETATRUTIDE,
  "gh-secretagogues": THREADS_GHS,
  "nootropics": THREADS_NOOTROPICS,
  "longevity-peptides": THREADS_LONGEVITY,
};

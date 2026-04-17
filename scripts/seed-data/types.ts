import type { ReactionType } from "@prisma/client";

export interface SeedReply {
  author: string; // username (must match USERS in users.ts)
  body: string;
  daysAgo: number; // how many days ago this reply was posted (must be <= thread.daysAgo)
  reactions?: Partial<Record<ReactionType, number>>;
}

export interface SeedThread {
  title: string;
  body: string;
  author: string;
  daysAgo: number;
  pinned?: boolean;
  locked?: boolean;
  views?: number;
  reactions?: Partial<Record<ReactionType, number>>;
  replies?: SeedReply[];
}

// ReactionType enum values: LIKE, AGREE, USEFUL, FUNNY, THANKS

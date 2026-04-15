"use client";

import { useState } from "react";
import Link from "next/link";
import { MarkdownBody } from "./MarkdownBody";
import { StackSignature } from "./StackSignature";
import { Reactions, type ReactionCount } from "./Reactions";
import { QuoteButton } from "./QuoteButton";
import { ThreadModActions } from "./ThreadModActions";
import { ReplyModActions } from "./ReplyModActions";
import { InlineBodyEditor } from "./InlineBodyEditor";
import { rankFor } from "@/lib/ranks";
import { isValidStack, type UserStack } from "@/lib/stack";

interface AuthorMeta {
  id: string;
  username: string | null;
  name: string | null;
  postCount: number;
  createdAt: string; // ISO string — serializable across the client boundary
  stackJson: unknown;
}

interface Props {
  kind: "thread" | "reply";
  id: string;
  /** Thread id; when rendering a reply, this is the parent thread. */
  threadId: string;
  categorySlug: string;
  title?: string; // threads only
  body: string;
  createdAt: string;
  editedAt?: string | null;
  views?: number;
  isPinned?: boolean;
  isLocked?: boolean;
  author: AuthorMeta;
  reactions: ReactionCount[];
  isAuthed: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canModerate: boolean;
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString();
}

export function PostCard(props: Props) {
  const [editing, setEditing] = useState(false);
  const rank = rankFor(props.author.postCount);
  const joinYear = new Date(props.author.createdAt).getFullYear();
  const display = props.author.username || props.author.name || "unknown";
  const stack = isValidStack(props.author.stackJson)
    ? (props.author.stackJson as UserStack)
    : null;
  const compact = props.kind === "reply";
  const avatarSize = compact ? "h-10 w-10 text-xs" : "h-12 w-12 text-sm";

  return (
    <div className="flex items-start gap-3 sm:gap-4">
      {/* Avatar + rank rail */}
      <div className="shrink-0 flex flex-col items-center">
        <Link
          href={props.author.username ? `/profile/${props.author.username}` : "#"}
          className={`${avatarSize} rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold`}
        >
          {display[0]?.toUpperCase()}
        </Link>
        <div className="text-[10px] text-gray-500 mt-1 text-center leading-tight">
          Joined {joinYear}
          <br />
          {props.author.postCount} posts
        </div>
      </div>

      <div className="min-w-0 flex-1">
        {/* Header: username, rank, timestamp */}
        <div className="flex items-center gap-2 flex-wrap text-sm mb-0.5">
          <Link
            href={props.author.username ? `/profile/${props.author.username}` : "#"}
            className="text-gray-200 font-semibold hover:text-pink-400"
          >
            {display}
          </Link>
          <span className={`text-xs ${rank.color}`}>
            {rank.badge ? `${rank.badge} ` : ""}
            {rank.name}
          </span>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          {formatRelative(props.createdAt)}
          {props.views !== undefined && <> · {props.views} views</>}
          {props.editedAt && <> · edited {formatRelative(props.editedAt)}</>}
        </div>

        {/* Body: either markdown render or inline editor */}
        {editing ? (
          <InlineBodyEditor
            kind={props.kind}
            id={props.id}
            initialTitle={props.title}
            initialBody={props.body}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <MarkdownBody source={props.body} />
            <StackSignature stack={stack} username={display} />
          </>
        )}

        {/* Reactions + actions row */}
        <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
          <Reactions
            threadId={props.kind === "thread" ? props.id : undefined}
            replyId={props.kind === "reply" ? props.id : undefined}
            initial={props.reactions}
            isAuthed={props.isAuthed}
          />
          <div className="flex items-center gap-3 flex-wrap">
            <QuoteButton author={display} body={props.body} />
            {props.kind === "thread" && (
              <ThreadModActions
                threadId={props.id}
                categorySlug={props.categorySlug}
                isPinned={!!props.isPinned}
                isLocked={!!props.isLocked}
                canEdit={props.canEdit}
                canDelete={props.canDelete}
                canModerate={props.canModerate}
                onEdit={() => setEditing(true)}
              />
            )}
            {props.kind === "reply" && (
              <ReplyModActions
                replyId={props.id}
                canEdit={props.canEdit}
                canDelete={props.canDelete}
                onEdit={() => setEditing(true)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

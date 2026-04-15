import Link from "next/link";
import { rankFor } from "@/lib/ranks";

interface AuthorMeta {
  username: string | null;
  name: string | null;
  postCount?: number;
}

interface Props {
  id: string;
  title: string;
  body: string;
  categorySlug: string;
  author: AuthorMeta;
  views: number;
  replyCount: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: Date;
  lastReplyAt: Date | null;
  lastReplyAuthor: AuthorMeta | null;
}

function formatRelative(date: Date | null): string {
  if (!date) return "";
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

export function ThreadRow(props: Props) {
  const author = props.author.username || props.author.name || "?";
  const lastAuthor = props.lastReplyAuthor?.username || props.lastReplyAuthor?.name;
  return (
    <Link
      href={`/forum/${props.categorySlug}/${props.id}`}
      className="flex items-start gap-4 p-4 hover:bg-[#22222a] transition-colors border-b border-gray-800 last:border-b-0"
    >
      {/* Author avatar */}
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shrink-0 flex items-center justify-center text-white font-bold text-sm">
        {author[0]?.toUpperCase()}
      </div>
      {/* Title + preview */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          {props.isPinned && (
            <span className="text-[10px] uppercase tracking-wider text-pink-400 font-bold">📌</span>
          )}
          {props.isLocked && (
            <span className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">🔒</span>
          )}
          <h3 className="font-semibold text-white truncate">{props.title}</h3>
        </div>
        <p className="text-sm text-gray-400 mt-0.5 line-clamp-1">{props.body.slice(0, 200)}</p>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 flex-wrap">
          <span>by <span className="text-gray-300">{author}</span></span>
          <span>·</span>
          <span>{formatRelative(props.createdAt)}</span>
        </div>
      </div>
      {/* Right: stats + last reply */}
      <div className="hidden sm:block shrink-0 text-right text-xs text-gray-500 min-w-[120px]">
        <div className="text-gray-300">
          <span className="font-semibold">{props.replyCount}</span>{" "}
          {props.replyCount === 1 ? "reply" : "replies"}
        </div>
        <div>{props.views} views</div>
        {props.lastReplyAt && lastAuthor && (
          <div className="mt-2 pt-2 border-t border-gray-800 text-[11px]">
            <div className="text-gray-300 truncate">{lastAuthor}</div>
            <div>{formatRelative(props.lastReplyAt)}</div>
          </div>
        )}
      </div>
    </Link>
  );
}

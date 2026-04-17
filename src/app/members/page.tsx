import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { rankFor } from "@/lib/ranks";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Members — PepAtlas",
  description: "Browse the PepAtlas community of peptide researchers and biohackers.",
};

interface MembersPageProps {
  searchParams: Promise<{ q?: string; sort?: string; role?: string; page?: string }>;
}

const PAGE_SIZE = 36;

export default async function MembersPage({ searchParams }: MembersPageProps) {
  const { q, sort, role, page } = await searchParams;
  const query = (q ?? "").trim();
  const sortKey = ["posts", "newest", "alpha"].includes(sort ?? "")
    ? sort
    : "posts";
  const roleFilter =
    role === "MODERATOR" || role === "ADMIN" ? role : undefined;
  const pageNum = Math.max(1, parseInt(page ?? "1", 10) || 1);

  const where: Prisma.UserWhereInput = {
    username: { not: null },
  };
  if (query.length >= 2) {
    where.OR = [
      { username: { contains: query, mode: "insensitive" } },
      { name: { contains: query, mode: "insensitive" } },
      { bio: { contains: query, mode: "insensitive" } },
      { location: { contains: query, mode: "insensitive" } },
    ];
  }
  if (roleFilter) where.role = roleFilter;

  const orderBy: Prisma.UserOrderByWithRelationInput =
    sortKey === "newest"
      ? { createdAt: "desc" }
      : sortKey === "alpha"
        ? { username: "asc" }
        : { postCount: "desc" };

  const [users, totalCount, memberTotal, modCount, adminCount] = await Promise.all([
    db.user.findMany({
      where,
      orderBy,
      skip: (pageNum - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        location: true,
        role: true,
        postCount: true,
        createdAt: true,
      },
    }),
    db.user.count({ where }),
    db.user.count({ where: { username: { not: null } } }),
    db.user.count({ where: { role: "MODERATOR" } }),
    db.user.count({ where: { role: "ADMIN" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-white tracking-tight">Members</h1>
        <p className="mt-2 text-[#9E9EAF]">
          {memberTotal} people in the community
          {adminCount + modCount > 0 && (
            <>
              {" · "}
              <span className="text-[#d6ff00]">{adminCount} admin{adminCount === 1 ? "" : "s"}</span>
              {" · "}
              <span className="text-[#7B2FFF]">{modCount} moderator{modCount === 1 ? "" : "s"}</span>
            </>
          )}
        </p>
      </header>

      <form className="mb-6 flex flex-wrap items-center gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search username, name, bio, location…"
          className="flex-1 min-w-[220px] rounded-lg border border-[#333] bg-[#111] px-4 py-2 text-sm text-white placeholder:text-[#666] focus:border-[#FF2D78] focus:outline-none"
        />
        <select
          name="sort"
          defaultValue={sortKey}
          className="rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#FF2D78] focus:outline-none"
        >
          <option value="posts">Most active</option>
          <option value="newest">Newest</option>
          <option value="alpha">A → Z</option>
        </select>
        <select
          name="role"
          defaultValue={role ?? ""}
          className="rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#FF2D78] focus:outline-none"
        >
          <option value="">All roles</option>
          <option value="MODERATOR">Mods only</option>
          <option value="ADMIN">Admins only</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 transition-colors"
        >
          Search
        </button>
      </form>

      {users.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-[#9E9EAF]">
            No members match.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-2 text-xs text-[#666]">
            Showing {users.length} of {totalCount}
            {totalPages > 1 && ` · page ${pageNum} of ${totalPages}`}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {users.map((u) => {
              const rank = rankFor(u.postCount);
              const initial =
                (u.username?.[0] ?? u.name?.[0] ?? "?").toUpperCase();
              return (
                <Link
                  key={u.id}
                  href={`/profile/${u.username}`}
                  className="group block rounded-xl border border-[#333] bg-[#111] p-4 hover:border-[#FF2D78]/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="shrink-0 flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                      style={{
                        background:
                          u.role === "ADMIN"
                            ? "linear-gradient(135deg,#d6ff00,#a6cc00)"
                            : u.role === "MODERATOR"
                              ? "linear-gradient(135deg,#7B2FFF,#4818c4)"
                              : "linear-gradient(135deg,#FF2D78,#c41860)",
                      }}
                    >
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-white truncate group-hover:text-[#FF2D78] transition-colors">
                          @{u.username}
                        </span>
                        {u.role !== "MEMBER" && (
                          <span
                            className="text-[10px] uppercase tracking-wider font-bold"
                            style={{
                              color:
                                u.role === "ADMIN" ? "#d6ff00" : "#7B2FFF",
                            }}
                          >
                            {u.role}
                          </span>
                        )}
                      </div>
                      {u.name && u.name !== u.username && (
                        <div className="text-xs text-[#9E9EAF] truncate">
                          {u.name}
                        </div>
                      )}
                      <div className="mt-1 text-[11px] text-[#666] flex items-center gap-2 flex-wrap">
                        <span className={rank.color}>{rank.name}</span>
                        <span>·</span>
                        <span>{u.postCount} posts</span>
                        {u.location && (
                          <>
                            <span>·</span>
                            <span>{u.location}</span>
                          </>
                        )}
                      </div>
                      {u.bio && (
                        <p className="mt-2 text-xs text-[#C5C5D4] line-clamp-2">
                          {u.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2 text-sm">
              {pageNum > 1 && (
                <Link
                  href={`/members?${new URLSearchParams({
                    ...(query ? { q: query } : {}),
                    sort: sortKey!,
                    ...(role ? { role } : {}),
                    page: String(pageNum - 1),
                  }).toString()}`}
                  className="rounded border border-[#333] px-3 py-1 text-[#C5C5D4] hover:border-[#555]"
                >
                  ← Previous
                </Link>
              )}
              <span className="text-[#666] px-2">
                {pageNum} / {totalPages}
              </span>
              {pageNum < totalPages && (
                <Link
                  href={`/members?${new URLSearchParams({
                    ...(query ? { q: query } : {}),
                    sort: sortKey!,
                    ...(role ? { role } : {}),
                    page: String(pageNum + 1),
                  }).toString()}`}
                  className="rounded border border-[#333] px-3 py-1 text-[#C5C5D4] hover:border-[#555]"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

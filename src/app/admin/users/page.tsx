import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { UserRoleActions } from "@/components/admin/UserRoleActions";
import { LocalTime } from "@/components/admin/LocalTime";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Users — Admin",
};

interface UsersPageProps {
  searchParams: Promise<{ q?: string; role?: string }>;
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/admin/users");
  const me = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, id: true },
  });
  if (me?.role !== "ADMIN") redirect("/");

  const { q, role } = await searchParams;
  const trimmedQ = (q ?? "").trim();

  const where: Prisma.UserWhereInput = {};
  if (trimmedQ) {
    where.OR = [
      { username: { contains: trimmedQ, mode: "insensitive" } },
      { email: { contains: trimmedQ, mode: "insensitive" } },
      { name: { contains: trimmedQ, mode: "insensitive" } },
    ];
  }
  if (role === "ADMIN" || role === "MODERATOR" || role === "MEMBER") {
    where.role = role;
  }

  const users = await db.user.findMany({
    where,
    orderBy: [{ role: "desc" }, { createdAt: "desc" }],
    take: 100,
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      role: true,
      postCount: true,
      createdAt: true,
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <nav className="text-sm text-[#9E9EAF] mb-3">
          <Link href="/admin" className="hover:text-white transition-colors">
            Admin
          </Link>
          {" / Users"}
        </nav>
        <h1 className="text-3xl font-bold text-white tracking-tight">Users</h1>
        <p className="mt-2 text-[#9E9EAF]">
          Search users, promote to moderator/admin, or demote.
        </p>
      </header>

      <form className="mb-6 flex gap-2 flex-wrap">
        <input
          type="search"
          name="q"
          defaultValue={trimmedQ}
          placeholder="Search username, email, name…"
          className="flex-1 min-w-[240px] rounded-lg border border-[#333] bg-[#111] px-4 py-2 text-sm text-white placeholder:text-[#666] focus:border-[#FF2D78] focus:outline-none"
        />
        <select
          name="role"
          defaultValue={role ?? ""}
          className="rounded-lg border border-[#333] bg-[#111] px-3 py-2 text-sm text-white focus:border-[#FF2D78] focus:outline-none"
        >
          <option value="">All roles</option>
          <option value="ADMIN">Admins</option>
          <option value="MODERATOR">Moderators</option>
          <option value="MEMBER">Members</option>
        </select>
        <button
          type="submit"
          className="rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 transition-colors"
        >
          Search
        </button>
      </form>

      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[#666] border-b border-[#1f1f1f]">
              <tr>
                <th className="text-left py-3 px-4">User</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-right py-3 px-4">Posts</th>
                <th className="text-left py-3 px-4">Joined</th>
                <th className="text-right py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f1f1f]">
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-[#9E9EAF]">
                    No users match.
                  </td>
                </tr>
              )}
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-[#1a1a1a]">
                  <td className="py-3 px-4">
                    <div className="font-medium text-white">
                      @{u.username ?? "(no username)"}
                    </div>
                    <div className="text-xs text-[#666]">{u.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="text-[10px] uppercase tracking-wider font-bold"
                      style={{
                        color:
                          u.role === "ADMIN"
                            ? "#d6ff00"
                            : u.role === "MODERATOR"
                              ? "#7B2FFF"
                              : "#9E9EAF",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-[#C5C5D4]">
                    {u.postCount}
                  </td>
                  <td className="py-3 px-4 text-xs text-[#9E9EAF]">
                    <LocalTime iso={u.createdAt.toISOString()} mode="date" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <UserRoleActions
                      userId={u.id}
                      currentRole={u.role}
                      isSelf={u.id === me?.id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

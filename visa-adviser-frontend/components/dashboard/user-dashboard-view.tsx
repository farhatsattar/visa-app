"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BadgeCheck, Loader2, Trophy, User2 } from "lucide-react";
import { fetchDashboard, type DashboardResponse } from "@/lib/auth-api";
import { CUSTOMER_RANK_INFO } from "@/lib/rank-briefs";
import { getStoredToken, clearStoredToken } from "@/lib/auth-storage";

const rankOrder = ["Classic", "Gold", "Platinum", "Super Platinum"] as const;

function formatDate(value?: string) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "—";
  }
}

export function UserDashboardView() {
  const router = useRouter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace("/login?next=/dashboard");
      return;
    }
    fetchDashboard(token)
      .then(setData)
      .catch((err: Error) => {
        if (err.message.toLowerCase().includes("unauthor") || err.message.includes("401")) {
          clearStoredToken();
          router.replace("/login");
          return;
        }
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="container-shell flex min-h-[40vh] items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-shell py-12 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-4 text-sm text-blue-700 underline"
        >
          Go to sign in
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const pctTo200 = Math.min(100, Math.round((data.totalPoints / 200) * 100));
  const { profile, totalPoints, rank, rewards, progress, referralTree } = data;

  return (
    <div className="container-shell py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">User Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        {profile.isVerified ? (
          <span className="text-emerald-600 dark:text-emerald-400">Verified</span>
        ) : (
          <span className="text-amber-600 dark:text-amber-400">Unverified — pending points may expire in 10 days</span>
        )}
      </p>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 dark:text-blue-300">
            <User2 size={16} /> Profile
          </p>
          <div className="mt-3 space-y-1 text-sm text-slate-800 dark:text-slate-200">
            <p>
              <span className="text-slate-500 dark:text-slate-400">Name: </span>
              {profile.fullName}
            </p>
            <p>
              <span className="text-slate-500 dark:text-slate-400">Email: </span>
              {profile.email}
            </p>
            <p>
              <span className="text-slate-500 dark:text-slate-400">Referral code: </span>
              <code className="rounded bg-slate-100 px-1 text-slate-900 dark:bg-slate-900/80 dark:text-amber-200">
                {profile.referralCode}
              </code>
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
          <p className="text-sm font-semibold">Active points</p>
          <p className="mt-2 text-3xl font-bold text-blue-700 dark:text-blue-300">{totalPoints}</p>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            Pending (incl. referral rewards): {data.pendingPoints} · Expired: {data.expiredPoints}
          </p>
          <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-full rounded-full bg-blue-700" style={{ width: `${pctTo200}%` }} />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {pctTo200}% towards 200 points milestone · {progress.toSuperPlatinum} points to go for Super Platinum cap
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
            <Trophy size={16} /> Current rank
          </p>
          <p className="mt-3 rounded-lg bg-amber-100 px-3 py-2 text-center text-sm font-bold text-amber-800 dark:bg-amber-500/20 dark:text-amber-200">
            {rank}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">4-level referral model</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Points flow through four depth levels when someone joins under your network.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {["Level 1", "Level 2", "Level 3", "Level 4"].map((level) => (
              <div
                key={level}
                className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-600/50 dark:bg-emerald-950/40 dark:text-emerald-200"
              >
                {level}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
          <p className="inline-flex items-center gap-2 text-sm font-semibold">
            <BadgeCheck size={15} />
            Rank path
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {rankOrder.map((r) => (
              <span
                key={r}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  r === rank
                    ? "bg-blue-700 text-white"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                }`}
              >
                {r}
              </span>
            ))}
          </div>
          <ul className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-600 dark:border-slate-600 dark:text-slate-400">
            {CUSTOMER_RANK_INFO.map((item) => (
              <li key={item.rank}>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.rank}: </span>
                {item.brief}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Rewards: {rewards.length ? rewards.join(", ") : "—"}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
        <p className="mb-4 text-sm font-semibold">Direct referrals (level 1)</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-slate-500 dark:text-slate-400">
              <tr>
                <th className="pb-2">Name</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Points</th>
                <th className="pb-2">Rank</th>
                <th className="pb-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {referralTree.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500 dark:text-slate-400">
                    No direct referrals yet. Share your referral code.
                  </td>
                </tr>
              ) : (
                referralTree.map((row) => (
                  <tr
                    key={String(row._id)}
                    className="border-t border-slate-200 text-slate-800 dark:border-slate-600 dark:text-slate-200"
                  >
                    <td className="py-3">{row.fullName}</td>
                    <td className="py-3">{row.email}</td>
                    <td className="py-3">{row.activePoints}</td>
                    <td className="py-3">{row.rank}</td>
                    <td className="py-3">{formatDate(row.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { clearStoredToken, getRoleFromToken, getStoredToken, subscribeToAuthChange } from "@/lib/auth-storage";

function readTokenSnapshot() {
  return getStoredToken() ?? "";
}

export function AuthNav() {
  const router = useRouter();
  const pathname = usePathname();
  const token = useSyncExternalStore(subscribeToAuthChange, readTokenSnapshot, () => "");

  const hasToken = Boolean(token);
  const isAdmin = getRoleFromToken(token || null) === "ADMIN";

  const refreshRoute = () => {
    if (typeof window === "undefined") return;
    router.refresh();
  };

  const logout = () => {
    clearStoredToken();
    router.push("/");
    refreshRoute();
  };

  if (!hasToken) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href={`/login${pathname !== "/" && pathname ? `?next=${encodeURIComponent(pathname)}` : ""}`}
          className="text-sm font-medium text-slate-600 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-400"
        >
          Sign in
        </Link>
        <Link
          href="/signup"
          className="rounded-full bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
        >
          Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {isAdmin && (
        <Link
          href="/admin"
          className="text-sm font-medium text-amber-700 hover:underline dark:text-amber-400"
        >
          Admin
        </Link>
      )}
      <Link
        href="/dashboard"
        className="text-sm font-medium text-slate-600 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-400"
      >
        Dashboard
      </Link>
      <button
        type="button"
        onClick={logout}
        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        Logout
      </button>
    </div>
  );
}

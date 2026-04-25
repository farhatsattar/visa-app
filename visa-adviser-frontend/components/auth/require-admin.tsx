"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { Loader2 } from "lucide-react";
import { getRoleFromToken, getStoredToken, subscribeToAuthChange } from "@/lib/auth-storage";

function readToken() {
  return getStoredToken() ?? "";
}

type RequireAdminProps = {
  children: ReactNode;
};

export function RequireAdmin({ children }: RequireAdminProps) {
  const router = useRouter();
  const token = useSyncExternalStore(subscribeToAuthChange, readToken, () => "");
  const role = getRoleFromToken(token || null);
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    if (token && !isAdmin) {
      // Logged in but not admin — stay on this page to show access denied
      return;
    }
    if (!token) {
      router.replace("/login?next=%2Fadmin");
    }
  }, [token, isAdmin, router]);

  if (!token) {
    return (
      <div className="container-shell flex min-h-[40vh] flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Sign-in required…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container-shell py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Access denied</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          This area is only for admin accounts.
        </p>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-6 rounded-full bg-blue-700 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-800"
        >
          Go to user dashboard
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

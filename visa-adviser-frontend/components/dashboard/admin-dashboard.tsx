"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import {
  deleteVisaRegistration,
  fetchAdminUsers,
  fetchVisaRegistrations,
  verifyUserAsAdmin,
  type AdminUserRow,
  type VisaRegistrationRow,
} from "@/lib/auth-api";
import { getStoredToken } from "@/lib/auth-storage";

function formatDate(value?: string | null) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "—";
  }
}

function rowId(u: AdminUserRow) {
  const id = u._id as unknown;
  if (typeof id === "string") return id;
  if (id && typeof id === "object" && "$oid" in (id as object)) {
    return (id as { $oid: string }).$oid;
  }
  return String(id);
}

export function AdminDashboard() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [registrations, setRegistrations] = useState<VisaRegistrationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [deletingRegistrationId, setDeletingRegistrationId] = useState<
    string | null
  >(null);

  const load = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setError("Not signed in");
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const [usersList, registrationsList] = await Promise.all([
        fetchAdminUsers(token),
        fetchVisaRegistrations(token),
      ]);
      setUsers(usersList);
      setRegistrations(registrationsList);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const totalUsers = users.length;
  const totalRegistrations = registrations.length;
  const pendingVerify = users.filter((u) => !u.isVerified).length;
  const referredMembers = users.filter((u) => u.parentId).length;
  const totalDirectEdges = users.reduce(
    (n, u) => n + (u.directReferrals?.length ?? 0),
    0,
  );

  const onVerify = async (u: AdminUserRow) => {
    const id = rowId(u);
    const token = getStoredToken();
    if (!token) return;
    setVerifyingId(id);
    setError(null);
    try {
      const updated = await verifyUserAsAdmin(token, id);
      setUsers((prev) =>
        prev.map((row) => (rowId(row) === id ? { ...row, ...updated } : row)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verify failed");
    } finally {
      setVerifyingId(null);
    }
  };

  const onDeleteRegistration = async (registrationId: string) => {
    const token = getStoredToken();
    if (!token) return;
    setDeletingRegistrationId(registrationId);
    setError(null);
    try {
      await deleteVisaRegistration(token, registrationId);
      setRegistrations((prev) => prev.filter((item) => item._id !== registrationId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeletingRegistrationId(null);
    }
  };

  return (
    <div className="container-shell py-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin panel</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Live data from the API: verify members to activate pending referral points.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total users", value: String(totalUsers) },
          { label: "Visa registrations", value: String(totalRegistrations) },
          { label: "Pending verification", value: String(pendingVerify) },
          { label: "Members with a referrer", value: String(referredMembers) },
          { label: "Direct referral links", value: String(totalDirectEdges) },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </p>
      )}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Users</h2>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        ) : users.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">No users yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="pb-2 pr-2">Name</th>
                  <th className="pb-2 pr-2">Email</th>
                  <th className="pb-2 pr-2">Code</th>
                  <th className="pb-2 pr-2">Rank</th>
                  <th className="pb-2 pr-2">Active</th>
                  <th className="pb-2 pr-2">Pending</th>
                  <th className="pb-2 pr-2">Verified</th>
                  <th className="pb-2 pr-2">Joined</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const id = rowId(u);
                  return (
                    <tr
                      key={id}
                      className="border-t border-slate-200 text-slate-800 dark:border-slate-600 dark:text-slate-200"
                    >
                      <td className="py-3 pr-2 font-medium">{u.fullName}</td>
                      <td className="py-3 pr-2">{u.email}</td>
                      <td className="py-3 pr-2">
                        <code className="rounded bg-slate-100 px-1 text-xs dark:bg-slate-900/80">
                          {u.referralCode}
                        </code>
                      </td>
                      <td className="py-3 pr-2">{u.rank}</td>
                      <td className="py-3 pr-2">{u.activePoints ?? 0}</td>
                      <td className="py-3 pr-2">{u.pendingPoints ?? 0}</td>
                      <td className="py-3 pr-2">
                        {u.isVerified ? (
                          <span className="text-emerald-600 dark:text-emerald-400">Yes</span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400">No</span>
                        )}
                      </td>
                      <td className="py-3 pr-2 text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="py-3">
                        {u.isVerified ? (
                          <span className="text-xs text-slate-500">—</span>
                        ) : (
                          <button
                            type="button"
                            disabled={verifyingId === id}
                            onClick={() => void onVerify(u)}
                            className="rounded-lg bg-blue-700 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
                          >
                            {verifyingId === id ? "…" : "Verify"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Visa registrations
        </h2>
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        ) : registrations.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            No visa registrations yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead className="text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="pb-2 pr-2">Name</th>
                  <th className="pb-2 pr-2">Father/Husband</th>
                  <th className="pb-2 pr-2">Phone</th>
                  <th className="pb-2 pr-2">WhatsApp</th>
                  <th className="pb-2 pr-2">Email</th>
                  <th className="pb-2 pr-2">Marital</th>
                  <th className="pb-2 pr-2">Children</th>
                  <th className="pb-2 pr-2">Visited</th>
                  <th className="pb-2 pr-2">Rejected</th>
                  <th className="pb-2 pr-2">Approved Not Visited</th>
                  <th className="pb-2 pr-2">Submitted</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((registration) => (
                  <tr
                    key={registration._id}
                    className="border-t border-slate-200 text-slate-800 dark:border-slate-600 dark:text-slate-200"
                  >
                    <td className="py-3 pr-2 font-medium">{registration.fullName}</td>
                    <td className="py-3 pr-2">{registration.fatherOrHusbandName}</td>
                    <td className="py-3 pr-2">{registration.phoneNumber}</td>
                    <td className="py-3 pr-2">{registration.whatsappNumber}</td>
                    <td className="py-3 pr-2">{registration.email}</td>
                    <td className="py-3 pr-2">{registration.maritalStatus}</td>
                    <td className="py-3 pr-2">{registration.children}</td>
                    <td className="py-3 pr-2">
                      {(registration.countriesVisited ?? []).join(", ") || "—"}
                    </td>
                    <td className="py-3 pr-2">
                      {(registration.rejectedVisaCountries ?? []).join(", ") || "—"}
                    </td>
                    <td className="py-3 pr-2">
                      {(registration.visaApprovedButNotVisitedCountries ?? []).join(", ") ||
                        "—"}
                    </td>
                    <td className="py-3 pr-2 text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(registration.createdAt)}
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => void onDeleteRegistration(registration._id)}
                        disabled={deletingRegistrationId === registration._id}
                        className="rounded-lg bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                      >
                        {deletingRegistrationId === registration._id ? "…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

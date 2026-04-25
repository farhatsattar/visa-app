"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { registerRequest } from "@/lib/auth-api";
import { setStoredToken } from "@/lib/auth-storage";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const body = {
        fullName,
        email,
        password,
        ...(referralCode.trim() ? { referralCode: referralCode.trim() } : {}),
      };
      const { accessToken } = await registerRequest(body);
      setStoredToken(accessToken);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-shell max-w-md py-16">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Create account</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Join Worldwide Visa Adviser and start your referral journey.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="fullName" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Full name
            </label>
            <input
              id="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-medium text-slate-900 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-medium text-slate-900 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Password (min 6 characters)
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-medium text-slate-900 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
          </div>
          <div>
            <label htmlFor="referral" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Referral code (optional)
            </label>
            <input
              id="referral"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-medium text-slate-900 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-400"
            />
          </div>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-amber-500 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create account & sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-blue-700 hover:underline dark:text-blue-400">
            Sign in
          </Link>
        </p>
      </div>
      <Footer />
    </>
  );
}

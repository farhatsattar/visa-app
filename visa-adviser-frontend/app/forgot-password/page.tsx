"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Placeholder until backend reset is implemented
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 400);
  };

  return (
    <>
      <Navbar />
      <div className="container-shell max-w-md py-16">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Forgot password</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Enter your account email. If it is registered, you will receive reset instructions (when email delivery is
          connected on the server).
        </p>

        {submitted ? (
          <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
            <p className="font-semibold">Request received</p>
            <p className="mt-2">
              If this email is on file, reset instructions will be sent shortly. Please also check your spam folder.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block text-sm font-semibold text-blue-700 hover:underline dark:text-blue-400"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
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
                className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-blue-700 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          <Link href="/login" className="font-semibold text-blue-700 hover:underline dark:text-blue-400">
            Sign in
          </Link>
          {" · "}
          <Link href="/register" className="font-semibold text-blue-700 hover:underline dark:text-blue-400">
            Create account
          </Link>
        </p>
      </div>
      <Footer />
    </>
  );
}

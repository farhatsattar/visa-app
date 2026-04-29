"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AuthNav } from "@/components/auth/auth-nav";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Benefits", href: "/#benefits" },
  { label: "Ranks", href: "/#ranks" },
  { label: "Rewards", href: "/#rewards" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Admin", href: "/admin" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <nav className="container-shell py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <span className="inline-flex items-center justify-center rounded-md border-2 border-amber-500 p-0.5 shadow-md dark:border-amber-400">
              <Image src="/logo.jpeg" alt="WVA logo" width={34} height={34} className="rounded-[4px] object-cover" priority />
            </span>
            WVA Promoter
          </Link>
          <div className="hidden items-center gap-5 md:flex">
            {links.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-400"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-700 md:hidden dark:border-slate-600 dark:text-slate-200"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <AuthNav />
            <ThemeToggle />
          </div>
        </div>

        {mobileOpen && (
          <div className="mt-3 grid gap-2 rounded-xl border border-slate-200 bg-white p-3 md:hidden dark:border-slate-700 dark:bg-slate-900">
            {links.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={closeMobileMenu}
                className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}

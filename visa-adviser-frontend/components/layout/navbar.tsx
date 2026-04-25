import Link from "next/link";
import Image from "next/image";
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
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <nav className="container-shell flex items-center justify-between py-3">
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
          <AuthNav />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

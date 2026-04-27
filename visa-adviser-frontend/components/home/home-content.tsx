"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Award,
  BadgeCheck,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  Flag,
  Globe,
  PlayCircle,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "../common/section-heading";
import { benefits, countries, leaders, rewardMilestones, services } from "@/data/mock-data";
import { CUSTOMER_RANK_INFO } from "@/lib/rank-briefs";

const countryFlagCodes: Record<string, string> = {
  UK: "gb",
  Canada: "ca",
  Australia: "au",
  Germany: "de",
  UAE: "ae",
  Italy: "it",
};

/** Local: `public/video/company-video.mp4` — ya full HTTPS URL (`.env.local` mein) */
const COMPANY_VIDEO_SRC =
  process.env.NEXT_PUBLIC_COMPANY_VIDEO_URL?.trim() || "/video/company-video.mp4";

function LeaderAvatar({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-amber-400"
        aria-hidden
      />
    );
  }
  return (
    <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-full ring-2 ring-slate-200 dark:ring-slate-600">
      <Image
        src={src}
        alt={`${name} — top leader`}
        fill
        className="object-cover"
        sizes="64px"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function HomeContent() {
  const pathname = usePathname();
  const showcaseImages = ["/images/visa1.jfif", "/images/visa2.jfif", "/images/visa3.jfif"];
  const [activeShowcaseImage, setActiveShowcaseImage] = useState(0);
  const [companyVideoError, setCompanyVideoError] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    const scrollTo = () =>
      document.getElementById(decodeURIComponent(id))?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    scrollTo();
    requestAnimationFrame(scrollTo);
    const t = window.setTimeout(scrollTo, 150);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveShowcaseImage((prev) => (prev + 1) % showcaseImages.length);
    }, 2200);

    return () => window.clearInterval(timer);
  }, [showcaseImages.length]);

  return (
    <main>
      <section className="container-shell grid items-center gap-10 py-16 md:grid-cols-2 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-xl dark:border-slate-700"
        >
          {companyVideoError ? (
            <div
              className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
              aria-hidden
            />
          ) : (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={COMPANY_VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onError={() => setCompanyVideoError(true)}
            />
          )}
          <div className="absolute inset-0 bg-slate-950/55" />
          <div className="relative p-7 sm:p-8">
            <p className="inline-flex rounded-full bg-blue-500/20 px-4 py-1 text-xs font-semibold text-blue-100 ring-1 ring-blue-200/30">
              3 Year Program | 200 Euro | Full Documentation Support
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Grow Your Future with Worldwide Visa Adviser
            </h1>
            <p className="mt-4 text-slate-100">
              Trusted visa consultancy + business promoter network with premium support and automated referral growth.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-800"
              >
                Sign in
              </Link>
              <Link
                href="/visa-registeration"
                className="inline-flex items-center justify-center rounded-full border border-amber-300 bg-amber-100 px-6 py-3 text-sm font-semibold text-amber-900 transition hover:bg-amber-200"
              >
                Registration
              </Link>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-100 via-white to-amber-50 p-8 shadow-xl dark:border-slate-800 dark:from-blue-950 dark:via-slate-900 dark:to-amber-950/30"
        >
          <Globe className="h-14 w-14 text-blue-700 dark:text-blue-300" />
          <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">Global Visa Consultancy Network</h3>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            End-to-end guidance from profile setup to documentation, processing, and long-term business scaling.
          </p>
        </motion.div>
      </section>

      <section className="container-shell py-12">
        <SectionHeading id="videos" title="Video Briefing" subtitle="Company introduction and business opportunity overview." />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            {companyVideoError ? (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-slate-200 px-4 py-8 text-center text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <PlayCircle className="h-10 w-10 opacity-60" />
                <p>Video file missing ya URL galat. Local file: public/video/company-video.mp4 yahan rakhain,</p>
                <p>ya .env.local mein NEXT_PUBLIC_COMPANY_VIDEO_URL=https://... (direct mp4) set karein.</p>
              </div>
            ) : (
              <video
                className="aspect-video w-full object-cover"
                src={COMPANY_VIDEO_SRC}
                autoPlay
                muted
                loop
                playsInline
                controls
                preload="metadata"
                onError={() => setCompanyVideoError(true)}
              />
            )}
          </div>
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-blue-50 p-3 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40">
            <motion.div
              key={showcaseImages[activeShowcaseImage]}
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -22 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="relative h-full w-full"
            >
              <Image
                src={showcaseImages[activeShowcaseImage]}
                alt={`Visa guidance preview ${activeShowcaseImage + 1}`}
                fill
                className="rounded-xl object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="eager"
              />
            </motion.div>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1">
              {showcaseImages.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full ${activeShowcaseImage === index ? "bg-white" : "bg-white/45"}`}
                />
              ))}
            </div>
            <p className="absolute bottom-3 right-4 text-xs font-semibold text-white">
              Opportunity / Business Plan Highlights
            </p>
          </div>
        </div>
      </section>

      <section className="container-shell py-12">
        <SectionHeading
          id="leaders"
          title="Top 10 Leaders"
          subtitle="Recognized members with strong rank progression and referral performance."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {leaders.map((leader) => (
            <div
              key={leader.name}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-center text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <LeaderAvatar src={leader.image} name={leader.name} />
              <h4 className="mt-3 text-sm font-semibold text-slate-900 dark:text-white">{leader.name}</h4>
              <p className="text-xs text-amber-700 dark:text-amber-300">{leader.rank}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{leader.points} referral points</p>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="container-shell py-12">
        <SectionHeading
          title="About Worldwide Visa Adviser"
          subtitle="Corporate-grade client guidance backed by long-term support and compliance."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Company Guidance", text: "Dedicated support by trained advisors at each stage." },
            { icon: FileText, title: "7 Official Documents", text: "Complete preparation package for client submissions." },
            { icon: BadgeCheck, title: "3-Year Support", text: "Continuous help for visa pathway and business growth." },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-600"
            >
              <item.icon className="h-7 w-7 text-blue-700 dark:text-blue-300" />
              <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="container-shell py-12">
        <SectionHeading title="Services" subtitle="Professional services designed for visa and business success." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <h4 className="font-semibold text-slate-900 dark:text-white">{service.title}</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="benefits" className="container-shell py-12">
        <SectionHeading title="Benefits" subtitle="The platform rewards growth, consistency, and network leadership." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-800/60 dark:bg-blue-950/50"
            >
              <CheckCircle2 className="h-5 w-5 text-blue-700 dark:text-blue-300" />
              <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-12">
        <SectionHeading title="Countries" subtitle="Top destination pathways available in our support network." />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {countries.map((country) => (
            <div
              key={country}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <img
                src={`https://flagcdn.com/w20/${countryFlagCodes[country] ?? "un"}.png`}
                alt={`${country} flag`}
                width={20}
                height={14}
                loading="lazy"
                className="h-[14px] w-5 rounded-[2px] border border-slate-300 object-cover"
              />
              <span className="font-medium">{country}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-12">
        <SectionHeading title="Referral Points Structure" subtitle="Automated 4-level referral distribution model." />
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              "Direct Referral = 5 points",
              "Level 2 = 2 points",
              "Level 3 = 1 point",
              "Level 4 = 1 point",
            ].map((step, i) => (
              <div
                key={step}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-600 dark:bg-slate-900/50"
              >
                <p className="text-xs text-slate-500 dark:text-slate-400">Step {i + 1}</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="rewards" className="container-shell py-12">
        <SectionHeading title="Rewards Roadmap" subtitle="Milestone rewards are unlocked automatically as points grow." />
        <div className="space-y-3">
          {rewardMilestones.map((item, idx) => (
            <div
              key={item.points}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <div className="rounded-full bg-amber-100 p-2 text-amber-700 dark:bg-amber-600/30 dark:text-amber-200">
                <Award size={18} />
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item.points} points → {item.reward}
              </p>
              <div className="ml-auto text-xs text-slate-500 dark:text-slate-400">Milestone {idx + 1}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="ranks" className="container-shell py-12">
        <SectionHeading
          title="Membership ranks"
          subtitle="Four tiers reflect how far you have grown in the program. Your dashboard updates automatically as your points change."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {CUSTOMER_RANK_INFO.map((item) => (
            <div
              key={item.rank}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-left text-slate-900 shadow-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <p className="text-sm font-bold text-amber-700 dark:text-amber-300">{item.rank}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.brief}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-12">
        <SectionHeading
          title="Verification status"
          subtitle="Verified members keep all points active. Unverified accounts should complete verification before pending rewards time out."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-700/40 dark:bg-emerald-900/20">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              <UserRoundCheck size={16} /> Verified User
            </p>
            <p className="mt-2 text-sm text-emerald-700/90 dark:text-emerald-200">All points are active and safe.</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-700/40 dark:bg-amber-900/20">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
              <CircleDollarSign size={16} /> Unverified Warning
            </p>
            <p className="mt-2 text-sm text-amber-700/90 dark:text-amber-200">
              Pending points expire after 10 days if verification is not completed.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

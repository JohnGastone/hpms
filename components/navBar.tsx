"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/themeContext";

const navLinks = [
  { href: "/",             label: "Dashboard"    },
  { href: "/patients",     label: "Patients"     },
  { href: "/appointments", label: "Appointments" },
  { href: "/wards",        label: "Wards"        },
];

function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setTime(new Date());
    const init = setTimeout(tick, 0);
    const id   = setInterval(tick, 1000);
    return () => { clearTimeout(init); clearInterval(id); };
  }, []);

  if (!time) return null;

  const hh   = time.getHours().toString().padStart(2, "0");
  const mm   = time.getMinutes().toString().padStart(2, "0");
  const ss   = time.getSeconds().toString().padStart(2, "0");
  const date = time.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

  return (
    <div className="hidden lg:flex flex-col items-end shrink-0">
      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight tabular-nums">
        {hh}:{mm}<span className="text-slate-400 dark:text-slate-500 font-normal">:{ss}</span>
      </p>
      <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight font-medium">{date}</p>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 transition-all active:scale-90"
    >
      {isDark ? (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-b border-slate-200/70 dark:border-slate-700/70 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group no-underline">
          <svg width="30" height="30" viewBox="0 0 80 80" fill="none" className="shrink-0">
            <rect width="80" height="80" rx="20" fill="#2563eb"/>
            <rect x="33" y="16" width="14" height="48" rx="7" fill="white" opacity="0.3"/>
            <rect x="16" y="33" width="48" height="14" rx="7" fill="white" opacity="0.3"/>
            <polyline points="14,42 26,42 31,28 40,56 49,34 54,42 66,42"
              fill="none" stroke="white" strokeWidth="3.5"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 transition-colors">MediTrack</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight font-semibold tracking-wider uppercase">HMS</p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 max-w-xs">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 no-underline ${
                  active
                    ? "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right side: clock · toggle · user */}
        <div className="flex items-center gap-3 shrink-0">

          <LiveClock />

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <ThemeToggle />

          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug">Dr. Okello</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-snug">Cardiology · On duty</p>
            </div>
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <span className="text-xs font-bold text-white tracking-wide">DO</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

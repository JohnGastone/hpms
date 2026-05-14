"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/",             label: "Dashboard"    },
  { href: "/patients",     label: "Patients"     },
  { href: "/appointments", label: "Appointments" },
  { href: "/wards",        label: "Wards"        },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200/70 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">

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
            <p className="text-sm font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">MediTrack</p>
            <p className="text-[10px] text-slate-400 leading-tight font-semibold tracking-wider uppercase">HMS</p>
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
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-800 leading-snug">Dr. Okello</p>
            <p className="text-[11px] text-slate-400 leading-snug">Cardiology · On duty</p>
          </div>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-white tracking-wide">DO</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" />
          </div>
        </div>

      </div>
    </header>
  );
}

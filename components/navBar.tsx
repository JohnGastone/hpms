import Link from "next/link";

// Flutter parallel:
// This is like a shared AppBar widget you'd pass into every Scaffold.
// In Next.js we extract it as a component and use it in layout.tsx
// so it appears on every page automatically — like a persistent AppBar
// in a Flutter MaterialApp with a consistent Scaffold structure.

const navLinks = [
  { href: "/",               label: "Dashboard" },
  { href: "/patients",       label: "Patients"  },
  { href: "/appointments",   label: "Appointments" },
  { href: "/wards",          label: "Wards"     },
];

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo + wordmark */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <svg width="32" height="32" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="80" height="80" rx="20" fill="#2563eb"/>
            <rect x="33" y="16" width="14" height="48" rx="7" fill="white" opacity="0.25"/>
            <rect x="16" y="33" width="48" height="14" rx="7" fill="white" opacity="0.25"/>
            <polyline points="14,42 26,42 31,28 40,56 49,34 54,42 66,42" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <p className="text-sm font-bold text-slate-800 leading-tight">MediTrack</p>
            <p className="text-xs text-slate-400 leading-tight">Patient Management</p>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Doctor avatar */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-slate-700">Dr. Okello</p>
            <p className="text-xs text-slate-400">On duty</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-blue-700">DO</span>
          </div>
        </div>

      </div>
    </header>
  );
}
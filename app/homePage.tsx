"use client";

// Flutter parallel:
// useDashboardStats() = FutureProvider<DashboardStats> — react-query handles
// loading, error, caching, and background refetch automatically.
// usePatientStore() reads from Zustand — same as ref.watch(patientProvider).
// useAuth() reads the logged-in user from Context — no BuildContext threading.

import { useEffect } from "react";
import Link from "next/link";
import { useDashboardStats, usePatients } from "@/lib/api";
import { usePatientStore } from "@/store/usePatientStore";
import { useAuth } from "@/context/authContext";
import PatientCard from "@/components/patientCard";
import { DashboardStatSkeleton, PatientCardSkeleton } from "@/components/skeletons";

export default function DashboardPage() {
  const { user } = useAuth();

  // react-query — replaces useEffect + useState loading/error/data
  // Flutter: ref.watch(dashboardStatsProvider)
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: fetchedPatients, isLoading: patientsLoading } = usePatients();

  // Zustand store — global patient list shared across all pages
  const { patients, setPatients } = usePatientStore();

  // Seed the Zustand store once when react-query finishes fetching
  // From now on, all pages read from the store — not from the API directly
  useEffect(() => {
    if (fetchedPatients) setPatients(fetchedPatients);
  }, [fetchedPatients, setPatients]);

  // Derive critical patients from the STORE (not the API response directly)
  // This means if you discharge a patient on the detail page,
  // the dashboard updates instantly without a refetch
  const criticalPatients = patients.filter((p) => p.status === "critical");

  const statCards = stats
    ? [
        { label: "Total patients",    value: stats.totalPatients, color: "text-slate-700", bg: "bg-white"    },
        { label: "Admitted",          value: stats.admitted,      color: "text-blue-700",  bg: "bg-blue-50"  },
        { label: "Critical",          value: stats.critical,      color: "text-red-700",   bg: "bg-red-50"   },
        { label: "Under observation", value: stats.observation,   color: "text-amber-700", bg: "bg-amber-50" },
        { label: "Beds occupied",     value: `${stats.bedsOccupied}/${stats.totalBeds}`, color: "text-teal-700", bg: "bg-teal-50" },
      ]
    : [];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Good morning, {user.name}
        </h2>
        <p className="text-slate-500 text-sm mt-1" suppressHydrationWarning>
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Today&apos;s overview</h3>
        {statsError ? (
          <div className="bg-red-50 text-red-700 rounded-2xl p-4 text-sm">Failed to load stats.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {statsLoading
              ? Array.from({ length: 5 }).map((_, i) => <DashboardStatSkeleton key={i} />)
              : statCards.map((card) => (
                  <div key={card.label} className={`${card.bg} rounded-2xl border border-slate-100 p-5`}>
                    <p className="text-xs text-slate-500 font-medium mb-2 leading-tight">{card.label}</p>
                    <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
                  </div>
                ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Critical patients</h3>
          <Link href="/patients" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View all →</Link>
        </div>
        {patientsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 2 }).map((_, i) => <PatientCardSkeleton key={i} />)}
          </div>
        ) : criticalPatients.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
            <p className="text-2xl mb-2">✅</p>
            <p className="text-slate-500 text-sm">No critical patients right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {criticalPatients.map((p) => (
              <Link key={p.id} href={`/patients/${p.id}`} className="no-underline">
                <PatientCard patient={p} />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Quick actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: "/patients/new", emoji: "➕", label: "Register patient", desc: "Add a new patient to the system" },
            { href: "/appointments",  emoji: "📅", label: "Appointments",     desc: "Manage today's schedule"         },
            { href: "/wards",         emoji: "🏥", label: "Ward overview",    desc: "Check bed availability by ward"  },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all no-underline">
              <p className="text-2xl mb-3">{item.emoji}</p>
              <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
              <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
"use client";

// Flutter parallel:
// "use client" = StatefulWidget. This page has state + side effects.
// useEffect here replaces initState() — it fetches data when the page mounts.
// The loading/error/data pattern is identical to FutureBuilder in Flutter:
//   snapshot.connectionState == waiting  → show skeleton
//   snapshot.hasError                    → show error widget
//   snapshot.hasData                     → show content

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchDashboardStats, fetchPatients } from "@/lib/api";
import { Patient } from "@/lib/types";
import PatientCard from "@/components/patientCard";
import { DashboardStatSkeleton, PatientCardSkeleton } from "@/components/skeletons";

interface DashboardStats {
  totalPatients: number;
  admitted: number;
  critical: number;
  observation: number;
  discharged: number;
  bedsOccupied: number;
  totalBeds: number;
}

export default function DashboardPage() {
  // Three separate state variables — each piece of data has its own loading state
  // Flutter: late DashboardStats stats; bool isLoading = true; String? error;
  const [stats, setStats]           = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [criticalPatients, setCriticalPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading]   = useState(true);

  // useEffect with [] = initState() — runs once when the component mounts
  // Flutter: void initState() { super.initState(); fetchStats(); }
  useEffect(() => {
    fetchDashboardStats()
      .then((data) => setStats(data))
      .catch(() => setStatsError("Failed to load stats"))
      .finally(() => setStatsLoading(false));

    fetchPatients()
      .then((data) => setCriticalPatients(data.filter((p) => p.status === "critical")))
      .finally(() => setPatientsLoading(false));

    // Returning a cleanup function = dispose() in Flutter
    // Here we don't have a subscription to cancel, but the pattern is the same:
    // return () => { subscription.cancel(); }
  }, []); // empty array = run once on mount only

  const statCards = stats
    ? [
        { label: "Total patients",  value: stats.totalPatients, color: "text-slate-700",  bg: "bg-white"       },
        { label: "Admitted",        value: stats.admitted,      color: "text-blue-700",   bg: "bg-blue-50"     },
        { label: "Critical",        value: stats.critical,      color: "text-red-700",    bg: "bg-red-50"      },
        { label: "Under observation",value: stats.observation,  color: "text-amber-700",  bg: "bg-amber-50"    },
        { label: "Beds occupied",   value: `${stats.bedsOccupied}/${stats.totalBeds}`, color: "text-teal-700", bg: "bg-teal-50" },
      ]
    : [];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      {/* Page heading */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1" suppressHydrationWarning>
          {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Stats grid */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Today&apos;s overview</h3>

        {statsError ? (
          <div className="bg-red-50 text-red-700 rounded-2xl p-4 text-sm">{statsError}</div>
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

      {/* Critical patients */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Critical patients
          </h3>
          <Link href="/patients" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all →
          </Link>
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

      {/* Quick links */}
      <section>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Quick actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: "/patients",     emoji: "🧑‍⚕️", label: "All patients",    desc: "View and search all patients"    },
            { href: "/appointments", emoji: "📅",    label: "Appointments",    desc: "Manage today's schedule"         },
            { href: "/wards",        emoji: "🏥",    label: "Ward overview",   desc: "Check bed availability by ward"  },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all no-underline"
            >
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
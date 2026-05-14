"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchPatients } from "@/lib/api";
import { Patient, Ward } from "@/lib/types";

const WARD_CONFIG: Record<Ward, { label: string; totalBeds: number; accent: string; iconBg: string; iconColor: string }> = {
  cardiology:  { label: "Cardiology",  totalBeds: 24, accent: "bg-rose-400",   iconBg: "bg-rose-50",   iconColor: "text-rose-600"   },
  neurology:   { label: "Neurology",   totalBeds: 18, accent: "bg-purple-400", iconBg: "bg-purple-50", iconColor: "text-purple-600" },
  pediatrics:  { label: "Pediatrics",  totalBeds: 20, accent: "bg-sky-400",    iconBg: "bg-sky-50",    iconColor: "text-sky-600"    },
  orthopedics: { label: "Orthopedics", totalBeds: 22, accent: "bg-orange-400", iconBg: "bg-orange-50", iconColor: "text-orange-600" },
  emergency:   { label: "Emergency",   totalBeds: 15, accent: "bg-red-400",    iconBg: "bg-red-50",    iconColor: "text-red-600"    },
  general:     { label: "General",     totalBeds: 40, accent: "bg-teal-400",   iconBg: "bg-teal-50",   iconColor: "text-teal-600"   },
};

const barColor = (pct: number) =>
  pct > 80 ? "bg-red-400" : pct > 60 ? "bg-amber-400" : "bg-emerald-400";

export default function WardsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchPatients().then(setPatients).finally(() => setLoading(false));
  }, []);

  const wardStats = (Object.entries(WARD_CONFIG) as [Ward, typeof WARD_CONFIG[Ward]][]).map(
    ([ward, cfg]) => {
      const wardPatients = patients.filter((p) => p.ward === ward);
      const occupied     = wardPatients.filter((p) => p.status !== "discharged").length;
      const critical     = wardPatients.filter((p) => p.status === "critical").length;
      const pct          = Math.round((occupied / cfg.totalBeds) * 100);
      return { ward, ...cfg, patients: wardPatients, occupied, critical, pct };
    }
  );

  const totalBeds     = wardStats.reduce((s, w) => s + w.totalBeds, 0);
  const totalOccupied = wardStats.reduce((s, w) => s + (loading ? 0 : w.occupied), 0);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-up">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Ward overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading ? "Loading…" : `${totalOccupied} of ${totalBeds} beds occupied across 6 wards`}
          </p>
        </div>
      </div>

      {/* Ward grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {wardStats.map((w) => (
          <div key={w.ward} className="bg-white dark:bg-slate-800 rounded-2xl ring-1 ring-slate-100 dark:ring-slate-700 shadow-xs overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:ring-slate-200 dark:hover:ring-slate-600">

            {/* Accent bar */}
            <div className={`h-1 w-full ${w.accent}`} />

            <div className="p-5 space-y-4">
              {/* Ward header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${w.iconBg}`}>
                    <svg className={`w-4 h-4 ${w.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{w.label}</p>
                </div>
                {w.critical > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full ring-1 ring-red-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    {w.critical} critical
                  </span>
                )}
              </div>

              {/* Occupancy */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span className="font-medium">{loading ? "—" : `${w.occupied} occupied`}</span>
                  <span>{w.totalBeds} beds total</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  {loading ? (
                    <div className="h-full w-1/3 bg-slate-200 animate-pulse rounded-full" />
                  ) : (
                    <div
                      className={`ward-bar h-full rounded-full transition-all duration-700 ${barColor(w.pct)}`}
                      style={{ "--ward-occupancy": `${w.pct}%` } as React.CSSProperties}
                    />
                  )}
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <p className="text-[11px] text-slate-400">{loading ? "" : `${w.pct}% occupancy`}</p>
                  {!loading && w.pct > 80 && (
                    <p className="text-[11px] font-semibold text-red-500">Near capacity</p>
                  )}
                </div>
              </div>

              {/* Patient preview */}
              {!loading && w.patients.length > 0 && (
                <div className="space-y-1 pt-1 border-t border-slate-50 dark:border-slate-700">
                  {w.patients.slice(0, 3).map((p) => (
                    <Link
                      key={p.id}
                      href={`/patients/${p.id}`}
                      className="flex items-center justify-between text-xs py-1.5 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline group"
                    >
                      <span className="font-medium group-hover:text-blue-600">{p.name}</span>
                      <span className="text-slate-400">Bed {p.bedNumber}</span>
                    </Link>
                  ))}
                  {w.patients.length > 3 && (
                    <p className="text-[11px] text-slate-400 pt-0.5">+{w.patients.length - 3} more patients</p>
                  )}
                </div>
              )}

              {!loading && w.patients.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-2 border-t border-slate-50 dark:border-slate-700">No patients admitted</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

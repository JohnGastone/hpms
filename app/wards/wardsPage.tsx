"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchPatients } from "@/lib/api";
import { Patient, Ward } from "@/lib/types";

const WARD_CONFIG: Record<Ward, { label: string; totalBeds: number; color: string; bg: string }> = {
  cardiology:   { label: "Cardiology",   totalBeds: 24, color: "text-rose-700",   bg: "bg-rose-50"   },
  neurology:    { label: "Neurology",    totalBeds: 18, color: "text-purple-700", bg: "bg-purple-50" },
  pediatrics:   { label: "Pediatrics",   totalBeds: 20, color: "text-sky-700",    bg: "bg-sky-50"    },
  orthopedics:  { label: "Orthopedics",  totalBeds: 22, color: "text-orange-700", bg: "bg-orange-50" },
  emergency:    { label: "Emergency",    totalBeds: 15, color: "text-red-700",     bg: "bg-red-50"    },
  general:      { label: "General",      totalBeds: 40, color: "text-teal-700",   bg: "bg-teal-50"   },
};

export default function WardsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetchPatients()
      .then(setPatients)
      .finally(() => setLoading(false));
  }, []);

  const wardStats = (Object.entries(WARD_CONFIG) as [Ward, typeof WARD_CONFIG[Ward]][]).map(
    ([ward, config]) => {
      const wardPatients  = patients.filter((p) => p.ward === ward);
      const occupied      = wardPatients.filter((p) => p.status !== "discharged").length;
      const critical      = wardPatients.filter((p) => p.status === "critical").length;
      const occupancyPct  = Math.round((occupied / config.totalBeds) * 100);
      return { ward, ...config, patients: wardPatients, occupied, critical, occupancyPct };
    }
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Ward overview</h2>
        <p className="text-slate-500 text-sm mt-1">Bed occupancy across all wards</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {wardStats.map((w) => (
          <div key={w.ward} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className={`${w.bg} ${w.color} text-xs font-semibold px-3 py-1 rounded-lg capitalize`}>
                {w.label}
              </div>
              {w.critical > 0 && (
                <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded-full">
                  {w.critical} critical
                </span>
              )}
            </div>

            {/* Occupancy bar */}
            <div>
              <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                <span>{w.occupied} occupied</span>
                <span>{w.totalBeds} total beds</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                {loading ? (
                  <div className="h-full bg-slate-200 animate-pulse rounded-full" />
                ) : (
                  <div
                    className={`ward-bar h-full rounded-full transition-all duration-700 ${
                      w.occupancyPct > 80 ? "bg-red-400" :
                      w.occupancyPct > 60 ? "bg-amber-400" : "bg-teal-400"
                    }`}
                    style={{ "--ward-occupancy": `${w.occupancyPct}%` } as React.CSSProperties}
                  />
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">{loading ? "—" : `${w.occupancyPct}% occupancy`}</p>
            </div>

            {/* Patient list preview */}
            {!loading && w.patients.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {w.patients.slice(0, 3).map((p) => (
                  <Link
                    key={p.id}
                    href={`/patients/${p.id}`}
                    className="flex items-center justify-between text-xs py-1 hover:text-blue-600 transition-colors no-underline text-slate-600"
                  >
                    <span>{p.name}</span>
                    <span className="text-slate-400">Bed {p.bedNumber}</span>
                  </Link>
                ))}
                {w.patients.length > 3 && (
                  <p className="text-xs text-slate-400">+{w.patients.length - 3} more</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
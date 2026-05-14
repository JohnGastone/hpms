"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchPatients } from "@/lib/api";
import { Patient } from "@/lib/types";
import PatientList from "@/components/patientList";
import StatsBar from "@/components/statsBar";
import { PatientCardSkeleton, StatsSkeleton } from "@/components/skeletons";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    fetchPatients()
      .then((data) => { setPatients(data); setLoading(false); })
      .catch(() => { setError("Could not load patients. Please try again."); setLoading(false); });
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-6 animate-fade-up">

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patients</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {loading ? "Loading…" : `${patients.length} patients on record`}
          </p>
        </div>
        <Link
          href="/patients/new"
          className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm no-underline shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Register patient
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 rounded-2xl p-4 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-6">
          <StatsSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <PatientCardSkeleton key={i} />)}
          </div>
        </div>
      )}

      {/* Data */}
      {!loading && !error && (
        <>
          <StatsBar patients={patients} />
          <PatientList patients={patients} onPatientClick={() => {}} />
        </>
      )}

    </main>
  );
}

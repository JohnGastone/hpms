"use client";

// Flutter parallel:
// useEffect with [] = initState() fetching data.
// setPatients(data) inside .then() = setState(() { patients = data; })
// The loading state drives conditional rendering — same as FutureBuilder.

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

  // useEffect — runs once on mount (empty dependency array)
  // Flutter: initState() → fetchPatients() → setState()
  useEffect(() => {
    fetchPatients()
      .then((data) => {
        setPatients(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load patients. Please try again.");
        setLoading(false);
      });
  }, []); // [] = run once, never re-run. Add a variable here to re-fetch when it changes.

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Patients</h2>
          <p className="text-slate-500 text-sm mt-1">
            {loading ? "Loading..." : `${patients.length} total patients`}
          </p>
        </div>
        <Link
          href="/patients/new"
          className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors no-underline"
        >
          + Register patient
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Loading state — skeletons instead of a spinner */}
      {loading && (
        <div className="space-y-8">
          <StatsSkeleton />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <PatientCardSkeleton key={i} />)}
          </div>
        </div>
      )}

      {/* Data loaded — same components as Day 1, just fed by real (simulated) API now */}
      {!loading && !error && (
        <>
          <StatsBar patients={patients} />
          <PatientList
            patients={patients}
            onPatientClick={() => {}}
          />
        </>
      )}
    </main>
  );
}
"use client";

// Flutter parallel:
// This is like a detail screen that receives an ID via Navigator.push arguments:
//   Navigator.pushNamed(context, '/patients/P001')
//
// In Next.js, the [id] folder name makes `id` available via `use(params)`.
// useEffect([id]) = re-runs whenever the id changes, like didUpdateWidget()
// when the key prop changes.
//
// The fetch-on-mount pattern is identical to:
//   initState() { fetchPatient(widget.patientId); }

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { fetchPatientById } from "@/lib/api";
import { Patient } from "@/lib/types";
import StatusBadge from "@/components/statusBadge";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PatientDetailPage({ params }: PageProps) {
  // Unwrap the params promise — Next.js App Router passes params as a Promise
  const { id } = use(params);
  const router  = useRouter();

  // Combined into one object so a single setState in each callback covers
  // all fields — avoids synchronous setState in the effect body.
  const [result, setResult] = useState<{
    id: string | null;
    patient: Patient | null;
    error: string | null;
  }>({ id: null, patient: null, error: null });

  // loading is derived — true while the fetched id doesn't match the current id.
  const loading = result.id !== id;
  const { patient, error } = result;

  // useEffect with [id] in the dependency array:
  // Flutter: didUpdateWidget() — re-runs when `id` changes
  // If the user navigates from /patients/P001 to /patients/P002,
  // this effect runs again automatically with the new id.
  useEffect(() => {
    let cancelled = false;

    fetchPatientById(id)
      .then((data) => {
        if (cancelled) return;
        if (!data) setResult({ id, patient: null, error: "Patient not found." });
        else        setResult({ id, patient: data,  error: null });
      })
      .catch(() => {
        if (!cancelled) setResult({ id, patient: null, error: "Failed to load patient." });
      });

    // Cleanup function — Flutter: dispose()
    return () => { cancelled = true; };
  }, [id]); // re-run whenever id changes

  if (loading) return <PatientDetailSkeleton />;

  if (error) return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-center">
      <p className="text-4xl mb-4">⚠️</p>
      <p className="text-slate-600 font-medium">{error}</p>
      <button onClick={() => router.back()} className="mt-6 text-blue-600 text-sm hover:underline">
        ← Go back
      </button>
    </main>
  );

  if (!patient) return null;

  const infoRows = [
    ["Patient ID",     patient.id],
    ["Age",            `${patient.age} years`],
    ["Gender",         patient.gender],
    ["Ward",           patient.ward],
    ["Bed number",     patient.bedNumber],
    ["Attending doctor", patient.doctor],
    ["Date admitted",  patient.admittedDate],
  ];

  return (
    <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      {/* Back button — Flutter: Navigator.pop(context) */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        ← Back
      </button>

      {/* Patient header card */}
      <div className="bg-white rounded-3xl border border-slate-100 p-7">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-blue-700">
                {patient.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{patient.name}</h2>
              <p className="text-sm text-slate-400 mt-0.5">{patient.id}</p>
            </div>
          </div>
          <StatusBadge status={patient.status} />
        </div>

        {/* Condition */}
        <div className="bg-slate-50 rounded-2xl p-4 mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Condition</p>
          <p className="text-slate-700 font-medium">{patient.condition}</p>
        </div>

        {/* Info rows */}
        <div className="space-y-3">
          {infoRows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-sm text-slate-400">{label}</span>
              <span className="text-sm font-medium text-slate-700 capitalize">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons — these will connect to Zustand store on Day 3 */}
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold py-3 rounded-2xl hover:bg-slate-50 transition-colors">
          Edit details
        </button>
        <button
          className={`text-sm font-semibold py-3 rounded-2xl transition-colors ${
            patient.status === "discharged"
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          disabled={patient.status === "discharged"}
        >
          {patient.status === "discharged" ? "Discharged" : "Discharge patient"}
        </button>
      </div>
    </main>
  );
}

function PatientDetailSkeleton() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      <div className="h-4 w-16 bg-slate-200 rounded animate-pulse" />
      <div className="bg-white rounded-3xl border border-slate-100 p-7 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex justify-between py-2 border-b border-slate-50">
            <div className="h-3 w-24 bg-slate-200 rounded animate-pulse" />
            <div className="h-3 w-20 bg-slate-200 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </main>
  );
}
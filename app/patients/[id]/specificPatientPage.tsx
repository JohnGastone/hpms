"use client";

// Flutter parallel:
// dischargePatient() calls the Zustand store action — like calling
// ref.read(patientProvider.notifier).discharge(id) in Riverpod.
// The change propagates INSTANTLY to every page reading from the store:
// the dashboard critical count drops, the patient list badge changes,
// the ward occupancy updates — all without any network call or prop drilling.
// This is the "aha" moment of Day 3.

import { use } from "react";
import { useRouter } from "next/navigation";
import { usePatientById } from "@/lib/api";
import { usePatientStore } from "@/store/usePatientStore";
import { useAuth } from "@/context/authContext";
import StatusBadge from "@/components/statusBadge";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PatientDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router  = useRouter();
  const { user } = useAuth();

  // react-query — fetches and caches the patient
  const { data: patient, isLoading, error } = usePatientById(id);

  // Zustand — get the discharge action from the global store
  // Flutter: final notifier = ref.read(patientProvider.notifier)
  const { dischargePatient, patients } = usePatientStore();

  // Read from store for live status updates (discharge reflects immediately)
  const livePatient = patients.find((p) => p.id === id) ?? patient;

  const handleDischarge = () => {
    // Zustand action — updates the store, every subscriber re-renders
    // Flutter: ref.read(patientProvider.notifier).discharge(id)
    dischargePatient(id);
  };

  if (isLoading) return <PatientDetailSkeleton />;

  if (error || !livePatient) return (
    <main className="max-w-2xl mx-auto px-6 py-16 text-center">
      <p className="text-4xl mb-4">⚠️</p>
      <p className="text-slate-600 font-medium">Patient not found.</p>
      <button onClick={() => router.back()} className="mt-6 text-blue-600 text-sm hover:underline">← Go back</button>
    </main>
  );

  const infoRows = [
    ["Patient ID",        livePatient.id],
    ["Age",               `${livePatient.age} years`],
    ["Gender",            livePatient.gender],
    ["Ward",              livePatient.ward],
    ["Bed number",        livePatient.bedNumber],
    ["Attending doctor",  livePatient.doctor],
    ["Date admitted",     livePatient.admittedDate],
    ["Reviewed by",       user.name],
  ];

  const isAlreadyDischarged = livePatient.status === "discharged";

  return (
    <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        ← Back
      </button>

      <div className="bg-white rounded-3xl border border-slate-100 p-7">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xl font-bold text-blue-700">
                {livePatient.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{livePatient.name}</h2>
              <p className="text-sm text-slate-400 mt-0.5">{livePatient.id}</p>
            </div>
          </div>
          <StatusBadge status={livePatient.status} />
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Condition</p>
          <p className="text-slate-700 font-medium">{livePatient.condition}</p>
        </div>

        <div className="space-y-3">
          {infoRows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-sm text-slate-400">{label}</span>
              <span className="text-sm font-medium text-slate-700 capitalize">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons — Discharge now actually works via Zustand */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => router.push(`/patients`)}
          className="bg-white border border-slate-200 text-slate-700 text-sm font-semibold py-3 rounded-2xl hover:bg-slate-50 transition-colors"
        >
          All patients
        </button>
        <button
          onClick={handleDischarge}
          disabled={isAlreadyDischarged}
          className={`text-sm font-semibold py-3 rounded-2xl transition-colors ${
            isAlreadyDischarged
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
          }`}
        >
          {isAlreadyDischarged ? "Already discharged" : "Discharge patient"}
        </button>
      </div>

      {isAlreadyDischarged && (
        <p className="text-center text-xs text-slate-400">
          Status updated globally — check the dashboard and patient list
        </p>
      )}
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
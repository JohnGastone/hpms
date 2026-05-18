"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { usePatientById } from "@/lib/api";
import { usePatientStore } from "@/store/usePatientStore";
import { useAuth } from "@/context/authContext";
import StatusBadge from "@/components/statusBadge";

interface PageProps {
  params: Promise<{ id: string }>;
}

const avatarGradients = [
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-rose-400 to-rose-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-cyan-400 to-cyan-600",
  "from-indigo-400 to-indigo-600",
  "from-pink-400 to-pink-600",
];

function getAvatarGradient(name: string) {
  return avatarGradients[name.charCodeAt(0) % avatarGradients.length];
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function PatientDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();

  const { data: patient, isLoading, error } = usePatientById(id);
  const { dischargePatient, patients } = usePatientStore();

  const livePatient = patients.find((p) => p.id === id) ?? patient;
  const isAlreadyDischarged = livePatient?.status === "discharged";

  if (isLoading) return <PatientDetailSkeleton />;

  if (error || !livePatient) return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p className="text-base font-semibold text-slate-700">Patient not found</p>
      <p className="text-sm text-slate-400 mt-1">This patient record may have been removed.</p>
      <button type="button" onClick={() => router.back()} className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
        ← Go back
      </button>
    </main>
  );

  const infoRows = [
    { label: "Patient ID",       value: livePatient.id,           icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg> },
    { label: "Age",              value: `${livePatient.age} years`, icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { label: "Gender",           value: livePatient.gender,        icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
    { label: "Ward",             value: livePatient.ward,          icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
    { label: "Bed number",       value: livePatient.bedNumber,     icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { label: "Attending doctor", value: livePatient.doctor,        icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { label: "Date admitted",    value: livePatient.admittedDate,  icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { label: "Reviewed by",      value: user.name,                 icon: <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
  ];

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5 animate-fade-up">

      {/* Back */}
      <button
        type="button"
        onClick={() => router.back()}
        className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
      >
        <svg className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Patient card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl ring-1 ring-slate-100 dark:ring-slate-700 shadow-xs overflow-hidden">

        {/* Coloured header band */}
        <div className={`h-1.5 w-full ${
          livePatient.status === "critical"    ? "bg-red-400"    :
          livePatient.status === "admitted"    ? "bg-blue-400"   :
          livePatient.status === "observation" ? "bg-amber-400"  : "bg-slate-200"
        }`} />

        <div className="p-5 sm:p-7">
          {/* Identity row */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getAvatarGradient(livePatient.name)} flex items-center justify-center shrink-0 shadow-sm`}>
                <span className="text-xl font-bold text-white">{getInitials(livePatient.name)}</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{livePatient.name}</h1>
                <p className="text-sm text-slate-400 mt-0.5">{livePatient.id}</p>
              </div>
            </div>
            <StatusBadge status={livePatient.status} />
          </div>

          {/* Condition */}
          <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-4 mb-6">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Condition</p>
            <p className="text-slate-700 dark:text-slate-200 font-medium text-sm leading-relaxed">{livePatient.condition}</p>
          </div>

          {/* Info rows */}
          <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
            {infoRows.map(({ label, value, icon }) => (
              <div key={label} className="flex items-center justify-between py-2.5">
                <span className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-slate-300 dark:text-slate-600">{icon}</span>
                  {label}
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 capitalize">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => router.push("/patients")}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.97] transition-all"
        >
          All patients
        </button>
        <button
          type="button"
          onClick={() => dischargePatient(id)}
          disabled={isAlreadyDischarged}
          className={`text-sm font-semibold py-3 rounded-2xl transition-all ${
            isAlreadyDischarged
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-sm"
          }`}
        >
          {isAlreadyDischarged ? "Already discharged" : "Discharge patient"}
        </button>
      </div>

      {isAlreadyDischarged && (
        <p className="text-center text-xs text-slate-400">
          Status updated globally — visible on the dashboard and patient list
        </p>
      )}

    </main>
  );
}

function PatientDetailSkeleton() {
  const pulse = "animate-pulse bg-slate-100 rounded-lg";
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
      <div className={`h-4 w-14 ${pulse}`} />
      <div className="bg-white rounded-3xl ring-1 ring-slate-100 overflow-hidden">
        <div className="h-1.5 w-full bg-slate-100 animate-pulse" />
        <div className="p-7 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 animate-pulse" />
            <div className="space-y-2">
              <div className={`h-5 w-40 ${pulse}`} />
              <div className={`h-3 w-24 ${pulse}`} />
            </div>
          </div>
          <div className={`h-16 rounded-2xl ${pulse}`} />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex justify-between py-2.5 border-b border-slate-50">
              <div className={`h-3 w-28 ${pulse}`} />
              <div className={`h-3 w-20 ${pulse}`} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

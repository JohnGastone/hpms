"use client";

import { useState } from "react";
import Link from "next/link";
import { Patient, PatientStatus, Ward } from "@/lib/types";
import PatientCard from "./patientCard";

interface PatientListProps {
  patients: Patient[];
  onPatientClick?: (patient: Patient) => void;
}

const ALL_STATUSES: PatientStatus[] = ["admitted", "critical", "observation", "discharged"];
const ALL_WARDS: Ward[] = ["cardiology", "neurology", "pediatrics", "orthopedics", "emergency", "general"];

const activeStatusClasses: Record<PatientStatus, string> = {
  admitted:    "bg-blue-600 text-white border-blue-600",
  critical:    "bg-red-600 text-white border-red-600",
  observation: "bg-amber-500 text-white border-amber-500",
  discharged:  "bg-slate-700 text-white border-slate-700",
};

const inactiveChip = "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-700 dark:hover:text-slate-200";
const activeAll    = "bg-slate-900 text-white border-slate-900";

export default function PatientList({ patients, onPatientClick }: PatientListProps) {
  const [query, setQuery]             = useState("");
  const [activeStatus, setStatus]     = useState<PatientStatus | "all">("all");
  const [activeWard, setWard]         = useState<Ward | "all">("all");

  const filtered = patients.filter((p) => {
    const q = query.toLowerCase();
    const matchSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q) ||
      p.doctor.toLowerCase().includes(q);
    return matchSearch &&
      (activeStatus === "all" || p.status === activeStatus) &&
      (activeWard   === "all" || p.ward   === activeWard);
  });

  const chip = (label: string, active: boolean, activeClass: string, onClick: () => void) => (
    <button
      key={label}
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all active:scale-[0.93] ${
        active ? activeClass : inactiveChip
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, ID, or doctor…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-300 dark:focus:border-blue-600 transition-all shadow-xs"
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center transition-colors"
          >
            <svg className="w-2.5 h-2.5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Status filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {chip("All", activeStatus === "all", activeAll, () => setStatus("all"))}
        {ALL_STATUSES.map((s) =>
          chip(s, activeStatus === s, activeStatusClasses[s], () => setStatus(s))
        )}
      </div>

      {/* Ward filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {chip("All wards", activeWard === "all", activeAll, () => setWard("all"))}
        {ALL_WARDS.map((w) =>
          chip(w, activeWard === w, activeAll, () => setWard(w))
        )}
      </div>

      {/* Result count */}
      <p className="text-xs text-slate-400 font-medium">
        {filtered.length === patients.length
          ? `${patients.length} patients`
          : `${filtered.length} of ${patients.length} patients`}
      </p>

      {/* List or empty */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No matching patients</p>
          <p className="text-xs text-slate-400 mt-1">Try a different name or clear the filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((patient) => (
            <Link key={patient.id} href={`/patients/${patient.id}`} className="no-underline">
              <PatientCard patient={patient} onClick={onPatientClick} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

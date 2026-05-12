"use client";

import { useState } from "react";
import { Patient, PatientStatus, Ward } from "@/lib/types";
import PatientCard from "./patientCard";

interface PatientListProps {
  patients: Patient[];
  onPatientClick?: (patient: Patient) => void;
}

// Flutter parallel:
// "use client" tells Next.js this component has interactivity (state).
// In Flutter, this would be a StatefulWidget.
//
// useState<string>("") === a State<String> field initialized to "".
// When you call setSearchQuery("..."), React re-renders this component
// exactly like calling setState(() { searchQuery = "..."; }) in Flutter.
//
// The filtered list is derived on every render — same as computing
// a filtered list inside build() in Flutter. No need for a separate
// state variable; just derive it.

const ALL_STATUSES: PatientStatus[] = ["admitted", "critical", "observation", "discharged"];
const ALL_WARDS: Ward[] = ["cardiology", "neurology", "pediatrics", "orthopedics", "emergency", "general"];

export default function PatientList({ patients, onPatientClick }: PatientListProps) {
  // useState — Flutter: String searchQuery = ""; inside your State class
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeStatus, setActiveStatus] = useState<PatientStatus | "all">("all");
  const [activeWard, setActiveWard] = useState<Ward | "all">("all");

  // Derived filtered list — recomputed on every render when state changes
  // Flutter: final filtered = patients.where((p) => p.name.contains(query)).toList()
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeStatus === "all" || p.status === activeStatus;
    const matchesWard = activeWard === "all" || p.ward === activeWard;
    return matchesSearch && matchesStatus && matchesWard;
  });

  return (
    <div className="space-y-5">
      {/* Search input — onChange is Flutter's onChanged on a TextField */}
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, ID, or doctor..."
          value={searchQuery}
          // onChange fires on every keystroke — sets state — triggers re-render
          // Flutter: onChanged: (val) => setState(() => searchQuery = val)
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filter chips row */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveStatus("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeStatus === "all"
              ? "bg-slate-800 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          All status
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setActiveStatus(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              activeStatus === s
                ? "bg-slate-800 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActiveWard("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeWard === "all"
              ? "bg-slate-800 text-white"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          All wards
        </button>
        {ALL_WARDS.map((w) => (
          <button
            key={w}
            onClick={() => setActiveWard(w)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              activeWard === w
                ? "bg-slate-800 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Result count */}
      <p className="text-xs text-slate-400 font-medium">
        {filteredPatients.length} of {patients.length} patients
      </p>

      {/* Conditional rendering — Flutter: filteredPatients.isEmpty ? EmptyWidget() : ListView */}
      {filteredPatients.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No patients match your search</p>
          <p className="text-sm mt-1">Try a different name or clear the filters</p>
        </div>
      ) : (
        // Grid of PatientCard components — Flutter: GridView.builder
        // Each card receives a patient object (props) — like passing data to a widget
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.map((patient) => (
            // key prop — Flutter: ValueKey(patient.id)
            <PatientCard
              key={patient.id}
              patient={patient}
              onClick={onPatientClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
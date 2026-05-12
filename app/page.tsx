"use client";

import { useState } from "react";
import { mockPatients } from "@/lib/mockData";
import { Patient } from "@/lib/types";
import StatsBar from "@/components/statsBar";
import PatientList from "@/components/patientList";

export default function PatientsPage() {
  const [patients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800">MediTrack</h1>
              <p className="text-xs text-slate-400">Patient Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              Ward: <span className="font-medium text-slate-700">All</span>
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-xs font-semibold text-blue-700">DR</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Patients</h2>
          <p className="text-slate-500 text-sm mt-1">
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <StatsBar patients={patients} />

        <PatientList
          patients={patients}
          onPatientClick={(p) => setSelectedPatient(p)}
        />
      </main>

      {selectedPatient && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPatient(null)}
        >
          <div
            className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 text-lg">Patient Detail</h3>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                  <span className="font-bold text-blue-700 text-lg">
                    {selectedPatient.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{selectedPatient.name}</p>
                  <p className="text-sm text-slate-400">{selectedPatient.id}</p>
                </div>
              </div>

              {[
                ["Age", `${selectedPatient.age} years`],
                ["Gender", selectedPatient.gender],
                ["Ward", selectedPatient.ward],
                ["Bed", selectedPatient.bedNumber],
                ["Doctor", selectedPatient.doctor],
                ["Condition", selectedPatient.condition],
                ["Admitted", selectedPatient.admittedDate],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm border-b border-slate-50 pb-2">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-slate-700 font-medium capitalize">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
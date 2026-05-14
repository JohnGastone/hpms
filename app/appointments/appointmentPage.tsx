"use client";

// Flutter parallel:
// The key lesson here is useEffect with a dependency — [dateFilter].
// When the user changes the date filter, the effect re-runs and refetches.
// In Flutter this is like calling setState() which triggers didUpdateWidget(),
// which then calls fetchAppointments() again.

import { useState, useEffect } from "react";
import { fetchAppointments } from "@/lib/api";

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

const STATUS_STYLES: Record<string, string> = {
  scheduled:    "bg-blue-50 text-blue-700",
  "in-progress": "bg-amber-50 text-amber-700",
  completed:    "bg-green-50 text-green-700",
  cancelled:    "bg-slate-100 text-slate-500",
};

// Available filter dates — in a real app this would come from the API
const DATE_OPTIONS = [
  { label: "Today",     value: "2025-05-13" },
  { label: "Tomorrow",  value: "2025-05-14" },
  { label: "May 15",    value: "2025-05-15" },
  { label: "All",       value: "all"        },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [fetchedFor, setFetchedFor]     = useState<string | null>(null);
  const [dateFilter, setDateFilter]     = useState("2025-05-13"); // today

  // loading is derived — true whenever the fetched data doesn't match the
  // current filter, so no synchronous setState is needed inside the effect.
  const loading = fetchedFor !== dateFilter;

  // useEffect with [dateFilter] dependency:
  // Re-runs every time dateFilter changes — like didUpdateWidget() in Flutter.
  // Flutter equivalent:
  //   void didUpdateWidget(Widget old) {
  //     if (old.dateFilter != widget.dateFilter) fetchAppointments();
  //   }
  useEffect(() => {
    let cancelled = false;

    fetchAppointments()
      .then((data) => {
        if (cancelled) return;
        const filtered = dateFilter === "all"
          ? data
          : data.filter((a) => a.date === dateFilter);
        setAppointments(filtered);
        setFetchedFor(dateFilter);
      });

    return () => { cancelled = true; };
  }, [dateFilter]); // ← this is the key: re-run when dateFilter changes

  return (
    <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Appointments</h2>
        <p className="text-slate-500 text-sm mt-1">
          {loading ? "Loading..." : `${appointments.length} appointments`}
        </p>
      </div>

      {/* Date filter — changing this triggers a re-fetch via useEffect */}
      <div className="flex gap-2 flex-wrap">
        {DATE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setDateFilter(opt.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              dateFilter === opt.value
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Appointment list */}
      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-36 bg-slate-200 rounded" />
                  <div className="h-3 w-24 bg-slate-100 rounded" />
                </div>
                <div className="h-6 w-20 bg-slate-100 rounded-full" />
              </div>
            </div>
          ))
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
            <p className="text-3xl mb-3">📅</p>
            <p className="text-slate-500 font-medium">No appointments for this date</p>
          </div>
        ) : (
          appointments.map((appt) => (
            <div key={appt.id} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Time block */}
                  <div className="text-center min-w-[52px]">
                    <p className="text-lg font-bold text-slate-800">{appt.time}</p>
                    <p className="text-xs text-slate-400">{appt.date.slice(5)}</p>
                  </div>
                  <div className="w-px h-10 bg-slate-100" />
                  {/* Patient + doctor info */}
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{appt.patientName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{appt.doctor} · {appt.type}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize flex-shrink-0 ${STATUS_STYLES[appt.status] ?? "bg-slate-100 text-slate-500"}`}>
                  {appt.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
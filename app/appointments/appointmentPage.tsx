"use client";

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

const STATUS_CONFIG: Record<string, { label: string; dot: string; classes: string }> = {
  scheduled:    { label: "Scheduled",    dot: "bg-blue-500",   classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/60"   },
  "in-progress":{ label: "In progress",  dot: "bg-amber-500",  classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60" },
  completed:    { label: "Completed",    dot: "bg-emerald-500",classes: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60" },
  cancelled:    { label: "Cancelled",    dot: "bg-slate-300",  classes: "bg-slate-50 text-slate-500 ring-1 ring-slate-200/60" },
};

const TYPE_ACCENT: Record<string, string> = {
  "Emergency":    "border-l-red-400",
  "Follow-up":    "border-l-blue-400",
  "Consultation": "border-l-violet-400",
  "Check-up":     "border-l-teal-400",
  "Post-op":      "border-l-amber-400",
};

const DATE_TABS = [
  { label: "Today",    value: "2025-05-13" },
  { label: "Tomorrow", value: "2025-05-14" },
  { label: "May 15",   value: "2025-05-15" },
  { label: "All",      value: "all"        },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [fetchedFor, setFetchedFor]     = useState<string | null>(null);
  const [dateFilter, setDateFilter]     = useState("2025-05-13");

  const loading = fetchedFor !== dateFilter;

  useEffect(() => {
    let cancelled = false;
    fetchAppointments().then((data) => {
      if (cancelled) return;
      const filtered = dateFilter === "all" ? data : data.filter((a) => a.date === dateFilter);
      setAppointments(filtered);
      setFetchedFor(dateFilter);
    });
    return () => { cancelled = true; };
  }, [dateFilter]);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-fade-up">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Appointments</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {loading ? "Loading…" : `${appointments.length} appointment${appointments.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Tab filter */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 pb-0.5">
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit min-w-max">
        {DATE_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setDateFilter(tab.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all active:scale-[0.94] ${
              dateFilter === tab.value
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl ring-1 ring-slate-100 p-5 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-slate-100 rounded" />
                  <div className="space-y-2">
                    <div className="h-3.5 w-36 bg-slate-100 rounded" />
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="h-6 w-20 bg-slate-100 rounded-full" />
              </div>
            </div>
          ))
        ) : appointments.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl ring-1 ring-slate-100 dark:ring-slate-700 p-14 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-slate-700">No appointments</p>
            <p className="text-xs text-slate-400 mt-1">Nothing scheduled for this date</p>
          </div>
        ) : (
          appointments.map((appt) => {
            const statusCfg = STATUS_CONFIG[appt.status] ?? STATUS_CONFIG.scheduled;
            return (
              <div
                key={appt.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl ring-1 ring-slate-100 dark:ring-slate-700 border-l-4 ${TYPE_ACCENT[appt.type] ?? "border-l-slate-200"} p-5 hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Time */}
                    <div className="text-center shrink-0 w-14">
                      <p className="text-base font-bold text-slate-900 dark:text-white leading-tight">{appt.time}</p>
                      <p className="text-[11px] text-slate-400 leading-tight">{appt.date.slice(5).replace("-", "/")}</p>
                    </div>
                    <div className="w-px h-8 bg-slate-100 dark:bg-slate-700 shrink-0" />
                    {/* Patient info */}
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">{appt.patientName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{appt.doctor} · <span className="text-slate-500">{appt.type}</span></p>
                    </div>
                  </div>
                  {/* Status badge */}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${statusCfg.classes}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusCfg.dot} ${appt.status === "in-progress" ? "animate-pulse" : ""}`} />
                    {statusCfg.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}

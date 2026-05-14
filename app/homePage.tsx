"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDashboardStats, usePatients } from "@/lib/api";
import { usePatientStore } from "@/store/usePatientStore";
import { useAuth } from "@/context/authContext";
import PatientCard from "@/components/patientCard";
import { DashboardStatSkeleton, PatientCardSkeleton } from "@/components/skeletons";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats();
  const { data: fetchedPatients, isLoading: patientsLoading } = usePatients();
  const { patients, setPatients } = usePatientStore();

  useEffect(() => {
    if (fetchedPatients) setPatients(fetchedPatients);
  }, [fetchedPatients, setPatients]);

  const criticalPatients = patients.filter((p) => p.status === "critical");

  const statCards = stats ? [
    {
      label: "Total patients",
      value: stats.totalPatients,
      valueColor: "text-slate-900",
      iconBg: "bg-slate-100",
      icon: <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    },
    {
      label: "Admitted",
      value: stats.admitted,
      valueColor: "text-blue-700",
      iconBg: "bg-blue-50",
      icon: <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    },
    {
      label: "Critical",
      value: stats.critical,
      valueColor: "text-red-700",
      iconBg: "bg-red-50",
      icon: <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    },
    {
      label: "Observation",
      value: stats.observation,
      valueColor: "text-amber-700",
      iconBg: "bg-amber-50",
      icon: <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    },
    {
      label: "Beds occupied",
      value: `${stats.bedsOccupied}/${stats.totalBeds}`,
      valueColor: "text-teal-700",
      iconBg: "bg-teal-50",
      icon: <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
    },
  ] : [];

  const quickActions = [
    {
      href: "/patients/new",
      label: "Register patient",
      desc: "Admit a new patient to the system",
      iconBg: "bg-blue-50",
      icon: <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
    },
    {
      href: "/appointments",
      label: "Appointments",
      desc: "Manage today's schedule",
      iconBg: "bg-violet-50",
      icon: <svg className="w-5 h-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    },
    {
      href: "/wards",
      label: "Ward overview",
      desc: "Check bed availability by ward",
      iconBg: "bg-teal-50",
      icon: <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fade-up">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Good morning, {user.name.replace("Dr. ", "Dr ")}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5" suppressHydrationWarning>
            {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <Link
          href="/patients/new"
          className="hidden sm:inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-sm no-underline shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
          New patient
        </Link>
      </div>

      {/* Stats */}
      <section>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Today&apos;s overview</p>
        {statsError ? (
          <div className="bg-red-50 text-red-700 rounded-2xl p-4 text-sm ring-1 ring-red-100">
            Failed to load stats.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {statsLoading
              ? Array.from({ length: 5 }).map((_, i) => <DashboardStatSkeleton key={i} />)
              : statCards.map((card, i) => (
                  <div key={card.label} className={`bg-white rounded-2xl p-4 ring-1 ring-slate-100 shadow-xs animate-fade-up anim-delay-${i} hover:shadow-md hover:ring-slate-200 transition-all`}>
                    <div className={`inline-flex p-2 rounded-lg ${card.iconBg} mb-3`}>{card.icon}</div>
                    <p className={`text-2xl font-bold tracking-tight ${card.valueColor}`}>{card.value}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5 leading-tight">{card.label}</p>
                  </div>
                ))}
          </div>
        )}
      </section>

      {/* Critical patients */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Critical patients</p>
            {criticalPatients.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none">
                {criticalPatients.length}
              </span>
            )}
          </div>
          <Link href="/patients" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors no-underline">
            View all →
          </Link>
        </div>

        {patientsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 2 }).map((_, i) => <PatientCardSkeleton key={i} />)}
          </div>
        ) : criticalPatients.length === 0 ? (
          <div className="bg-white rounded-2xl ring-1 ring-slate-100 shadow-xs p-8 text-center">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            </div>
            <p className="text-sm font-semibold text-slate-700">No critical patients</p>
            <p className="text-xs text-slate-400 mt-1">All patients are stable right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {criticalPatients.map((p) => (
              <Link key={p.id} href={`/patients/${p.id}`} className="no-underline">
                <PatientCard patient={p} />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Quick actions */}
      <section>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Quick actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group bg-white rounded-2xl ring-1 ring-slate-100 shadow-xs p-5 hover:ring-slate-200 hover:shadow-md transition-all no-underline"
            >
              <div className={`inline-flex p-2.5 rounded-xl ${item.iconBg} mb-3 group-hover:scale-110 transition-transform duration-200`}>
                {item.icon}
              </div>
              <p className="font-semibold text-slate-800 text-sm">{item.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}

import { Patient, PatientStatus } from "@/lib/types";

interface StatsBarProps {
  patients: Patient[];
}

interface StatItem {
  label: string;
  count: number;
  color: string;
  bgColor: string;
}

// Flutter parallel:
// This component receives a list (like a List<Patient> in Dart) as a prop
// and computes derived values from it — like using .where() in Dart.
// In Flutter you'd do this inside build() or a helper method.
// Here we derive stats directly from the prop before returning JSX.

export default function StatsBar({ patients }: StatsBarProps) {
  // Derived counts — computed from props, no extra state needed
  // Flutter: List<Patient> admitted = patients.where((p) => p.status == 'admitted').toList()
  const countByStatus = (status: PatientStatus) =>
    patients.filter((p) => p.status === status).length;

  const stats: StatItem[] = [
    {
      label: "Total",
      count: patients.length,
      color: "text-slate-700",
      bgColor: "bg-slate-100",
    },
    {
      label: "Admitted",
      count: countByStatus("admitted"),
      color: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      label: "Critical",
      count: countByStatus("critical"),
      color: "text-red-700",
      bgColor: "bg-red-50",
    },
    {
      label: "Observation",
      count: countByStatus("observation"),
      color: "text-amber-700",
      bgColor: "bg-amber-50",
    },
    {
      label: "Discharged",
      count: countByStatus("discharged"),
      color: "text-slate-500",
      bgColor: "bg-slate-50",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {/* 
        .map() with a key — Flutter equivalent: ListView.builder with itemBuilder.
        The 'key' prop is like Flutter's ValueKey — helps React track list items.
      */}
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`${stat.bgColor} rounded-2xl p-4 text-center`}
        >
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
          <p className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
import { Patient, PatientStatus } from "@/lib/types";

interface StatsBarProps {
  patients: Patient[];
}

const statDefs: Array<{ status: PatientStatus | null; label: string; color: string; bg: string }> = [
  { status: null,          label: "Total",       color: "text-slate-900",  bg: "bg-white"     },
  { status: "admitted",    label: "Admitted",    color: "text-blue-700",   bg: "bg-blue-50"   },
  { status: "critical",    label: "Critical",    color: "text-red-700",    bg: "bg-red-50"    },
  { status: "observation", label: "Observation", color: "text-amber-700",  bg: "bg-amber-50"  },
  { status: "discharged",  label: "Discharged",  color: "text-slate-500",  bg: "bg-slate-50"  },
];

export default function StatsBar({ patients }: StatsBarProps) {
  const count = (s: PatientStatus) => patients.filter((p) => p.status === s).length;

  return (
    <div className="grid grid-cols-5 gap-3">
      {statDefs.map(({ status, label, color, bg }) => (
        <div key={label} className={`${bg} dark:bg-slate-800 rounded-2xl p-4 text-center ring-1 ring-black/5 dark:ring-slate-700`}>
          <p className={`text-2xl font-bold tracking-tight ${color}`}>
            {status ? count(status) : patients.length}
          </p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

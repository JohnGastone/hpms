import { PatientStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: PatientStatus;
}

const statusConfig: Record<PatientStatus, { label: string; dot: string; classes: string }> = {
  admitted:    { label: "Admitted",    dot: "bg-blue-500",  classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/60"    },
  critical:    { label: "Critical",    dot: "bg-red-500",   classes: "bg-red-50 text-red-700 ring-1 ring-red-200/60"       },
  observation: { label: "Observation", dot: "bg-amber-500", classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/60" },
  discharged:  { label: "Discharged",  dot: "bg-slate-300", classes: "bg-slate-50 text-slate-500 ring-1 ring-slate-200/60" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { label, dot, classes } = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot} ${status === "critical" ? "animate-pulse" : ""}`} />
      {label}
    </span>
  );
}

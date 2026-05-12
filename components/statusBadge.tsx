import { PatientStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: PatientStatus;
}

const statusConfig: Record<PatientStatus, { label: string; classes: string }> = {
  admitted: {
    label: "Admitted",
    classes: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  },
  critical: {
    label: "Critical",
    classes: "bg-red-50 text-red-700 ring-1 ring-red-200 animate-pulse",
  },
  discharged: {
    label: "Discharged",
    classes: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  },
  observation: {
    label: "Observation",
    classes: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
};

// Flutter parallel:
// This is like a StatelessWidget that takes a 'status' parameter (prop)
// and returns different decoration/colors based on it — same as a 
// conditional Container with BoxDecoration in your build() method.

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}
    >
      {status === "critical" && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
      )}
      {config.label}
    </span>
  );
}
import { Patient } from "@/lib/types";
import StatusBadge from "./statusBadge";

interface PatientCardProps {
  patient: Patient;
  onClick?: (patient: Patient) => void;
}

const wardColors: Record<string, string> = {
  cardiology:  "bg-rose-50 text-rose-600",
  neurology:   "bg-purple-50 text-purple-600",
  pediatrics:  "bg-sky-50 text-sky-600",
  orthopedics: "bg-orange-50 text-orange-600",
  emergency:   "bg-red-50 text-red-600",
  general:     "bg-teal-50 text-teal-600",
};

const statusAccent: Record<string, string> = {
  admitted:    "border-l-blue-400",
  critical:    "border-l-red-400",
  observation: "border-l-amber-400",
  discharged:  "border-l-slate-200",
};

const avatarGradients = [
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-rose-400 to-rose-600",
  "from-emerald-400 to-emerald-600",
  "from-amber-400 to-amber-600",
  "from-cyan-400 to-cyan-600",
  "from-indigo-400 to-indigo-600",
  "from-pink-400 to-pink-600",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function getAvatarGradient(name: string) {
  return avatarGradients[name.charCodeAt(0) % avatarGradients.length];
}

export default function PatientCard({ patient, onClick }: PatientCardProps) {
  return (
    <div
      onClick={() => onClick?.(patient)}
      className={`bg-white rounded-2xl ring-1 ring-slate-100 border-l-4 ${statusAccent[patient.status] ?? "border-l-slate-200"}
        p-5 transition-all duration-200 hover:shadow-md hover:ring-slate-200 hover:-translate-y-1 active:scale-[0.98] active:shadow-none
        ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(patient.name)} flex items-center justify-center shrink-0 shadow-sm`}>
            <span className="text-xs font-bold text-white">{getInitials(patient.name)}</span>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 text-sm leading-tight truncate">{patient.name}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{patient.age}y · {patient.gender} · {patient.id}</p>
          </div>
        </div>
        <StatusBadge status={patient.status} />
      </div>

      <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 leading-relaxed mb-3 line-clamp-2">
        {patient.condition}
      </p>

      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize ${wardColors[patient.ward] ?? "bg-slate-100 text-slate-600"}`}>
          {patient.ward}
        </span>
        <div className="text-right">
          <p className="text-[11px] text-slate-400 leading-tight">{patient.doctor}</p>
          <p className="text-[11px] font-semibold text-slate-600 leading-tight">Bed {patient.bedNumber}</p>
        </div>
      </div>
    </div>
  );
}

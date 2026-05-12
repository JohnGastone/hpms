import { Patient } from "@/lib/types";
import StatusBadge from "./statusBadge";

interface PatientCardProps {
  patient: Patient;
  onClick?: (patient: Patient) => void;
}

const wardColors: Record<string, string> = {
  cardiology: "bg-rose-100 text-rose-700",
  neurology: "bg-purple-100 text-purple-700",
  pediatrics: "bg-sky-100 text-sky-700",
  orthopedics: "bg-orange-100 text-orange-700",
  emergency: "bg-red-100 text-red-700",
  general: "bg-teal-100 text-teal-700",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Flutter parallel:
// This is your custom StatelessWidget. 
// 'patient' and 'onClick' are constructor parameters — exactly like
// passing values to a widget via its constructor in Flutter.
// The return JSX is your build() method returning a widget tree.
// Composition: PatientCard uses StatusBadge inside it — 
// same as nesting custom widgets inside each other.

export default function PatientCard({ patient, onClick }: PatientCardProps) {
  return (
    <div
      onClick={() => onClick?.(patient)}
      className={`
        bg-white rounded-2xl border border-slate-100 p-5 
        transition-all duration-200 
        hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5
        ${onClick ? "cursor-pointer" : ""}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar — like a CircleAvatar in Flutter */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-slate-600">
              {getInitials(patient.name)}
            </span>
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm leading-tight">
              {patient.name}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {patient.age} yrs · {patient.gender} · {patient.id}
            </p>
          </div>
        </div>
        {/* StatusBadge is a child component — like a child widget */}
        <StatusBadge status={patient.status} />
      </div>

      <div className="space-y-2">
        <p className="text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 leading-relaxed">
          {patient.condition}
        </p>

        <div className="flex items-center justify-between pt-1">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-md capitalize ${wardColors[patient.ward] ?? "bg-slate-100 text-slate-600"}`}
          >
            {patient.ward}
          </span>
          <div className="text-right">
            <p className="text-xs text-slate-400">{patient.doctor}</p>
            <p className="text-xs font-medium text-slate-600">
              Bed {patient.bedNumber}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePatientStore } from "@/store/usePatientStore";
import { useAuth } from "@/context/authContext";
import { Patient, Ward } from "@/lib/types";

const patientSchema = z.object({
  name:      z.string().min(2, "Name must be at least 2 characters"),
  age:       z.number({ error: "Age must be a number" }).min(0, "Age must be positive").max(150, "Invalid age"),
  gender:    z.enum(["male", "female", "other"], { message: "Select a gender" }),
  ward:      z.enum(["cardiology","neurology","pediatrics","orthopedics","emergency","general"], { message: "Select a ward" }),
  condition: z.string().min(3, "Describe the condition"),
  doctor:    z.string().min(2, "Doctor name required"),
  bedNumber: z.string().min(1, "Bed number required"),
});

type PatientFormData = z.infer<typeof patientSchema>;

const WARDS: Ward[] = ["cardiology","neurology","pediatrics","orthopedics","emergency","general"];

export default function RegisterPatientPage() {
  const router = useRouter();
  const { addPatient } = usePatientStore();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = async (data: PatientFormData) => {
    await new Promise((r) => setTimeout(r, 800));
    const newPatient: Patient = {
      id:           `P-${crypto.randomUUID().slice(0, 8)}`,
      name:         data.name,
      age:          data.age,
      gender:       data.gender,
      ward:         data.ward,
      condition:    data.condition,
      doctor:       `Dr. ${data.doctor}`,
      bedNumber:    data.bedNumber,
      status:       "admitted",
      admittedDate: new Date().toISOString().split("T")[0],
    };
    addPatient(newPatient);
    router.push("/patients");
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-8 space-y-6 animate-fade-up">

      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-4"
        >
          <svg className="w-4 h-4 transition-transform duration-150 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Register patient</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Admitting as <span className="font-medium text-slate-700">{user.name}</span> · {user.ward}
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white rounded-3xl ring-1 ring-slate-100 shadow-xs p-7">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">Patient information</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <Field label="Full name" error={errors.name?.message}>
            <input {...register("name")} placeholder="e.g. Amina Hassan" className={input(!!errors.name)} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Age" error={errors.age?.message}>
              <input type="number" {...register("age", { valueAsNumber: true })} placeholder="34" className={input(!!errors.age)} />
            </Field>
            <Field label="Gender" error={errors.gender?.message}>
              <select {...register("gender")} className={input(!!errors.gender)}>
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Ward" error={errors.ward?.message}>
              <select {...register("ward")} className={input(!!errors.ward)}>
                <option value="">Select ward</option>
                {WARDS.map((w) => <option key={w} value={w} className="capitalize">{w}</option>)}
              </select>
            </Field>
            <Field label="Bed number" error={errors.bedNumber?.message}>
              <input {...register("bedNumber")} placeholder="e.g. C-04" className={input(!!errors.bedNumber)} />
            </Field>
          </div>

          <Field label="Condition / diagnosis" error={errors.condition?.message}>
            <textarea {...register("condition")} placeholder="e.g. Hypertensive crisis" rows={3} className={input(!!errors.condition)} />
          </Field>

          <Field label="Attending doctor (surname)" error={errors.doctor?.message}>
            <input {...register("doctor")} placeholder="e.g. Okello" className={input(!!errors.doctor)} />
          </Field>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Registering…
                </>
              ) : (
                "Register patient"
              )}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

function input(hasError: boolean) {
  return [
    "w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-slate-800 placeholder-slate-400",
    "focus:outline-none focus:ring-2 focus:border-transparent transition-all",
    hasError
      ? "border-red-300 focus:ring-red-100"
      : "border-slate-200 focus:ring-blue-100 hover:border-slate-300",
  ].join(" ");
}

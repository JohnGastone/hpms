"use client";

// Flutter parallel:
// React Hook Form = TextEditingController + FormKey + validator all in one.
// Zod = a type-safe schema validator — like adding validate: (val) => ... to
// each TextFormField, but defined once as a schema object and reused everywhere.
//
// Flutter FormKey approach:
//   final _formKey = GlobalKey<FormState>();
//   TextEditingController _nameController = TextEditingController();
//   _formKey.currentState!.validate()
//
// React Hook Form + Zod approach:
//   const schema = z.object({ name: z.string().min(2) })
//   const { register, handleSubmit, formState } = useForm({ resolver: zodResolver(schema) })
//   <input {...register("name")} />
//
// The key difference: React Hook Form tracks ALL form state (values, errors,
// touched fields, dirty state) — you just register inputs and it handles the rest.
// No controller per field, no manual validation calls.

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePatientStore } from "@/store/usePatientStore";
import { useAuth } from "@/context/authContext";
import { Patient, Ward } from "@/lib/types";

// Zod schema — the single source of truth for validation rules
// Flutter: each field's validator: (val) => val!.isEmpty ? 'Required' : null
const patientSchema = z.object({
  name:      z.string().min(2, "Name must be at least 2 characters"),
  age:       z.number({ error: "Age must be a number" }).min(0, "Age must be positive").max(150, "Invalid age"),
  gender:    z.enum(["male", "female", "other"], { message: "Select a gender" }),
  ward:      z.enum(["cardiology","neurology","pediatrics","orthopedics","emergency","general"], { message: "Select a ward" }),
  condition: z.string().min(3, "Describe the condition"),
  doctor:    z.string().min(2, "Doctor name required"),
  bedNumber: z.string().min(1, "Bed number required"),
});

// Infer TypeScript type from schema — no need to declare it twice
type PatientFormData = z.infer<typeof patientSchema>;

const WARDS: Ward[] = ["cardiology","neurology","pediatrics","orthopedics","emergency","general"];

export default function RegisterPatientPage() {
  const router = useRouter();
  const { addPatient } = usePatientStore();
  const { user } = useAuth();

  // useForm — sets up the form with Zod as the validation resolver
  // Flutter: final _formKey = GlobalKey<FormState>()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  });

  const onSubmit = async (data: PatientFormData) => {
    // Simulate an API call
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

    // addPatient — Zustand store action, instantly visible on all pages
    // Flutter: ref.read(patientProvider.notifier).add(newPatient)
    addPatient(newPatient);

    // Navigate back to the patient list
    router.push("/patients");
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
      <div>
        <button onClick={() => router.back()} className="text-sm text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1">
          ← Back
        </button>
        <h2 className="text-2xl font-bold text-slate-800">Register patient</h2>
        <p className="text-slate-500 text-sm mt-1">Admitting as {user.name} · {user.ward}</p>
      </div>

      {/* handleSubmit validates first, then calls onSubmit */}
      {/* Flutter: Form(key: _formKey, child: Column(...)) */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Patient name */}
        <Field label="Full name" error={errors.name?.message}>
          <input
            {...register("name")}
            placeholder="e.g. Amina Hassan"
            className={inputClass(!!errors.name)}
          />
        </Field>

        {/* Age + Gender row */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Age" error={errors.age?.message}>
            <input
              type="number"
              {...register("age", { valueAsNumber: true })}
              placeholder="34"
              className={inputClass(!!errors.age)}
            />
          </Field>

          <Field label="Gender" error={errors.gender?.message}>
            <select {...register("gender")} className={inputClass(!!errors.gender)}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </Field>
        </div>

        {/* Ward + Bed row */}
        <div className="grid grid-cols-2 gap-4">
          <Field label="Ward" error={errors.ward?.message}>
            <select {...register("ward")} className={inputClass(!!errors.ward)}>
              <option value="">Select ward</option>
              {WARDS.map((w) => (
                <option key={w} value={w} className="capitalize">{w}</option>
              ))}
            </select>
          </Field>

          <Field label="Bed number" error={errors.bedNumber?.message}>
            <input
              {...register("bedNumber")}
              placeholder="e.g. C-04"
              className={inputClass(!!errors.bedNumber)}
            />
          </Field>
        </div>

        {/* Condition */}
        <Field label="Condition / diagnosis" error={errors.condition?.message}>
          <textarea
            {...register("condition")}
            placeholder="e.g. Hypertensive crisis"
            rows={3}
            className={inputClass(!!errors.condition)}
          />
        </Field>

        {/* Doctor */}
        <Field label="Attending doctor (surname)" error={errors.doctor?.message}>
          <input
            {...register("doctor")}
            placeholder="e.g. Okello"
            className={inputClass(!!errors.doctor)}
          />
        </Field>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Registering..." : "Register patient"}
        </button>
      </form>
    </main>
  );
}

// Reusable field wrapper — label + input slot + error message
// Flutter: Column(children: [Text(label), TextFormField(...), Text(error)])
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full px-4 py-2.5 bg-white border rounded-xl text-sm text-slate-700 placeholder-slate-400
    focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all
    ${hasError ? "border-red-300 focus:ring-red-100 focus:border-red-300" : "border-slate-200"}`;
}
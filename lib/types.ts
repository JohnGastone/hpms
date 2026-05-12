export type PatientStatus = "admitted" | "critical" | "discharged" | "observation";

export type Ward = "cardiology" | "neurology" | "pediatrics" | "orthopedics" | "emergency" | "general";

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  status: PatientStatus;
  ward: Ward;
  admittedDate: string;
  condition: string;
  doctor: string;
  bedNumber: string;
}
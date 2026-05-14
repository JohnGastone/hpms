import { Patient } from "./types";
import { mockPatients } from "./mockData";

// Flutter parallel:
// This file is your "repository" or "service" layer — like a PatientRepository
// class in Flutter that abstracts whether data comes from an API or local cache.
// On Day 3 this is where react-query hooks will live.

// Simulate real network latency so useEffect/loading states behave realistically
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Simulated API — returns mock data after a short delay.
// Swap these functions for real fetch() calls when you have a real backend.
// The components never need to change — only this file.

export async function fetchPatients(): Promise<Patient[]> {
  await delay(900);
  return mockPatients;
}

export async function fetchPatientById(id: string): Promise<Patient | null> {
  await delay(600);
  return mockPatients.find((p) => p.id === id) ?? null;
}

export async function fetchDashboardStats() {
  await delay(700);
  const patients = mockPatients;
  const byStatus = (s: string) => patients.filter((p) => p.status === s).length;

  return {
    totalPatients: patients.length,
    admitted: byStatus("admitted"),
    critical: byStatus("critical"),
    observation: byStatus("observation"),
    discharged: byStatus("discharged"),
    bedsOccupied: patients.filter((p) => p.status !== "discharged").length,
    totalBeds: 120,
  };
}

export async function fetchAppointments() {
  await delay(800);

  // Mock appointments — on Day 3 this comes from your real API
  return [
    { id: "A001", patientId: "P001", patientName: "Amina Hassan",   doctor: "Dr. Okello",   date: "2025-05-13", time: "09:00", type: "Follow-up",    status: "scheduled" },
    { id: "A002", patientId: "P002", patientName: "James Odhiambo", doctor: "Dr. Njeri",    date: "2025-05-13", time: "10:30", type: "Emergency",     status: "in-progress" },
    { id: "A003", patientId: "P003", patientName: "Fatuma Mbeki",   doctor: "Dr. Okello",   date: "2025-05-13", time: "11:00", type: "Consultation",  status: "scheduled" },
    { id: "A004", patientId: "P005", patientName: "Grace Mwangi",   doctor: "Dr. Njeri",    date: "2025-05-14", time: "08:30", type: "Check-up",      status: "scheduled" },
    { id: "A005", patientId: "P004", patientName: "Emmanuel Kariuki",doctor: "Dr. Abubakar",date: "2025-05-14", time: "14:00", type: "Post-op",       status: "scheduled" },
    { id: "A006", patientId: "P007", patientName: "Zawadi Kimani",  doctor: "Dr. Okello",   date: "2025-05-14", time: "15:30", type: "Consultation",  status: "scheduled" },
    { id: "A007", patientId: "P009", patientName: "Neema Juma",     doctor: "Dr. Abubakar", date: "2025-05-15", time: "09:30", type: "Follow-up",     status: "scheduled" },
    { id: "A008", patientId: "P008", patientName: "Peter Otieno",   doctor: "Dr. Njeri",    date: "2025-05-15", time: "11:00", type: "Emergency",     status: "scheduled" },
  ];
}
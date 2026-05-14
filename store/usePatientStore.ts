import { create } from "zustand";
import { Patient, PatientStatus } from "@/lib/types";

// Flutter parallel:
// This is your Riverpod StateNotifierProvider or a Bloc.
// The store lives OUTSIDE the component tree — any component
// anywhere in the app can read or write to it without prop drilling.
//
// In Flutter with Riverpod:
//   final patientProvider = StateNotifierProvider<PatientNotifier, List<Patient>>(...)
//   ref.read(patientProvider.notifier).discharge(id)
//
// In React with Zustand:
//   const { patients, dischargePatient } = usePatientStore()
//   dischargePatient(id)
//
// No context, no passing down through props, no BuildContext needed.
// Just call the hook anywhere — it always points to the same store.

interface PatientStore {
  // State — Flutter: the List<Patient> inside your StateNotifier
  patients: Patient[];
  isLoaded: boolean;

  // Actions — Flutter: methods on your StateNotifier
  setPatients: (patients: Patient[]) => void;
  dischargePatient: (id: string) => void;
  updatePatientStatus: (id: string, status: PatientStatus) => void;
  addPatient: (patient: Patient) => void;
}

// create() is Zustand's equivalent of StateNotifier
// set() is your setState — it merges new state with existing state
export const usePatientStore = create<PatientStore>((set) => ({
  // Initial state — Flutter: initialState in StateNotifier constructor
  patients: [],
  isLoaded: false,

  // setPatients — called once on app load (replaces useEffect local setState)
  // Flutter: void loadPatients(List<Patient> data) { state = data; }
  setPatients: (patients) => set({ patients, isLoaded: true }),

  // dischargePatient — updates one patient's status to "discharged"
  // Flutter: void discharge(String id) {
  //   state = [for (final p in state) if (p.id == id) p.copyWith(status: 'discharged') else p];
  // }
  dischargePatient: (id) =>
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, status: "discharged" as PatientStatus } : p
      ),
    })),

  // updatePatientStatus — generic status update used by ward actions
  updatePatientStatus: (id, status) =>
    set((state) => ({
      patients: state.patients.map((p) =>
        p.id === id ? { ...p, status } : p
      ),
    })),

  // addPatient — called after registering a new patient via the form
  // Flutter: void add(Patient p) { state = [...state, p]; }
  addPatient: (patient) =>
    set((state) => ({ patients: [patient, ...state.patients] })),
}));
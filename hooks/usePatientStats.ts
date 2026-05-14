// Custom hooks — the Day 3 bonus concept
//
// Flutter parallel:
// Custom hooks = extracting logic into a reusable class/mixin in Flutter.
// Instead of repeating loading/error/data logic across components,
// you extract it into a hook the same way you'd extract a helper method
// into a base class or a utility function.
//
// Flutter: abstract class PatientViewModel extends ChangeNotifier { ... }
// React:   function usePatientStats() { ... return { admitted, critical, ... } }
//
// The rule: if you find yourself writing the same useState/useEffect/filter
// logic in two components, extract it into a useXxx() custom hook.

import { useMemo } from "react";
import { usePatientStore } from "@/store/usePatientStore";
import { Ward } from "@/lib/types";

// usePatientStats — computes derived stats from the global store
// Any component that needs these numbers calls this one hook
export function usePatientStats() {
  const { patients } = usePatientStore();

  // useMemo — only recomputes when patients array changes
  // Flutter: recomputes inside build() when setState fires
  return useMemo(() => {
    const byStatus = (s: string) => patients.filter((p) => p.status === s).length;

    return {
      total:       patients.length,
      admitted:    byStatus("admitted"),
      critical:    byStatus("critical"),
      observation: byStatus("observation"),
      discharged:  byStatus("discharged"),
      // Derived booleans — convenient for conditional rendering
      hasCritical: byStatus("critical") > 0,
    };
  }, [patients]);
}

// useWardStats — computes per-ward occupancy, used by the Wards page
export function useWardStats() {
  const { patients } = usePatientStore();

  return useMemo(() => {
    const wards: Ward[] = ["cardiology","neurology","pediatrics","orthopedics","emergency","general"];
    return wards.map((ward) => {
      const wardPatients = patients.filter((p) => p.ward === ward);
      const occupied     = wardPatients.filter((p) => p.status !== "discharged").length;
      return { ward, patients: wardPatients, occupied };
    });
  }, [patients]);
}
import type { AcquisitionStepDefinition } from "@/acquisition/types/contracts";
import { BudgetStep } from "@/acquisition/onboarding/steps/BudgetStep";
import { FinalizeStep } from "@/acquisition/onboarding/steps/FinalizeStep";
import { LifestyleStep } from "@/acquisition/onboarding/steps/LifestyleStep";
import { OwnershipStep } from "@/acquisition/onboarding/steps/OwnershipStep";
import { PreferencesStep } from "@/acquisition/onboarding/steps/PreferencesStep";

export const acquisitionSteps: AcquisitionStepDefinition[] = [
  {
    id: "ownership",
    title: "Ownership Intent",
    description: "Define how this vehicle should fit your ownership strategy.",
    component: OwnershipStep,
  },
  {
    id: "budget",
    title: "Budget Intelligence",
    description: "Map comfort range, stretch ceiling, and risk tolerance.",
    component: BudgetStep,
  },
  {
    id: "preferences",
    title: "Vehicle Preferences",
    description: "Capture target brands, emotional priorities, and compare set.",
    component: PreferencesStep,
  },
  {
    id: "lifestyle",
    title: "Lifestyle Signals",
    description: "Align day-to-day use, environment, and ownership timeline.",
    component: LifestyleStep,
  },
  {
    id: "finalize",
    title: "Finalize Brief",
    description: "Confirm readiness and generate your private acquisition report preview.",
    component: FinalizeStep,
  },
];


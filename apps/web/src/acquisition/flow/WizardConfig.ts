import type { AcquisitionStepDefinition } from "@/acquisition/types/contracts";
import { BudgetStep } from "@/acquisition/onboarding/steps/BudgetStep";
import { FinalizeStep } from "@/acquisition/onboarding/steps/FinalizeStep";
import { LifestyleStep } from "@/acquisition/onboarding/steps/LifestyleStep";
import { OwnershipStep } from "@/acquisition/onboarding/steps/OwnershipStep";
import { PreferencesStep } from "@/acquisition/onboarding/steps/PreferencesStep";
import { budgetQuestions, comparisonQuestions, ownershipQuestions, preferenceQuestions } from "@/acquisition/schemas/questions";

const lifestyleQuestion = preferenceQuestions.find((question) => question.id === "lifestyle");
const desiredEmotionQuestion = preferenceQuestions.find((question) => question.id === "desiredEmotion");

if (!lifestyleQuestion || !desiredEmotionQuestion) {
  throw new Error("Acquisition lifestyle step questions are not configured.");
}

export const acquisitionSteps: AcquisitionStepDefinition[] = [
  {
    id: "ownership",
    title: "Ownership Intent",
    description: "Define how this vehicle should fit your ownership strategy.",
    questions: ownershipQuestions,
    component: OwnershipStep,
  },
  {
    id: "budget",
    title: "Budget Intelligence",
    description: "Map comfort range, stretch ceiling, and risk tolerance.",
    questions: budgetQuestions,
    component: BudgetStep,
  },
  {
    id: "preferences",
    title: "Vehicle Preferences",
    description: "Capture target brands, emotional priorities, and compare set.",
    questions: [...preferenceQuestions, ...comparisonQuestions],
    component: PreferencesStep,
  },
  {
    id: "lifestyle",
    title: "Lifestyle Signals",
    description: "Align day-to-day use, environment, and ownership timeline.",
    questions: [lifestyleQuestion, desiredEmotionQuestion],
    component: LifestyleStep,
  },
  {
    id: "finalize",
    title: "Finalize Brief",
    description: "Confirm readiness and generate your private acquisition report preview.",
    questions: [],
    component: FinalizeStep,
  },
];


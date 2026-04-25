import type { QuestionDefinition } from "@/acquisition/types/contracts";

export const ownershipQuestions: QuestionDefinition[] = [
  {
    id: "ownershipIntent",
    type: "select",
    label: "Why are you purchasing?",
    options: [
      "Daily driver",
      "Weekend exotic",
      "Collector asset",
      "Investment hold",
      "Luxury status",
      "Track use",
      "Business image",
    ],
    required: true,
  },
  {
    id: "ownershipDuration",
    type: "select",
    label: "How long do you expect to keep the vehicle?",
    options: ["Under 1 year", "1-2 years", "3-5 years", "5-10 years", "Long-term collector"],
    required: true,
  },
  {
    id: "drivingFrequency",
    type: "select",
    label: "How often will you drive it?",
    options: ["Daily", "Weekly", "Monthly", "Rarely"],
    required: true,
  },
];

export const budgetQuestions: QuestionDefinition[] = [
  {
    id: "budget",
    type: "number",
    label: "Comfortable purchase budget (USD)",
    min: 75000,
    max: 5000000,
    step: 5000,
    required: true,
  },
  {
    id: "riskTolerance",
    type: "slider",
    label: "Repair and volatility tolerance",
    min: 1,
    max: 10,
    step: 1,
    required: true,
  },
  {
    id: "monthlyOwnershipComfort",
    type: "number",
    label: "Monthly ownership comfort (USD)",
    min: 1000,
    max: 30000,
    step: 250,
  },
];

export const preferenceQuestions: QuestionDefinition[] = [
  {
    id: "preferredBrands",
    type: "multi",
    label: "Preferred brands",
    options: ["Ferrari", "Lamborghini", "Porsche", "McLaren", "Rolls-Royce", "Aston Martin"],
    required: true,
  },
  {
    id: "desiredEmotion",
    type: "multi",
    label: "Desired ownership feel",
    options: [
      "Stealth wealth",
      "Track aggression",
      "Collector prestige",
      "Open-air theater",
      "Grand touring serenity",
      "Investment confidence",
    ],
    required: true,
  },
  {
    id: "lifestyle",
    type: "multi",
    label: "Lifestyle context",
    options: ["City commuting", "Weekend escapes", "Networking events", "Climate-sensitive storage", "Long highway travel"],
  },
];

export const comparisonQuestions: QuestionDefinition[] = [
  {
    id: "compareVehicles",
    type: "multi",
    label: "Vehicles you want compared",
    options: [
      "Ferrari 812 GTS",
      "Lamborghini Huracan Sterrato",
      "Porsche 911 GT3 RS",
      "McLaren 765LT Spider",
      "Rolls-Royce Ghost Black Badge",
    ],
  },
  {
    id: "mustHaveFeatures",
    type: "multi",
    label: "Must-have attributes",
    options: ["Warranty coverage", "Low miles", "Factory carbon package", "Provenance docs", "Concierge logistics support"],
  },
];

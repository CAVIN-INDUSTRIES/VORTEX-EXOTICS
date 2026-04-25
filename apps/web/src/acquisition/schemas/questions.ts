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
    options: ["under-1-year", "1-2-years", "3-5-years", "5-10-years", "long-term-collector"],
    helperText: "Use horizon bands so downstream scoring can map depreciation/risk models consistently.",
    required: true,
    profileKey: "ownershipDuration",
  },
  {
    id: "drivingFrequency",
    type: "select",
    label: "How often will you drive it?",
    options: ["daily", "weekly", "monthly", "rarely"],
    required: true,
    profileKey: "drivingFrequency",
  },
];

export const budgetQuestions: QuestionDefinition[] = [
  {
    id: "budget",
    type: "slider",
    label: "Comfortable purchase budget (USD)",
    min: 75000,
    max: 5000000,
    step: 5000,
    valuePrefix: "$",
    required: true,
    profileKey: "budget",
  },
  {
    id: "riskTolerance",
    type: "slider",
    label: "Repair and volatility tolerance",
    min: 1,
    max: 10,
    step: 1,
    valueSuffix: "/10",
    required: true,
    profileKey: "riskTolerance",
  },
  {
    id: "monthlyOwnershipComfort",
    type: "slider",
    label: "Monthly ownership comfort (USD)",
    min: 1000,
    max: 30000,
    step: 250,
    valuePrefix: "$",
    profileKey: "monthlyOwnershipComfort",
  },
  {
    id: "financingPreference",
    type: "select",
    label: "Preferred acquisition structure",
    options: ["cash", "financing", "lease", "open"],
    profileKey: "financingPreference",
  },
];

export const preferenceQuestions: QuestionDefinition[] = [
  {
    id: "preferredBrands",
    type: "multi",
    label: "Preferred brands",
    options: ["Ferrari", "Lamborghini", "Porsche", "McLaren", "Rolls-Royce", "Aston Martin"],
    required: true,
    profileKey: "preferredBrands",
  },
  {
    id: "avoidedBrands",
    type: "multi",
    label: "Brands to avoid",
    options: ["Ferrari", "Lamborghini", "Porsche", "McLaren", "Rolls-Royce", "Aston Martin"],
    profileKey: "avoidedBrands",
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
    profileKey: "desiredEmotion",
  },
  {
    id: "lifestyle",
    type: "multi",
    label: "Lifestyle context",
    options: ["City commuting", "Weekend escapes", "Networking events", "Climate-sensitive storage", "Long highway travel"],
    profileKey: "lifestyle",
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
    profileKey: "compareVehicles",
  },
  {
    id: "mustHaveFeatures",
    type: "multi",
    label: "Must-have attributes",
    options: ["Warranty coverage", "Low miles", "Factory carbon package", "Provenance docs", "Concierge logistics support"],
    profileKey: "mustHaveFeatures",
  },
];

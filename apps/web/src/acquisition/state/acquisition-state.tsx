"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { AcquisitionFlowStepId, AcquisitionProfile } from "@/acquisition/types/contracts";
import { defaultAcquisitionProfile } from "@/acquisition/types/contracts";

const STORAGE_KEY = "vex_private_acquisition_profile_v1";

type AcquisitionState = {
  profile: AcquisitionProfile;
  lastUpdatedAt: string | null;
};

export type AcquisitionAction =
  | { type: "HYDRATE"; payload: AcquisitionState }
  | { type: "SET_FIELD"; payload: Partial<AcquisitionProfile> }
  | { type: "SET_PREFERRED_BRANDS"; payload: string[] }
  | { type: "SET_AVOIDED_BRANDS"; payload: string[] }
  | { type: "SET_DESIRED_EMOTION"; payload: string[] }
  | { type: "SET_LIFESTYLE"; payload: string[] }
  | { type: "SET_COMPARE_VEHICLES"; payload: string[] }
  | { type: "REPLACE_PROFILE"; payload: AcquisitionProfile }
  | { type: "RESET" };

const initialState: AcquisitionState = {
  profile: defaultAcquisitionProfile(),
  lastUpdatedAt: null,
};

function sanitizeProfile(candidate: unknown): AcquisitionProfile {
  const base = defaultAcquisitionProfile();
  if (!candidate || typeof candidate !== "object") {
    return base;
  }

  const source = candidate as Partial<AcquisitionProfile>;
  const validOwnershipDurations = new Set<AcquisitionProfile["ownershipDuration"]>([
    "under-1-year",
    "1-2-years",
    "3-5-years",
    "5-10-years",
    "long-term-collector",
  ]);
  const validDrivingFrequency = new Set<AcquisitionProfile["drivingFrequency"]>(["daily", "weekly", "monthly", "rarely"]);
  const validFinancingPreference = new Set<AcquisitionProfile["financingPreference"]>(["cash", "financing", "lease", "open"]);
  return {
    budget: typeof source.budget === "number" ? source.budget : base.budget,
    preferredBrands: Array.isArray(source.preferredBrands)
      ? source.preferredBrands.filter((value): value is string => typeof value === "string")
      : base.preferredBrands,
    ownershipIntent: typeof source.ownershipIntent === "string" ? source.ownershipIntent : base.ownershipIntent,
    ownershipDuration:
      typeof source.ownershipDuration === "string" && validOwnershipDurations.has(source.ownershipDuration as AcquisitionProfile["ownershipDuration"])
        ? (source.ownershipDuration as AcquisitionProfile["ownershipDuration"])
        : base.ownershipDuration,
    drivingFrequency:
      typeof source.drivingFrequency === "string" && validDrivingFrequency.has(source.drivingFrequency as AcquisitionProfile["drivingFrequency"])
        ? (source.drivingFrequency as AcquisitionProfile["drivingFrequency"])
        : base.drivingFrequency,
    lifestyle: Array.isArray(source.lifestyle)
      ? source.lifestyle.filter((value): value is string => typeof value === "string")
      : base.lifestyle,
    riskTolerance: typeof source.riskTolerance === "number" ? source.riskTolerance : base.riskTolerance,
    monthlyOwnershipComfort:
      typeof source.monthlyOwnershipComfort === "number" ? source.monthlyOwnershipComfort : base.monthlyOwnershipComfort,
    financingPreference:
      typeof source.financingPreference === "string" &&
      validFinancingPreference.has(source.financingPreference as AcquisitionProfile["financingPreference"])
        ? (source.financingPreference as AcquisitionProfile["financingPreference"])
        : base.financingPreference,
    desiredEmotion: Array.isArray(source.desiredEmotion)
      ? source.desiredEmotion.filter((value): value is string => typeof value === "string")
      : base.desiredEmotion,
    compareVehicles: Array.isArray(source.compareVehicles)
      ? source.compareVehicles.filter((value): value is string => typeof value === "string")
      : base.compareVehicles,
    avoidedBrands: Array.isArray(source.avoidedBrands)
      ? source.avoidedBrands.filter((value): value is string => typeof value === "string")
      : base.avoidedBrands,
    mustHaveFeatures: Array.isArray(source.mustHaveFeatures)
      ? source.mustHaveFeatures.filter((value): value is string => typeof value === "string")
      : base.mustHaveFeatures,
  };
}

function acquisitionReducer(state: AcquisitionState, action: AcquisitionAction): AcquisitionState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "SET_FIELD":
      return {
        profile: {
          ...state.profile,
          ...action.payload,
        },
        lastUpdatedAt: new Date().toISOString(),
      };
    case "SET_PREFERRED_BRANDS":
      return {
        profile: {
          ...state.profile,
          preferredBrands: action.payload,
        },
        lastUpdatedAt: new Date().toISOString(),
      };
    case "SET_AVOIDED_BRANDS":
      return {
        profile: {
          ...state.profile,
          avoidedBrands: action.payload,
        },
        lastUpdatedAt: new Date().toISOString(),
      };
    case "SET_DESIRED_EMOTION":
      return {
        profile: {
          ...state.profile,
          desiredEmotion: action.payload,
        },
        lastUpdatedAt: new Date().toISOString(),
      };
    case "SET_LIFESTYLE":
      return {
        profile: {
          ...state.profile,
          lifestyle: action.payload,
        },
        lastUpdatedAt: new Date().toISOString(),
      };
    case "SET_COMPARE_VEHICLES":
      return {
        profile: {
          ...state.profile,
          compareVehicles: action.payload,
        },
        lastUpdatedAt: new Date().toISOString(),
      };
    case "REPLACE_PROFILE":
      return {
        profile: action.payload,
        lastUpdatedAt: new Date().toISOString(),
      };
    case "RESET":
      return {
        profile: defaultAcquisitionProfile(),
        lastUpdatedAt: new Date().toISOString(),
      };
    default:
      return state;
  }
}

type AcquisitionStateContextValue = {
  state: AcquisitionState;
  profile: AcquisitionProfile;
  dispatch: (action: AcquisitionAction) => void;
};

const AcquisitionStateContext = createContext<AcquisitionStateContextValue | null>(null);

function readPersistedState(): AcquisitionState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AcquisitionState>;
    return {
      profile: sanitizeProfile(parsed.profile),
      lastUpdatedAt: typeof parsed.lastUpdatedAt === "string" ? parsed.lastUpdatedAt : null,
    };
  } catch {
    return null;
  }
}

function persistState(next: AcquisitionState): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function clearPersistedAcquisitionState(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(STORAGE_KEY);
}

export function AcquisitionStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(acquisitionReducer, initialState);

  useEffect(() => {
    const hydrated = readPersistedState();
    if (hydrated) {
      dispatch({ type: "HYDRATE", payload: hydrated });
    }
  }, []);

  useEffect(() => {
    persistState(state);
  }, [state]);

  const value = useMemo<AcquisitionStateContextValue>(
    () => ({
      state,
      profile: state.profile,
      dispatch,
    }),
    [state]
  );

  return <AcquisitionStateContext.Provider value={value}>{children}</AcquisitionStateContext.Provider>;
}

export function useAcquisitionState() {
  const ctx = useContext(AcquisitionStateContext);
  if (!ctx) {
    throw new Error("useAcquisitionState must be used inside AcquisitionStateProvider");
  }
  return ctx;
}

export function useAcquisition() {
  const { profile } = useAcquisitionState();
  return profile;
}

export function useAcquisitionMeta() {
  const { state } = useAcquisitionState();
  return { lastUpdatedAt: state.lastUpdatedAt };
}

export function useAcquisitionDispatch() {
  const { dispatch } = useAcquisitionState();
  return dispatch;
}

export const ACQUISITION_STORAGE_KEY = STORAGE_KEY;

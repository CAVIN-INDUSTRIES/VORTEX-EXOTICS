"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { AcquisitionFlowStepId, AcquisitionProfile } from "@/acquisition/types/contracts";
import { defaultAcquisitionProfile } from "@/acquisition/types/contracts";

const STORAGE_KEY = "vex_private_acquisition_profile_v1";

type AcquisitionState = {
  profile: AcquisitionProfile;
  lastUpdatedAt: string | null;
};

type AcquisitionAction =
  | { type: "hydrate"; payload: AcquisitionState }
  | { type: "update-step"; stepId: AcquisitionFlowStepId; payload: Partial<AcquisitionProfile> }
  | { type: "replace-profile"; payload: AcquisitionProfile }
  | { type: "reset" };

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
  return {
    budget: typeof source.budget === "number" ? source.budget : base.budget,
    preferredBrands: Array.isArray(source.preferredBrands)
      ? source.preferredBrands.filter((v): v is string => typeof v === "string")
      : base.preferredBrands,
    ownershipIntent: typeof source.ownershipIntent === "string" ? source.ownershipIntent : base.ownershipIntent,
    lifestyle: Array.isArray(source.lifestyle)
      ? source.lifestyle.filter((v): v is string => typeof v === "string")
      : base.lifestyle,
    riskTolerance: typeof source.riskTolerance === "number" ? source.riskTolerance : base.riskTolerance,
    ownershipDuration: typeof source.ownershipDuration === "number" ? source.ownershipDuration : base.ownershipDuration,
    desiredEmotion: Array.isArray(source.desiredEmotion)
      ? source.desiredEmotion.filter((v): v is string => typeof v === "string")
      : base.desiredEmotion,
    compareVehicles: Array.isArray(source.compareVehicles)
      ? source.compareVehicles.filter((v): v is string => typeof v === "string")
      : base.compareVehicles,
  };
}

function acquisitionReducer(state: AcquisitionState, action: AcquisitionAction): AcquisitionState {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "update-step":
      return {
        profile: {
          ...state.profile,
          ...action.payload,
        },
        lastUpdatedAt: new Date().toISOString(),
      };
    case "replace-profile":
      return {
        profile: action.payload,
        lastUpdatedAt: new Date().toISOString(),
      };
    case "reset":
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
  updateStep: (stepId: AcquisitionFlowStepId, payload: Partial<AcquisitionProfile>) => void;
  replaceProfile: (profile: AcquisitionProfile) => void;
  reset: () => void;
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
      dispatch({ type: "hydrate", payload: hydrated });
    }
  }, []);

  useEffect(() => {
    persistState(state);
  }, [state]);

  const value = useMemo<AcquisitionStateContextValue>(
    () => ({
      state,
      updateStep: (stepId, payload) => {
        dispatch({ type: "update-step", stepId, payload });
      },
      replaceProfile: (profile) => {
        dispatch({ type: "replace-profile", payload: profile });
      },
      reset: () => {
        dispatch({ type: "reset" });
      },
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

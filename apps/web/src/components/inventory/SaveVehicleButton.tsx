"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "vex_saved_vehicle_ids";
const SAVED_VEHICLES_EVENT = "vex:saved-vehicles-updated";

export function readSavedVehicles() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeSavedVehicles(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(SAVED_VEHICLES_EVENT, { detail: ids }));
}

export function SaveVehicleButton({ vehicleId }: { vehicleId: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setSaved(readSavedVehicles().includes(vehicleId));
    sync();

    window.addEventListener(SAVED_VEHICLES_EVENT, sync as EventListener);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SAVED_VEHICLES_EVENT, sync as EventListener);
      window.removeEventListener("storage", sync);
    };
  }, [vehicleId]);

  const toggleSaved = () => {
    const current = readSavedVehicles();
    const next = current.includes(vehicleId) ? current.filter((id) => id !== vehicleId) : [...current, vehicleId];
    writeSavedVehicles(next);
    setSaved(next.includes(vehicleId));
  };

  return (
    <button
      type="button"
      onClick={toggleSaved}
      aria-pressed={saved}
      className={`relative overflow-hidden rounded-full border px-4 py-2 text-xs uppercase tracking-[0.2em] transition duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f1d38a]/40 hover:-translate-y-[1px] ${
        saved
          ? "border-[#f1d38a]/45 bg-[#d4af37]/16 text-[#fff6de]"
          : "border-white/10 bg-white/[0.04] text-[#d8d0c2] hover:border-[#f1d38a]/24 hover:bg-white/[0.06] hover:text-[#fff8eb]"
      }`}
    >
      <span
        className="pointer-events-none absolute inset-y-0 left-[-35%] w-[40%] -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)] opacity-0 transition duration-700 hover:translate-x-[260%] hover:opacity-100"
        aria-hidden="true"
      />
      {saved ? "Saved" : "Save to Vault"}
    </button>
  );
}

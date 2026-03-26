"use client";

import { useState } from "react";
import { ConfiguratorVehicleCanvas } from "@/components/configurator/ConfiguratorVehicleCanvas";
import type { CameraPreset } from "@/components/configurator/VehicleScene";
import {
  FINISH_CSS_GRADIENT,
  FINISH_SWATCHES,
  type EditionId,
  type FinishId,
  type PowertrainId,
} from "@/components/configurator/vehicleFinish";
import styles from "./ExoticVisualization.module.css";

/**
 * Hero 3D strip — same WebGL studio as the configure section, compact + minimal chrome.
 */
export function ExoticVisualization() {
  const [finish, setFinish] = useState<FinishId>("rosso");
  const [edition, setEdition] = useState<EditionId>("Launch");
  const [powertrain, setPowertrain] = useState<PowertrainId>("V12");
  const [cameraPreset, setCameraPreset] = useState<CameraPreset | null>("threeQuarter");
  const [autoRotate, setAutoRotate] = useState(false);

  return (
    <div className={styles.stage} data-cursor="interactive">
      <div className={styles.hud}>
        <span className={styles.badge}>Lot preview</span>
        <span className={styles.sub}>Orbit · Zoom · Studio lit</span>
      </div>

      <div className={styles.controls} aria-label="3D quick controls">
        <div className={styles.controlGroup}>
          <span className={styles.controlsLabel}>Finish</span>
          <div className={styles.swatchRow}>
            {FINISH_SWATCHES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={finish === s.id ? styles.swatchBtnActive : styles.swatchBtn}
                style={{ background: FINISH_CSS_GRADIENT[s.id] }}
                onClick={() => setFinish(s.id)}
                aria-label={s.label}
                title={s.label}
                data-sfx="button"
              />
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <span className={styles.controlsLabel}>Camera</span>
          <div className={styles.btnRow}>
            {[
              { id: "threeQuarter" as const, label: "3/4" },
              { id: "side" as const, label: "Side" },
              { id: "front" as const, label: "Front" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                className={cameraPreset === p.id ? styles.miniBtnActive : styles.miniBtn}
                onClick={() => setCameraPreset(p.id)}
                data-sfx="button"
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              className={autoRotate ? styles.miniBtnActive : styles.miniBtn}
              onClick={() => setAutoRotate((v) => !v)}
              aria-pressed={autoRotate}
              data-sfx="button"
            >
              Rotate
            </button>
          </div>
        </div>

        <div className={styles.controlGroup}>
          <span className={styles.controlsLabel}>Spec</span>
          <div className={styles.btnRow}>
            {(["Launch", "Heritage", "Track"] as const).map((e) => (
              <button
                key={e}
                type="button"
                className={edition === e ? styles.miniBtnActive : styles.miniBtn}
                onClick={() => setEdition(e)}
                data-sfx="button"
              >
                {e}
              </button>
            ))}
          </div>
          <div className={styles.btnRow}>
            {(["V12", "Twin-turbo V8", "Hybrid"] as const).map((p) => (
              <button
                key={p}
                type="button"
                className={powertrain === p ? styles.miniBtnActive : styles.miniBtn}
                onClick={() => setPowertrain(p)}
                data-sfx="button"
              >
                {p === "Twin-turbo V8" ? "TT V8" : p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ConfiguratorVehicleCanvas
        compact
        minimal
        embed
        premium
        compactGrid
        finishId={finish}
        edition={edition}
        powertrain={powertrain}
        cameraPresetOverride={cameraPreset}
        onCameraPresetApplied={() => setCameraPreset(null)}
        autoRotateOverride={autoRotate}
        onAutoRotateChange={setAutoRotate}
      />
    </div>
  );
}

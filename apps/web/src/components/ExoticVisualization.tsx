"use client";

import { useState } from "react";
import { ConfiguratorVehicleCanvas } from "@/components/configurator/ConfiguratorVehicleCanvas";
import { FINISH_CSS_GRADIENT, FINISH_SWATCHES, type FinishId } from "@/components/configurator/vehicleFinish";
import styles from "./ExoticVisualization.module.css";

/**
 * Hero 3D strip — same WebGL studio as the configure section, compact + minimal chrome.
 */
export function ExoticVisualization() {
  const [finish, setFinish] = useState<FinishId>("rosso");

  return (
    <div className={styles.stage} data-cursor="interactive">
      <div className={styles.hud}>
        <span className={styles.badge}>Lot preview</span>
        <span className={styles.sub}>Orbit · Zoom · Studio lit</span>
      </div>

      <div className={styles.controls} aria-label="Quick finish selection">
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
            />
          ))}
        </div>
      </div>

      <ConfiguratorVehicleCanvas
        compact
        minimal
        embed
        premium
        compactGrid
        finishId={finish}
        edition="Launch"
        powertrain="V12"
      />
    </div>
  );
}

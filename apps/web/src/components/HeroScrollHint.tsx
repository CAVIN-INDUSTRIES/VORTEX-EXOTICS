"use client";

import styles from "./HeroScrollHint.module.css";

export function HeroScrollHint() {
  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" })}
      >
        <span className={styles.label}>See more below</span>
        <span className={styles.chevron} aria-hidden />
      </button>
    </div>
  );
}

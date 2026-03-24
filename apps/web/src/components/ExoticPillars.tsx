"use client";

import { useReveal } from "@/hooks/useReveal";
import styles from "./ExoticPillars.module.css";

const PILLARS = [
  {
    title: "Know the car before you pay",
    body: "Listings show history and condition up front — from our team or private sellers we’ve checked.",
  },
  {
    title: "Built for serious buyers",
    body: "Custom builds and rare stock without the noise. Fewer steps, clear choices.",
  },
  {
    title: "Delivery you can track",
    body: "Enclosed shipping and updates so you know where your car is from pickup to your door.",
  },
] as const;

export function ExoticPillars() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="pillars" ref={ref} className={styles.section} data-reveal>
      <div className={styles.header}>
        <p className={styles.eyebrow}>How it works</p>
        <h2 className={styles.title}>Three things you can count on</h2>
        <p className={styles.lede}>
          VEX is for exotic cars only — not a general used-car lot. Here’s what you get when you work with us.
        </p>
      </div>
      <ul className={styles.grid}>
        {PILLARS.map((p) => (
          <li key={p.title} className={styles.card}>
            <h3 className={styles.cardTitle}>{p.title}</h3>
            <p className={styles.cardBody}>{p.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

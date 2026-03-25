import Link from "next/link";
import styles from "./TestDriveStrip.module.css";

export function TestDriveStrip() {
  return (
    <section id="test-drive" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Visit</p>
          <h2 className={styles.title}>Book a visit</h2>
          <p className={styles.subhead}>
            See a car in person or on a video call. We work around your schedule.
          </p>
        </div>
        <div className={styles.ctas}>
          <Link href="/#contact" className={styles.primary} data-magnetic="true">
            Email us
          </Link>
          <Link href="/inventory" className={styles.secondary} data-magnetic="true">
            Browse cars
          </Link>
        </div>
      </div>
    </section>
  );
}

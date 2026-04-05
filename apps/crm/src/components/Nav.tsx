"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./Nav.module.css";

export function Nav() {
  const pathname = usePathname();
  const { logout, role } = useAuth();

  const links = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/appraisals", label: "Appraisals" },
    { href: "/analytics", label: "Analytics" },
    { href: "/autonomous", label: "Autonomous" },
    { href: "/leads", label: "Leads" },
    { href: "/orders", label: "Orders" },
    { href: "/invoices", label: "Invoices" },
    { href: "/inventory", label: "Inventory" },
    { href: "/customers", label: "Customers" },
    ...(role === "ADMIN" || role === "GROUP_ADMIN" ? [{ href: "/settings/flags", label: "Flags" }] : []),
  ];

  return (
    <header className={styles.nav}>
      <div className={`crm-shell ${styles.inner}`}>
        <nav className={styles.linkRow} aria-label="Primary">
          <Link href="/dashboard" className={styles.brand}>
            VEX CRM
          </Link>
          {links.map(({ href, label }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));
            return (
              <Link key={href} href={href} className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}>
                {label}
              </Link>
            );
          })}
        </nav>
        <button type="button" className={styles.signOut} onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  );
}

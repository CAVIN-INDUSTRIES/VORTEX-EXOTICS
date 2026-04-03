import StaffLayout from "../(staff)/layout";
import type { ReactNode } from "react";

export default function InvoicesLayout({ children }: { children: ReactNode }) {
  // Reuse the existing staff shell (auth redirect + nav + onboarding wizard).
  return <StaffLayout>{children}</StaffLayout>;
}


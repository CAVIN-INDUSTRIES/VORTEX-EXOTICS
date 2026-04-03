import StaffLayout from "../../(staff)/layout";
import type { ReactNode } from "react";

export default function AppraisalIdLayout({ children }: { children: ReactNode }) {
  // Keep the staff auth redirect + nav experience for the plan's appraisal detail route.
  return <StaffLayout>{children}</StaffLayout>;
}


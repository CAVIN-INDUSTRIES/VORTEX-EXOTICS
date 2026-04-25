import { ReportPreview } from "@/acquisition/reporting/ReportPreview";
import { buildMockVehicleReport } from "@/acquisition/mock/mockVehicleResults";
import { defaultAcquisitionProfile } from "@/acquisition/types/contracts";

export const metadata = {
  title: "Private Acquisition Report Preview | VEX Atelier",
  description: "Preview the private acquisition intelligence report with mock scoring and recommendation data.",
};

export default function PrivateAcquisitionReportPreviewPage() {
  const report = buildMockVehicleReport(defaultAcquisitionProfile());
  return (
    <main id="main-content" className="shell py-14 sm:py-18">
      <ReportPreview report={report} />
    </main>
  );
}


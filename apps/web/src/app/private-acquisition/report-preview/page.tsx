import { ReportPreview } from "@/acquisition/reporting/ReportPreview";
import { mockVehicleRecommendationReport } from "@/acquisition/mock/mockVehicleResults";

export const metadata = {
  title: "Private Acquisition Report Preview | VEX Atelier",
  description: "Preview the private acquisition intelligence report with mock scoring and recommendation data.",
};

export default function PrivateAcquisitionReportPreviewPage() {
  return (
    <main id="main-content" className="shell py-14 sm:py-18">
      <ReportPreview report={mockVehicleRecommendationReport} />
    </main>
  );
}


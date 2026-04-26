import { Suspense } from "react";
import { PrivateAcquisitionClient } from "@/app/private-acquisition/PrivateAcquisitionClient";

export default function PrivateAcquisitionPage() {
  return (
    <Suspense fallback={<main className="shell py-10 text-sm text-[var(--text-soft)]">Loading acquisition consultation...</main>}>
      <PrivateAcquisitionClient />
    </Suspense>
  );
}

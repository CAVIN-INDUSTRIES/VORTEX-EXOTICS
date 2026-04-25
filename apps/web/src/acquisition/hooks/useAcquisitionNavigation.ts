"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useAcquisitionNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setStep = useCallback(
    (step: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("step", step);
      router.replace(`/private-acquisition?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const goToPreview = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("step");
    const query = params.toString();
    router.push(query ? `/private-acquisition/report-preview?${query}` : "/private-acquisition/report-preview");
  }, [router, searchParams]);

  return {
    setStep,
    goToPreview,
  };
}

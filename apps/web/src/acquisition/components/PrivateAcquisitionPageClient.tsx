"use client";

import Link from "next/link";
import { AutomotiveAtmosphere } from "@/components/atmosphere";
import { EditorialContainer, SectionShell } from "@/components/layout";
import { MotionReveal } from "@/components/site/MotionReveal";
import { AcquisitionWizard } from "@/acquisition/components";
import { acquisitionTheme } from "@/acquisition/config";
import { AcquisitionProvider } from "@/acquisition/state";

export function PrivateAcquisitionPageClient() {
  return (
    <AcquisitionProvider>
      <main id="main-content">
        <SectionShell variant="default" atmosphere={<AutomotiveAtmosphere variant="hero" intensity="high" />}>
          <EditorialContainer>
            <MotionReveal
              className="overflow-hidden rounded-[2.1rem] border p-8 shadow-[0_26px_70px_rgba(0,0,0,0.45)] sm:p-12"
              style={{
                borderColor: acquisitionTheme.colors.line,
                background:
                  "radial-gradient(circle at 18% 20%, rgba(241,211,138,0.22), transparent 42%), radial-gradient(circle at 84% 76%, rgba(140,98,57,0.2), transparent 44%), linear-gradient(150deg, #050508 2%, #111217 58%, #1a1713 100%)",
              }}
            >
              <p className="text-xs uppercase tracking-[0.3em]" style={{ color: acquisitionTheme.colors.softGoldBright }}>
                Private acquisition intelligence
              </p>
              <h1 className="mt-6 max-w-3xl text-4xl leading-[1.03] text-[#fff8eb] sm:text-6xl">
                Build Your Private Vehicle Acquisition Strategy
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#d9cfbe] sm:text-lg">
                Personalized luxury intelligence powered by market analytics, ownership forecasting, and acquisition
                consulting.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a href="#acquisition-wizard" className="gold-button">
                  Begin Consultation
                </a>
                <Link href="/private-acquisition/report-preview" className="ghost-button">
                  View Report Preview
                </Link>
              </div>
            </MotionReveal>
          </EditorialContainer>
        </SectionShell>

        <SectionShell variant="cinematic" atmosphere={<AutomotiveAtmosphere variant="collection" intensity="medium" />}>
          <EditorialContainer>
            <AcquisitionWizard />
          </EditorialContainer>
        </SectionShell>
      </main>
    </AcquisitionProvider>
  );
}

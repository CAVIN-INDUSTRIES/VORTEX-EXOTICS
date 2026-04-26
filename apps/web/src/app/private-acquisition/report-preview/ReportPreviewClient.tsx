"use client";

import { useMemo, useState } from "react";
import { runAcquisitionEngine } from "@/acquisition/engine/runAcquisitionEngine";
import { defaultAcquisitionProfile } from "@/acquisition/mock/defaultProfile";
import { LeadSubmissionPayload } from "@/acquisition/types/contracts";
import { submitLeadPayload } from "@/acquisition/api/leadPayload";
import { formatUsd } from "@/acquisition/utils/currency";

export function ReportPreviewClient() {
  const [leadMessage, setLeadMessage] = useState<string | null>(null);

  const report = useMemo(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("vex.privateAcquisition.report");
      if (stored) {
        return JSON.parse(stored) as ReturnType<typeof runAcquisitionEngine>["report"];
      }
    }
    return runAcquisitionEngine(defaultAcquisitionProfile).report;
  }, []);

  const projections = report.projections.slice(0, 3);

  const onSubmitLead = async () => {
    const payload: LeadSubmissionPayload = {
      contact: { clientName: report.profile.clientName || "Concierge Lead", email: report.profile.email || "concierge@example.com", phone: report.profile.phone, location: report.profile.location || "Unknown" },
      acquisitionProfile: report.profile,
      recommendationSummary: report.narrative.executiveSummary,
      selectedVehicles: report.recommendations.map((rec) => rec.vehicleId),
      reportSummary: report.narrative.topPickReasoning,
      timestampIso: new Date().toISOString(),
      sourceRoute: "/private-acquisition/report-preview",
      consentFlags: report.profile.consent,
    };
    const result = await submitLeadPayload(payload);
    setLeadMessage(result.message);
  };

  return (
    <main className="shell py-8" data-testid="acq-report-preview">
      <section className="cinema-panel acq-print-section rounded-3xl p-6 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="section-kicker">Private Acquisition Intelligence Report</p>
            <h1 className="section-title">Advisor Preview</h1>
          </div>
          <div className="flex gap-2 print:hidden">
            <button className="ghost-button" onClick={() => window.print()} data-testid="acq-print">Print / Export PDF</button>
            <button className="gold-button" onClick={onSubmitLead} data-testid="acq-submit-lead">Submit Lead</button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3" data-testid="acq-score-cards">
          {report.recommendations.slice(0, 3).map((item) => (
            <article key={item.type} className="glass-panel rounded-2xl p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#f1d38a]/80">{item.title}</p>
              <h2 className="mt-2 text-lg text-[#fff8eb]">{item.vehicleId.replaceAll("-", " ")}</h2>
              <p className="mt-2 text-sm text-[var(--text-soft)]">{item.whySelected}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2" data-testid="acq-financial-section">
          {projections.map((projection) => (
            <article key={projection.vehicleId} className="glass-panel rounded-2xl p-4">
              <h3 className="text-base text-[#fff8eb]">{projection.vehicleId.replaceAll("-", " ")}</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Expected monthly: {formatUsd(projection.expected.costPerMonth)}</p>
              <p className="text-sm text-[var(--text-soft)]">3-year resale: {formatUsd(projection.expected.resaleEstimate3Year)}</p>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-gradient-to-r from-[#f1d38a] to-[#8a6b2e]" style={{ width: `${Math.max(8, projection.expected.depreciationLoss / projection.expected.purchasePriceEstimate * 100)}%` }} />
              </div>
            </article>
          ))}
        </div>

        <section className="mt-8 overflow-x-auto" data-testid="acq-comparison-section">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-[#f1d38a]">
                <th className="py-2 pr-4">Vehicle</th><th className="py-2 pr-4">Future Outlook</th><th className="py-2 pr-4">Reliability</th><th className="py-2 pr-4">Liquidity</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(report.comparison.metrics).map(([vehicleId, metrics]) => (
                <tr key={vehicleId} className="border-b border-white/5">
                  <td className="py-2 pr-4">{vehicleId.replaceAll("-", " ")}</td>
                  <td className="py-2 pr-4">{Number(metrics.futureOutlook ?? 0).toFixed(0)}</td>
                  <td className="py-2 pr-4">{Number(metrics.reliability ?? 0).toFixed(0)}</td>
                  <td className="py-2 pr-4">{Number(metrics.marketLiquidity ?? 0).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="mt-8 rounded-2xl border border-[#f1d38a]/20 bg-black/30 p-4">
          <h2 className="text-lg text-[#fff8eb]">Advisor Notes</h2>
          <p className="mt-2 text-sm text-[var(--text-soft)]">{report.narrative.executiveSummary}</p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">{report.disclaimer}</p>
          <div className="mt-4 flex flex-wrap gap-2 print:hidden">
            <button className="ghost-button" onClick={() => setLeadMessage("Save report coming soon. Contact advisor to archive this report.")}>Save Report</button>
            <button className="ghost-button" onClick={() => setLeadMessage("Email report coming soon. Contact advisor for direct send.")}>Email Report</button>
            <button className="ghost-button" onClick={() => navigator.clipboard.writeText(report.narrative.executiveSummary).then(() => setLeadMessage("Summary copied."))}>Copy Summary</button>
            <button className="gold-button" onClick={() => setLeadMessage("Consultation scheduling coming soon. Contact advisor now.")}>Schedule Consultation</button>
          </div>
          {leadMessage ? <p className="mt-3 text-sm text-[#f1d38a]">{leadMessage}</p> : null}
        </section>
      </section>
    </main>
  );
}

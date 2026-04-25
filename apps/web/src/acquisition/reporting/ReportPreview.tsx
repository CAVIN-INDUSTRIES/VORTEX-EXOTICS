"use client";

import Link from "next/link";
import type { VehicleRecommendationReport } from "@/acquisition/types/contracts";
import { acquisitionTheme } from "@/acquisition/config/acquisition-theme";

export function ReportPreview({ report }: { report: VehicleRecommendationReport }) {
  return (
    <div className="space-y-8">
      <section className="rounded-[1.9rem] border p-6 sm:p-8" style={{ borderColor: acquisitionTheme.colors.line, background: acquisitionTheme.effects.panel }}>
        <p className="text-xs uppercase tracking-[0.28em]" style={{ color: acquisitionTheme.semantic.goldSoft }}>
          Executive Summary
        </p>
        <h2 className="mt-4 text-3xl text-[#fff8eb]">{report.summary.headline}</h2>
        <p className="mt-3 text-sm leading-7 text-[#d8d0c2]">{report.summary.narrative}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#aa9f8d]">Budget position</p>
            <p className="mt-2 text-xl text-[#fff8eb]">{report.summary.budgetPosition}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#aa9f8d]">Risk profile</p>
            <p className="mt-2 text-xl text-[#fff8eb]">{report.summary.riskProfile}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-[#aa9f8d]">Ownership horizon</p>
            <p className="mt-2 text-xl text-[#fff8eb]">{report.summary.ownershipHorizonMonths} months</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-2xl text-[#fff8eb]">Recommendations</h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {report.recommendations.map((vehicle) => (
            <article key={vehicle.id} className="rounded-2xl border border-white/10 bg-black/25 p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.24em] text-[#f1d38a]/80">{vehicle.rankLabel}</p>
                <p className="text-sm text-[#d8d0c2]">Score {vehicle.score.toFixed(1)}</p>
              </div>
              <h4 className="mt-3 text-xl text-[#fff8eb]">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h4>
              <p className="mt-2 text-sm leading-7 text-[#d8d0c2]">{vehicle.rationale}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {vehicle.highlights.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-[#f1d38a]/20 bg-[#d4af37]/12 px-3 py-1 text-xs text-[#f1d38a]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-lg text-[#fff8eb]">${vehicle.estimatedPriceUsd.toLocaleString()}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[1.8rem] border border-white/10 bg-black/20 p-6 sm:p-8">
        <h3 className="text-2xl text-[#fff8eb]">Financial projection</h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <p className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-[#d8d0c2]">
            Total ownership cost: <strong className="text-[#fff8eb]">${report.financialProjection.totalOwnershipCostUsd.toLocaleString()}</strong>
          </p>
          <p className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-[#d8d0c2]">
            Projected value: <strong className="text-[#fff8eb]">${report.financialProjection.projectedResaleValueUsd.toLocaleString()}</strong>
          </p>
          <p className="rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-[#d8d0c2]">
            Monthly estimate: <strong className="text-[#fff8eb]">${report.financialProjection.monthlyOwnershipEstimateUsd.toLocaleString()}</strong>
          </p>
        </div>
      </section>

      <section className="rounded-[1.8rem] border border-white/10 bg-black/20 p-6 sm:p-8">
        <h3 className="text-2xl text-[#fff8eb]">Comparison grid</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-[#aa9f8d]">
                <th className="border-b border-white/10 px-3 py-2">Vehicle</th>
                <th className="border-b border-white/10 px-3 py-2">Market Momentum</th>
                <th className="border-b border-white/10 px-3 py-2">Cost Predictability</th>
                <th className="border-b border-white/10 px-3 py-2">Emotional Match</th>
              </tr>
            </thead>
            <tbody>
              {report.comparisonGrid.rows.map((row) => (
                <tr key={row.vehicleId} className="text-[#d8d0c2]">
                  <td className="border-b border-white/10 px-3 py-3">{row.label}</td>
                  <td className="border-b border-white/10 px-3 py-3">{row.marketMomentum}</td>
                  <td className="border-b border-white/10 px-3 py-3">{row.costPredictability}</td>
                  <td className="border-b border-white/10 px-3 py-3">{row.emotionalMatch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-[1.8rem] border border-white/10 bg-black/20 p-6 sm:p-8">
        <h3 className="text-2xl text-[#fff8eb]">Advisor notes</h3>
        <ul className="mt-4 space-y-3 text-sm leading-7 text-[#d8d0c2]">
          {report.advisorNotes.map((note) => (
            <li key={note} className="rounded-xl border border-white/10 bg-black/25 px-4 py-3">
              {note}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/private-acquisition" className="ghost-button">
          Back to consultation
        </Link>
        <Link href="/contact?intent=private-acquisition-report" className="gold-button">
          Request concierge follow-up
        </Link>
      </div>
    </div>
  );
}

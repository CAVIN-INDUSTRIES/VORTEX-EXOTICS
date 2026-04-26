# Private Acquisition Intelligence Engine

## Overview
`/private-acquisition` delivers a concierge-style intake and recommendation workflow for premium private vehicle sourcing.

## Routes
- `/private-acquisition`
- `/private-acquisition/report-preview`

## Folder Structure
- `apps/web/src/acquisition/engine`: matcher, scoring, financial, market risk, ranker, orchestrator
- `apps/web/src/acquisition/vehicle-data`: normalized vehicle record helpers, curated mock dataset, filters/search
- `apps/web/src/acquisition/market`: market signals and risk rules
- `apps/web/src/acquisition/comparison`: metric extraction, matrix, narratives
- `apps/web/src/acquisition/reporting`: report assembly pipeline
- `apps/web/src/acquisition/ai`: deterministic advisor narrative templates
- `apps/web/src/acquisition/schemas`: Zod validation schemas
- `apps/web/src/acquisition/api`: lead payload contract + submit strategy
- `apps/web/src/acquisition/mock`: baseline mock profile
- `apps/web/src/acquisition/utils`: formatting helpers

## Data Contracts
Contracts live in `types/contracts.ts` and include profile, candidate, recommendation, risk, comparison, projection, report, and lead payload types.

## Scoring Model
10 score categories (0-100) with dynamic weighting based on profile intent.
Default category weights are adjusted for daily-driver vs weekend/collector and depreciation sensitivity.

## Report Pipeline
1. Validate profile
2. Match + score vehicles
3. Project financial scenarios
4. Assess market risk
5. Build comparison matrix
6. Rank recommendation categories
7. Generate advisor narrative
8. Build report sections

## Testing
- Playwright flow: `apps/web/tests/private-acquisition.spec.ts`
- Playwright screenshots: `apps/web/tests/private-acquisition-snapshots.spec.ts`
- Unit tests scaffold: `apps/web/src/acquisition/__tests__/engine.test.ts`

## Deployment Notes
- Works in mock intelligence mode with no AI key required.
- Lead submit endpoint expects `${NEXT_PUBLIC_API_BASE}/acquisition/leads`; gracefully degrades when unavailable.

## Known Limitations
- Market, valuation, and ownership cost signals are mock estimates.
- Report persistence is currently local/session-based.
- Save/email/report sharing actions are intentionally explicit placeholders.

## Future Integration
- Replace mock dataset with validated market feeds.
- Persist reports/leads server-side and expose CRM handoff state.
- Add authenticated advisor review workflow.

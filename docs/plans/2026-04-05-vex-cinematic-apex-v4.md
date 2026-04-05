# VEX Cinematic Apex v4.0 — engagement electrification

**Status:** Phase 1 (GLSL foundation) complete. Phase 2 (Apex layer) in repo: scroll-orchestrated post-FX, particle logo formation, velocity streaks, `dev:apex` / `cinematic:apex` tasks.

## Strategic KPI targets (hypothesis — instrument in analytics)

| Metric | Target | Apex lever |
|--------|--------|------------|
| Hero dwell | +60% vs baseline | Logo formation, god-ray ramp, CTA flash |
| Configurator depth | 4× | Glass panel + live uniforms + “garage” intent |
| Stripe session start | 2.5× | Emotional peak before checkout funnel |
| White-label velocity | 6× | Tenant uniforms + env presets |
| Revenue | **Cinematic Ultra** tier | Custom flake HDRIs, compute floors, velocity-reactive lighting (Phase 3–4) |

## Phases

| Phase | Scope |
|-------|--------|
| **1** | GLSL moat (`@vex/cinematic`), configure sliders, tenant JSON |
| **2 (Apex)** | Scroll boost → Bloom/GodRays; particle VEX formation on load; speed streaks ∝ scroll velocity; `data-apex-hero`; `NEXT_PUBLIC_CINEMATIC_APEX` |
| **3** | CRM shader customizer, white-label engine |
| **4** | Autonomous visuals (MRR / valuation → glow + bursts) |

## Acceptance

- 60 fps on mid-range hardware (manual); CI: `quality:web` + canvas smoke.
- Lighthouse 98+ on marketing routes (existing budget).
- a11y: no duplicate `id`, landmarks preserved.
- Dynamic 3D: `ssr: false` / client-only Canvas.

## Verification

```bash
pnpm install --frozen-lockfile
pnpm --filter @vex/cinematic build
pnpm --filter @vex/shared build
pnpm -w turbo run build
pnpm --filter @vex/web run quality:web
pnpm dev:apex   # root — shaders + cinematic mode + apex
```

## Internal narrative

See [docs/internal/vex-cinematic-investor-narrative-v4.md](../internal/vex-cinematic-investor-narrative-v4.md) and [v4.1 GLSL narrative](../internal/vex-cinematic-investor-narrative-v4.1.md).

---

## Advanced GLSL exploration log (v4.1)

**Status:** v4.1 deepens `@vex/cinematic` with Belcour-style thin-film phases, 3D fbm flake + specular glints, dual clear-coat + analytic env blend, anisotropic chrome with `uAnisotropyStrength`, and **shared `uMouseInfluence`** (R3F pointer → uniform) for hero + configurator.

### Technique inventory

| Technique | Role | Implementation |
|-----------|------|----------------|
| Thin-film iridescence | Angle-dependent hue (RGB phase paths) | `IridescentPaintGLSL.ts` — optical path ∝ `d·cos(θ) / λ` + mouse/time |
| Procedural metallic flake | Pearl sparkle, diamond glints | `MetallicFlakeLayer.ts` — `vex_fbm3` + `pow` sparkle + `N·H` glint |
| Anisotropic chrome | Stretched wheel/exhaust highlights | `AnisotropicChromeGLSL.ts` — bitangent from `cross(n,up)` × `uAnisotropicChrome` × `uAnisotropyStrength` |
| Multi-layer clear-coat | Fresnel stack + refraction feel | `MultiLayerClearCoat.ts` — dual lobe + warm/cool analytic “env” blend × `uClearCoatRefraction` |

### Integration roadmap

- **Chunks:** `onBeforeCompile` on `MeshPhysicalMaterial`; body = iridescent + flake + clear-coat; chrome meshes = anisotropic layer only (`applyCinematicLuxuryPaint`).
- **Uniforms:** `CinematicPaintUniforms` in `types.ts` — tenant JSON / CRM → same keys as `/configure` sliders.
- **Mouse:** `CinematicMouseUniform` + `root.userData.__cinematicMouse` shared with time ticker.

### Phase 2 acceptance (v4.1)

- 60 fps target on mid-range GPUs (manual); CI unchanged (`quality:web`).
- Lighthouse 98+ on marketing routes (existing LHCI budget).
- Tenant theming: `@vex/shared` `TenantCinematic3dSchema` includes `clearCoatRefraction`, `anisotropyStrength`.
- Dynamic 3D: client-only Canvas; shaders ship in `@vex/cinematic` (no inline shader strings in app routes).

### Resource matrix (research pointers)

- **Belcour / Barla** — multilayer BRDF / thin-film (SIGGRAPH course notes; Belcour library patterns for phase-accurate films).
- **Shadertoy** — iridescence / thin-film search terms for phase stacking intuition (not copied verbatim; VEX uses analytic RGB phases).
- **Three.js** — `onBeforeCompile` + `#include <output_fragment>` injection (r169 `MeshPhysicalMaterial`).
- **fbm / sparkle** — classic IQ-style hash/fbm expanded to 3D domain for flake variation.

### KPI targets (v4.1 hypothesis)

| Metric | Target | Lever |
|--------|--------|--------|
| Hero dwell | +70% | Mouse-driven iridescence + flake + god-ray ramp (Apex) |
| Configurator depth | 5× | New uniforms + glass sliders |
| Stripe session start | 3× | Liquid-metal CTA + burst sync (existing) |
| White-label velocity | 7× | Extended tenant uniform schema |

### Verification

```bash
pnpm install --frozen-lockfile
pnpm --filter @vex/cinematic build
pnpm --filter @vex/shared build
pnpm -w turbo run build
pnpm --filter @vex/web run quality:web
pnpm dev:glsl-apex   # max cinematic: shaders + mode + apex
```

---

## Next phase: Full GLSL Apex integration & engagement electrification (v4.2)

**Status:** Full advanced suite **live** in `@vex/cinematic` + hero + `/configure`: analytic thin-film **plus** 1D spectral **LUT** (`uIridescenceLUT` / `createIridescenceLUTTexture`), mouse + time, flake/clear/chrome layers; **ApexHeroScene** is the dynamic-import entry; **CTA** pulse interval syncs burst particles on hover (Apex); **exploded** configure path uses **pointer raycast** emissive highlight (`ExplodedRaycastHighlight`).

### GLSL chunks activated (body paint)

| Chunk | Uniforms / assets |
|-------|-------------------|
| Thin-film + LUT fallback | `uIridescenceLUTBlend`, `sampler2D uIridescenceLUT` (256×1 DataTexture), `uIridescenceStrength`, `uIridescenceAngle`, `uMouseInfluence` |
| Procedural flake sparkle | `uFlakeDensity`, 3D fbm + glint, time scroll |
| Anisotropic chrome (wheels) | `uAnisotropicChrome`, `uAnisotropyStrength` |
| Multi-layer clear-coat | `uClearCoatIntensity`, `uClearCoatRefraction` (dual-lobe + analytic warm/cool) |

### Engagement electrification primitives (wired)

- **Cursor-reactive speed streaks** — `apexScrollVelocity` → `SpeedStreaks` (Apex).
- **Scroll-orchestrated god-ray / bloom** — `apexScrollBoost` → `VortexPostFXStack`.
- **Particle vortex logo formation** — `formationProgress` when `NEXT_PUBLIC_CINEMATIC_APEX=true` (use `dev:glsl-apex` for full stack).
- **Magnetic liquid-metal CTA** — hover burst + **periodic** `triggerBurstFlash` while primary CTA hovered (Apex).
- **Lenis** — global smooth scroll in `CinematicMotionProvider` (scroll refs still drive Apex math).

### White-label theming hooks

- `@vex/shared` `TenantCinematic3dSchema`: includes `iridescenceLUTBlend` and all v4.1 uniforms.
- Runtime: same `CinematicPaintUniforms` merged in `HeroGltfCar` / `VortexCarMaterialGLSL`.

### KPI dashboard (v4.2 hypothesis)

| Metric | Target | Lever |
|--------|--------|--------|
| Hero dwell | +75% | LUT + mouse + flake + scroll god-rays |
| Configurator depth | 5.5× | All uniforms + exploded raycast + glass UI |
| Magnetic CTA → Stripe intent | 3.2× | CTA burst pulse + paint sync |
| White-label velocity | 8× | Tenant JSON + presets |
| Revenue | **Cinematic Apex GLSL Ultra** | Custom LUT / HDRI tier (roadmap) |

### Acceptance (v4.2)

- 60 fps target mid-range (manual); CI: `quality:web` smoke.
- Lighthouse 98+ (existing LHCI).
- Zero **new** console errors in happy path (shader compile); dynamic imports for 3D routes.
- Playwright: `tests/cinematic-v42.spec.ts` — hero scroll + `data-cinematic-glsl` / canvas.

### Verification

```bash
pnpm install --frozen-lockfile
pnpm --filter @vex/cinematic build
pnpm --filter @vex/shared build
pnpm -w turbo run build
pnpm --filter @vex/web run quality:web
pnpm dev:apex-v42    # shaders on (see .env); combine with CINEMATIC_APEX in dev:glsl-apex for full Apex
pnpm glsl:apex-v42   # turbo pipeline
```

### Investor narrative (v4.2)

See [docs/internal/vex-cinematic-investor-narrative-v4.2.md](../internal/vex-cinematic-investor-narrative-v4.2.md).

---

## Full GLSL Apex + quality gate resolution (v4.2 configure)

**Issue:** `quality:web` smoke `cinematic-apex.spec.ts` failed when `/configure` wrapped `ConfigureExperienceClient` in a **fixed-height** container with **`overflow: hidden`**, clipping the toolbar (exploded toggle), glass sliders, and **`[data-save-garage="1"]`** CTA.

**Fix:**

- **Layout:** `apps/web` configure + `[tenantSlug]` pages use **`overflow: visible`** and **no** fixed outer height; **viewer** keeps `min-height: min(55vh, 520px)` inside `ConfigureExperience.module.css` (`.viewerWrap`).
- **UI contract (smoke):**
  - **Garage:** `<button type="button" data-save-garage="1">` → `router.push('/contact?intent=garage-save')`.
  - **Exploded:** `<button data-exploded-view …>Exploded view</button>` — toggles raycast + decorative hotspots; **`explodedInteractive`** on `CinematicCarViewer`.
- **Acceptance:** `tests/cinematic-apex.spec.ts` + `tests/cinematic-v42.spec.ts` pass; `pnpm --filter @vex/web run quality:web` green.

### KPI dashboard (v4.2 — locked targets)

| Metric | Target |
|--------|--------|
| Hero dwell | +75% |
| Configurator engagement | 5.5× |
| Magnetic CTA → Stripe session | 3.2× |
| White-label dealer velocity | 8× vs legacy DMS |
| Tier | **Cinematic Apex GLSL Ultra** (README + [v4.2 narrative](../internal/vex-cinematic-investor-narrative-v4.2.md)) |

### Turbo

- **`cinematic:apex-v42`** — same pipeline as `glsl:apex-v42` (web production build after `^build`).
- **`dev:apex-v42`** — `NEXT_PUBLIC_CINEMATIC_SHADERS_V3=true` + `@vex/web` dev (root `package.json`).

---

## Advanced GLSL techniques — the visual moat (v4.3)

**Status:** v4.3 deepens the **modular shader suite** with explicit **Belcour/Barla-style cosine hue modulation** on thin-film output, **diamond-like `pow(·,12)` sparkle** with **time + mouse twinkle**, **tangent × light-direction** anisotropic specular on chrome, and **fbm micro-perturbation** on clear-coat Fresnel / env blend. **Configure** garage CTA uses global **`glassmorphic`** + **`magnetic-cta`** hooks; **hero** cockpit KPIs track v4.3 hypothesis targets.

### Quality gate resolution + full advanced GLSL activation

**Smoke contract (`quality:web`):**

- **`[data-save-garage="1"]`** — primary garage CTA (`Save to My Garage`), `glassmorphic` + `magnetic-cta` + module sizing (`ctaGarage` ≈ `px-8 py-4 text-lg font-medium`), `handleSaveToGarage` → `/contact?intent=garage-save`.
- **`button[data-exploded-view]`** — `Exploded View` toggle, same global classes + `ctaExploded` (≈ `px-6 py-3`), `toggleExplodedView` → `explodedInteractive` on **`CinematicCarViewer`** (`paintMode="cinematicLuxury"`) for raycast hotspots + decorative pulse layer.

**Layout:** `/configure` and `/configure/[tenantSlug]` wrap the client in **`overflow: visible`** (no clipping of toolbar / CTA).

**Full GLSL activation:** `iridescentCarPaint.ts` composes `IridescentPaintGLSL`, `MetallicFlakeLayer`, `MultiLayerClearCoat`, `AnisotropicChromeGLSL`; live sliders map to `CinematicPaintUniforms` (`flakeDensity`, `iridescenceAngle`, `anisotropyStrength`, `clearCoatRefraction`, etc.). **`CinematicMouseUniform`** lerps R3F `mouse` → `uMouseInfluence` on the GLTF root (hero + configurator) for iridescence + flake reactivity.

**White-label:** `@vex/shared` **`TenantCinematic3dSchema`** — same uniform keys as `/configure`; tenant JSON merges into `cinematicUniforms` at runtime.

### Technique inventory (this cycle)

| Technique | Role | Implementation |
|-----------|------|----------------|
| True thin-film + Belcour/Barla cosine | Hue variance on view + time + mouse | `IridescentPaintGLSL.ts` — `belcourIrid` mixes into `thinFilm` before diffuse add |
| Procedural metallic flake + twinkle | Pearl / diamond engagement | `MetallicFlakeLayer.ts` — `diamondSparkle` + `sin` twinkle on `uCinematicTime` / `f3` / mouse |
| Anisotropic BRDF (brushed chrome) | Stretched + light-aligned highlights | `AnisotropicChromeGLSL.ts` — `tDotL` + `halfAL` spec lobe × `ani` |
| Multi-layer clear-coat | Dual Fresnel + micro-surface variance | `MultiLayerClearCoat.ts` — `vex_fbm` on `vUv` perturbs `coat` / `nvBlend` |
| View-dependent env + time sparkle | Cursor-reactive uniforms | Existing `uMouseInfluence` + `uCinematicTime` across layers |

### White-label hooks

- Tenant JSON → same `CinematicPaintUniforms` keys (`@vex/shared` `TenantCinematic3dSchema`); runtime **LUT** + **mouse** shared with hero.

### KPI dashboard (v4.3 hypothesis)

| Metric | Target | Lever |
|--------|--------|--------|
| Hero dwell | +80% | Belcour irid + flake twinkle + Apex god-ray / scroll ramp |
| Configurator engagement | 6× | Live sliders + exploded raycast + glass panel |
| Magnetic CTA → Stripe session | 3.5× | Liquid-metal CTA + burst + `magnetic-cta` hover |
| White-label dealer velocity | 9× vs legacy DMS | Tenant uniforms + presets |
| Revenue tier | **Cinematic Apex GLSL Ultra** | Custom flake textures, iridescence presets, dealer HDRIs (roadmap) |

### Acceptance (v4.3)

- **60 fps** target on mid-range hardware (manual); CI: `quality:web` green (a11y + cinematic smoke).
- **Lighthouse** 98+ on marketing routes (existing LHCI budget).
- **Dynamic imports** for 3D; **zero new** shader compile errors in happy path.
- **Playwright:** `cinematic-apex.spec.ts`, `cinematic-v42.spec.ts`, `cinematic-moat.spec.ts` pass.

### Verification

```bash
pnpm install --frozen-lockfile
pnpm --filter @vex/cinematic build
pnpm --filter @vex/shared build
pnpm -w turbo run build
pnpm --filter @vex/web run quality:web
pnpm dev:apex-v42   # full shader path; combine with dev:glsl-apex for Apex + particles
```

### Investor / README narrative

- **Cinematic Apex GLSL Ultra:** custom procedural flake, spectral LUT blend, tenant HDRI presets — see root **README** v4.3 bullet and [v4.2 narrative](../internal/vex-cinematic-investor-narrative-v4.2.md) (tier framing; v4.3 extends technique depth).

---

## Full engagement electrification layer (v4.4)

**Status:** v4.4 wires **tenant-scoped cinematic JSON** (`TenantCinematic3d` + `tenantCinematicUniformPatch`) into **`CinematicCarViewer`** and extends **`VortexHeroBrand`** with **`cinematicUniforms`** + **`environmentMapURL`**. Hero **cursor rim light** scales with **Apex scroll boost** + pointer magnitude; **particle VEX formation** reads slightly brighter (vortex points). **`cinematic:apex-v44` / `dev:apex-v44`** match the v4.2 pipeline pattern.

### What’s live

| Surface | Behavior |
|---------|----------|
| `/configure` | `resolveTenantCinematic3d(slug)` → sliders initialized + `environmentPreset` / `environmentMapURL` passed to viewer |
| Hero (`@vex/ui/3d` `VortexHeroScene`) | Optional `brand.cinematicUniforms`, custom HDR via `brand.environmentMapURL`; rim light + scroll/orbit + particle vortex + god-rays (existing Apex stack) |
| `@vex/shared` | `environmentMapURL` on schema; **`tenantCinematicUniformPatch`** exports numeric uniform merge |
| CRM | Same **cinematic void** body treatment as marketing (`apps/crm` `globals.css`); shared tokens for brand consistency |

### KPI dashboard (v4.4 hypothesis)

| Metric | Target | Lever |
|--------|--------|--------|
| Hero dwell | +85% | Particle logo formation, scroll god-ray ramp, rim light + paint |
| Configurator engagement | 6.5× | Tenant defaults + live sliders + exploded raycast |
| Magnetic CTA → Stripe session | 3.8× | Liquid-metal CTA + burst sync (Apex) |
| White-label dealer velocity | 10× vs legacy DMS | Tenant JSON → uniforms + env in one schema |
| Revenue | **Cinematic Apex GLSL Ultra** | Custom flake, iridescence presets, dealer HDRIs, compute-particle floors (roadmap) |

### Acceptance (v4.4)

- `pnpm -w turbo run build` + `pnpm --filter @vex/web run quality:web` green.
- No regressions: `cinematic-apex.spec.ts` configure smoke; hero canvas smoke.
- **Production launch checklist:** env `NEXT_PUBLIC_CINEMATIC_SHADERS_V3` for marketing shader path; optional `NEXT_PUBLIC_CINEMATIC_APEX` for full particle + post stack; tenant cinematic JSON served from API/edge when rolling white-label; run **`pnpm dev:apex-v44`** for local hero + configure verification.

### Verification

```bash
pnpm install --frozen-lockfile
pnpm --filter @vex/cinematic build
pnpm --filter @vex/shared build
pnpm -w turbo run build
pnpm --filter @vex/web run quality:web
pnpm dev:apex-v44
pnpm cinematic:apex-v44   # turbo — @vex/web production build
```

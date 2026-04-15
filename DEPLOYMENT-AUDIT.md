# VEX Website Deployment Audit & Recovery Plan

## A. Deployment Diagnosis

### Current State (CRITICAL FINDINGS)

| Item | Current Reality | Issue |
|------|----------------|-------|
| **Live Site** | `https://vex-client.netlify.app` | Using "vex-client" naming, not "vex-website" |
| **Deploy Source** | GitHub: `Danticipation/vex-website`, commit `8a54c6f` | **OUTDATED FORK** - This is not the canonical repo |
| **Canonical Repo** | `iamBOBERTBOBERTS/vex-website` | Contains the actual monorepo with apps/web |
| **netlify.toml** | **MISSING** | No repo-owned deployment config exists |
| **Monorepo Target** | Not configured | Build doesn't target `apps/web` specifically |
| **Branch** | `main` | Correct branch, wrong repo |

### The Core Problem

The Netlify project `vex-client` is building from an **outdated fork** (`Danticipation/vex-website`) rather than the **canonical source** (`iamBOBERTBOBERTS/vex-website`). This means:

1. The monorepo structure (pnpm + Turbo workspaces) is not being respected
2. The `apps/web` Next.js app is not being properly targeted
3. The deployed site is missing the premium UI improvements in the canonical repo

---

## B. Exact Netlify Fix

### Option 1: RECOMMENDED — Repoint `vex-client` Site (Minimal Disruption)

**Why:** Keeps the existing Netlify URL (`vex-client.netlify.app`) which may be bookmarked/shared.

**Steps:**

1. **Log into Netlify Dashboard**
   - Go to https://app.netlify.com/sites/vex-client

2. **Change Repository Source**
   - Navigate to: Site settings → Build & deploy → Continuous Deployment → Build settings
   - Click "Edit settings"
   - **Repository:** Change from `github.com/Danticipation/vex-website` to `github.com/iamBOBERTBOBERTS/vex-website`
   - **Branch:** Keep `main`

3. **Update Build Settings**
   - **Base directory:** `.` (repo root - the pnpm workspace)
   - **Build command:** `pnpm install --frozen-lockfile && pnpm --filter @vex/web run build`
   - **Publish directory:** `apps/web/dist`

4. **Set Environment Variables**
   - Navigate to: Site settings → Environment variables
   - Add:
     - `NODE_VERSION` = `20`
     - `NODE_ENV` = `production`

5. **Deploy & Verify**
   - Trigger manual deploy: Deploys → Trigger deploy → Clear cache and retry
   - Verify build logs show pnpm installing and Next.js building correctly

### Option 2: Create New Site `vex-website` (Clean Slate)

**Why:** Aligns site name with repo name, removes all legacy confusion.

**Steps:**

1. **Create New Site**
   - In Netlify dashboard: "Add new site" → Import from GitHub
   - Select: `iamBOBERTBOBERTS/vex-website` → `main` branch

2. **Configure Same Settings as Option 1** (build command, publish dir, env vars)

3. **Configure Custom Domain (if applicable)**
   - If there's a custom domain, transfer it from `vex-client` to `vex-website`

4. **Update DNS/Redirects**
   - Set up redirect from `vex-client.netlify.app` to `vex-website.netlify.app`

5. **Delete or Archive `vex-client`**
   - After confirming `vex-website` works, delete the old site

---

## C. Exact Files Added/Updated

### 1. `netlify.toml` (NEW FILE)

Created at repo root with:
- Build command targeting `@vex/web`
- Static export configuration for Next.js
- Security headers
- Asset caching rules
- Redirect rules

See: `./netlify.toml`

### 2. `apps/web/next.config.js` (UPDATED)

Changes made:
- Added `output: 'export'` for static site generation
- Set `distDir: 'dist'` for consistent output path
- Disabled image optimization for static export compatibility
- Added trailing slash for cleaner URLs

### 3. `.github/workflows/deploy-prod.yml` (NO CHANGE NEEDED)

The workflow already:
- Builds the web app via `pnpm run build`
- Triggers deploy hooks (Netlify + Render)
- Runs full test suite before deploy

Once Netlify is configured with `netlify.toml`, the deploy hook will build correctly.

---

## D. Branch/Repo/Site Naming Recommendation

### Recommendation: **CONSOLIDATE into `vex-website`**

**Rationale:**

1. **Single Source of Truth:** `vex-website` is the canonical repo name in the organization
2. **Avoid Confusion:** Having both `vex-client` and `vex-website` creates cognitive overhead
3. **Future-Proof:** The monorepo contains `apps/web`, `apps/api`, `apps/crm` - `vex-website` better describes the public-facing nature
4. **SEO Consistency:** Aligns repository name with deployed site name

### Naming Strategy

| Element | Current | Recommended |
|---------|---------|-------------|
| **GitHub Repo** | `iamBOBERTBOBERTS/vex-website` | Keep as-is (canonical) |
| **Netlify Site** | `vex-client` | Rename or replace with `vex-website` |
| **Site URL** | `vex-client.netlify.app` | `vex-website.netlify.app` |
| **Package** | `@vex/web` | Keep as-is (workspace naming) |

### Migration Path

1. **Immediate:** Implement Option 1 (repoint `vex-client` to correct repo)
2. **Short-term:** Set up `vex-website.netlify.app` as new site
3. **Transition:** Configure 301 redirect from `vex-client` to `vex-website`
4. **Final:** Archive `vex-client` site once traffic confirms move

---

## E. UI Improvement Plan (Premium Redesign)

### Current Visual Issues Identified

1. **Generic Template Feel**
   - Service icons are placeholder symbols (`£`, `◆`, `◈`, `◇`) not actual SVG icons
   - Trust logos are text placeholders ("Partner", "Press", "Certified")
   - No actual imagery or 3D elements despite the "cinematic" intent

2. **Typography Hierarchy Weak**
   - All headings feel similar in weight
   - Line-height and letter-spacing need refinement for luxury feel
   - Montserrat at 800 weight feels too aggressive for premium automotive

3. **Spacing & Rhythm**
   - Sections lack distinct visual separation
   - Cards feel cramped
   - No breathing room for premium content

4. **Color System**
   - Gold accent (`#d8b262`) is good but underutilized
   - Missing depth through subtle gradients and shadows
   - No ambient lighting effects for "exotic" feel

5. **CTA Structure**
   - Header CTAs are crowded
   - "Book a Test Drive" as primary header CTA may be premature (no context yet)
   - Card CTAs lack visual distinction

### Redesign Checklist

#### Phase 1: Foundation (High Impact, Low Risk)

- [ ] **Typography System**
  - Replace Montserrat 800 headlines with more refined font pairing
  - Consider: `font-family: 'Inter' for UI, 'Playfair Display' or 'Cormorant Garamond' for headlines`
  - Implement proper typographic scale: Display → H1 → H2 → Body → Caption
  - Add subtle text-shadow to hero headline for depth

- [ ] **Color Refinement**
  - Keep `#d8b262` gold as primary accent
  - Add secondary accent: deep bronze `#8B7355`
  - Implement subtle gold glow on hover instead of generic shadow
  - Add radial gradient ambient lighting to hero section

- [ ] **Spacing System**
  - Establish 8px base grid system
  - Increase section padding from `4rem` to `6rem` for breathing room
  - Add subtle section dividers using CSS borders with gradient

#### Phase 2: Component Enhancement

- [ ] **Hero Section**
  - Replace static gradient with parallax-ready layered background
  - Add subtle animated particles or light rays (CSS only, no heavy JS)
  - Center content should feel like a "vault door" opening experience
  - Metrics should have animated counters on scroll-into-view

- [ ] **Navigation**
  - Header should be transparent on hero, solid on scroll (already partially done)
  - Add "glassmorphism" effect: `backdrop-filter: blur(20px) saturate(180%)`
  - Move "Book a Test Drive" CTA to hero section only, keep header minimal

- [ ] **Inventory Cards**
  - Replace generic card hover with "spotlight" effect
  - Add image zoom on hover with smooth transition
  - Badge styling: gold border, not filled
  - Price should use tabular figures for alignment

- [ ] **Services Section**
  - Replace placeholder icons with custom SVG icons
  - Each service card should have subtle gradient background
  - Implement staggered reveal animation on scroll

- [ ] **Testimonials**
  - Add quotation mark as large decorative element
  - Card styling should feel like luxury testimonial cards
  - Consider horizontal scroll on mobile instead of stacked

- [ ] **Trust Logos**
  - Replace placeholder text with actual partner logos (SVG)
  - Implement grayscale-to-color on hover
  - Consider infinite scroll marquee for many logos

- [ ] **Footer**
  - Add newsletter signup with premium input styling
  - Include actual social media links (not just placeholders)
  - Add subtle top border gradient

#### Phase 3: Cinematic Polish

- [ ] **3D/Parallax Effects**
  - Add CSS-only parallax to hero background layers
  - Implement subtle 3D tilt effect on inventory cards (CSS transform on hover)

- [ ] **Micro-interactions**
  - Button hover: magnetic cursor effect (CSS only)
  - Link hover: underline grows from center
  - Scroll indicator on hero (animated chevron)

- [ ] **Loading States**
  - Skeleton screens should have shimmer animation
  - Page transition: fade + slight Y translate

- [ ] **Dark Mode Refinement**
  - Current dark mode is good, but add subtle noise texture overlay
  - Consider slight blue-shift to blacks (not pure #000, but #0a0a0f)

#### Phase 4: Content Strategy

- [ ] **Replace Placeholder Content**
  - Write actual service descriptions (current ones are generic)
  - Source real testimonials or create realistic placeholder quotes
  - Add actual partner logos or remove section

- [ ] **Imagery**
  - Hero needs high-quality automotive imagery (dark, moody, exotic)
  - Inventory cards need consistent photography style
  - Consider WebP with fallback for performance

---

## F. Suspicious Generic/Template Sections to Replace

| Section | Issue | Priority |
|---------|-------|----------|
| **Service Icons** | Using Unicode symbols (`£`, `◆`, `◈`, `◇`) instead of designed icons | High |
| **Trust Logos** | Placeholder text ("Partner", "Press", "Certified") | High |
| **Testimonials** | Generic quotes with initials only | Medium |
| **Social Links** | Placeholder `#` hrefs | Medium |
| **Footer Links** | Standard template links, no actual content pages | Low |
| **"Build Your Ride"** | CTA exists but page may be incomplete (verify) | Medium |

---

## G. Implementation Order

### Immediate (This Week)

1. ✅ Create `netlify.toml` with correct build settings
2. ✅ Update `apps/web/next.config.js` for static export
3. 🔄 **Netlify Dashboard:** Repoint `vex-client` to `iamBOBERTBOBERTS/vex-website`
4. 🔄 **Netlify Dashboard:** Update build settings per Section B
5. 🔄 Test deploy on staging/preview branch

### Phase 1: Visual Foundation (Next Sprint)

6. Update typography system (fonts, scale)
7. Refine color system with bronze accent
8. Implement 8px spacing grid
9. Hero section parallax + ambient lighting

### Phase 2: Component Polish (Following Sprint)

10. Design and implement custom SVG service icons
11. Redesign inventory cards with spotlight effect
12. Rewrite service descriptions (less generic)
13. Replace trust logos placeholder with actual content or remove

### Phase 3: Premium Effects (Backlog)

14. CSS-only 3D tilt effects on cards
15. Micro-interactions (magnetic buttons, animated underlines)
16. Scroll-triggered animations
17. Page transitions

### Phase 4: Content & Assets

18. Source/produce hero imagery
19. Write authentic testimonials or source real ones
20. Create actual partner logo assets
21. Verify all CTA destinations have proper content

---

## H. Final Recommendation

**KEEP `vex-client` TEMPORARILY, MIGRATE TO `vex-website`**

### Immediate Action Plan

1. **Repoint existing `vex-client` site** to canonical repo (Option 1 from Section B)
2. **Merge `netlify.toml`** to `main` branch
3. **Verify build succeeds** with new configuration
4. **Create new `vex-website` site** in parallel
5. **Add 301 redirect** from `vex-client` to `vex-website` once verified
6. **Archive `vex-client`** after 30-day transition period

### Why Not Keep Both?

- **SEO Split:** Search engines will see duplicate content across two URLs
- **Maintenance Overhead:** Every config change must be duplicated
- **User Confusion:** Team members won't know which URL to share
- **Analytics Fragmentation:** Traffic data split across properties

### Success Metrics

| Metric | Before | Target After |
|--------|--------|--------------|
| Build Source | Wrong repo | Correct repo |
| Deploy Time | Unknown | <5 minutes |
| netlify.toml | Missing | Present |
| Visual Polish | Generic template | Premium automotive |
| Lighthouse Score | TBD | >90 all categories |

---

## Appendices

### Appendix A: netlify.toml Reference

```toml
[build]
  base = "."
  publish = "apps/web/dist"
  command = "pnpm install --frozen-lockfile && pnpm --filter @vex/web run build"

[build.environment]
  NODE_VERSION = "20"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Appendix B: Useful Commands

```bash
# Test build locally
pnpm install --frozen-lockfile
pnpm --filter @vex/web run build

# Preview production build
pnpm --filter @vex/web run start

# Check build output
ls -la apps/web/dist/
```

### Appendix C: Netlify URLs

- **Current (legacy):** https://vex-client.netlify.app
- **Target (new):** https://vex-website.netlify.app
- **Dashboard:** https://app.netlify.com/sites/vex-client

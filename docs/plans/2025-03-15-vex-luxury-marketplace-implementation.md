# VEX Luxury Marketplace Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Ship a consumer-first luxury automotive platform (customer site + CRM) with dual inventory, build-your-own, shipping, financing, trade-in, customer portal, and extensible CRM.

**Architecture:** Monorepo with `apps/web` (Next.js customer site), `apps/api` (Node/Express), `apps/crm` (Next.js staff app), and `packages/shared` (types, Zod). Postgres via Prisma; API is the only backend; JWT auth with roles. Reference: `docs/plans/2025-03-15-vex-luxury-marketplace-design.md`.

**Tech Stack:** Node 20+, pnpm, TypeScript, Next.js 14 (App Router), Express, Prisma, Zod, React 18. Optional: Turborepo for monorepo orchestration.

---

## Phase 1: Monorepo, API skeleton, database, auth

### Task 1.1: Create monorepo structure

**Files:**
- Create: `package.json` (root, workspaces)
- Create: `pnpm-workspace.yaml`
- Create: `apps/api/package.json`, `apps/web/package.json`, `apps/crm/package.json`, `packages/shared/package.json`
- Create: `tsconfig.json` (root base), `apps/api/tsconfig.json`, `apps/web/tsconfig.json`, `packages/shared/tsconfig.json`

**Steps:**
1. Root `package.json`: `"private": true`, `"workspaces": ["apps/*", "packages/*"]`. Scripts: `"dev:api"`, `"dev:web"`, `"dev:crm"`, `"build"` (build all).
2. `pnpm-workspace.yaml`: `packages: ["apps/*", "packages/*"]`.
3. Each app/package has minimal package.json with name, main/types, and dependencies. Shared has no React; api has express, prisma, zod; web/crm have next, react.
4. Commit: `chore: init monorepo with workspaces`

---

### Task 1.2: Shared package — base types and Zod

**Files:**
- Create: `packages/shared/package.json` (name: `@vex/shared`, exports index)
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/schemas/auth.ts`
- Create: `packages/shared/src/types/user.ts`

**Steps:**
1. Export from index: schemas (auth), types (user). User type: id, email, role (enum), name?, phone?, tier?, createdAt.
2. Zod: registerSchema (email, password, name), loginSchema (email, password). Export inferred types.
3. Commit: `feat(shared): add user types and auth schemas`

---

### Task 1.3: Prisma schema — users and auth

**Files:**
- Create: `apps/api/package.json` (add prisma, @prisma/client, bcrypt, jsonwebtoken)
- Create: `apps/api/prisma/schema.prisma`

**Steps:**
1. Schema: datasource db (env DATABASE_URL), generator client. Model User: id (cuid), email (unique), passwordHash, role (enum: CUSTOMER, STAFF, ADMIN), name?, phone?, tier? (e.g. STANDARD, VIP), createdAt, updatedAt.
2. Run `pnpm exec prisma generate` in apps/api. Verify no errors.
3. Commit: `feat(api): add Prisma and User model`

---

### Task 1.4: API Express app and health check

**Files:**
- Create: `apps/api/src/index.ts`
- Create: `apps/api/src/app.ts`
- Create: `apps/api/src/routes/health.ts`

**Steps:**
1. Express app: json(), cors (origin from env or * for dev), mount `/health` → GET returns `{ status: "ok" }`.
2. index.ts: load env (e.g. dotenv), start server on PORT (default 3001). No DB call in health.
3. Run `pnpm dev` in apps/api, GET http://localhost:3001/health → 200 and body `{ status: "ok" }`.
4. Commit: `feat(api): add Express app and health route`

---

### Task 1.5: Auth routes — register and login

**Files:**
- Create: `apps/api/src/routes/auth.ts`
- Create: `apps/api/src/controllers/authController.ts`
- Create: `apps/api/src/middleware/validate.ts` (generic Zod validator)
- Modify: `apps/api/src/app.ts` (mount /auth, use validate for body)

**Steps:**
1. validate middleware: accepts Zod schema, parses req.body, returns 400 on error.
2. POST /auth/register: validate(registerSchema), hash password (bcrypt), create User, return 201 + user (exclude passwordHash) + JWT (include userId, role). Conflict if email exists.
3. POST /auth/login: validate(loginSchema), find user, compare password, return 200 + user + JWT.
4. JWT secret from env; expiry e.g. 7d. Use same response shape (user, token) for both.
5. Commit: `feat(api): add register and login`

---

### Task 1.6: Auth middleware and GET /auth/me

**Files:**
- Create: `apps/api/src/middleware/auth.ts`
- Modify: `apps/api/src/routes/auth.ts` (add GET /me), `apps/api/src/controllers/authController.ts` (me handler)

**Steps:**
1. auth middleware: Bearer token from Authorization header, verify JWT, attach req.user (id, email, role). 401 if missing/invalid.
2. GET /auth/me: auth required, return current user from DB (exclude passwordHash).
3. Commit: `feat(api): add auth middleware and GET /auth/me`

---

## Phase 2: Inventory, vehicles catalog, shared schemas

### Task 2.1: Prisma schema — vehicles, inventory, configuration_options

**Files:**
- Modify: `apps/api/prisma/schema.prisma`

**Steps:**
1. Model Vehicle: id, make, model, trimLevel, year, basePrice, bodyType?, imageUrls (Json?), isActive (default true), createdAt, updatedAt.
2. Model Inventory: id, source (enum COMPANY, PRIVATE_SELLER), vehicleId (FK Vehicle), listedByUserId? (FK User, for private), location?, listPrice, mileage?, status (enum AVAILABLE, RESERVED, SOLD), vin?, verificationStatus? (enum PENDING, APPROVED, REJECTED for private), imageUrls? (Json), specs? (Json), createdAt, updatedAt.
3. Model ConfigurationOption: id, vehicleId? (nullable, FK Vehicle), category (enum TIRES, PAINT, ACCESSORIES, STYLING), name, priceDelta, isRequired (default false), createdAt, updatedAt.
4. Run `pnpm exec prisma generate`. Create migration: `prisma migrate dev --name add_vehicles_inventory_options`.
5. Commit: `feat(api): add Vehicle, Inventory, ConfigurationOption models`

---

### Task 2.2: Shared types for vehicles and inventory

**Files:**
- Create: `packages/shared/src/types/vehicle.ts`
- Create: `packages/shared/src/types/inventory.ts`
- Modify: `packages/shared/src/index.ts` (export new types)

**Steps:**
1. Vehicle: id, make, model, trimLevel, year, basePrice, bodyType?, imageUrls?, isActive. ConfigurationOption: id, vehicleId?, category, name, priceDelta, isRequired.
2. Inventory: id, source, vehicleId, listedByUserId?, location?, listPrice, mileage?, status, vin?, verificationStatus?, imageUrls?, specs?, vehicle? (optional nested). Enums match Prisma.
3. Commit: `feat(shared): add vehicle and inventory types`

---

### Task 2.3: API — GET /vehicles and GET /vehicles/:id/options

**Files:**
- Create: `apps/api/src/routes/vehicles.ts`
- Create: `apps/api/src/controllers/vehiclesController.ts`
- Modify: `apps/api/src/app.ts` (mount /vehicles)

**Steps:**
1. GET /vehicles: list vehicles where isActive, optional query make/model. Return array of vehicles.
2. GET /vehicles/:id/options: return configuration options for vehicle (and optionally global options where vehicleId null). 404 if vehicle not found.
3. Commit: `feat(api): add vehicles and options endpoints`

---

### Task 2.4: API — GET /inventory and GET /inventory/:id

**Files:**
- Create: `apps/api/src/routes/inventory.ts`
- Create: `apps/api/src/controllers/inventoryController.ts`
- Modify: `apps/api/src/app.ts` (mount /inventory)

**Steps:**
1. GET /inventory: query params source, location, minPrice, maxPrice, make, model, year, status (default AVAILABLE), limit, offset. Filter and paginate. Include vehicle relation. Private listings: only APPROVED or filter by verificationStatus.
2. GET /inventory/:id: by id, include vehicle and options. 404 if not found.
3. Commit: `feat(api): add inventory list and detail endpoints`

---

### Task 2.5: API — POST /inventory (private listing) and PATCH /inventory/:id

**Files:**
- Create: `packages/shared/src/schemas/inventory.ts`
- Modify: `apps/api/src/routes/inventory.ts`, `apps/api/src/controllers/inventoryController.ts`

**Steps:**
1. Zod schema: create (source, vehicleId, location?, listPrice, mileage?, vin?, imageUrls?, specs?). For private: source PRIVATE_SELLER, require auth, set listedByUserId, verificationStatus PENDING.
2. POST /inventory: auth optional for company (or require staff); for private require auth. Validate body, create inventory. Return 201 + inventory.
3. PATCH /inventory/:id: auth required. Staff can update status, verificationStatus; owner can update own private listing (limited fields). Return 200 + updated inventory.
4. Commit: `feat(api): add inventory create and update`

---

## Phase 3: Customer site — shell, theme, home, inventory

### Task 3.1: Next.js app (web) and dark theme

**Files:**
- Create: `apps/web/package.json` (next, react, @vex/shared workspace)
- Create: `apps/web/tsconfig.json`, `apps/web/next.config.js`
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/globals.css`
- Create: `apps/web/.env.local.example` (NEXT_PUBLIC_API_URL)

**Steps:**
1. layout: root layout, metadata, body with font classes (Montserrat, Poppins, Inter from next/font). globals.css: CSS variables --bg-primary #0D0D0D, --bg-card #1E1E1E, --accent #FFD700, --text-primary #FFFFFF, --text-secondary #CCCCCC; apply to body.
2. Commit: `feat(web): add Next.js app and dark theme`

---

### Task 3.2: Header component

**Files:**
- Create: `apps/web/src/components/Header.tsx`
- Create: `apps/web/src/components/Header.module.css` (or Tailwind)

**Steps:**
1. Sticky header, semi-transparent dark background, backdrop-blur. Logo left (text or placeholder), nav links: Inventory, Build Your Ride, Services, About, Contact. CTA button “Book a Test Drive” (gold, hover glow). Optional: shrink or shadow on scroll (use state + scroll listener).
2. Commit: `feat(web): add Header component`

---

### Task 3.3: Home page — hero and CTAs

**Files:**
- Create: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/components/Hero.tsx`

**Steps:**
1. Hero: full-width section, background image or video (placeholder ok), dark gradient overlay. H1 large (Montserrat Bold), subheading (Poppins). Two CTAs: “View Inventory” (link to /inventory), “Build Your Ride” (link to /build). Minimal text; luxury feel.
2. Home page: render Header, Hero. Optional: small “Featured” strip (placeholder cards or later wired to API).
3. Commit: `feat(web): add home page and hero`

---

### Task 3.4: Inventory list page and filters

**Files:**
- Create: `apps/web/src/app/inventory/page.tsx`
- Create: `apps/web/src/components/InventoryFilters.tsx`
- Create: `apps/web/src/components/InventoryGrid.tsx`
- Create: `apps/web/src/lib/api.ts` (fetch wrapper with NEXT_PUBLIC_API_URL)

**Steps:**
1. api.ts: getInventory(params) calling GET /inventory with query params. Type response with shared types.
2. Inventory page: state for filters (source, location, minPrice, maxPrice, make, model, year). Filters component: dropdowns/inputs, “Apply” or live update. Grid: cards (image, make/model, year, price, location); link to /inventory/[id]. Fetch on mount and when filters change; loading and empty states.
3. Card hover: slight lift, accent glow (CSS). Responsive grid 3–4 cols desktop, 1–2 mobile.
4. Commit: `feat(web): add inventory list and filters`

---

### Task 3.5: Inventory detail page

**Files:**
- Create: `apps/web/src/app/inventory/[id]/page.tsx`
- Create: `apps/web/src/components/VehicleGallery.tsx` (optional, simple image list)

**Steps:**
1. Fetch GET /inventory/:id. Show gallery (or single image), specs, price, location. CTAs: “Configure & buy” (link to /build?inventoryId=…), “Reserve / Pay deposit” (link to checkout with this inventory). 404 if not found.
2. Commit: `feat(web): add inventory detail page`

---

## Phase 4: Orders, build-your-own, checkout, shipping, financing, trade-in

### Task 4.1: Prisma schema — orders, saved_vehicles, shipments, appraisals, subscriptions, notifications

**Files:**
- Modify: `apps/api/prisma/schema.prisma`

**Steps:**
1. Order: id, userId (FK), type (enum INVENTORY, CUSTOM_BUILD), inventoryId? (FK), vehicleId? (FK), configSnapshot? (Json), status (enum DRAFT, DEPOSIT_PAID, CONFIRMED, FULFILLED), depositAmount?, totalAmount?, financingSnapshot? (Json), tradeInSnapshot? (Json), shippingSnapshot? (Json), stylingAddonsSnapshot? (Json), createdAt, updatedAt.
2. SavedVehicle: id, userId (FK), inventoryId? (FK), configSnapshot? (Json), createdAt.
3. Shipment: id, orderId (FK), carrier?, trackingUrl?, status (enum PENDING, IN_TRANSIT, DELIVERED), estimatedDelivery?, openEnclosed (enum OPEN, ENCLOSED), quoteAmount?, origin?, destination?, createdAt, updatedAt.
4. Appraisal: id, userId? (FK), vehicleInfo (Json), estimatedValue?, status, createdAt.
5. Subscription: id, userId (FK), plan (enum CHECK_MY_DEAL, VIP_CONCIERGE), status, billingInterval?, amount?, expiresAt?, createdAt.
6. Notification: id, userId (FK), type, title, body, readAt?, createdAt.
7. Run prisma migrate dev --name add_orders_shipments_appraisals.
8. Commit: `feat(api): add Order, SavedVehicle, Shipment, Appraisal, Subscription, Notification`

---

### Task 4.2: API — orders CRUD and saved vehicles

**Files:**
- Create: `packages/shared/src/schemas/order.ts`
- Create: `apps/api/src/routes/orders.ts`, `apps/api/src/controllers/ordersController.ts`
- Create: `apps/api/src/routes/savedVehicles.ts`, `apps/api/src/controllers/savedVehiclesController.ts`
- Modify: `apps/api/src/app.ts` (mount /orders, /saved-vehicles)

**Steps:**
1. POST /orders: auth required. Body: type, inventoryId?, vehicleId?, configSnapshot?, depositAmount?, totalAmount?, financingSnapshot?, tradeInSnapshot?, shippingSnapshot?, stylingAddonsSnapshot?. Set userId, status DRAFT or DEPOSIT_PAID. Return 201.
2. GET /orders: auth required. Customer: only own; staff: all with optional filters. Paginate.
3. PATCH /orders/:id: auth, role check (customer can limited updates; staff can status). Return 200.
4. GET /saved-vehicles: auth, return user’s saved vehicles (with inventory or config).
5. POST /saved-vehicles: auth, body inventoryId? or configSnapshot?. Return 201.
6. DELETE /saved-vehicles/:id: auth, ensure ownership. Return 204.
7. Commit: `feat(api): add orders and saved vehicles endpoints`

---

### Task 4.3: Build-your-own flow — steps 1–6 (web)

**Files:**
- Create: `apps/web/src/app/build/page.tsx`
- Create: `apps/web/src/app/build/layout.tsx` (optional progress wrapper)
- Create: `apps/web/src/components/build/StepVehicle.tsx`, `StepTrim.tsx`, `StepPaint.tsx`, `StepTires.tsx`, `StepAccessories.tsx`, `StepSummary.tsx`
- Create: `apps/web/src/store/buildStore.ts` (context or zustand: selected vehicle, options, running total)

**Steps:**
1. Build store: selectedVehicleId, selectedOptions (category -> optionId), derived total. Load vehicles and options from API.
2. Step 1: list vehicles (cards), select one → next. Step 2: trim if applicable or skip. Step 3: paint (from options category PAINT). Step 4: tires (TIRES). Step 5: accessories (ACCESSORIES, STYLING). Step 6: summary with total, “Continue to checkout” → redirect to /checkout?build=1 (or pass state).
3. Progress indicator at top (1–6). Back/Next; minimal clicks, clear CTAs.
4. Commit: `feat(web): add build-your-own flow`

---

### Task 4.4: Shipping quote endpoint and checkout integration

**Files:**
- Create: `apps/api/src/routes/shipping.ts`
- Create: `apps/api/src/controllers/shippingController.ts`
- Create: `packages/shared/src/schemas/shipping.ts`
- Modify: `apps/api/src/app.ts` (mount /shipping)

**Steps:**
1. POST /shipping/quote: body origin, destination (address or lat/lng), openEnclosed. Compute distance (simple formula or stub: e.g. 415 miles), rate per mile (e.g. 1.5), add 0.35% platform adder. Return { amount, distance, breakdown }.
2. Optional: POST /orders/:id/shipment: auth, create Shipment for order (carrier, status PENDING, quoteAmount, origin, destination). GET /shipments/:id: auth, return shipment (tracking for portal).
3. Commit: `feat(api): add shipping quote and shipment endpoints`

---

### Task 4.5: Financing calculator endpoint

**Files:**
- Create: `apps/api/src/routes/financing.ts`
- Create: `packages/shared/src/schemas/financing.ts`
- Modify: `apps/api/src/app.ts` (mount /financing)

**Steps:**
1. POST /financing/calculate: body price, termMonths, apr. Return monthlyPayment, totalInterest, totalAmount. Formula: standard loan amortization.
2. Commit: `feat(api): add financing calculate endpoint`

---

### Task 4.6: Appraisals endpoint

**Files:**
- Create: `apps/api/src/routes/appraisals.ts`
- Create: `apps/api/src/controllers/appraisalsController.ts`
- Create: `packages/shared/src/schemas/appraisal.ts`
- Modify: `apps/api/src/app.ts` (mount /appraisals)

**Steps:**
1. POST /appraisals: body make, model, year, mileage, condition (enum or string). Optional auth (userId). Rule-based estimate: simple formula or lookup (e.g. base by make/model/year minus mileage factor). Save to Appraisal, return 201 + estimatedValue.
2. GET /appraisals/:id: auth optional; return appraisal. If authenticated, user can see own.
3. Commit: `feat(api): add appraisals endpoint`

---

### Task 4.7: Checkout page (web)

**Files:**
- Create: `apps/web/src/app/checkout/page.tsx`
- Create: `apps/web/src/components/checkout/OrderSummary.tsx`, `FinancingForm.tsx`, `ShippingForm.tsx`, `TradeInForm.tsx`, `DepositSubmit.tsx`

**Steps:**
1. Checkout reads build state (from store or query) or inventory id. Show order summary (vehicle + options + total). Sections: Financing (term, APR, desired payment → call /financing/calculate, show result; store in state). Shipping (origin, destination, open/enclosed → call /shipping/quote; show amount). Trade-in (link to /appraisal or inline form; attach appraisal id or snapshot). Styling add-ons (if any from build). Deposit amount (input or fixed); “Submit” creates order via POST /orders with all snapshots. Redirect to confirmation or portal.
2. Require auth for submit; if not logged in, redirect to login then back to checkout.
3. Commit: `feat(web): add checkout page and order creation`

---

### Task 4.8: Trade-in / appraisal page (web)

**Files:**
- Create: `apps/web/src/app/appraisal/page.tsx` (or /trade-in)
- Create: `apps/web/src/components/appraisal/AppraisalForm.tsx`

**Steps:**
1. Form: make, model, year, mileage, condition. Submit → POST /appraisals. Show estimated value. CTA “Use as trade-in” → store in context or redirect to checkout with appraisal id in state.
2. Commit: `feat(web): add appraisal page`

---

## Phase 5: Customer portal and notifications

### Task 5.1: Web auth (login/register) and auth context

**Files:**
- Create: `apps/web/src/app/login/page.tsx`, `apps/web/src/app/register/page.tsx`
- Create: `apps/web/src/contexts/AuthContext.tsx`
- Create: `apps/web/src/lib/api.ts` (add auth: store token, attach to requests, logout)

**Steps:**
1. Login/register forms; on success store token (cookie or localStorage), set user in context. API client: if token exists, send Authorization header. Logout: clear token and user.
2. AuthContext: user, login, register, logout, loading. Provide at layout.
3. Commit: `feat(web): add login, register, and auth context`

---

### Task 5.2: Customer portal dashboard

**Files:**
- Create: `apps/web/src/app/portal/page.tsx` (or /dashboard)
- Create: `apps/web/src/components/portal/SavedVehicles.tsx`, `OngoingDeals.tsx`, `ShippingTracking.tsx`, `NotificationsList.tsx`

**Steps:**
1. Portal layout: require auth; redirect to login if not authenticated. Fetch GET /orders (mine), GET /saved-vehicles, GET /notifications (if endpoint exists).
2. Sections: Saved vehicles (cards, link to inventory or build). Ongoing deals (orders not FULFILLED: status, total, link to detail). Completed purchases (orders FULFILLED). Shipping tracking: for orders with shipment, show carrier, status, tracking URL, ETA (GET /shipments/:id or nested in order). Notifications: list with read/unread; PATCH /notifications/:id/read on click.
3. Financing summary: from order snapshots. Styling/upgrades: from order snapshot. All costs visible.
4. Commit: `feat(web): add customer portal dashboard`

---

### Task 5.3: Notifications API and creation on order/shipment events

**Files:**
- Create: `apps/api/src/routes/notifications.ts`
- Create: `apps/api/src/controllers/notificationsController.ts`
- Create: `apps/api/src/services/notificationService.ts` (createNotification(userId, type, title, body))
- Modify: `apps/api/src/controllers/ordersController.ts` (after order status change or shipment create, call notificationService)

**Steps:**
1. GET /notifications: auth, return user’s notifications (paginated). PATCH /notifications/:id/read: auth, set readAt. Return 200.
2. notificationService.createNotification: insert Notification. Call when order status changes (e.g. DEPOSIT_PAID, CONFIRMED, FULFILLED) and when shipment is created or status updated.
3. Commit: `feat(api): add notifications and trigger on order/shipment`

---

## Phase 6: Subscriptions (Check My Deal), VIP, deal analysis

### Task 6.1: Subscriptions API and deal analysis stub

**Files:**
- Create: `apps/api/src/routes/subscriptions.ts`
- Create: `apps/api/src/controllers/subscriptionsController.ts`
- Create: `apps/api/src/routes/dealAnalysis.ts`
- Modify: `apps/api/src/app.ts` (mount /subscriptions, /deal-analysis)

**Steps:**
1. POST /subscriptions: auth, body plan (CHECK_MY_DEAL, VIP_CONCIERGE), billingInterval, amount. Create Subscription (status ACTIVE), set expiresAt. Return 201. v1: no payment gateway; record only.
2. POST /deal-analysis: auth optional; body order snapshot (vehicle, financing, shipping, add-ons). If user has active Check My Deal subscription, run analysis (v1: rule-based or stub recommendations, e.g. “Consider longer term for lower payment”). Return { recommendations: [...] }. 403 if no active subscription.
3. Commit: `feat(api): add subscriptions and deal analysis`

---

### Task 6.2: Check My Deal and VIP upsell on web

**Files:**
- Create: `apps/web/src/components/checkout/SubscriptionUpsell.tsx`
- Modify: `apps/web/src/app/checkout/page.tsx` (show upsell; link to /portal for subscription management)
- Create: `apps/web/src/app/portal/subscriptions/page.tsx` (list my subscriptions; optional upgrade to VIP)

**Steps:**
1. At checkout or portal: “Get deal analysis — Check My Deal $X/mo or $750/yr.” If subscribed, show “Run deal analysis” button → call POST /deal-analysis, show recommendations.
2. VIP: “Full-service concierge” tier; display only or simple “Request VIP” that creates lead in CRM. Commit: `feat(web): add subscription upsell and deal analysis UI`

---

## Phase 7: CRM app

### Task 7.1: CRM Next.js app and auth

**Files:**
- Create: `apps/crm/package.json`, `apps/crm/tsconfig.json`, `apps/crm/next.config.js`
- Create: `apps/crm/src/app/layout.tsx`, `apps/crm/src/app/page.tsx` (redirect to /dashboard or login)
- Create: `apps/crm/src/app/login/page.tsx`
- Create: `apps/crm/src/contexts/AuthContext.tsx` (same API; role must be STAFF or ADMIN; else redirect to web)

**Steps:**
1. CRM uses same API URL. Login → store token. On load, GET /auth/me; if role not staff/admin, redirect to main site. Dashboard layout: sidebar or top nav (Dashboard, Leads, Orders, Inventory, Customers).
2. Commit: `feat(crm): add CRM app and staff auth`

---

### Task 7.2: CRM — leads and dashboard

**Files:**
- Create: `apps/api/src/routes/leads.ts`, `apps/api/src/controllers/leadsController.ts`
- Create: `apps/crm/src/app/dashboard/page.tsx`
- Create: `apps/crm/src/app/leads/page.tsx`, `apps/crm/src/app/leads/[id]/page.tsx`

**Steps:**
1. API: GET/POST/PATCH /leads. POST from web (e.g. “Book a Test Drive”) or CRM. GET with filters (status, assignedTo). GET /dashboard/stats: counts for leads (new, open), orders (by status). Auth: staff only.
2. CRM dashboard: show stats, recent leads, recent orders. Leads list: table with status, contact, assigned; link to detail. Lead detail: edit status, assign, notes; optional “Convert to order.”
3. Commit: `feat(crm): add leads and dashboard`

---

### Task 7.3: CRM — orders and inventory management

**Files:**
- Create: `apps/crm/src/app/orders/page.tsx`, `apps/crm/src/app/orders/[id]/page.tsx`
- Create: `apps/crm/src/app/inventory/page.tsx` (list; add/edit for company and verify private)

**Steps:**
1. Orders list: filters status, date; table; link to detail. Order detail: customer, type, config, deposit, status; staff can PATCH status and add internal notes (store in Order or separate notes table if needed).
2. Inventory: list all; staff can add company inventory, edit, set verification for private. Form uses same schemas as API.
3. Commit: `feat(crm): add orders and inventory management`

---

### Task 7.4: CRM — customers list and detail

**Files:**
- Create: `apps/api/src/routes/customers.ts` (GET /customers: list users where role CUSTOMER; GET /customers/:id: detail with orders, leads, appraisals)
- Create: `apps/crm/src/app/customers/page.tsx`, `apps/crm/src/app/customers/[id]/page.tsx`
- Modify: `apps/api/src/app.ts` (mount /customers)

**Steps:**
1. GET /customers: staff only, paginated. GET /customers/:id: user + orders + leads + appraisals. Read-only in v1.
2. CRM customers list: table; link to detail. Detail: contact info, orders, leads, appraisals.
3. Commit: `feat(crm): add customers list and detail`

---

## Phase 8: Polish and optional enhancements

### Task 8.1: Animations and micro-interactions (web)

**Files:**
- Modify: `apps/web/src/app/globals.css`, `apps/web/src/components/Header.tsx`, `apps/web/src/components/InventoryGrid.tsx`, card components

**Steps:**
1. Section fade-in on scroll (e.g. Intersection Observer + CSS transition or Framer Motion). Card hover: translateY(-4px), box-shadow glow. Button hover: scale(1.02), glow. Smooth scroll for anchor links. Optional: parallax on hero.
2. Commit: `feat(web): add scroll and hover animations`

---

### Task 8.2: Footer and trust section (web)

**Files:**
- Create: `apps/web/src/components/Footer.tsx`
- Create: `apps/web/src/components/TrustStrip.tsx` (testimonials placeholder, press logos placeholder)
- Modify: `apps/web/src/app/page.tsx` (add TrustStrip, Footer)

**Steps:**
1. Footer: darker #0A0A0A; links (Inventory, Build, Services, About, Contact); social icons (accent); small copyright. Trust strip: headline, 2–3 testimonial placeholders, logo placeholders for “As seen in” or certifications.
2. Commit: `feat(web): add footer and trust strip`

---

### Task 8.3: Seed script and README

**Files:**
- Create: `apps/api/prisma/seed.ts`
- Create: `README.md` (root)

**Steps:**
1. Seed: 1 admin user, 2–3 vehicles, 2–3 configuration options, 2–3 company inventory items. Run with `prisma db seed`.
2. README: project overview, design doc link, how to run (pnpm install, copy .env, prisma migrate, prisma db seed, pnpm dev:api, pnpm dev:web, pnpm dev:crm). Env vars listed.
3. Commit: `chore: add seed and README`

---

## Execution checklist

- [ ] Phase 1: Monorepo, API, DB, auth
- [ ] Phase 2: Inventory, vehicles, options
- [ ] Phase 3: Web home, inventory list/detail, theme
- [ ] Phase 4: Orders, build flow, checkout, shipping, financing, appraisal
- [ ] Phase 5: Portal, notifications
- [ ] Phase 6: Subscriptions, deal analysis, VIP
- [ ] Phase 7: CRM app (dashboard, leads, orders, inventory, customers)
- [ ] Phase 8: Polish, footer, seed, README

---

## Notes

- Use exact paths as above; adjust if you rename apps (e.g. `apps/site` instead of `apps/web`).
- TDD: add tests for API routes and critical logic where time allows; plan assumes minimal tests in v1.
- Payments: Stripe (or other) can be added in a follow-up plan (webhook, PaymentIntent, order status update).
- AI appraisal: swap rule-based logic in appraisalsController for third-party or AI later; contract unchanged.

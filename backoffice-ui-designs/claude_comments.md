# Review of the YoReservo BackOffice Designs — Comments & Recommendations

> **Scope reviewed**: `README.md`, `BACKOFFICE_SPECIFICATIONS.md`, `backoffice_modules.md`, `STYLE_GUIDE.md`, `assets/*.css`, all 16 HTML prototypes + `index.html`, and — for cross-checking — `poc-yoreservo-backend-service/prisma/schema.prisma`.
> **Method**: read the docs, syntax-checked every inline `<script>` with `node --check`, counted structural metrics per file, and compared the "Mapped Database Entities" claims against the real Prisma schema.

---

## 1. Verdict

**The product thinking is excellent; the prototype delivery does not match what the docs claim.**

The specification (`BACKOFFICE_SPECIFICATIONS.md`) is the strongest piece of work here: the A–Y critique is specific, grounded in real Venezuelan operations (Pago Móvil, BCV rate, WhatsApp, split shifts, RIF), and correctly maps UI problems to the data model. The agenda-as-timeline, click-to-book drawer, voucher inspector, safe court deactivation, ally-vs-venue split and self-service-vs-admin profile separation are all the right calls.

However:

| Area | Status |
|---|---|
| Product / UX concepts | 🟢 Strong |
| Spec ↔ DB alignment | 🟡 Good intent, several claims don't match the real schema |
| Prototype functionality | 🟡 ~~11 of 16 pages had a JavaScript syntax error~~ **fixed 2026-10-12** (see §2.1); behaviour still mostly simulated (`alert()`, hard-coded data) |
| Prototype maintainability | 🟠 Heavy duplication, ~1,800 inline styles |
| Accessibility | 🔴 Effectively none |
| Docs consistency | 🟠 Three conflicting design-token sets / several contradictory statements |

---

## 2. Critical findings (fix before anyone reviews the designs)

### 2.1 ✅ FIXED — 11 of 16 pages had a JS `SyntaxError` — the "Automated Verification" claim was not reliable

> **Status (2026-10-12): resolved.** The 22 missing commas (2 per page: `es` + `en` dictionaries) were added and all 16 pages now pass `node scripts/check-prototypes.js` with 0 errors. The finding is kept below for traceability. Note that the check only proves the scripts *parse* and keys/links resolve; the interactive behaviour (drawers, modals, QR, language switch) still deserves a manual click-through in Chrome.

`backoffice_modules.md` states *"Every single screen was verified, interacted with, and recorded… zero broken layouts."* Running `node --check` on each inline script contradicted that.

Original findings from `node --check` (before the fix):

```
FAIL agenda-grid.html        line 70   nav_overview: "Resumen",
FAIL reservations-list.html  line 202  nav_overview: "Resumen",
FAIL master-catalogs.html    line 55   nav_overview: "Resumen",
FAIL executive-dashboard.html line 161 nav_profile: "Mi Perfil & Seguridad",
FAIL exchange-rate.html, pago-movil-inbox.html, settlements.html,
     users-rbac.html, schedules-editor.html, spaces-builder.html,
     venues-management.html            (same pattern)
OK   index, login, profile, recover-password, set-password
```

**Root cause** (e.g. [agenda-grid.html L1187-1188](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/agenda/agenda-grid.html#L1187-L1188)): a script/bulk edit appended the new `nav_*` i18n keys after the last entry **without adding a comma**:

```js
qr_success_title: "¡Check-in Exitoso!"      // <-- missing comma
nav_overview: "Resumen",
```

**Impact**: a parse error kills the *entire* `<script>` block. In the browser those pages render, but `setLanguage`, `toggleTheme`, drawers, modals, filters, QR scanner etc. are all undefined — every `onclick` throws `ReferenceError`. The flagship Agenda and the Dashboard (the page currently open in your browser) are among the broken ones.

**Fix**: add the missing commas (mechanical), then add a CI-style guard (see §6, step 1).

### 2.2 🔴 The "Mapped Database Entities" lists reference models that don't exist

Compared with the actual `schema.prisma` (models: `User, Session, Location, ActivityType, Activity, ActivityCategory, Venue, Image, Space, Schedule, Reservation, Review, Payment, ExchangeRateLog`):

| Claimed in `backoffice_modules.md` | Reality |
|---|---|
| `Court`, `CourtSchedule` | The model is `Space` + `Schedule` |
| `ScheduleOverride` | Doesn't exist (holiday overrides in the schedule editor have no home) |
| `Amenity`, `SurfaceType` | Don't exist (amenities and court surfaces in Modules 4 & 5 have no home) |
| `Account`, `VerificationToken` | Don't exist (needed for the staff-invitation flow in Module 1) |
| `Settlement`, `SettlementBatch`, `SettlementItem` | Don't exist (Phase 1 proposes them but the module catalog presents them as "mapped") |

Also, `README.md` still says `index.html`, `auth/`, `dashboard/`… are *"Coming Soon"* and lists folders (`reservations/`, `venues-spaces/`) that don't exist, while the modules doc says everything is delivered. Terminology also drifts (`Court` vs `Space` vs `Cancha`).

**Recommendation**: use the DB vocabulary everywhere in tech docs (`Space`, `Schedule`), and split "Mapped Database Entities" into **Exists today** vs **Needs migration**.

---

## 3. Product / domain comments

### 3.1 🔴 The commission model contradicts itself
- Spec §D/§W: the 5% **service fee is added on top and paid by the client** ($60 → $63.60). The ally's revenue is the full court subtotal.
- Module 7 / Phase 1: *"5% commission retained, **95% net payout to ally**."*

These are two different business models. Pick one and make it consistent in the UI labels, the `Settlement` model and the dashboard KPIs. If the client pays the fee, the settlement is `Σ subtotal` to the ally and `Σ serviceFee` is YoReservo revenue — there is no "95%".

### 3.2 🔴 Settlements must exclude manual/cash bookings
Walk-in bookings (`isManual = true`, cash at the counter) are money the venue already holds. If they're bundled into a bi-weekly payout, YoReservo would be paying the ally for cash the ally already collected. Settlement items should be limited to **platform-collected, `VERIFIED` payments**. The spec never says this; the settlements prototype should show it explicitly (and show "cash collected directly by venue" as an informational line).

### 3.3 🟠 "Pre-reserva (Hold, 15 min)" conflates two different states
The grid colours one state "Hold" with a 15-minute countdown, but Pago Móvil introduces a **second pending state**: *payment submitted, awaiting accountant verification* — which can last hours. A slot in that state must **not** expire at 15 minutes, and the receptionist needs to see the difference. Recommend two visual states: `HOLD` (user checking out) and `PAYMENT_UNDER_REVIEW` (reference submitted). Also: the detail modal shows **"Check-in" enabled for Hold bookings** — it should be disabled until `CONFIRMED`.

### 3.4 🟠 Blocks (`BLOCKED`) don't belong in `ReservationStatus`
The spec proposes adding `BLOCKED` to `ReservationStatus`. But a block has no price, no payment, no client, no QR hash, and `Reservation` makes `shortCode`, `qrCodeHash`, `subtotal`, `totalAmount` required. You'd have to fabricate values and every revenue/occupancy query would need `WHERE status != 'BLOCKED'`. **Better**: a dedicated `SpaceBlock { spaceId, date, startTime, endTime, reason, createdBy }` (also solves recurring maintenance and `ScheduleOverride`/holidays in one model). The "Block for rain" action should also resolve *existing* bookings in that window (reschedule / cancel+refund) — currently it only shows a `confirm()`.

### 3.5 🟠 `Payment` is 1:1 with `Reservation` — breaks the "rejected → re-upload" flow
Phase 2 promises an email *"Pago Móvil discrepancy — re-upload proof"*, but `Payment.reservationId` is `@unique`. A rejected attempt has nowhere to live while a new attempt is created. Either make it 1:N (attempts) or keep the single row and add an `attempts`/audit table. This also needs a **time limit after rejection** so the slot isn't held forever.

### 3.6 🟠 Missing data the UI already assumes
- **`User.phone`**: the profile/walk-in/WhatsApp flows depend on it; the `User` model has no phone field (only `Venue.contactPhone`).
- **Ally payout bank account**: needed for settlements (spec §G mentions it; no model).
- **Customer name for manual bookings**: spec lists `customer_name/customer_phone`; note Phase 1 renames `notes` → `internal_notes` — keep one name.
- **Time zone**: `Time(0)`/`Date` columns have no zone. Pin `America/Caracas` (UTC-4) explicitly in docs and API contracts; the "today" KPIs depend on it.
- **Slot duration**: the grid is hard-coded to 1-hour rows. Padel is typically 90 min, and some venues use 30-min steps. Make the slot granularity a venue/space setting, even if v1 only ships 60 min.

### 3.7 🟡 Roles: the sidebar is not role-adaptive
The spec's headline idea is a "role-adaptive portal", but every page contains the same hard-coded **13-link sidebar** (Treasury, Master Catalogs, Users… visible to everyone including `VALIDATOR`). In the prototype, role is simulated only on the login/dashboard. Recommended: a single `NAV_BY_ROLE` map + a role switcher stored in `localStorage` that every page honours, so reviewers can actually *see* the ALLY vs ADMIN vs VALIDATOR experience. A `VALIDATOR` should arguably get a **minimal 3-item app** (Today / Check-in / Walk-in), not the full console.

### 3.8 🟡 Other domain gaps worth adding to the backlog
- **Refund / cancellation policy** (cancel window, who eats the fee) — `REFUNDED` is added to the enum but no screen shows it.
- **Audit log** (who blocked, cancelled, changed a rate/price) — only the rate has one.
- **Notifications centre** (new Pago Móvil to verify, hold about to expire).
- **Offline/poor-connectivity check-in**: gate staff in venues often have unstable data; the QR validator is the one flow that should degrade gracefully.
- **Double-booking protection**: the spec should state the DB-level guarantee (exclusion constraint on `space_id + date + time range` or transactional lock), not only the UI.
- **Pagination / large-data states**: ledgers and the agenda are only designed for ~4 courts and a few rows.

---

## 4. Prototype / front-end comments

### 4.1 🟠 Duplication is already out of control
| Metric | Finding |
|---|---|
| Sidebar markup | Copy-pasted in 12 pages |
| i18n dictionary | Re-declared per page (hence the bug in §2.1 — the same edit had to be applied 11 times) |
| Inline `style="…"` | **~1,790** occurrences across the pages (e.g. 187 in `settlements.html`, 182 in `agenda-grid.html`) |
| Page weight | 30–76 KB of hand-written HTML each; `agenda-grid` has **145 hand-written slot elements** |
| Theme/lang/sidebar JS | Re-implemented in every file |

This is the same class of problem that produced the syntax bug. It will make every future design change (new menu item, new status colour) an N-file edit.

### 4.2 🟠 Hard-coded values that will mislead reviewers
- BCV rate is the literal `41.0` in JS (`price * 41.0`), disconnected from the `exchange-rate.html` page.
- "Today = 12 Oct", "Mañana (13 Oct)", "Mié (14 Oct)" are hard-coded strings; `selectDate()` only toggles a CSS class.
- Booking submit/check-in/block/cancel use `alert()`/`confirm()` and **never mutate the grid** — the key promise ("the agenda has been updated") isn't demonstrated.
- Dashboard "charts" are hand-built `div` bars (no SVG/canvas) so axes/tooltips/legends are not real.
- The `.agents` folder and `design-tokens.css` (the client-app-faithful token file) are not linked by any page; the CSS actually used is `backoffice.css`.

### 4.3 🟡 Three conflicting token sets
| Source | Background | Brand |
|---|---|---|
| `README.md` | `#F7F5EF` (cream), `--bg-main` | `--brand-deep #1F290F` |
| `STYLE_GUIDE.md` / `backoffice.css` | `#F8FAF7`, `--bg-app` | `--brand-forest #1F290F` |
| `assets/design-tokens.css` (orphan) | `#F7F5EF`, `--background` | `--primary #565F45` |

Different variable names for the same concepts. Pick one naming scheme (I'd keep the `STYLE_GUIDE.md` one, since it's the one in use and supports dark mode), delete the other two, and fix the README.

### 4.4 🔴 Accessibility is essentially absent
Across all pages: **0 `aria-*` attributes, 0 `role` attributes**, no `:focus-visible` styles, no `prefers-reduced-motion`, and emoji used as nav icons (📊📅📋💳) and as the theme-toggle label (no accessible name). Drawers/modals don't trap focus or close on `Esc`. The style guide promises "WCAG AA/AAA" — that can't be claimed without at least: labelled buttons, focus rings, `role="dialog"` + `aria-modal`, keyboard-operable grid slots (they're clickable `div`s), and status conveyed by **text/icon, not colour alone** (the grid's five statuses are colour-coded; ~8% of men are colour-blind and venues are often outdoors in sunlight).

### 4.5 🟡 Other UI/UX notes
- **Mobile**: the style guide says "mobile-first" and gives a bottom tab bar design, but the real receptionist use case is a **phone at the counter**. Screenshots/tests should be at 390 px for the Agenda, walk-in drawer and check-in; the current layout approach (desktop sidebar + overflow) isn't evidence of this.
- **Emoji as icons** reads as prototype-grade next to the "premium" brand; use one SVG icon set (Lucide/Phosphor) shared via an inline sprite.
- **Language switcher in the dictionary** replaces `innerText`, which wipes child nodes (icons/badges) inside translated elements and can't translate placeholders/`title`/`aria-label`; plus `Hoy`/`Today` strings are concatenated in JS (word order breaks in other languages — the schema already anticipates `it`/`de`).
- **Dark mode on a *data* console**: good to have, but I'd treat it as a v2 priority below accessibility and mobile. It doubles the visual QA surface (every status colour, every chart).
- **Spec docs are very long for a POC** (spec 26 KB + modules 34 KB with overlapping content). `backoffice_modules.md` repeats the A–Y list a second time. Consider one source of truth plus a short matrix.

---

## 5. What I would do differently

1. **Stop at a design-system + 5 flagship screens, not 16 screens.** The value is in Agenda, Walk-in drawer, Pago Móvil inbox, Venue/Space/Schedule setup, and Settlements. Users-RBAC, master catalogs, profile and password screens are standard CRUD that don't need pixel-level prototypes before the data model is settled.
2. **Make the prototype data-driven, with a shared shell.** One `shell.js` (sidebar from `NAV_BY_ROLE`, theme, language, role switcher), one `i18n/es.json`+`en.json`, one `mock-db.js` (venues, spaces, schedules, reservations, rate) and render grid slots from `mock-db`. Then "book a walk-in" really adds a block, "block for rain" really changes status, and changing the BCV rate really updates every price. This kills the duplication, the hard-coded `41.0`, and the class of bug in §2.1.
3. **Prototype in the stack you're going to ship (Next.js + the client app's tokens) earlier.** Phase 3 already plans Next.js/React, and the client web app exists. Building a Next.js `/backoffice` route group (or a sibling app with a shared `@yoreservo/ui` package) from day one avoids throwing away ~700 KB of HTML. If the HTML POC must stay (for stakeholders without a dev env), treat it as **disposable** and don't invest in dark mode/i18n parity there.
4. **Re-order the roadmap: schema decisions *before* more UI.** Resolve §3.1–3.6 first (commission model, blocks, payment attempts, settlements scope, phone/bank fields), then do the Prisma migration. Today the plan says Phase 1 is the schema, but the UI already encodes decisions (95% payout, `BLOCKED` reservation) that deserve a conscious review.
5. **Define success with a task-timing test, not a "verified" screenshot.** The spec's key claims are measurable — *"booking in 5 seconds"*, *"1-click verification"*. Write 5 tasks (walk-in booking at 7 PM, find a booking by phone, verify a Pago Móvil, block a court for rain, close a settlement) and time them with 2–3 real venue staff on a phone.
6. ✅ **Put an automated check in the loop — done.** [`scripts/check-prototypes.js`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/scripts/check-prototypes.js) (no dependencies) validates inline-script syntax, `data-i18n` keys in `es`/`en` (missing + parity) and relative links. Run `node scripts/check-prototypes.js`; it exits 1 on errors, so it can be wired into a pre-commit hook or CI. Remaining idea: also assert that every page's sidebar links match a single `NAV_BY_ROLE` source once the shared shell exists (§5.2).
7. **Add the missing "states" to the flagship screens**: empty, loading, error, offline, "two receptionists booked the same slot" conflict, expired hold, partial Bs payment (under/over-pay vs BCV-rate drift), and a venue with 12+ courts.

---

## 6. Suggested next steps (prioritised)

| # | Action | Effort |
|---|---|---|
| 1 | ✅ ~~Fix the 11 missing-comma syntax errors; add a `node --check` + i18n-key + link checker script~~ — **done** (`scripts/check-prototypes.js`, documented in README) | ✔ |
| 2 | Decide and document the commission model (fee-on-top vs. 5% deduction) and settlement scope (exclude cash/manual) | decision |
| 3 | Correct "Mapped Database Entities" to real model names; split *exists* vs *needs migration*; update the README status | ~1 h |
| 4 | Replace `BLOCKED`-in-`ReservationStatus` with a `SpaceBlock` model; add `PAYMENT_UNDER_REVIEW` vs `HOLD` distinction; make `Payment` support retries | design + migration |
| 5 | Extract shared shell (sidebar-by-role, theme, i18n, mock data) and make Agenda actually mutate state | ~1–2 days |
| 6 | Accessibility pass on Agenda + drawers (labels, focus ring, `role=dialog`, Esc, non-colour status cues) | ~0.5–1 day |
| 7 | Consolidate to one token naming scheme; delete orphan `design-tokens.css`; fix README | ~1 h |
| 8 | Run the 5-task timing test on mobile (390 px) with real venue staff | ~0.5 day |

---

## 7. What is genuinely good (keep it)

- The **A–Y forensic critique** with direct DB mapping — rare and valuable.
- **Timeline matrix + click-to-book drawer + zero-fee manual booking** — the correct core of the product.
- **Voucher-inline Pago Móvil inspector with reject reasons** and the BCV override requiring an audit note.
- **Ally vs Venue separation**, safe-deactivation modal, split-shift editor.
- **Profile vs admin user management** split and the invitation-token activation flow.
- The visual identity (deep olive + electric lime, Outfit/Inter) is distinctive and consistent with the client app.

The foundation is right. The fastest path to a trustworthy deliverable is to **fix the syntax errors, resolve the business-model contradictions, and consolidate the prototype around a shared, data-driven shell** before adding more screens.

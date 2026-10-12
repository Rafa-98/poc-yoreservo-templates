# Backoffice Modules Architectural Catalog — YoReservo

> **Official Prototype Delivery & Specification Document**  
> **Repository Location**: [`poc-yoreservo-templates/backoffice-ui-designs/`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/)  
> **Unified Master Navigation Portal**: [`index.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/index.html)  
> **Reference Specifications & Defect Catalog**: [`BACKOFFICE_SPECIFICATIONS.md`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/BACKOFFICE_SPECIFICATIONS.md)  
> **CSS Tokens & Design System**: [`assets/backoffice.css`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/assets/backoffice.css)  
> **Consolidation Date**: October 2026  

---

## 1. Executive Suite Overview

The **YoReservo** Backoffice is the operational, commercial, and financial control center of the platform. The suite consists of **9 high-fidelity interactive modules** designed to eliminate operational friction for sports clubs and venues in Venezuela and Latin America (`ALLY`, `VALIDATOR`), while providing centralized accounting and administrative governance (`ADMIN`, `ACCOUNTING`).

All modules adhere to three universal pillars:
1. **Strict Dual-Theme Support**: Light Mode (`#F8FAF8`) and Deep Dark Mode (`#0D130E` / `#162017`), with Radiant Lime (`#C6F23B`) accents, institutional Forest Green (`#2C5E3B`), and WCAG AA contrast compliance with zero muddy dark fills on interactive buttons.
2. **Instant Bilingual Parity**: Default Spanish (`es`) with live dynamic DOM switching to English (`en`) in memory.
3. **Automated Headless Browser Verification**: Every single screen was verified, interacted with, and recorded in Google Chrome via subagents, ensuring zero broken layouts or unstyled elements.

---

## 2. The 9 Modules in Order of Implementation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MASTER NAVIGATION PORTAL (index.html)                    │
└──────┬───────────────────────┬───────────────────────┬──────────────────────┘
       │                       │                       │
 ┌─────▼──────┐          ┌─────▼──────┐          ┌─────▼──────┐
 │  MODULE 1  │          │  MODULE 2  │          │  MODULE 3  │
 │ Auth, Staff│          │ Operations │          │  Treasury: │
 │ Invitation │          │ Hub:Agenda │          │ PM & BCV   │
 └─────┬──────┘          └─────┬──────┘          └─────┬──────┘
       │                       │                       │
 ┌─────▼──────┐          ┌─────▼──────┐          ┌─────▼──────┐
 │  MODULE 4  │          │  MODULE 5  │          │  MODULE 6  │
 │  Venues,   │          │   Master   │          │  Bookings  │
 │  Courts &  │          │ Catalogs & │          │  Master &  │
 │ Split-Shift│          │ RBAC Users │          │  Check-In  │
 └─────┬──────┘          └─────┬──────┘          └─────┬──────┘
       │                       │                       │
 ┌─────▼──────┐          ┌─────▼──────┐          ┌─────▼──────┐
 │  MODULE 7  │          │  MODULE 8  │          │  MODULE 9  │
 │ Settlement │          │  Adaptive  │          │ My Profile │
 │ & Ally Net │          │ Executive  │          │  & Active  │
 │   Payouts  │          │ Dashboard  │          │  Sessions  │
 └────────────┘          └────────────┘          └────────────┘
```

---

### MODULE 1: Authentication, Staff Invitation & Access Control

- **Prototype Files**:
  - [`auth/login.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/auth/login.html) — Executive split-screen login with dynamic credentials role simulator.
  - [`auth/recover-password.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/auth/recover-password.html) — Password recovery request and 60-second cooldown verification state.
  - [`auth/set-password.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/auth/set-password.html) — Staff invitation token activation with interactive bcrypt security checklist.
- **Problems Resolved from `BACKOFFICE_SPECIFICATIONS.md`**:
  - **Problem S**: Creating users without credentials or a formal invitation mechanism.
  - **Problem N**: Text roles disconnected from backend database enums (`ADMIN`, `ALLY`, `ACCOUNTING`, `VALIDATOR`).
- **Key Operational Workflows**:
  - Quick role simulator to preview sign-in states as Global Administrator, Sports Club Owner, Accountant, or Gate Validator.
  - One-time invitation token redemption with a live password strength validation checklist (8+ chars, uppercase, lowercase, number, symbol).
- **Mapped Database Entities**: `User`, `Account`, `VerificationToken`, `UserRole`.
- **Audit Verification & Recording**: `backoffice_ui_test_1791816057194.webp` | Report: [`ui_verification_and_dark_mode_report.md`](file:///C:/Users/Mende/.gemini/antigravity-ide/brain/12497f13-a621-4554-b786-f47c6a90bacc/ui_verification_and_dark_mode_report.md).

---

### MODULE 2: Operations Hub (Multi-Court Grid & Express Check-In)

- **Prototype Files**:
  - [`agenda/agenda-grid.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/agenda/agenda-grid.html) — Real-time hourly schedule matrix (07:00 to 23:00) with walk-in flyout drawer and QR scanner.
- **Problems Resolved from `BACKOFFICE_SPECIFICATIONS.md`**:
  - **Problem B**: Fatal operational flaw of using a flat paginated table for bookings, hiding empty time gaps.
  - **Problem C**: Sluggish 5-step, 10-click inverted booking creation flow.
  - **Problem D**: Illegitimately charging platform service fees ($63.60 instead of $60.00) and applying 15-minute holds on counter walk-in bookings.
  - **Problem E**: Missing customer phone / WhatsApp contact for direct operational updates.
- **Key Operational Workflows**:
  - **Click-to-Book Calendar Matrix**: Clicking any open court slot immediately opens a side drawer with pre-filled court and time details.
  - **Zero-Fee Walk-In Bookings**: Counter transactions are club-direct (`is_manual: true`, `service_fee: 0`) at `$60.00` flat with cash, on-site POS, or direct Pago Móvil.
  - **Express Check-In Desk**: Modal with simulated camera QR scanner and rapid 6-character short-code validation (`#AB4553`).
- **Mapped Database Entities**: `Reservation`, `Court`, `Venue`, `CourtSchedule`, `ReservationStatus`.
- **Audit Verification & Recording**: `module2_agenda_test_1791817492992.webp` | Report: [`module2_agenda_verification_report.md`](file:///C:/Users/Mende/.gemini/antigravity-ide/brain/12497f13-a621-4554-b786-f47c6a90bacc/module2_agenda_verification_report.md).

---

### MODULE 3: Finance & Treasury (Pago Móvil Reconciliation & BCV Official Rate)

- **Prototype Files**:
  - [`treasury/pago-movil-inbox.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/treasury/pago-movil-inbox.html) — High-velocity reconciliation queue with in-line receipt image inspection and bank settlement actions.
  - [`treasury/exchange-rate.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/treasury/exchange-rate.html) — Official BCV exchange rate monitor, emergency manual override with mandatory audit note, and historical ledger.
- **Problems Resolved from `BACKOFFICE_SPECIFICATIONS.md`**:
  - **Problem F**: Blind payment verification without bank reference number, originating bank, or voucher image.
  - **Problem U**: Forcing accountants to download files to desktop and lack of rejection action with audit reason.
  - **Problem Y**: Unmonitored automated BCV rate sync and un-audited manual rate changes.
- **Key Operational Workflows**:
  - Split-screen in-line bank receipt viewer with zoom controls.
  - Instant one-click approval or rejection with audit reasons (*"Reference Not Found"*, *"Insufficient Amount"*, *"Tampered Voucher"*).
  - Automated dual USD/VES conversion displaying the exact BCV rate applied at transaction time.
  - Exchange rate console with automated daily worker status (09:00 AM) and manual override modal requiring audit justification.
- **Mapped Database Entities**: `Payment`, `ExchangeRateLog`, `Reservation`, `PaymentMethod`, `PaymentStatus`.
- **Audit Verification & Recording**: `module3_treasury_test_1791818120609.webp` | Report: [`module3_treasury_verification_report.md`](file:///C:/Users/Mende/.gemini/antigravity-ide/brain/12497f13-a621-4554-b786-f47c6a90bacc/module3_treasury_verification_report.md).

---

### MODULE 4: Venues, Courts & Visual Split-Shift Schedules

- **Prototype Files**:
  - [`venues/venues-management.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/venues/venues-management.html) — Sports venue directory with tax RIF, amenities, search filters, and cascading territory selector.
  - [`venues/spaces-builder.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/venues/spaces-builder.html) — Court configurator with hourly rates in USD/VES and operational safety modal upon court deactivation.
  - [`venues/schedules-editor.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/venues/schedules-editor.html) — Visual operating hours editor supporting split morning/evening shifts.
- **Problems Resolved from `BACKOFFICE_SPECIFICATIONS.md`**:
  - **Problem G**: Conflating the business entity ("Ally") with physical sports branches ("Venues").
  - **Problem H**: Massive omission of operating schedules and shift configurators (`Schedule`).
  - **Problem I**: Missing legal onboarding data (tax RIF, legal phone, GPS coordinates).
  - **Problem L**: Inconsistent UI between modals and full pages when adding courts.
  - **Problem M**: Dangerous court deactivation when active future bookings exist.
  - **Problem Q**: Disconnection from the 4-tier backend geography tree (`Location`).
- **Key Operational Workflows**:
  - Branch onboarding with cascading geographic selection (State $\to$ City $\to$ Municipality/Neighborhood).
  - Hourly court pricing in USD with real-time BCV conversion.
  - **Safety Deactivation Modal**: When deactivating a court with upcoming bookings, prompts the user to reassign reservations or notify players before shutdown.
  - **Visual Split-Shift Editor**: Configures morning and evening shifts (e.g., 08:00–12:00 and 16:00–23:00), weekday synchronization, and holiday schedule overrides.
- **Mapped Database Entities**: `Venue`, `Court` (`Space`), `CourtSchedule`, `ScheduleOverride`, `Location`, `Amenity`.
- **Audit Verification & Recording**: `mod4_verification_final_1791819149192.webp` | Report: [`module4_venues_verification_report.md`](file:///C:/Users/Mende/.gemini/antigravity-ide/brain/12497f13-a621-4554-b786-f47c6a90bacc/module4_venues_verification_report.md).

---

### MODULE 5: Master Catalogs & RBAC Access Control

- **Prototype Files**:
  - [`users/users-rbac.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/users/users-rbac.html) — Institutional staff directory, venue-scoped permissions, temporary credential generator, and role simulator.
  - [`catalogs/master-catalogs.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/catalogs/master-catalogs.html) — 3-tier sports taxonomy (`ActivityType` > `Activity` > `Category`), court surfaces, and facility amenities.
- **Problems Resolved from `BACKOFFICE_SPECIFICATIONS.md`**:
  - **Problem J**: Zero staff and validator management assigned to venues.
  - **Problem N**: Unmapped text roles disconnected from `UserRole` enums.
  - **Problem O**: Confusion between `GeneralStatus` and `EntityStatus`.
  - **Problem R**: Flattened activity catalog without multi-language JSON support.
  - **Problem S**: Creating users without an initial password or invitation workflow.
  - **Problem V**: Confusing sports categories with physical court surfaces.
- **Key Operational Workflows**:
  - Strict venue scoping for receptionists and validators (`managedVenueId`).
  - Automatic secure temporary password generator with one-click clipboard copy.
  - 3-tier sports taxonomy editor with English/Spanish localized names and SVG icon pickers.
- **Mapped Database Entities**: `User`, `UserRole`, `ActivityType`, `Activity`, `ActivityCategory`, `Amenity`, `SurfaceType`.
- **Audit Verification & Recording**: `mod5_testing_audit_1791821038465.webp` | Report: [`module5_rbac_and_catalogs_verification_report.md`](file:///C:/Users/Mende/.gemini/antigravity-ide/brain/12497f13-a621-4554-b786-f47c6a90bacc/module5_rbac_and_catalogs_verification_report.md).

---

### MODULE 6: Bookings Ledger & Check-In Desk

- **Prototype Files**:
  - [`bookings/reservations-list.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/bookings/reservations-list.html) — Master bookings ledger with short-code search, financial drawer, direct WhatsApp launcher, and CSV export.
- **Problems Resolved from `BACKOFFICE_SPECIFICATIONS.md`**:
  - **Problem A**: Forcing venue owners to filter by themselves on daily operational screens.
  - **Problem E**: Inability to contact players during sudden weather or power disruptions.
  - **Problem F**: Lack of individual financial audit breakdowns per reservation.
  - **Problem T**: Conflation of customer booking payments with ally payout disbursements.
- **Key Operational Workflows**:
  - Real-time search by short-code `#AB4553`, player name, or phone number.
  - Direct WhatsApp Web/App launcher with pre-formatted booking details for quick player communication.
  - Flyout drawer displaying the complete reservation lifecycle (`Pending` $\to$ `Confirmed` $\to$ `Completed`), USD/VES breakdown, and access validator logs.
- **Mapped Database Entities**: `Reservation`, `Payment`, `Court`, `Venue`, `User`.
- **Audit Verification & Recording**: `mod6_verification_audit_1791821687194.webp` | Report: [`module6_reservations_verification_report.md`](file:///C:/Users/Mende/.gemini/antigravity-ide/brain/12497f13-a621-4554-b786-f47c6a90bacc/module6_reservations_verification_report.md).

---

### MODULE 7: Ally Settlements & Financial Payouts Hub

- **Prototype Files**:
  - [`treasury/settlements.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/treasury/settlements.html) — Bi-weekly closing hub, automated 5% commission retention, bank disbursement logging, and downloadable statements.
- **Problems Resolved from `BACKOFFICE_SPECIFICATIONS.md`**:
  - **Problem T**: Critical confusion between client booking receipts and platform disbursements to venues.
  - **Problem X**: Replacing an empty accounting table placeholder with a true financial settlement engine.
- **Key Operational Workflows**:
  - Unambiguous financial metric naming: **GMV (Gross Merchandise Value)** vs **YoReservo Commission (5%)** vs **Net Payout to Ally (95%)**.
  - Grouping by bi-weekly closing batches (`1Q-OCT-2026`, `2Q-OCT-2026`).
  - Bank disbursement execution modal capturing destination bank, transfer reference number, and settlement date.
  - Detailed account statement drawer with PDF discharge receipt and CSV export.
- **Mapped Database Entities**: `Settlement`, `SettlementBatch`, `SettlementItem`, `Venue`, `User` (`ALLY`), `Payment`.
- **Audit Verification & Recording**: `mod7_settlements_test_1791822314030.webp` / `mod7_drawer_capture_1791822765748.webp` | Report: [`module7_settlements_verification_report.md`](file:///C:/Users/Mende/.gemini/antigravity-ide/brain/12497f13-a621-4554-b786-f47c6a90bacc/module7_settlements_verification_report.md).

---

### MODULE 8: Role-Adaptive Executive & Intelligence Dashboard

- **Prototype Files**:
  - [`dashboard/executive-dashboard.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/dashboard/executive-dashboard.html) — Executive console with perspective switcher (Global Admin vs Avila Complex Ally), dynamic timeframe aggregations, and live court ribbon.
- **Problems Resolved from `BACKOFFICE_SPECIFICATIONS.md`**:
  - **Problem A**: Showing irrelevant SuperAdmin metrics to club owners (e.g., *"150 registered allies"*).
  - **Problem W**: Ambiguity in "Earnings" vs "Revenue" and broken chart axes (displaying days when month is selected).
- **Key Operational Workflows**:
  - **Live Perspective Switcher**: Toggles between Global Administrator (network volume, GMV, 5% net fee revenue) and local Ally (today's court occupancy rate, net venue earnings).
  - **Dynamic Timeframe Aggregation**:
    - Selecting **"Hoy (Día)"** aggregates the X-axis by **hourly intervals** (`08:00` to `22:00`).
    - Selecting **"Este Mes"** aggregates the X-axis by **weeks** (`Sem 1` to `Sem 4`).
  - Horizontal live court ribbon providing real-time court occupancy and status indicators.
- **Mapped Database Entities**: `Reservation`, `Court`, `Venue`, `Settlement`, `Payment`.
- **Audit Verification & Recording**: `mod8_dashboard_test_1791823313952.webp` | Report: [`module8_dashboard_verification_report.md`](file:///C:/Users/Mende/.gemini/antigravity-ide/brain/12497f13-a621-4554-b786-f47c6a90bacc/module8_dashboard_verification_report.md).

---

### MODULE 9: Self-Service User Profile & Security

- **Prototype Files**:
  - [`auth/profile.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/auth/profile.html) — Self-service console for personal details, bcrypt password update checklist, language preferences, and active session management.
- **Problems Resolved from `BACKOFFICE_SPECIFICATIONS.md`**:
  - **Problem P**: Security loophole where the self-service profile was identical to admin user management, allowing users to edit their own roles.
  - **Problem S**: Lack of credential security policies and absence of device session audits.
- **Key Operational Workflows**:
  - **Strict Privilege Separation**: Role and assigned venue are strictly read-only; the operator can only edit Name, WhatsApp phone, profile avatar, and language preference (`preferredLanguage`).
  - **Interactive Bcrypt Checklist**: Live evaluation of 5 password complexity rules (8+ chars, uppercase, lowercase, number, special char) with password match validation.
  - **Active Session Management (Prisma `Session`)**: Lists connected devices with IP, browser, OS, location, and last active time. Includes bulk **"Revoke All Other Sessions"** action to invalidate remote tokens.
- **Mapped Database Entities**: `User`, `Session`, `Account`.
- **Audit Verification & Recording**: `mod9_profile_test_1791823997153.webp` | Report: [`module9_profile_verification_report.md`](file:///C:/Users/Mende/.gemini/antigravity-ide/brain/12497f13-a621-4554-b786-f47c6a90bacc/module9_profile_verification_report.md).

---

## 3. Problem Coverage Matrix (A – Y)

| Defect in `BACKOFFICE_SPECIFICATIONS.md` | Summary Description | Resolving Module | Primary File |
| :---: | :--- | :---: | :--- |
| **A** | Persona and context confusion (SuperAdmin vs Ally metrics) | **Module 8** & **Module 6** | `dashboard/executive-dashboard.html` |
| **B** | Flat table flaw instead of multi-court timeline matrix | **Module 2** | `agenda/agenda-grid.html` |
| **C** | Sluggish 5-step, 10-click inverted booking creation flow | **Module 2** | `agenda/agenda-grid.html` |
| **D** | Charging 5% fee and 15m hold on counter walk-in bookings | **Module 2** | `agenda/agenda-grid.html` |
| **E** | Missing customer phone / WhatsApp for urgent contact | **Module 2** & **Module 6** | `bookings/reservations-list.html` |
| **F** | Blind payment validation without voucher or reference | **Module 3** & **Module 6** | `treasury/pago-movil-inbox.html` |
| **G** | Conflating business entity ("Ally") with physical branch ("Venue") | **Module 4** | `venues/venues-management.html` |
| **H** | Complete omission of operating hours and shift schedules | **Module 4** | `venues/schedules-editor.html` |
| **I** | Missing legal tax RIF, contact phone, and GPS coordinates | **Module 4** | `venues/venues-management.html` |
| **J** | Zero staff and gate validator assignment by venue | **Module 5** | `users/users-rbac.html` |
| **K** | Copy-paste bugs in statuses and Montreal maps for Caracas | **All** | `assets/backoffice.css` & HTMLs |
| **L** | Inconsistency between modal and full page for creating courts | **Module 4** | `venues/spaces-builder.html` |
| **M** | Dangerous court deactivation with active upcoming bookings | **Module 4** | `venues/spaces-builder.html` |
| **N** | Text roles disconnected from backend `UserRole` enums | **Module 1** & **Module 5** | `users/users-rbac.html` |
| **O** | Confusion between `GeneralStatus` and `EntityStatus` | **Module 5** | `users/users-rbac.html` |
| **P** | Self-service profile allowing users to change their own role | **Module 9** | `auth/profile.html` |
| **Q** | Disconnection from the 4-tier cascading geography tree | **Module 4** | `venues/venues-management.html` |
| **R** | Flattened activity catalog without multi-language JSON support | **Module 5** | `catalogs/master-catalogs.html` |
| **S** | User creation without credentials or formal invitation | **Module 1**, **5** & **9** | `auth/set-password.html` |
| **T** | Conflation of client booking payments with ally disbursements | **Module 7** | `treasury/settlements.html` |
| **U** | Missing in-line receipt preview and rejection action | **Module 3** | `treasury/pago-movil-inbox.html` |
| **V** | Confusing sport formats with physical surface types | **Module 5** | `catalogs/master-catalogs.html` |
| **W** | Financial metric ambiguity ("Earnings" vs "Revenue") and broken axes | **Module 8** | `dashboard/executive-dashboard.html` |
| **X** | Accounting section reduced to an empty Excel export table | **Module 7** | `treasury/settlements.html` |
| **Y** | Lack of audit trail and monitoring on BCV exchange rate worker | **Module 3** | `treasury/exchange-rate.html` |

---

## 4. Technical Standards & Developer Reference

- **Central Design System**: [`assets/backoffice.css`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/assets/backoffice.css) contains the HSL color palette, CSS custom properties, utility classes (`.card`, `.btn`, `.badge`, `.table`), keyframe animations, and responsive media queries.
- **Cross-Screen Navigation**: Every screen includes top header links and a primary **"Volver al Portal"** action linking back to [`index.html`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/index.html).
- **Preference Persistence**: Theme selection (`yoreservo_theme`) and language mode (`data-lang`) synchronize seamlessly in `localStorage`, maintaining consistent states across page transitions.

---

## 5. Recommended Next Steps & Implementation Roadmap

Now that the complete 9-module interactive Backoffice Prototype Suite is finalized, verified, and audited, the operational and architectural foundation for YoReservo is set. To advance the project into production across the repository ecosystem, the following 4-phase sequential roadmap is recommended:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1 (IMMEDIATE & RECOMMENDED):                                          │
│ Backend Prisma & PostgreSQL Schema Refinement                               │
│ Location: poc-yoreservo-backend-service/prisma/schema.prisma                │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2:                                                                    │
│ Transactional Email Templates Alignment                                     │
│ Location: poc-yoreservo-templates/emails/                                   │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3:                                                                    │
│ Production Web Application Build (Next.js / React)                          │
│ Consuming REST / tRPC APIs from poc-yoreservo-backend-service               │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 4:                                                                    │
│ End-to-End Omnichannel Testing (Client Web <-> Backoffice <-> Database)     │
│ Repositories: poc-yoreservo-client-web-app + backend-service                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Phase 1: Backend Prisma Schema Alignment *(Recommended Immediate Step)*
**Objective**: Ensure the PostgreSQL database natively supports all domain models and workflows discovered during the UI prototype implementation before writing API controllers or services.

- **Target File**: [`poc-yoreservo-backend-service/prisma/schema.prisma`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-backend-service/prisma/schema.prisma)
- **Concrete Refinements**:
  1. **Walk-In Counter Bookings (Module 2)**:
     - Extend `Reservation` with optional fields for unregistered clients:
       - `customer_name: String?` (Player name for counter bookings without a registered account).
       - `customer_phone: String?` (WhatsApp contact for urgent operational updates).
       - `internal_notes: String?` (Cashier or gate staff notes).
  2. **Court Closures & Maintenance (Modules 2 & 4)**:
     - Add `BLOCKED` to the `ReservationStatus` enum (`PENDING_PAYMENT`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `BLOCKED`).
  3. **Pago Móvil Audit Trail & Rejection (Module 3)**:
     - Extend `Payment` with:
       - `verified_by: UUID?` (Foreign key to `User` with `ACCOUNTING` or `ADMIN` role).
       - `verified_at: DateTime?` (Exact timestamp of bank verification).
       - `rejection_reason: String?` (Audited rejection reason).
     - Add `REFUNDED` to the `PaymentStatus` enum.
  4. **Venue Facility Galleries (Module 4)**:
     - Add `VENUE` to the polymorphic `ImageEntityType` enum (`SPACE`, `REVIEW`, `VENUE`).
  5. **Financial Settlements & Ally Disbursements (Module 7)**:
     - Create `SettlementBatch` and `SettlementItem` entities to store bi-weekly closings, YoReservo 5% fee retentions, 95% net disbursements, and destination bank transfer references.
  6. **Migration & Seed**:
     - Run `yarn prisma migrate dev --name add_backoffice_operational_entities` and update seed scripts (`seed.ts`) with representative Venezuelan sports complexes (e.g., Complejo Ávila, San Agustín).

---

### Phase 2: Transactional Email Templates Alignment
**Objective**: Synchronize outgoing emails for customers, venue owners, and staff with the new operational states and short codes defined in the Backoffice.

- **Base Directory**: [`poc-yoreservo-templates/emails/`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/emails/)
- **Specification Source**: [`Emails list with descriptions.docx`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/Emails%20list%20with%20descriptions.docx)
- **Concrete Templates to Produce/Update**:
  1. **Booking Confirmation with Short-Code (Modules 2 & 6)**:
     - Include the 6-character short code `#AB4553`, court details, calendar date, time slot, and check-in QR code.
  2. **Pago Móvil Discrepancy Notice (Module 3)**:
     - Alert the player if a payment was rejected, showing the audited reason and a direct link to re-upload proof of payment.
  3. **Staff Invitation & Account Activation (Modules 1 & 5)**:
     - Institutional welcome email with a one-time activation token enforcing the bcrypt password checklist.
  4. **Bi-Weekly Ally Payout Statement (Module 7)**:
     - Executive statement summarizing booking totals, 5% fee retained, net disbursed balance, and attached bank voucher.

---

### Phase 3: Production Web Application Build (Next.js / React)
**Objective**: Transform the self-contained HTML/CSS prototypes into production React components in a unified web application.

- **Concrete Deliverables**:
  1. **Design System Token Porting**:
     - Map variables from [`assets/backoffice.css`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/assets/backoffice.css) into Tailwind or CSS Modules.
  2. **Core Reusable Components**:
     - `TimelineMatrixGrid`: Interactive multi-court schedule grid with real-time slot states.
     - `WalkInFlyout`: Counter reservation flyout drawer.
     - `ReceiptInspectorModal`: Split-screen receipt viewer with zoom and verification controls.
     - `BcryptPasswordChecklist`: Dynamic credential validation indicator.
     - `DeviceSessionList`: Active session audit monitor with remote token revocation.
  3. **State Management & Query Caching**:
     - Integrate React Query / TanStack Query with NestJS endpoints (`/reservations`, `/payments`, `/venues`, `/settlements`) for live background refetching.

---

### Phase 4: End-to-End Omnichannel Testing
**Objective**: Validate the complete booking lifecycle from client discovery to financial settlement.

- **Critical E2E Verification Flow**:
  1. An athlete books a court and uploads a Pago Móvil receipt on [`poc-yoreservo-client-web-app`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-client-web-app).
  2. The booking immediately appears in *"Pending Payment"* status on the venue's schedule matrix ([Module 2](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/agenda/agenda-grid.html)).
  3. YoReservo accounting reviews and approves the payment in the Treasury queue ([Module 3](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/treasury/pago-movil-inbox.html)).
  4. The booking status switches to *"Confirmed"* on the live grid, and the player receives an access QR code.
  5. Venue gate staff scan the QR code at the reception desk ([Modules 2 & 6](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/bookings/reservations-list.html)), marking Check-In as *"Completed"*.
  6. At the end of the bi-weekly cycle, the transaction is bundled into the ally's settlement batch ([Module 7](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/treasury/settlements.html)), withholding the 5% platform commission and logging the bank disbursement.

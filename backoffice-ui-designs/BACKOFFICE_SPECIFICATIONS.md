# Backoffice Functional Specifications & Architecture — YoReservo

> **Reference and Product Design Document**  
> **Date:** October 2026  
> **Project:** YoReservo Ecosystem (`poc-yoreservo-templates`, `poc-yoreservo-backend-service`, `poc-yoreservo-client-web-app`)

---

## 1. Executive Summary & Vision

The **YoReservo** Backoffice is the operational, commercial, and financial control center of the platform. While [`poc-yoreservo-client-web-app`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-client-web-app) is optimized for discovery and booking by the end athlete (`CLIENT`), the Backoffice solves the operational needs of two distinct realities:

1. **Daily Operations of Sports Clubs & Venues (`ALLY` and `VALIDATOR`)**:
   - Visual, real-time court availability matrix (hour-by-hour).
   - Frictionless walk-in and manual booking registration (phone/WhatsApp calls) at the counter with zero app service fees.
   - On-site access validation and check-in (QR scanning or 6-character short code).
2. **Platform Administration & Governance (`ADMIN` and `ACCOUNTING`)**:
   - Bolívares payment reconciliation (Pago Móvil verification inbox).
   - Official exchange rate management (BCV rate) and audit trail (`ExchangeRateLog`).
   - Management of settlements and batch payouts to venue owners (Allies).
   - Legal onboarding and verification of new venues (RIF, coordinates, active status).
   - Dynamic multi-language master catalogs (Sport taxonomy and Geography tree).

---

## 2. Role-Based Access Control Architecture (RBAC)

The Backoffice is a **unified, role-adaptive portal**: a single entry point whose sidebar navigation and data scopes adapt automatically based on the authenticated user's role and organizational authorization scope:

```
                               ┌────────────────────────────────┐
                               │        BACKOFFICE LOGIN        │
                               └────────────────┬───────────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 │                              │                              │
         [ Role: ADMIN ]               [ Role: ALLY_OWNER ]           [ Role: ACCOUNTING ]
       Platform SuperAdmin              Organization Owner             Treasury & Finance
                 │                      (Corporate Scope)                      │
                 │                              │                              │
  • Global Platform Dashboard    • Multi-Venue Overview         • Pago Móvil Verification Queue
  • Organization / Ally Audits   • Corporate Payout Account     • BCV Exchange Rate Controls
  • Master Catalogs (Sports/Geo) • Organization Staff Invites   • Organization Settlement Batches
  • Global Financials (5% Fee)   • Legal RIF & Contract Terms   • Bank Reconciliation Ledger
  • Global User Account Control  • Branch Performance Comp.     • Billing & Invoicing Reports
                 │                              │
                 │                     [ Role: ALLY_ADMIN ]
                 │                      Venue Branch Manager
                 │                        (Venue Scope)
                 │                              │
                 │               • Visual Multi-Court Grid
                 │               • Shift & Schedule Editor
                 │               • Court / Space Configurator
                 │               • Walk-in Bookings & Cash Desk
                 │                              │
                 └──────────────┬───────────────┘
                                │
                      [ Role: VALIDATOR ]
                    Gate Staff & Receptionist
                                │
                 • Today's Operational Timeline Grid
                 • Express Check-in (QR / Short Code)
                 • Walk-in / Cash Booking Form
```

---

## 3. Forensic Critique of Initial Mockups (Identified Friction Points)

After reviewing the initial 10 mockups, several major structural and UX flaws were identified, justifying a complete redesign:

### A. Persona & Context Confusion
- **Problem**: The Dashboard displayed *"Total de aliados registrados: 150"*, a metric relevant only to a SuperAdmin. A venue owner (`ALLY`) manages 1 or 2 venues and needs to see **today's court occupancy rate** and incoming bookings, not how many other venues exist on the platform.
- **Problem**: On the reservations screen, the user had to filter by *"Aliado: San Agustín..."*. An ally manages their own club; forcing them to filter by themselves adds unnecessary cognitive friction.

### B. Fundamental Operational Flaw: Using a Flat Table for Court Bookings
- **Problem**: The primary reservations screen was a standard paginated data table.
- **Real-world friction**: A flat table cannot display **empty time gaps** or simultaneous court bookings at 6:00 PM. A receptionist cannot quickly answer a customer asking if Court 2 is available at 7:00 PM.
- **Mandatory fix**: The primary interface **must be an Interactive Time Grid / Timeline Matrix** (Courts as columns, operating hours 07:00–23:00 as rows, colored by real-time status). The table view should only serve as a secondary audit/search tab.

### C. Inverted, Sluggish "Create Booking" Flow
- **Problem**: Creating a reservation required 5 steps: filling in client details, selecting 5 dropdowns (*Date*, *Ally*, *Sport*, *Court type*, *Court*), clicking a *"Ver disponibilidad"* button, and opening a modal displaying a vertical 1-column list of hours for that single court.
- **Real-world friction**: Takes over 1 minute and 10+ clicks. If Court 1 is taken, the user must close the modal, change the dropdown to Court 2, and click again.
- **Mandatory fix**: **Click-to-Book Calendar Flow**. The receptionist clicks directly on the open time slot on the desired court in the visual calendar; a side drawer opens pre-filled with the Court and Time; the receptionist enters Customer Name, WhatsApp/Phone, and Payment Method (Cash/POS); and confirms in 5 seconds.

### D. Charging Platform Service Fees & 15-Minute Holds on Manual Bookings
- **Problem**: In the manual booking mockup, a $60 court fee was calculated as **$63.60** (adding YoReservo's 5% platform service fee), and the button read *"Crear pre-reservación"*.
- **Real-world friction**: Direct bookings taken at the venue counter are club-direct transactions (`is_manual: true`, `service_fee: 0`). They must not pay platform fees or risk automatic cancellation by the 15-minute hold sweeper.

### E. Missing WhatsApp / Phone Number
- **Problem**: The client form only requested Email, First Name, and Last Name.
- **Real-world friction**: In amateur sports across Latin America, **95% of communication with players happens via WhatsApp**, not email. If a game is rained out or delayed, venue staff WhatsApp the player directly.

### F. Blind Pago Móvil Validation in Reservation Details
- **Problem**: In *"Detalle de Reservación"*, reservations in status *"Pendiente de confirmación de pago"* displayed a *"Validar Pago"* button, but did not show the bank reference number, originating bank, payer phone number, or proof of payment voucher image.
- **Real-world friction**: Cashiers and accountants cannot validate a payment without cross-referencing the bank reference against their bank portal.

### G. Conflation of "Ally" (Business Partner) vs "Venue" (Physical Complex) — 3-Tier Multi-Vertical Decoupling
- **Problem**: In previous mockups, physical venue branches ("Colegio San Agustín del Paraíso", "Ávila Fitness Center") were treated as if each were a separate "Ally", while the business entity, corporate tax RIF, and bank payout account were conflated.
- **Multi-Vertical Scaling Reality**: YoReservo scales beyond sports clubs to event halls, concerts, training courses, presentations, and speeches. A corporate Ally (`ORGANIZATION`) can operate multiple physical venues/campuses (`VENUE`), or produce events across third-party facilities, while holding a single legal RIF and receiving consolidated payouts into one corporate bank account.
- **Mandatory fix — 3-Tier Architecture**:
  1. **Organization (`ORGANIZATION`)**: Corporate/Legal partner (Legal name, commercial trade name, RIF, master corporate phone/email, commission rate %, and corporate payout bank account).
  2. **Physical Venues (`VENUE`)**: Physical sites/branches belonging to an Organization (`organization_id` FK), with distinct address, GPS coordinates, local reception phone, and facilities.
  3. **Multi-Purpose Spaces (`SPACE`)**: Generic bookable units (courts, rooms, auditoriums, stages, fields) with capacity, surface type, indoor/outdoor indicator, and hourly tariff.
  4. **Scoped Personnel (`USER`)**: `ALLY_OWNER` and `ACCOUNTING` operate across the entire Organization; `ALLY_ADMIN` and `VALIDATOR` are strictly scoped to their assigned `VENUE`.
  5. **Settlement Batches (`SETTLEMENT_BATCH`)**: Disbursed to the `ORGANIZATION`'s bank account with itemized breakdowns showing the origin venue for each booking.

### H. Massive Omission: Operating Hours & Shift Schedules are Nowhere to be Found!
- **Problem**: In *"Detalles de aliado"* and *"Agregar nueva cancha"*, you can define a court number, sport, and hourly price ($35/h), but **there is zero interface to set schedules or opening hours (`Schedule`)**!
- **Real-world reality**: The backend availability engine strictly relies on `Schedule` (split shifts per day of week, e.g. Mon–Fri 08:00–12:00 and 16:00–23:00). Without a shift configurator, no court can generate bookable hours.

### I. Missing Legal Onboarding & Contact Details
- **Problem**: The venue screen only shows *Name*, *Entry Date*, and *Status*.
- **Real-world reality**: In Venezuela and LatAm, onboarding a sports complex requires verifying the **RIF (Tax ID)**, contact phone/WhatsApp, exact physical address, and legal representative. Omitting RIF and phone makes verification impossible.

### J. Zero Staff & Validator Management
- **Problem**: There is no way for an Ally to assign staff members (`VALIDATOR` role) to their venue (`managed_venue_id`).
- **Mandatory fix**: Add a dedicated "Staff / Recepcionistas" tab inside the venue manager to invite and assign validators who can scan QR codes and operate the check-in desk.

### K. Copy-Paste Quality Bugs
- **Problem**: The *"Aliados"* status filter input is set to **`Pagada`** (a reservation payment status copy-pasted onto an ally directory!). The map displays Montreal, Canada, while stating "San Bernardino", for a venue named "El Paraíso". On the court update modal, the status field is still erroneously titled *"Estatus inicial"*.

### L. Inconsistency: Modal vs. Full Page for "Agregar Cancha"
- **Problem**: In one mockup, adding a court is a modal popup over the table; in another, it is an entirely separate full-page form with an image carousel (`mínimo 3 fotos`).
- **Mandatory fix**: Standardize on a structured, multi-step configurator (or clear tabbed layout):
  1. Court specifications (Sport, category, court number, surface type, hourly rate in USD).
  2. Operating Hours & Shifts (`Schedule`: open/close times, split shifts, days closed).
  3. Photo Gallery (optional uploads mapped to polymorphic `Image` entity).

### M. Deactivation Conflict with Active Bookings
- **Problem**: The court table allows toggling a court status directly to *"Inhabilitada"* (Disabled).
- **Real-world hazard**: If Court 1 is disabled while having 4 confirmed bookings tomorrow, the system must not blindly shut down the resource.
- **Mandatory fix**: Provide an operational safety modal: *"Court 1 has 4 upcoming bookings. Options: [Reassign to Court 2] [Cancel & Notify Clients] [Disable anyway after existing bookings]"*.

### N. Role Disconnect with the Database (`UserRole` Enum)
- **Problem**: The user mockups display custom text roles like *"Administradora Uptek"* and *"Aliado Admin"*.
- **Real-world reality**: In the backend, `UserRole` contains strict enums: `ADMIN`, `ALLY`, `ACCOUNTING`, `VALIDATOR`, `CLIENT`.
- **Mandatory fix**: Map all UI role badges and selectors directly to the platform's RBAC roles. A manager of a venue is either the `ALLY` owner or a `VALIDATOR` assigned to `managedVenueId`.

### O. Status Enum Confusion (`HABILITADA` vs `ACTIVE` / `IN_VERIFICATION`)
- **Problem**: On the "Agregar Aliado" screen, the status field offers *"HABILITADA"*.
- **Real-world reality**: In the database:
  - Venues and Users use `GeneralStatus`: `ACTIVE`, `INACTIVE`, `IN_VERIFICATION`.
  - Bookable Spaces use `EntityStatus`: `ENABLED`, `DISABLED`.
- **Mandatory fix**: Venues must be onboarded as `IN_VERIFICATION` (Awaiting review of RIF and location) or set to `ACTIVE` by an Admin. They cannot be "Habilitada".

### P. Self-Service "My Profile" vs. Admin "User Management" Duplication
- **Problem**: *"Perfil de usuario"* (`Configuración -> Perfil`) and *"Detalles de usuario"* (`Usuarios -> Ver detalles`) are 100% visually identical forms. In the profile screen, a user can literally edit their own Role and change which venue they manage!
- **Mandatory fix**: Separate permissions cleanly:
  - **My Profile (`/profile`)**: Self-service only. The user edits their Name, Password, Phone, Profile Photo, and Language preference (`preferredLanguage`). Role and assigned venue are read-only.
  - **Admin User Management (`/users/:id`)**: Admin-only. Can modify roles (`ALLY`, `VALIDATOR`, etc.), assign `managedVenueId`, toggle `status` (`ACTIVE`/`INACTIVE`), trigger password resets, and inspect/revoke active login sessions (`Session` table).

### Q. Geography Tree Mismatch in Venue Creation
- **Problem**: The venue creation screen asks for *"Estado donde se ubica: Distrito Capital"* and *"Ubicación: El paraíso"* as isolated text inputs.
- **Real-world reality**: In the backend, `Location` is a 4-tier tree: `Country` $\to$ `State` $\to$ `City` $\to$ `Neighborhood`.
- **Mandatory fix**: Use cascading selectors connected to `Location`: State (e.g. Distrito Capital) $\to$ City (e.g. Caracas) $\to$ Neighborhood (e.g. El Paraíso) to set `Venue.locationId`.

### R. Flattened 3-Tier Activity Catalog & Missing i18n
- **Problem**: The *"Deportes"* screen reduces the entire activity catalog to a flat, single-column table (*"Bolas criollas"*, *"Fútbol"*).
- **Real-world reality**: The database schema strictly defines a 3-tier taxonomy:
  - `ActivityType` (e.g. `SPORTS`, `ENTERTAINMENT`) with `iconUrl`.
  - `Activity` (e.g. `Fútbol`, `Padel`, `Tenis`) with `imageUrl`.
  - `ActivityCategory` (e.g. `Fútbol 5`, `Fútbol 7`, `Fútbol 11`) which is the actual bookable unit linked to `Space.activityCategoryId`.
  - All names are localized JSONB maps (`{ "es": "Fútbol", "en": "Soccer" }`).
- **Mandatory fix**: The admin catalog manager must support the full 3-tier hierarchy, localized names, and image/icon asset uploads.

### S. "Crear Usuario" Missing Initial Authentication Credentials
- **Problem**: The *"Crear usuario"* screen collects Name, Role, and Email, but **has no password field or invitation mechanism**.
- **Real-world reality**: The backend API (`POST /users`) requires a secure password (8-72 characters, bcrypt hashed).
- **Mandatory fix**: Provide an input for setting an initial temporary password (with an "Auto-generate secure password" option) or an "Invite via Email" flow.

### T. Conflation in "Pagos": Client Booking Payments vs. Ally Settlements
- **Problem**: The *"Pagos"* table lists rows with *Aliado*, *Monto: $150.00*, *Estatus: Pagado*, and *Acciones: Factura*. It is ambiguous whether these are customer booking payments or platform payouts to the venue.
- **Mandatory fix**: Split clearly:
  - **Cobros a Clientes (Client Payments)**: Linked to reservations, showing client name, short code, payment method, amount in Bs/USD, and status (`PENDING`, `VERIFIED`, `FAILED`).
  - **Liquidaciones a Aliados (Ally Settlements)**: Platform payout batches transferring accumulated balances to venue owners.

### U. Pago Móvil Verification UX: Missing In-line Voucher Preview & Reject Action
- **Problem**: The *"Confirmación de pago"* screen only provides a *"Descargar comprobante de pago"* link and a *"Validar pago"* button.
- **Real-world reality**: 
  - Forcing the accountant to download image files to their desktop for every single transaction slows down reconciliation dramatically.
  - There is no button to **Reject or Flag** a payment if the reference number is counterfeit or not found on the bank statement.
  - The USD equivalent amount and the BCV rate applied are omitted from this verification card.
- **Mandatory fix**: Provide a side-by-side in-line voucher preview modal, a "Reject Payment" button with a rejection reason note, and full financial breakdown (USD total, BCV rate, and Bs received).

### V. Confusing "ActivityCategory" with Physical "Court Type"
- **Problem**: In *"Editar deporte"*, the subcategories (*Fútbol 5*, *Fútbol 7*, *Fútbol 11*) are labeled as *"Tipo de canchas"* (Court type).
- **Real-world reality**: 
  - A physical court type is the surface/infrastructure (*Grama sintética*, *Techada*, *Arcilla*, *Indoor*).
  - *Fútbol 5*, *Fútbol 7*, *Pádel Dobles*, *Tenis Singles* is the **Sport Category / Format (`ActivityCategory`)**, which is the bookable entity in the database.
- **Mandatory fix**: Clearly label this as **"Categorías / Formatos Deportivos"** and allow multi-language JSON name editing (`es`/`en`) and thumbnail assignment.

### W. Severe Financial Metric Ambiguity in "Ganancias" (`Facturación` vs `Ganancias`)
- **Problem**: The *"Ganancias"* screen presents two separate bar charts titled *"Facturación del negocio"* and *"Ganancias del negocio"* without explaining the difference.
- **Why this fails**:
  - For an **Admin**: Is "Facturación" the total platform booking volume (GMV e.g. $92,400), and "Ganancias" YoReservo's 5% cut ($4,620)?
  - For an **Ally**: Their revenue is court subtotal ($3,300), and platform fees are billed to the client.
  - **Quality bug**: The toggle is set to **`día`** (Day), but the chart X-axis shows dates **Sep 1, Sep 8, Sep 15** (a weekly/monthly view, not a daily view!). The other chart has 20 unlabeled green bars with zero axis markers.
- **Mandatory fix**: Standardize financial metrics:
  - **Volumen Bruto / GMV**: Total dollar volume booked.
  - **Comisión de Plataforma (5%)**: Net revenue retained by YoReservo.
  - **Ingreso Neto del Aliado**: Total court earnings disbursed to the venue.
  - Timeframe toggles must properly change X-axis aggregation (Hours of the day when `Día` is selected, Days of the month when `Mes` is selected).

### X. "Contabilidad" as an Empty Export Placeholder
- **Problem**: The entire *"Contabilidad"* section is literally just a 6-row table showing months (*Mayo, Abril, Marzo...*) and a single button *"Exportar excel"*. There are no financial summaries, no closing statements, no account reconciliation, and no ledger preview.
- **Mandatory fix**: Turn Contabilidad into a genuine **Financial Closing & Reconciliation Hub**:
  - Monthly/bi-weekly financial closing cards: Total collected via Pago Móvil vs Card, total platform fees retained, total payouts executed to Allies, and pending unsettled balances.
  - Direct report exports (Excel, PDF account statements per Ally).

### Y. Exchange Rate ("Tasa de Cambio") — Solid Concept Needing Operational Polish
- **Evaluation**: The *"Tasa de cambio"* screen is one of the strongest mockups because it directly mirrors the database model `ExchangeRateLog` (`rate`, `createdAt`, `generatedBy: SYSTEM / MANUAL`).
- **Required enhancements**:
  - Display the automated BCV sync status (e.g. *"Última sincronización oficial BCV: Hoy a las 09:00 AM — Próxima ejecución: Mañana 09:00 AM"*).
  - When performing a manual override, prompt the user for an audit justification note (*"Ajuste manual por feriado bancario"*).

---

## 4. Database Alignment & Required Schema Refinements

The active PostgreSQL schema ([`prisma/schema.prisma`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-backend-service/prisma/schema.prisma) and [`new-db-er.mermaid`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-backend-service/docs/new-db-er.mermaid)) is ~90% ready. To support the full Backoffice lifecycle, the following refinements are documented:

| Feature / Use Case | Current DB State | Proposed Backoffice Refinement (Implemented in `proposed_db.mermaid`) |
|---|---|---|
| **Ally Corporate Entity Decoupling** | Conflated `Venue` with Ally owner; single company could not own multiple branches or host events elsewhere. | Introduced `ORGANIZATION` entity (legal name, trade name, RIF, master corporate phone/email, commission rate %, corporate bank account). `VENUE` strictly represents physical sites linked via `organization_id`. |
| **Multi-Purpose Bookable Spaces** | Schema assumed only sports courts. | Evolved `SPACE` to support sports, concerts, courses, presentations with `capacity`, `surface_type`, `is_covered`, and `hourly_rate`. |
| **Court Maintenance & Closures** | Only transactional booking statuses existed (`PENDING_PAYMENT`, `CONFIRMED`). | Introduced dedicated `SPACE_BLOCK` entity (`space_id`, `start_time`, `end_time`, `reason`, `created_by`) separating operational closures from customer bookings. |
| **Accounting Audit Trail (Payment Approver)** | `Payment` had `status: PENDING, VERIFIED, FAILED`, but omitted approver. | Added to `Payment`: `verified_by: UUID?` (FK to `User`), `verified_at: DateTime?`. |
| **Payment Retry on Rejection** | `Payment.reservation_id` was unique 1:1, preventing re-uploading vouchers. | Decoupled `RESERVATION ||--o{ PAYMENT` (1:N) for payment audit history and retry flow. |
| **Multi-Venue Personnel Scoping** | `User` had no organization link, only optional single venue. | Added `organization_id: UUID?` and `managed_venue_id: UUID?` to `USER` for corporate vs branch scoping. |
| **Ally Payouts & Settlements** | No model existed for accumulated payouts. | Introduced `SETTLEMENT_BATCH` and `SETTLEMENT_ITEM` linked to `ORGANIZATION` with itemized venue breakdowns. |

---

## 5. Backoffice Screen & Module Blueprint

### Module 1: Authentication & Access Control
- **`login.html`**: Focused, elegant card with YoReservo brand identity, Email and Password inputs, password visibility toggle, and password recovery link.
- **`recover-password.html`**: Password reset request flow with email feedback and cooldown timer.
- **`profile.html`**: User self-service profile (update name, phone, password, preferred language `preferredLanguage`, and profile picture). Role and assigned venue are strictly read-only.

### Module 2: Contextual Smart Dashboard
- **ADMIN View**:
  - Global KPIs: Gross Merchandise Value (GMV), Net Platform Commission (5%), Total monthly reservations, New venues pending review.
  - Actionable Alerts: Pago Móvil references pending verification, unverified venues.
  - Analytics: Bookings broken down by sport, platform peak hours heatmap.
- **ALLY / VALIDATOR View**:
  - Venue KPIs: Court occupancy today (%), Confirmed bookings today, Net daily venue revenue, Next upcoming match.
  - Quick Action Buttons: "+ Quick Walk-in Booking", "Scan QR / Express Check-in".

### Module 3: Operations Hub (Interactive Multi-Court Schedule)
- **`agenda-grid.html` (Flagship Operational Screen)**:
  - Date Selector (quick chips: Today, Tomorrow, Datepicker).
  - Venue Selector (for allies owning multiple clubs).
  - Sport filter tabs (Football, Padel, Tennis).
  - **Timeline Matrix**:
    - X-Axis: Venue courts side-by-side (e.g., Court 1 - Football 5, Court 2 - Football 5, Court 3 - Padel).
    - Y-Axis: Operating hours (07:00 AM to 11:00 PM in 1-hour increments).
    - Color-coded interactive slot blocks (`AVAILABLE`, `PRE_RESERVED` with countdown, `CONFIRMED`, `COMPLETED`, `BLOCKED`).
  - **Quick Booking Flyout Drawer**:
    - Triggered by clicking directly on an open time block.
    - Fields: Pre-selected Court & Hour, Client Name, WhatsApp Phone, Payment Method (Cash at counter, Direct Pago Móvil, Card).
    - Instant confirmation button (`is_manual: true`, zero app fees).
- **`reservations-list.html`**: Secondary tabular view with advanced search by booking code (`AB4553`), customer name, phone, date range, and CSV/Excel export.

### Module 4: Booking Details & Check-In
- **`reservation-detail.html`**:
  - Status Card: Highlighted short code (`AB4553`), QR code, status badge with official brand colors.
  - Customer Information: Name, Phone with direct WhatsApp click-to-chat (`wa.me`), Email.
  - Resource Information: Venue, Sport category, Court number, Date and Time slot.
  - Payment Audit Panel:
    - If Pago Móvil: Reference number, Originating bank, Payer phone, Amount in Bs and USD, BCV rate applied, digital receipt link.
    - Actions: "Approve Payment", "Reject / Mark Failed", "Perform Check-in".
  - Validation Log: Shows `validated_by` and exact timestamp of on-site ticket scanning.

### Module 5: Venues, Spaces & Split Shifts Configurator
- **`venues-management.html`**: Venue directory and editor (RIF, address, geo-coordinates, contact phone, photo gallery).
- **`spaces-builder.html`**: Court configurator per venue, assigned sport category, USD hourly rate, active/disabled toggle.
- **`schedules-editor.html`**: Visual weekly recurring shift editor (e.g., Mon–Fri: Morning 08:00–12:00, Evening 16:00–23:00; Saturday full day).
- **`venue-staff.html`**: Staff & validator management (inviting reception staff and linking them to `managed_venue_id` with QR scanner permissions).

### Module 6: Finance & Treasury
- **`pago-movil-inbox.html`**: High-velocity queue of pending Pago Móvil payments with bank filtering and 1-click verification.
- **`exchange-rate.html`**: Official BCV rate tracker, history logs (`ExchangeRateLog`), and manual rate adjustment tool with audit justification.
- **`settlements.html`**: Ally settlement ledger (calculates accumulated court subtotal, deducts platform fee, logs payout transaction reference).

### Module 7: Master Catalogs & User Management (Admin Only)
- **`activities-catalog.html`**: Hierarchical CRUD for Activity Types, Activities, and Categories with multi-language JSON names (`es` / `en`).
- **`locations-tree.html`**: Geographic tree manager (Country $\to$ State $\to$ City $\to$ Neighborhood).
- **`users-directory.html`**: User directory across all roles (`ALLY`, `VALIDATOR`, `ACCOUNTING`, `ADMIN`), filterable by role and status (`ACTIVE`, `INACTIVE`, `IN_VERIFICATION`).
- **`user-detail-admin.html`**: Comprehensive admin user editor (change role, link `managedVenueId`, toggle status, trigger password resets, and view/revoke active sessions from the `Session` table).

---

## 6. Implementation Roadmap
1. Review the remaining mockups from the user to finalize requirement analysis.
2. Build the interactive master navigation portal (`index.html`) using YoReservo's institutional design tokens.
3. Incrementally generate the responsive, Chrome-ready HTML prototypes in [`poc-yoreservo-templates/backoffice-ui-designs/`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs).

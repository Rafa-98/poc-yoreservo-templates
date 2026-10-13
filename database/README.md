# YoReservo Database Architecture & Proposed Schema

> **Document Version:** 2.0 — Decoupled Organization & Multi-Tenant Model (October 2026)  
> **Source Model:** [`proposed_db.mermaid`](./proposed_db.mermaid)  
> **Baseline Compared:** [`poc-yoreservo-backend-service/docs/new-db-er.mermaid`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-backend-service/docs/new-db-er.mermaid)  
> **Functional Source:** [`poc-yoreservo-templates/backoffice-ui-designs/`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-templates/backoffice-ui-designs/)

---

## 1. Executive Summary & 3-Tier Hierarchy

This proposed database schema establishes a clean, decoupled 3-tier resource architecture designed to scale seamlessly across sports complexes, event production companies, concert promoters, training academies, and conference centers:

```
 ┌────────────────────────────────────────────────────────┐
 │                      ORGANIZATION                      │  (The Ally / Partner Legal Company)
 │  • Legal name, Commercial trade name, Tax RIF          │  e.g. "Inversiones Ávila C.A."
 │  • Payout corporate bank account & fiscal address      │       "Caracas Live Producciones C.A."
 │  • Primary Ally account owner (User role: ALLY)        │
 └──────────────────────────┬─────────────────────────────┘
                            │
                            │ 1 : N (owns / operates)
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │                         VENUE                          │  (The Physical Site / Campus / Branch)
 │  • Physical address, GPS coordinates (lat, lng)        │  e.g. "Sede San Bernardino"
 │  • City / Neighborhood (LOCATION tree node)            │       "Sede La Castellana"
 │  • Facility photos (parking, cafeteria, locker rooms)  │       "Auditorio CCCT"
 └──────────────────────────┬─────────────────────────────┘
                            │
                            │ 1 : N (contains bookable resources)
                            ▼
 ┌────────────────────────────────────────────────────────┐
 │                         SPACE                          │  (The Bookable Resource / Unit)
 │  • Activity format (ACTIVITY_CATEGORY)                 │  e.g. Cancha 1 (Fútbol 5)
 │  • Hourly / Session price, surface, shifts, capacity   │       Pista Central (Pádel)
 │  • Event Hall, Auditorium, Boardroom, Classroom        │       Auditorio Principal (Conferencia)
 └────────────────────────────────────────────────────────┘
```

---

## 2. Key Architecture Adjustments & Forensic Rationale

### A. Decoupling `ORGANIZATION` (Ally Company) from `VENUE` (Physical Location)
- **Problem**: In `new-db-er.mermaid`, `VENUE` held both corporate legal/financial fields (`rif`, payout bank details, owner) and physical location fields (`address`, GPS coordinates). This conflation breaks whenever:
  1. An Ally is an **Event Producer / Promoter** (*e.g. "Caracas Live Producciones"*) hosting concerts at third-party venues (*e.g. Poliedro, Anfiteatro*). The company is not a physical venue.
  2. A sports club Ally owns **multiple branches/locations** (*e.g. "Padel Pro La Castellana", "Padel Pro Las Mercedes"*). Company RIF and bank accounts were duplicated across multiple venue rows.
  3. An academy or educational partner rents or operates spaces across different sites.
- **Solution**:
  - `ORGANIZATION`: Represents the legal business partner. Stores trade name, legal entity name, fiscal RIF, corporate bank payout account, and platform commission rate.
  - `VENUE`: Represents the physical campus/site/branch where activities happen. Points to `organization_id FK` and `location_id FK` (neighborhood).
  - Settlements (`SETTLEMENT_BATCH`) target the `ORGANIZATION` as the corporate payee, consolidating revenue across all venues managed by that company.

### B. Dedicated Court Blocking Model (`SPACE_BLOCK`) Instead of `BLOCKED` in `ReservationStatus`
- **Problem**: Placing `BLOCKED` inside `ReservationStatus` pollutes the reservation table. Operational closures (rain, maintenance, tournaments) do not have a client, a short code, a QR hash, or a payment. Forcing them into `Reservation` requires fabricating dummy data and forces every financial, occupancy, and settlement query to filter `WHERE status != 'BLOCKED'`.
- **Solution**: A dedicated `SPACE_BLOCK` table (`space_id`, `block_date`, `start_time`, `end_time`, `reason`, `notes`, `created_by`). This cleanly supports rain closures, court maintenance, and split-schedule overrides without polluting commercial reservations.

### C. 1:N Relationship for Payments (`RESERVATION ||--o{ PAYMENT`)
- **Problem**: In `new-db-er.mermaid`, `Payment` was 1:1 (`@unique reservationId`). In real Venezuelan Pago Móvil operations, an accountant may reject a payment reference (e.g. wrong amount in Bs, reference not found in bank portal). With a 1:1 constraint, the user cannot re-upload proof of payment without overwriting the historical audit record of the first rejection.
- **Solution**: `RESERVATION` has 1:N `PAYMENT` attempts. Attempt 1 can be `status: REJECTED` with a documented `rejection_reason`. Attempt 2 can be submitted by the user and verified by accounting (`status: VERIFIED`).

### D. Resolving the 15-Minute Hold Sweeper vs. Pago Móvil Manual Audit
- **Problem**: When a client selects Pago Móvil, they report their transfer. The reservation cannot stay in `PENDING_PAYMENT` with a 15-minute countdown, because the background sweeper would cancel the booking before the accountant opens the banking portal.
- **Solution**: Add `PAYMENT_UNDER_REVIEW` to `ReservationStatus`. Submitting a Pago Móvil reference transitions the booking from `PENDING_PAYMENT` (15-min hold) to `PAYMENT_UNDER_REVIEW`, which holds the court slot indefinitely until accounting approves (`CONFIRMED`) or rejects it.

### E. Counter Walk-In Bookings (`is_manual = true`)
- **Problem**: Receptionists taking counter or WhatsApp bookings do not register a client account. `Reservation` had `client_id` nullable, but provided nowhere to store the player's name or contact number.
- **Solution**: Added `customer_name`, `customer_phone` (for direct WhatsApp notifications), and `internal_notes` to `RESERVATION`. Counter bookings have `service_fee = 0` (zero platform fee).

### F. Financial Settlements Hub (`SETTLEMENT_BATCH` & `SETTLEMENT_ITEM`)
- **Problem**: There was no data model to track platform payout disbursements to Allies.
- **Solution**:
  - `SETTLEMENT_BATCH`: Tracks the bi-weekly/monthly payout batch per organization (`period_start_date`, `period_end_date`, `gross_amount`, `platform_fee_amount`, `net_payout_amount`, `status`, `payout_reference_number`, `payout_receipt_url`, `disbursed_by`).
  - `SETTLEMENT_ITEM`: Links each settled reservation and payment to the batch. Enforces that each reservation is settled exactly once.
  - **Business Rule**: Settlements bundle verified online/platform payments (`VERIFIED`), and explicitly exclude counter cash bookings (`is_manual = true`) where the venue already collected the physical cash.

### G. Formal Staff Invitation Engine (`USER_INVITATION`)
- **Problem**: An Admin or Ally inviting a receptionist/validator previously required inventing an arbitrary password upfront.
- **Solution**: Added `USER_INVITATION` with a secure one-time activation token hash (`token_hash`), target organization, assigned physical venue, and expiration window.

### H. Multi-Purpose Bookable Spaces (`SPACE`)
- **Problem**: `SPACE` only supported sports court attributes.
- **Solution**: Added `capacity` (for event halls, classrooms, conference auditoriums), `surface_type`, and `is_covered` to support both sports complexes and event/speech venues.

### I. Multi-Currency Official BCV Reference Support ($ USD vs € EUR)
- **Problem**: In Venezuelan commerce, some Allied businesses price their services pegged to the official **USD ($)** BCV rate (*Bs / USD*), while other Allies (e.g. premium padel clubs, event producers) price and charge pegged to the official **EUR (€)** BCV rate (*Bs / EUR*). The original schema assumed a single hard-coded USD exchange rate log, leaving no mechanism for Allies to choose their reference currency or for the system to audit calculations in Bolívares.
- **Solution**:
  - **`CURRENCY` Entity**: Stores supported ISO currencies (`USD`, `EUR`, `VES`, etc.) and indicates whether they are valid Ally pricing references (`is_reference = true`) or national settlement tender (`VES`, `is_national = true`).
  - **`EXCHANGE_RATE` Entity**: Tracks daily official rates published by the Banco Central de Venezuela per currency pair (`USD/VES`, `EUR/VES`, etc.) with `value_date` (Fecha Valor), active status, and manual override audit logs.
  - **`ORGANIZATION.reference_currency_code`**: An Ally configures whether their company bills in `USD` ($) or `EUR` (€).
  - **`RESERVATION` Audit**: Every reservation captures `currency_code`, the exact `exchange_rate_id` and snapshot `exchange_rate_value` applied at booking time, and computes `total_amount_ves` for legal and fiscal invoicing compliance in Venezuela.
  - **`PAYMENT` Audit**: When paying via Pago Móvil in Bolívares, the payment captures the exact applied rate and calculates both `amount_ves` and `amount_reference` ($ or €).

### J. Venezuelan Document Taxonomy & Worldwide Phone Architecture

1. **Venezuelan Identity & Tax Document Standard (`document_type` + `document_number`)**:
   - Replaces free-text inputs where users previously had to type "V-" or "J-" with a dedicated selector containing all 6 official Venezuelan document types:
     - **`V`** — **Venezolano**: Cédula de Identidad de nacional.
     - **`E`** — **Extranjero**: Cédula de Identidad de extranjero residente.
     - **`J`** — **Jurídico**: RIF de personas jurídicas y sociedades mercantiles.
     - **`G`** — **Gubernamental**: RIF de entes públicos, alcaldías e instituciones del Estado.
     - **`P`** — **Pasaporte**: Identificación de viajeros internacionales y diplomáticos.
     - **`C`** — **Comunal**: RIF de consejos comunales y comunas organizadas.
   - Ensured across `ORGANIZATION` (RIF), `USER` (CI/DNI), `USER_INVITATION` (Staff Onboarding), `RESERVATION` (Walk-in client identification), and `PAYMENT` (Pago Móvil reconciliation).

2. **Worldwide Phone Architecture (`country_code` + `operator_prefix` + `subscriber_number`)**:
   - Every phone input across Client Web App and Backoffice Web App is structured as a 3-part composite component:
     - **Country Code Selector**: Comprehensive worldwide list of country calling codes (defaulting to 🇻🇪 `+58`, with `+1`, `+34`, `+57`, `+507`, `+52`, `+56`, `+54`, `+51`, `+593`, `+55`, etc.).
     - **Operator / Prefix Selector**: Venezuelan mobile operators (`0412` Digitel, `0414` / `0424` Movistar, `0416` / `0426` Movilnet, `0422`), landline (`0212` Caracas), or international.
     - **Subscriber Number Input**: 7 digits.
   - Stored in international format (e.g. `+58 412 1234567`) enabling seamless, 1-click WhatsApp messaging (`https://wa.me/584121234567`).

---

## 3. Entity Comparison Matrix

| Entity | `new-db-er.mermaid` | `proposed_db.mermaid` (v2.0) | Justification / Backoffice Module |
|---|---|---|---|
| **`CURRENCY`** | ❌ Did not exist | ✅ **New Entity** | Formalizes ISO currency codes (`USD`, `EUR`, `VES`, `CNY`); supports multi-reference pricing |
| **`EXCHANGE_RATE`** | Limited USD log (`rate`) | ✅ **Upgraded Entity** | Supports multi-currency BCV rates (`USD/VES`, `EUR/VES`), `value_date`, active flag, and audit notes (Mod 3) |
| **`ORGANIZATION`** | ❌ Did not exist | ✅ **New Entity** | Decouples Ally Company from physical venues; stores RIF (`document_type` + `rif_number`), payout bank, and `reference_currency_code` ($ vs €) |
| **`VENUE`** | Mixed corporate & physical | Focused on **Physical Site** | Points to `organization_id`; holds physical address, GPS coordinates, local reception phone |
| `USER` | Basic auth fields | Added `organization_id`, `document_type`, `document_number`, `phone`, timestamps | Profile management (Mod 9) & WhatsApp ops (Mod 2, 6) |
| `USER_INVITATION` | ❌ Did not exist | ✅ New entity | Staff invitation & onboarding flow with document type & phone (Mod 1, 5) |
| `SESSION` | Basic fields | Added `last_active_at` | Active session monitor & remote revocation (Mod 9) |
| `IMAGE` | `SPACE`, `REVIEW` only | Added `ORGANIZATION`, `VENUE` | Company branding and facility photo galleries (Mod 4) |
| `SPACE` | Category & price only | Added `currency_code`, `capacity`, `surface_type`, `is_covered` | Multi-vertical court & event hall configurator (Mod 4) |
| `SCHEDULE` | Open/close times | Added `is_active` | Temporarily pausing shifts without deletion (Mod 4) |
| `SPACE_BLOCK` | ❌ Did not exist | ✅ New entity | Rain closures, court maintenance, tournaments (Mod 2) |
| `RESERVATION` | Registered client only | Added `currency_code`, `exchange_rate_id`, `total_amount_ves`, `customer_name`, `customer_document_type`, `customer_document_number`, `customer_phone` | Multi-reference BCV pricing, counter walk-ins (Mod 2), check-in audit (Mod 4, 6) |
| `ReservationStatus` | 4 states | Added `PAYMENT_UNDER_REVIEW`, `REFUNDED` | Pago Móvil review queue (Mod 3) & refunds (Mod 7) |
| `PAYMENT` | 1:1 with Reservation | Changed to **1:N**; added `currency_code`, `exchange_rate_id`, `amount_ves`, `amount_reference`, `payer_document_type`, `payer_id_document`, `phone_number`, `verified_by` | Multi-currency Pago Móvil verification queue, voucher inspector, retry on rejection (Mod 3) |
| `PaymentStatus` | `PENDING, VERIFIED, FAILED` | Added `REJECTED`, `REFUNDED` | Discrepancy rejection & refund tracking (Mod 3, 7) |
| `SETTLEMENT_BATCH` | ❌ Did not exist | ✅ New entity | Ally corporate bi-weekly closings & payout ledger with currency tracking (Mod 7) |
| `SETTLEMENT_ITEM` | ❌ Did not exist | ✅ New entity | Itemized settlement breakdown per booking (Mod 7) |

---

## 4. Next Step: Prisma Migration Alignment

To apply these changes in `poc-yoreservo-backend-service`:
1. Update `prisma/schema.prisma` with the models and enums defined in `proposed_db.mermaid`.
2. Generate migration:
   ```bash
   yarn prisma migrate dev --name add_organization_and_backoffice_entities
   ```
3. Update database seed scripts (`seed.ts`) with sample Venezuelan organizations (e.g. Grupo Deportivo Ávila C.A., Caracas Live Producciones C.A.), venues, spaces, schedules, and initial settlement batches.

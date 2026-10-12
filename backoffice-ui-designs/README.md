# YoReservo — Backoffice UI Designs & Functional Specifications

This directory contains the functional specifications, information architecture, and interactive HTML/CSS/JS prototypes for the **Unified YoReservo Backoffice**.

---

## 📂 Directory Contents

| File / Folder | Description |
|---|---|
| [`BACKOFFICE_SPECIFICATIONS.md`](./BACKOFFICE_SPECIFICATIONS.md) | **Complete Specification**: Role analysis, critique of previous mockups, database mapping, and functional design of each module. |
| [`STYLE_GUIDE.md`](./STYLE_GUIDE.md) | **Design System & Style Rules**: Executive palette, semantic CSS tokens, typography, and responsive rules. |
| `index.html` *(Coming Soon)* | Master interactive portal to preview and test all Backoffice screens in Google Chrome. |
| `auth/` *(Coming Soon)* | Login and Password Recovery designs built with the institutional Design System. |
| `dashboard/` *(Coming Soon)* | Contextual operational dashboard tailored to user roles (`ADMIN` vs `ALLY` / `STAFF`). |
| `agenda/` *(Coming Soon)* | Interactive multi-court Timeline Grid and quick-booking flyout drawer. |
| `reservations/` *(Coming Soon)* | Reservation details with authentic Pago Móvil audit proofs, lifecycles, and QR check-in. |
| `venues-spaces/` *(Coming Soon)* | Venues, courts, media gallery, and split-shift schedule configurators. |
| `treasury/` *(Coming Soon)* | Pago Móvil reconciliation inbox, exchange rate controls, and ally payouts. |
| `catalogs/` *(Coming Soon)* | Master catalogs (Sports, Categories, Geography) and user directory. |

---

## 🎨 Design System & Visual Standards

All prototypes in this directory follow **YoReservo's** official brand standards:

### 1. Typography
- **Headings & Branding**: `Outfit` (600, 700, 800) — Athletic, modern, and prominent.
- **Body, Tables & Forms**: `Inter` (400, 500, 600, 700) — Precision and clarity in data-dense interfaces.

### 2. Institutional Color Palette (CSS Tokens)
```css
:root {
  /* Backgrounds & Surfaces */
  --bg-main: #F7F5EF;          /* Soft institutional backdrop */
  --bg-surface: #FFFFFF;       /* Cards and elevated surfaces */
  --bg-muted: #F0EDE5;         /* Secondary surfaces, inputs */
  --border: #E6E2D8;           /* Subtle borders */
  
  /* Text */
  --text-main: #1F290F;        /* Deep olive-green (near black) */
  --text-muted: #636C59;       /* Secondary text / placeholders */
  
  /* Brand Identity */
  --brand-deep: #1F290F;       /* Institutional deep forest olive */
  --brand-accent: #C6F23B;     /* Vibrant electric lime (athletic energy) */
  --brand-accent-hover: #b5e327;
  
  /* Operational Statuses */
  --status-available-bg: #ECFDF5;
  --status-available-text: #059669;
  --status-hold-bg: #FEF3C7;
  --status-hold-text: #D97706;
  --status-confirmed-bg: #EFF6FF;
  --status-confirmed-text: #2563EB;
  --status-completed-bg: #F3E8FF;
  --status-completed-text: #7C3AED;
  --status-cancelled-bg: #FEE2E2;
  --status-cancelled-text: #DC2626;
  --status-blocked-bg: #F1F5F9;
  --status-blocked-text: #64748B;
}
```

---

## 🚀 How to View the Designs
All prototypes are **self-contained HTML5/CSS3/Vanilla JS files** with zero build dependencies:
1. Open any `.html` file directly in **Google Chrome**.
2. Each screen features realistic interactivity (status switching, filters, modals, and time-slot selection).

---

## ✅ Validating the Prototypes
Run the static checker (Node 18+, no dependencies) after editing any screen:
```bash
node scripts/check-prototypes.js          # add --unused to also list unused i18n keys
```
It fails (exit code 1) on: inline-script **syntax errors**, `data-i18n` keys **missing** in `es`/`en` or **out of parity** between them, and **broken relative links** (`href` / `src` / `url()`).


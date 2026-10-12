# YoReservo Backoffice — Design System & Style Guide

This guide establishes the visual standard, color palette, responsive layout rules, and component tokens for the **YoReservo Backoffice** prototypes located in `poc-yoreservo-templates/backoffice-ui-designs`.

---

## 1. Design Philosophy: "Executive Athletic Precision"

While [`poc-yoreservo-client-web-app`](file:///c:/Users/Mende/OneDrive/Documentos/personal/proyectos/YoReservo/Repos/poc-yoreservo-client-web-app) is optimized for discovery and booking by casual sports players with warm cream tones, the **Backoffice** is a high-density, analytical, and operational workspace used daily by venue managers, receptionists, and accountants.

Its visual language combines:
- **Executive Authority**: Dark forest slate foundation (`#121811`) providing structure and focus.
- **Athletic Energy**: YoReservo's signature electric lime (`#C6F23B`) used strategically for active states, key CTAs, and live operational feedback.
- **Clarity & High Contrast**: Crisp off-white backgrounds (`#F8FAF7`) with pure white elevated cards and subtle borders (`#E2E6DF`) to prevent eye fatigue during 8-hour operational shifts.

---

## 2. Color Palette & Semantic Tokens

### Core Foundation
```css
:root {
  /* Surfaces & Canvas */
  --bg-app: #F8FAF7;               /* Main workspace backdrop (crisp off-white) */
  --bg-surface: #FFFFFF;           /* Elevated cards, tables, modals */
  --bg-surface-hover: #F2F5F0;     /* Hover state on rows and cards */
  --bg-muted: #EBEFE7;             /* Input background, secondary chips */
  
  /* Sidebar & Structural Frame */
  --bg-sidebar: #121811;           /* Deep Executive Forest Slate */
  --bg-sidebar-hover: #1D261C;     /* Sidebar menu hover */
  --bg-sidebar-active: #243022;    /* Active menu item container */
  --text-sidebar: #A2ADA0;         /* Inactive menu text / icons */
  --text-sidebar-active: #FFFFFF;  /* Active menu text */
  --border-sidebar: #1E281D;       /* Sidebar dividing border */

  /* Text & Contrast */
  --text-main: #141A13;            /* Primary titles and data values */
  --text-muted: #5C6659;           /* Secondary labels, timestamps, table headers */
  --text-faint: #8E998B;           /* Placeholders, disabled states */
  
  /* Borders */
  --border-subtle: #E2E6DF;        /* Standard 1px card and table border */
  --border-medium: #CAD0C5;        /* Input border, focused boundaries */
  --border-strong: #A8B1A2;        /* Emphasized divider */

  /* Brand Signature Accents */
  --brand-lime: #C6F23B;           /* Signature Electric Lime */
  --brand-lime-hover: #B5E02E;     /* Button hover state */
  --brand-lime-text: #121811;      /* High-contrast text on lime buttons */
  --brand-forest: #1F290F;         /* Institutional Deep Olive */
  --brand-forest-hover: #2C3A16;   /* Dark button hover */

  /* Interactive Text & Links */
  --text-link: #183C15;            /* Deep accessible forest green in light mode */
  --text-link-hover: #0F260D;
  --text-accent: #1F451B;
}

/* Dark Mode Tokens (Nocturnal Executive Cockpit) */
[data-theme="dark"] {
  /* Surfaces & Canvas */
  --bg-app: #0B100B;               /* Deep slate dark canvas */
  --bg-surface: #131A12;           /* Elevated cards, tables, modals */
  --bg-surface-hover: #1B241A;     /* Hover state on rows and cards */
  --bg-muted: #1A2319;             /* Input background, secondary chips */
  
  /* Sidebar & Structural Frame */
  --bg-sidebar: #080C07;           /* Nocturnal pitch frame */
  --bg-sidebar-hover: #111810;     /* Sidebar menu hover */
  --bg-sidebar-active: #1A2419;    /* Active menu item container */
  --text-sidebar: #8E9A8C;         /* Inactive menu text / icons */
  --text-sidebar-active: #FFFFFF;  /* Active menu text */
  --border-sidebar: #172216;       /* Sidebar dividing border */

  /* Text & Contrast */
  --text-main: #F4F6F2;            /* Primary titles and data values */
  --text-muted: #9EAAA8;           /* Secondary labels, timestamps */
  --text-faint: #7E8D7B;           /* Placeholders, disabled states */
  
  /* Borders */
  --border-subtle: #202A1F;        /* Subtle card border */
  --border-medium: #2C392B;        /* Input border */
  --border-strong: #3D4D3B;        /* Emphasized divider */

  /* Brand Signature Accents */
  --brand-lime: #C6F23B;           /* Signature Electric Lime (radiant on dark) */
  --brand-lime-hover: #D2F55E;     /* Button hover state */
  --brand-lime-text: #121811;      /* High contrast dark text on lime */
  --brand-forest: #1F2D1C;         /* Elevated dark olive */
  --brand-forest-hover: #2B3D27;   /* Olive hover */

  /* Interactive Text & Links in Dark Mode (High Contrast Radiant Lime) */
  --text-link: #C6F23B;            /* Radiant Electric Lime text links (AAA contrast against dark surfaces) */
  --text-link-hover: #E2FF80;
  --text-accent: #C6F23B;
}
```

### Operational Status Tokens (For Bookings, Schedules & Treasury)
| Status | Light Mode (Bg / Text / Border) | Dark Mode (Bg / Text / Border) | Meaning in Backoffice |
|---|---|---|---|
| **Available** | `#ECFDF5` / `#059669` / `#A7F3D0` | `rgba(5, 150, 105, 0.16)` / `#34D399` / `rgba(52, 211, 153, 0.3)` | Court slot open for booking |
| **Pre-reserved (Hold)** | `#FFFBEB` / `#D97706` / `#FDE68A` | `rgba(217, 119, 6, 0.16)` / `#FBBF24` / `rgba(251, 191, 36, 0.3)` | 15-min online payment hold in progress |
| **Confirmed / Paid** | `#EFF6FF` / `#2563EB` / `#BFDBFE` | `rgba(37, 99, 235, 0.16)` / `#60A5FA` / `rgba(96, 165, 250, 0.3)` | Booking confirmed and fully paid |
| **Completed / Checked-in** | `#F5F3FF` / `#7C3AED` / `#DDD6FE` | `rgba(124, 58, 237, 0.16)` / `#A78BFA` / `rgba(167, 139, 250, 0.3)` | Player scanned QR code at the gate |
| **Cancelled / Failed** | `#FEF2F2` / `#DC2626` / `#FECACA` | `rgba(220, 38, 38, 0.16)` / `#F87171` / `rgba(248, 113, 113, 0.3)` | Unpaid hold expired or booking cancelled |
| **Blocked / Maintenance** | `#F1F5F9` / `#475569` / `#CBD5E1` | `rgba(100, 116, 139, 0.16)` / `#94A3B8` / `rgba(148, 163, 184, 0.3)` | Court closed for rain, lighting, or repairs |

---

### Dual-Theme Architecture Rules
1. **Never Hardcode Theme-Dependent Colors**: Always use `var(--bg-app)`, `var(--bg-surface)`, `var(--text-main)`, `var(--border-subtle)` in stylesheets and components.
2. **Synchronized Theme Toggle**: Every screen must provide the `.theme-toggle-btn` (`☀️ / 🌙`) in the top navigation. Theme is stored in `localStorage.getItem('yoreservo_theme')`.
3. **Contrast Verification**: Light mode emphasizes clean, crisp readability for daytime sunlight conditions. Dark mode reduces glare during nighttime shifts and highlights active bookings with glowing electric lime accents.

---

## 3. Typography Hierarchy

Imported via Google Fonts:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
```

- **`font-display`: 'Outfit', sans-serif**
  - Used for: Brand logo, page titles (`h1`, `h2`), large KPI metrics, and modal titles.
  - Weights: `600` (SemiBold), `700` (Bold), `800` (ExtraBold).
- **`font-sans`: 'Inter', sans-serif**
  - Used for: Navigation labels, data table rows, input fields, badges, time slots, and body copy.
  - Weights: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold).

---

## 4. Mobile-First & Responsive Principles

The Backoffice must be **fully responsive and mobile-first**:

### Breakpoint Strategy
- **Mobile (`< 768px`)**:
  - **Target User**: Receptionist, court validator on-site, or club owner on a phone.
  - **Navigation**: Hidden sidebar replaced by a fixed bottom tab bar (Home, Agenda, Check-in, More) or top hamburger menu.
  - **Multi-Court Timeline**: Horizontal snap-scrollable view where each court column is minimum `150px` wide.
  - **Quick Booking & Check-in**: Bottom flyout sheet with large touch targets (`min-height: 48px`).
- **Tablet (`768px – 1023px`)**:
  - Collapsed icon-only sidebar (`w-18` / `72px`) maximizing canvas space for the daily agenda grid.
- **Desktop (`>= 1024px`)**:
  - Full expanded executive sidebar (`w-64` / `256px`).
  - Dense multi-court grid displaying 4–8 courts simultaneously without horizontal scroll.
  - Multi-panel side drawer for live Pago Móvil voucher audit and detail inspection.

---

## 5. UI Component Rules

1. **No Raw Inputs with Search Icons Everywhere**:
   - Only actual search bars have magnifying glass icons. Name, email, price, and court number inputs use clean, modern, minimalist text inputs with floating or top-aligned labels.
2. **Buttons**:
   - **Primary CTA**: Lime background (`#C6F23B`) with dark text (`#121811`), `font-weight: 600`, `rounded-xl`. (e.g. "+ Nueva Reserva", "Validar Pago").
   - **Secondary / Action**: Deep forest background (`#1F290F`) with white text, or clean neutral white button with subtle border (`border: 1px solid var(--border-medium)`).
   - **Destructive**: Soft red background (`#FEF2F2`) with red text (`#DC2626`) and border (`#FECACA`).
3. **Data Density**:
   - Table rows use `padding: 12px 16px` for comfortable scanning.
   - Status badges use compact pills: `padding: 4px 10px`, `font-size: 12px`, `font-weight: 600`, `rounded-full`.
4. **Standalone Portability**:
   - All HTML files must link directly to Google Fonts and self-contained CSS styles so they can be opened and reviewed directly in **Google Chrome** with zero setup.
5. **High-Contrast Text Links & Accents (No Low Contrast Text in Dark Mode)**:
   - **Strict Rule**: NEVER use structural background tokens (like `--brand-forest` or `--bg-sidebar`) as text colors.
   - Always use `.text-link` or `var(--text-link)`.
   - In Light Mode, `--text-link` resolves to deep high-contrast Forest Green (`#183C15`).
   - In Dark Mode, `--text-link` resolves to radiant Electric Lime (`#C6F23B`), ensuring flawless visibility against dark cards (`#131A12`) and full WCAG AAA compliance.

---

## 6. Internationalization (i18n) Standards

Consistent with `poc-yoreservo-client-web-app` and the database `preferred_language` field:

1. **Default & Supported Languages**:
   - **Default Language**: **Spanish (`es`)**. All mockups and initial interface states render in Spanish by default.
   - **Supported Secondary Language**: **English (`en`)**. Full dictionary parity is required.
2. **Global Language Switcher**:
   - Every single Backoffice screen must feature a visible `LanguageSwitcher` pill in the top navigation bar (`ES | EN`).
3. **Interactive Prototype Localization**:
   - HTML prototypes must support live in-browser language switching using a lightweight dictionary or `data-i18n` attribute pattern, allowing reviewers in Google Chrome to toggle seamlessly between Spanish and English copy.
4. **Backend Multi-Language Consistency**:
   - Forms dealing with catalog items (Activity names, Category names, Location labels) must support multi-language JSON input (`{ "es": "...", "en": "..." }`) reflecting the backend Prisma schema.

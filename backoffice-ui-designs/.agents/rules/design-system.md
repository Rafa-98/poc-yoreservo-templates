---
trigger: always_on
---

# YoReservo Backoffice — Mandatory UI & Design Rules

- **Read and follow `STYLE_GUIDE.md` and `BACKOFFICE_SPECIFICATIONS.md`** for every single screen design.
- **Palette**: Use only the approved semantic tokens from `STYLE_GUIDE.md`:
  - Executive Forest frame (`#121811` / `#1D261C`) for sidebar and structure.
  - Signature Electric Lime (`#C6F23B`) for primary CTAs and active states.
  - Crisp canvas (`#F8FAF7`) with pure white elevated surfaces (`#FFFFFF`).
  - Standardized operational status badges (`Available`, `Pre-reserved`, `Confirmed`, `Completed`, `Cancelled`, `Blocked`).
- **Typography**: `Outfit` for display headings & brand logo; `Inter` for UI data, inputs, badges, and tables.
- **Mobile-First & Responsive**:
  - Always design layout structure mobile-first (`< 768px`) for on-site staff and validators using smartphones.
  - Scale gracefully to tablet (`768px–1023px`) with icon sidebar and desktop (`>= 1024px`) with full dense multi-court agenda and side audit drawers.
- **Internationalization (i18n)**:
  - **Spanish (`es`) by default**, with full **English (`en`)** parity.
  - Every screen must feature the `LanguageSwitcher` (`ES | EN`) in the top navigation bar.
  - Prototype copy should be easily toggled or previewed in both languages.
- **Dual Theme Support (Light Mode & Dark Mode) — Mandatory Rule**:
  - Every single screen, module, card, table, modal, drawer, and input MUST support both **Light Mode** (Daylight Executive Canvas) and **Dark Mode** (Nocturnal Cockpit).
  - All styling must be driven by semantic CSS tokens (`:root` for light mode, `[data-theme="dark"]` for dark mode).
  - Every screen must feature an accessible Theme Toggle button (`☀️ / 🌙`) with state persistence in `localStorage` (`yoreservo_theme`).
  - High contrast and readability must be preserved in both themes: pure white card elevation (`#FFFFFF`) with crisp borders on off-white (`#F8FAF7`) in light mode; layered slate elevation (`#131A12` on `#0B100B`) with glowing lime accents (`#C6F23B`) in dark mode.
  - Never hardcode fixed hex colors in UI components where background or text tokens should adapt.
  - **Text Link Contrast Rule**: NEVER use dark background tokens (such as `--brand-forest` or `--bg-sidebar`) for text or links. All interactive links, secondary CTAs, and inline tags MUST use `.text-link` and `--text-link` (`#183C15` in Light Mode, radiant `#C6F23B` in Dark Mode) ensuring 100% legibility on dark surfaces.
- **Automated Visual Testing Verification — Mandatory Rule**:
  - After creating or modifying any screen or module, you MUST use the `browser_subagent` to open Google Chrome, navigate to the design, test theme toggling (Light Mode ↔ Dark Mode), test language toggling (ES ↔ EN), test interactive controls (forms, pills, modals), and capture visual screenshots/recordings for the user.
- **Prototypes Output**:
  - All designs must be standalone HTML5/CSS3/Vanilla JS files that can be opened and reviewed directly in **Google Chrome**.
  - All conversational interaction, code comments, and documentation must be in **English**.

# Connect AI — Visual Design System
### A complete UI specification. Apply to any product to match this exact look and feel.

This document defines the visual language of **Connect AI**: tokens, typography, component anatomy, spacing, motion, and rules. It is feature-agnostic — use it to restyle any existing screen, page, or component to match this design system exactly.

---

## GOAL

Your product's UI should feel like this:
- Enterprise SaaS, not a consumer app
- Calm, professional, information-dense without feeling cluttered
- Purple/violet as the primary action color; teal only for AI/automation touches
- IBM Plex Sans — not Inter, not Roboto
- White cards on a very slightly blue-gray off-white canvas
- Subtle borders and tiny shadows — elevation is low and intentional
- Every interaction has a smooth transition; nothing jumps

If any element in your UI looks "generic Bootstrap", "shadcn default", "heavy Material", or "loud gradient" — this spec overrides it.

---

## 1. FONTS

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```css
body {
  font-family: "IBM Plex Sans", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
/* Arabic / RTL pages */
[dir="rtl"] body {
  font-family: "IBM Plex Sans Arabic", "IBM Plex Sans", system-ui, sans-serif;
}
/* Numbers, IDs, code, metrics */
.mono {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-feature-settings: "tnum";
}
```

**Type scale:**

| Token | Value | Use |
|---|---|---|
| `--fs-sm` | 12.5px | Labels, hints, captions, badge text |
| `--fs-base` | 14px | Body, table rows, form fields, nav |
| `--fs-lg` | 16px | Card headings, section titles, subtitles |
| `--fs-display` | 30px | Page titles (`<h1>`) |
| `--fs-stat` | 30px | Large dashboard numbers |

**Heading rules:** `font-weight: 600`, `letter-spacing: -0.025em`, `line-height: 1.2`. Body: `line-height: 1.5`.

---

## 2. COLOR TOKENS

Paste these into `:root`. Every color in the UI must come from one of these tokens — never hardcode hex values.

```css
:root {
  /* ── Primary accent: purple/violet ── */
  --accent-h:       245;
  --accent:         oklch(0.55 0.20 var(--accent-h));   /* main purple  */
  --accent-strong:  oklch(0.47 0.21 var(--accent-h));   /* hover/active */
  --accent-soft:    oklch(0.95 0.04 var(--accent-h));   /* tinted bg, active nav */
  --accent-soft-2:  oklch(0.90 0.07 var(--accent-h));   /* deeper tint  */
  --accent-contrast: #ffffff;

  /* ── AI/automation accent: teal — ONLY for AI-powered features ── */
  --ai:             oklch(0.62 0.12 195);
  --ai-soft:        oklch(0.95 0.04 195);

  /* ── Border radii ── */
  --r-xs:  6px;
  --r-sm:  8px;
  --r-md: 12px;
  --r-lg: 16px;
  --r-xl: 22px;

  /* ── Shadows (always very subtle) ── */
  --shadow-xs:  0 1px 2px rgba(13,22,38,.05);
  --shadow-sm:  0 1px 3px rgba(13,22,38,.07), 0 1px 2px rgba(13,22,38,.04);
  --shadow-md:  0 4px 16px rgba(13,22,38,.08), 0 2px 5px rgba(13,22,38,.05);
  --shadow-lg:  0 18px 50px rgba(13,22,38,.16), 0 6px 16px rgba(13,22,38,.08);
  --shadow-pop: 0 12px 40px rgba(13,22,38,.18);
  --ring: 0 0 0 3px color-mix(in oklch, var(--accent) 22%, transparent);

  /* ── Layout ── */
  --sidebar-w:  252px;
  --topbar-h:    62px;
  --pad-card:    22px;   /* card inner padding */
  --gap:         20px;   /* grid/flex gap */
  --row-h:       44px;   /* input / button height */

  /* ── Motion ── */
  --t-fast:   130ms cubic-bezier(.4,0,.2,1);
  --t:        220ms cubic-bezier(.4,0,.2,1);
  --t-spring: 380ms cubic-bezier(.2,.9,.25,1.05);
}
```

### Light theme `[data-theme="light"]`

```css
[data-theme="light"] {
  --canvas:        #f4f6f9;   /* page background */
  --canvas-2:      #eef1f6;
  --surface:       #ffffff;   /* card, panel, input */
  --surface-2:     #f8f9fb;   /* alternating rows, inset sections */
  --surface-3:     #f1f3f7;   /* badge bg, segmented track, toolbar */
  --border:        #e5e8ee;   /* default dividers */
  --border-strong: #d3d8e0;   /* input borders, stronger lines */
  --text:          #0f1726;
  --text-2:        #586172;   /* secondary, labels */
  --text-3:        #8b94a4;   /* placeholder, captions */
  --text-inv:      #ffffff;
  --overlay:       rgba(15,23,38,.42);

  --success:       oklch(0.60 0.14 152);
  --success-soft:  oklch(0.95 0.05 152);
  --warning:       oklch(0.72 0.15  70);
  --warning-soft:  oklch(0.95 0.06  75);
  --danger:        oklch(0.60 0.20  25);
  --danger-soft:   oklch(0.95 0.05  25);
  --info:          oklch(0.62 0.13 240);
  --info-soft:     oklch(0.95 0.04 240);
  --purple:        oklch(0.58 0.18 305);
  --purple-soft:   oklch(0.95 0.05 305);
}
```

### Dark theme `[data-theme="dark"]`

```css
[data-theme="dark"] {
  --canvas:        #0a0d13;
  --canvas-2:      #070a0f;
  --surface:       #11151d;
  --surface-2:     #161b25;
  --surface-3:     #1c222e;
  --border:        #242b38;
  --border-strong: #313a4a;
  --text:          #e9edf4;
  --text-2:        #98a2b3;
  --text-3:        #6b7588;
  --text-inv:      #0a0d13;
  --overlay:       rgba(0,0,0,.60);

  /* Accent lightens in dark mode */
  --accent:        oklch(0.68 0.17 245);
  --accent-strong: oklch(0.74 0.16 245);
  --accent-soft:   oklch(0.30 0.08 245);
  --accent-soft-2: oklch(0.38 0.11 245);
  --ai:            oklch(0.72 0.12 195);
  --ai-soft:       oklch(0.32 0.06 195);

  --success:       oklch(0.72 0.14 152);  --success-soft: oklch(0.33 0.07 152);
  --warning:       oklch(0.78 0.14  75);  --warning-soft: oklch(0.36 0.07  70);
  --danger:        oklch(0.68 0.18  25);  --danger-soft:  oklch(0.35 0.09  25);
  --info:          oklch(0.70 0.12 240);  --info-soft:    oklch(0.33 0.07 240);

  --shadow-xs:  0 1px 2px rgba(0,0,0,.30);
  --shadow-sm:  0 1px 3px rgba(0,0,0,.40);
  --shadow-md:  0 6px 20px rgba(0,0,0,.45);
  --shadow-lg:  0 22px 60px rgba(0,0,0,.60);
}
```

### Compact density `[data-density="compact"]`

```css
[data-density="compact"] {
  --row-h:    36px;
  --pad-card: 16px;
  --gap:      14px;
  --fs-base:  13px;
  --fs-sm:    11.5px;
  --fs-lg:    15px;
  --topbar-h: 54px;
}
```

---

## 3. CSS RESET & BASE

```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }
body { background: var(--canvas); color: var(--text); font-size: var(--fs-base); line-height: 1.5; }
h1,h2,h3,h4 { line-height: 1.2; font-weight: 600; letter-spacing: -.01em; }
a { color: inherit; text-decoration: none; }
button { font-family: inherit; cursor: pointer; border: none; background: none; color: inherit; }
input, textarea, select { font-family: inherit; font-size: inherit; color: inherit; }
::selection { background: color-mix(in oklch, var(--accent) 28%, transparent); }

/* Scrollbar */
*::-webkit-scrollbar { width: 10px; height: 10px; }
*::-webkit-scrollbar-thumb {
  background: color-mix(in oklch, var(--text-3) 40%, transparent);
  border-radius: 20px; border: 3px solid transparent; background-clip: padding-box;
}
*::-webkit-scrollbar-thumb:hover {
  background: color-mix(in oklch, var(--text-3) 65%, transparent);
  background-clip: padding-box;
}
```

---

## 4. APP SHELL

### Structure

```
┌──────────────────────────────────────────────────────────┐
│  Sidebar (252px fixed)  │  Main column (flex: 1)         │
│                         ├──────────────────────────────  │
│  Logo (62px tall)       │  Top bar (62px, sticky)        │
│  ─────────────────      ├──────────────────────────────  │
│  Nav sections           │  Content (.content)            │
│    SECTION LABEL        │  .page { padding: 26px 30px;   │
│    › Nav item           │    max-width: 1480px; }        │
│    › Nav item (active)  │                                │
│  ─────────────────      │                                │
│  [Collapse]             │                                │
│  User avatar + name     │                                │
└─────────────────────────┴────────────────────────────────┘
```

### Sidebar CSS

```css
.sidebar {
  width: var(--sidebar-w);        /* 252px */
  flex: 0 0 var(--sidebar-w);
  background: var(--surface);
  border-inline-end: 1px solid var(--border);
  display: flex; flex-direction: column;
  transition: width var(--t), flex-basis var(--t);
  z-index: 30;
}
.sidebar.collapsed { width: 72px; flex-basis: 72px; }

/* Section label */
.nav-section-label {
  font-size: 10.5px; font-weight: 600;
  letter-spacing: .07em; text-transform: uppercase;
  color: var(--text-3);
  padding: 16px 12px 7px;
}

/* Nav item */
.nav-item {
  display: flex; align-items: center; gap: 12px;
  height: 40px; padding-inline: 12px; border-radius: var(--r-sm);
  color: var(--text-2); font-size: var(--fs-base); font-weight: 500;
  white-space: nowrap; position: relative;
  transition: background var(--t-fast), color var(--t-fast);
}
.nav-item:hover { background: var(--surface-3); color: var(--text); }

/* Active state */
.nav-item.active {
  background: var(--accent-soft);
  color: var(--accent-strong);
  font-weight: 600;
}
.nav-item.active::before {
  content: "";
  position: absolute;
  inset-inline-start: -12px;      /* flush with sidebar edge */
  top: 9px; bottom: 9px;
  width: 3px; border-radius: 3px;
  background: var(--accent);
}

/* Count badge */
.nav-item .nav-badge {
  margin-inline-start: auto;
  font-size: 11px; font-weight: 600;
  background: var(--surface-3); color: var(--text-2);
  padding: 1px 7px; border-radius: 20px;
}
.nav-item.active .nav-badge {
  background: color-mix(in oklch, var(--accent) 18%, transparent);
  color: var(--accent-strong);
}
```

### Top bar CSS

```css
.topbar {
  height: var(--topbar-h);
  display: flex; align-items: center; gap: 14px;
  padding-inline: 22px;
  background: color-mix(in oklch, var(--surface) 88%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0; z-index: 20;
}

/* Search field inside topbar */
.searchbar {
  flex: 1 1 auto; max-width: 460px; height: 40px;
  display: flex; align-items: center; gap: 10px;
  padding-inline: 14px; background: var(--surface-3);
  border: 1px solid transparent; border-radius: var(--r-md);
  color: var(--text-3); transition: var(--t-fast);
}
.searchbar:focus-within {
  background: var(--surface);
  border-color: var(--accent);
  box-shadow: var(--ring);
}
.searchbar input { flex: 1; background: none; border: none; outline: none; color: var(--text); }

/* AI badge inside search */
.ai-pill {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 600;
  color: var(--ai); background: var(--ai-soft);
  padding: 3px 8px; border-radius: 20px;
}

/* Icon buttons in topbar */
.icon-btn {
  width: 38px; height: 38px; border-radius: var(--r-sm);
  display: grid; place-items: center;
  color: var(--text-2);
  transition: background var(--t-fast), color var(--t-fast);
}
.icon-btn:hover { background: var(--surface-3); color: var(--text); }
```

### Brand / Logo

```css
.brand-mark {
  width: 34px; height: 34px; border-radius: 9px;
  background: linear-gradient(140deg, var(--accent), color-mix(in oklch, var(--accent) 55%, var(--ai)));
  display: grid; place-items: center; color: #fff;
  box-shadow: var(--shadow-sm);
}
/* Inside: a small sparkle/star SVG icon in white */
.brand-name { font-weight: 600; font-size: 16px; letter-spacing: -.02em; }
.brand-name b { color: var(--accent); font-weight: 700; }
/* "Connect" normal weight, "AI" bold purple */
```

---

## 5. BUTTONS

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 40px; padding: 0 16px; border-radius: var(--r-sm);
  font-weight: 600; font-size: var(--fs-base);
  white-space: nowrap; border: 1px solid transparent;
  transition: var(--t-fast);
}
.btn:active { transform: translateY(1px); }
.btn[disabled] { opacity: .5; pointer-events: none; }

/* Filled — primary action */
.btn-primary { background: var(--accent); color: #fff; box-shadow: var(--shadow-sm); }
.btn-primary:hover { background: var(--accent-strong); }

/* Outlined — secondary action */
.btn-ghost { background: var(--surface); color: var(--text); border-color: var(--border-strong); }
.btn-ghost:hover { background: var(--surface-3); border-color: var(--text-3); }

/* Subtle — tertiary, inline */
.btn-subtle { background: var(--surface-3); color: var(--text); }
.btn-subtle:hover { background: var(--border); }

/* Danger */
.btn-danger { background: var(--danger); color: #fff; }
.btn-danger:hover { background: oklch(0.55 0.20 25); }

/* AI / teal variant */
.btn-ai {
  background: color-mix(in oklch, var(--ai) 14%, var(--surface));
  color: var(--ai);
  border-color: color-mix(in oklch, var(--ai) 35%, transparent);
}
.btn-ai:hover { background: color-mix(in oklch, var(--ai) 22%, var(--surface)); }

/* Size variants */
.btn-sm { height: 32px; padding: 0 12px; font-size: 13px; }
.btn-icon { width: 40px; padding: 0; }
.btn-icon.btn-sm { width: 32px; }
```

---

## 6. CARDS

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  box-shadow: var(--shadow-xs);
}
.card-pad { padding: var(--pad-card); }

/* Card with section header */
.card-head {
  display: flex; align-items: center; gap: 12px;
  padding: 16px var(--pad-card);
  border-bottom: 1px solid var(--border);
}

/* Interactive card hover */
.card-interactive {
  transition: border-color var(--t-fast), box-shadow var(--t-fast), transform var(--t-fast);
  cursor: pointer;
}
.card-interactive:hover {
  border-color: var(--border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
```

**Critical rule:** Cards are differentiated from the canvas by a 1px border and `shadow-xs` only. Do NOT add heavy box shadows to resting cards.

---

## 7. BADGES & STATUS PILLS

Always: pastel background + deeper text of the same hue. Never full-saturation backgrounds.

```css
.badge {
  display: inline-flex; align-items: center; gap: 5px;
  height: 22px; padding: 0 9px; border-radius: 20px;
  font-size: 11.5px; font-weight: 600; white-space: nowrap;
  background: var(--surface-3); color: var(--text-2);
}
.badge-success { background: var(--success-soft); color: var(--success); }
.badge-warning { background: var(--warning-soft); color: var(--warning); }
.badge-danger  { background: var(--danger-soft);  color: var(--danger); }
.badge-info    { background: var(--info-soft);    color: var(--info); }
.badge-accent  { background: var(--accent-soft);  color: var(--accent-strong); }
.badge-ai      { background: var(--ai-soft);      color: var(--ai); }
.badge-neutral { background: var(--surface-3);    color: var(--text-2); }

/* Status dot */
.sdot { width: 8px; height: 8px; border-radius: 50%; flex: 0 0 auto; }
/* Usage: <span class="sdot" style="background: var(--success)"></span> Active */
```

---

## 8. FORM INPUTS

```css
.input, .textarea, .select {
  width: 100%;
  height: var(--row-h);
  padding: 0 13px;
  border-radius: var(--r-sm);
  background: var(--surface);
  border: 1px solid var(--border-strong);
  color: var(--text);
  font-size: var(--fs-base);
  transition: border-color var(--t-fast), box-shadow var(--t-fast);
  outline: none;
}
.textarea { height: auto; min-height: 90px; padding: 11px 13px; line-height: 1.55; resize: vertical; }
.input:focus, .textarea:focus, .select:focus {
  border-color: var(--accent);
  box-shadow: var(--ring);
}
.input::placeholder, .textarea::placeholder { color: var(--text-3); }

/* Select chevron */
.select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238b94a4' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 13px center;
  padding-inline-end: 34px;
}
[dir="rtl"] .select { background-position: left 13px center; }

/* Field wrapper */
.field { display: flex; flex-direction: column; gap: 7px; }
.field label { font-size: 12.5px; font-weight: 600; color: var(--text-2); }
.field .hint  { font-size: 11.5px; color: var(--text-3); }
```

---

## 9. SEGMENTED CONTROL

```css
.seg {
  display: inline-flex;
  background: var(--surface-3);
  border-radius: var(--r-sm);
  padding: 3px; gap: 2px;
}
.seg button {
  padding: 5px 11px; border-radius: 6px;
  font-size: 12.5px; font-weight: 600;
  color: var(--text-2);
  transition: all var(--t-fast);
  white-space: nowrap;
}
.seg button.on {
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-xs);
}
```

---

## 10. TOGGLE SWITCH

```css
.switch {
  width: 38px; height: 22px; border-radius: 20px;
  background: var(--border-strong);
  position: relative; cursor: pointer;
  transition: background var(--t);
  flex: 0 0 auto;
}
.switch.on { background: var(--accent); }
.switch::after {
  content: "";
  position: absolute;
  top: 2px; inset-inline-start: 2px;
  width: 18px; height: 18px;
  border-radius: 50%; background: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,.35);
  transition: transform var(--t);
}
.switch.on::after { transform: translateX(16px); }
[dir="rtl"] .switch.on::after { transform: translateX(-16px); }
.switch:disabled { opacity: .45; cursor: not-allowed; }
```

---

## 11. TABLE

```css
.tbl { width: 100%; border-collapse: collapse; }
.tbl th {
  text-align: start;
  font-size: 11px; font-weight: 600;
  letter-spacing: .04em; text-transform: uppercase;
  color: var(--text-3);
  padding: 11px 14px;
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}
.tbl td {
  padding: 13px 14px;
  border-bottom: 1px solid var(--border);
  font-size: var(--fs-base);
  vertical-align: middle;
}
.tbl tbody tr { transition: background var(--t-fast); cursor: pointer; }
.tbl tbody tr:hover { background: var(--surface-2); }
.tbl tbody tr:last-child td { border-bottom: none; }
```

---

## 12. AVATARS

```css
.avatar {
  border-radius: 50%;
  object-fit: cover; flex: 0 0 auto;
  display: grid; place-items: center;
  font-weight: 600; color: #fff;
  overflow: hidden;
}
/* Sizes: 28px (list), 34px (sidebar), 38px (card), 48px (profile) */
/* Color: generate from name using oklch(0.60 0.14 <hue derived from name>) */
/* Example colors: purple oklch(0.6 0.14 255), teal oklch(0.6 0.14 195),
   orange oklch(0.6 0.14 60), green oklch(0.6 0.14 145) */
```

---

## 13. PROGRESS BAR

```css
.pbar { height: 7px; border-radius: 20px; background: var(--surface-3); overflow: hidden; }
.pbar > span {
  display: block; height: 100%; border-radius: 20px;
  background: var(--accent);
  transition: width var(--t-spring);  /* animate on mount */
}
```

---

## 14. CHIPS

```css
.chip {
  display: inline-flex; align-items: center; gap: 6px;
  height: 28px; padding: 0 11px; border-radius: 20px;
  background: var(--surface-3); color: var(--text-2);
  font-size: 12.5px; font-weight: 500;
  border: 1px solid transparent;
  transition: var(--t-fast); white-space: nowrap;
}
.chip-accent { background: var(--accent-soft); color: var(--accent-strong); }

/* Removable chip */
.chip.removable { padding-inline-end: 6px; }
.chip .x {
  width: 16px; height: 16px; border-radius: 50%;
  display: grid; place-items: center; opacity: .6;
}
.chip .x:hover { opacity: 1; background: var(--border); }
```

---

## 15. MODAL

```css
/* Backdrop */
.scrim {
  position: fixed; inset: 0;
  background: var(--overlay);
  backdrop-filter: blur(2px);
  z-index: 100; display: grid; place-items: center; padding: 30px;
  animation: fadeIn .2s ease;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* Modal panel */
.modal {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-xl); box-shadow: var(--shadow-lg);
  width: 100%; max-width: 560px; max-height: 88vh;
  overflow: hidden; display: flex; flex-direction: column;
  animation: modalIn .32s cubic-bezier(.2,.9,.25,1.02);
}
@keyframes modalIn {
  from { opacity: 0; transform: translateY(16px) scale(.97); }
  to   { opacity: 1; transform: none; }
}
.modal-head { padding: 20px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; }
.modal-body { padding: 22px; overflow-y: auto; flex: 1; }
.modal-foot { padding: 16px 22px; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 10px; }
```

---

## 16. SIDE DRAWER / PANEL

```css
.drawer-scrim {
  position: fixed; inset: 0; background: var(--overlay);
  z-index: 120; opacity: 0; pointer-events: none;
  transition: opacity var(--t);
}
.drawer-scrim.open { opacity: 1; pointer-events: auto; }

.drawer {
  position: fixed; top: 0; inset-inline-end: 0; height: 100%;
  width: 480px; max-width: 92vw;
  background: var(--surface);
  border-inline-start: 1px solid var(--border);
  box-shadow: var(--shadow-lg);
  z-index: 121;
  display: flex; flex-direction: column;
  transform: translateX(100%);
  transition: transform .3s cubic-bezier(.2,.9,.25,1);
}
.drawer.open { transform: none; }
[dir="rtl"] .drawer { transform: translateX(-100%); }
[dir="rtl"] .drawer.open { transform: none; }

.drawer-head { display: flex; align-items: center; gap: 12px; padding: 20px 22px; border-bottom: 1px solid var(--border); flex: 0 0 auto; }
.drawer-body { flex: 1 1 auto; overflow-y: auto; padding: 22px; }
.drawer-foot { display: flex; gap: 10px; padding: 16px 22px; border-top: 1px solid var(--border); flex: 0 0 auto; }
```

---

## 17. TOAST

```css
.toast-wrap { position: fixed; bottom: 24px; inset-inline-end: 24px; display: flex; flex-direction: column; gap: 10px; z-index: 200; }
.toast {
  display: flex; align-items: center; gap: 11px;
  background: var(--text); color: var(--surface);
  padding: 12px 16px; border-radius: var(--r-md);
  box-shadow: var(--shadow-lg);
  font-size: 13.5px; font-weight: 500;
  animation: toastIn .35s cubic-bezier(.2,.9,.25,1.05);
  max-width: 360px;
}
@keyframes toastIn {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: none; }
}
```

---

## 18. ACCORDION

```css
.acc { border: 1px solid var(--border); border-radius: var(--r-md); overflow: hidden; }
.acc + .acc { margin-top: 10px; }

.acc-head {
  display: flex; align-items: center; gap: 12px;
  width: 100%; padding: 14px 16px;
  background: var(--surface); text-align: start;
  transition: background var(--t-fast);
}
.acc-head:hover { background: var(--surface-2); }

/* Chevron indicator */
.acc-head .chev { transition: transform var(--t); color: var(--text-3); }
.acc-head.open .chev { transform: rotate(90deg); }
[dir="rtl"] .acc-head.open .chev { transform: rotate(-90deg); }

/* Smooth height expansion via CSS grid trick */
.acc-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .3s cubic-bezier(.4,0,.2,1); background: var(--surface-2); }
.acc-body.open { grid-template-rows: 1fr; }
.acc-body > .acc-inner { overflow: hidden; }
.acc-body > .acc-inner > div { padding: 4px 16px 8px; }
```

---

## 19. TABS (underline style)

```css
.tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--border); }
.tabs button {
  padding: 12px 14px; font-size: 13px; font-weight: 600;
  color: var(--text-2);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color var(--t-fast), border-color var(--t-fast);
  white-space: nowrap;
}
.tabs button.on { color: var(--accent-strong); border-bottom-color: var(--accent); }
.tabs button:hover:not(.on) { color: var(--text); }
```

---

## 20. KEBAB / CONTEXT MENU

```css
.kebab-wrap { position: relative; display: inline-block; }
.kebab-menu {
  position: absolute; inset-inline-end: 0; top: calc(100% + 4px);
  min-width: 168px; background: var(--surface);
  border: 1px solid var(--border); border-radius: var(--r-md);
  box-shadow: var(--shadow-pop); padding: 6px; z-index: 50;
  animation: modalIn .16s ease;
}
.kebab-menu button {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 8px 10px; border-radius: var(--r-sm);
  font-size: 13px; font-weight: 500; color: var(--text); text-align: start;
  transition: background var(--t-fast);
}
.kebab-menu button:hover { background: var(--surface-3); }
.kebab-menu button.danger { color: var(--danger); }
```

---

## 21. PAGE LAYOUT PATTERN

Every page follows this structure:

```
.page { padding: 26px 30px 60px; max-width: 1480px; margin: 0 auto; }

/* Page entrance animation */
@media (prefers-reduced-motion: no-preference) {
  .page { animation: pageIn .34s cubic-bezier(.2,.8,.2,1); }
}
@keyframes pageIn { from { transform: translateY(8px); } to { transform: none; } }
```

**Page header anatomy:**
```html
<div class="page-head">
  <div>
    <h1 class="page-title">Page Title</h1>
    <p class="page-sub">Short, helpful subtitle explaining what this page is for.</p>
  </div>
  <div class="spacer"></div>   <!-- flex: 1 — pushes actions right -->
  <div class="page-actions">
    <button class="btn btn-ghost">Secondary</button>
    <button class="btn btn-primary">+ Primary</button>
  </div>
</div>
```

**Breadcrumbs:**
```css
.crumbs { display: flex; align-items: center; gap: 7px; font-size: 12.5px; color: var(--text-3); margin-bottom: 12px; }
.crumbs a:hover { color: var(--accent); }
/* Separator: › or / in muted color */
```

**Stat row (dashboard cards):**
```css
/* 3–4 stat cards in a CSS grid, equal columns */
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--gap); }
/* Inside each: icon square + label above, large monospace number + optional unit below */
```

---

## 22. WARN BAR

```css
.warn-bar {
  display: flex; align-items: flex-start; gap: 11px;
  padding: 13px 15px; border-radius: var(--r-md);
  background: var(--warning-soft);
  border: 1px solid color-mix(in oklch, var(--warning) 35%, transparent);
}
.warn-bar .wb-ico { color: var(--warning); flex: 0 0 auto; margin-top: 1px; }
.warn-bar .wb-text { font-size: 12.5px; line-height: 1.55; color: var(--text); }
```

---

## 23. ICONS

Use **Lucide** (React, SVG, or web component — your choice). Stroke width ~1.5px. Default size 16px.

**Never use emoji as UI icons.** Never use filled/solid icon sets — always outlined Lucide.

Icon inside a colored square (used for stat cards, empty states):
```css
.icon-box {
  width: 34px; height: 34px; border-radius: 9px;
  display: grid; place-items: center;
  /* Color example: */
  background: color-mix(in oklch, var(--accent) 13%, var(--surface));
  color: var(--accent);
}
```

---

## 24. AI VISUAL LANGUAGE

AI-related UI uses **teal only** — never the purple accent. This creates an instant visual signal: "this is the AI doing something."

```css
/* AI badge (in toolbar, on buttons, next to generated content) */
.badge-ai { background: var(--ai-soft); color: var(--ai); }

/* AI card/panel accent border */
.ai-card { border-inline-start: 3px solid var(--ai); }

/* AI section background tint */
.ai-tint { background: color-mix(in oklch, var(--ai) 8%, var(--surface)); }

/* Button variant */
.btn-ai { background: color-mix(in oklch, var(--ai) 14%, var(--surface)); color: var(--ai); border-color: color-mix(in oklch, var(--ai) 35%, transparent); }

/* AI sparkle label prefix: ✦ (not emoji) */
/* Example: ✦ AI-generated draft — review before saving */

/* Typing/streaming animation */
@keyframes aiType { from { opacity: .3; } to { opacity: 1; } }
.ai-stream { animation: aiType .5s ease; }
.ai-cursor::after {
  content: ""; display: inline-block; width: 8px; height: 1.05em;
  background: var(--ai); border-radius: 1px;
  animation: blink 1s steps(2) infinite; vertical-align: text-bottom; margin-inline-start: 2px;
}
@keyframes blink { 50% { opacity: 0; } }
```

---

## 25. RTL SUPPORT

**The single most important rule:** use CSS logical properties everywhere. If you use `left`, `right`, `padding-left`, `margin-right`, `border-left` — change them to the logical equivalents. The entire layout will then flip to Arabic with no overrides needed.

| Replace this… | With this |
|---|---|
| `left: 0` | `inset-inline-start: 0` |
| `right: 0` | `inset-inline-end: 0` |
| `padding-left: 16px` | `padding-inline-start: 16px` |
| `padding-right: 16px` | `padding-inline-end: 16px` |
| `margin-left: auto` | `margin-inline-start: auto` |
| `border-left: 3px solid` | `border-inline-start: 3px solid` |
| `text-align: left` | `text-align: start` |
| `translateX(100%)` | conditional on `[dir]` |

**Font swap for Arabic:**
```css
[dir="rtl"] body {
  font-family: "IBM Plex Sans Arabic", "IBM Plex Sans", system-ui, sans-serif;
}
```

**Drawer direction:**
```css
[dir="rtl"] .drawer { inset-inline-start: 0; inset-inline-end: auto; transform: translateX(-100%); }
[dir="rtl"] .drawer.open { transform: none; }
```

---

## 26. MICRO-INTERACTIONS CHECKLIST

Apply every one of these — they're what makes the UI feel polished vs. flat:

| Element | Interaction | CSS |
|---|---|---|
| Page load | Slides up 8px, fades in | `translateY(8px) → none`, 340ms |
| Button press | Dips 1px | `:active { transform: translateY(1px) }` |
| Interactive card | Lifts 2px, shadow deepens | `:hover { transform: translateY(-2px); box-shadow: var(--shadow-md) }` |
| Modal open | Scales up from .97, fades | `scale(.97) translateY(16px) → none`, 320ms spring |
| Drawer open | Slides in 40px | `translateX(40px) → none`, 300ms |
| Toast | Slides up from bottom | `translateY(14px) → none`, 350ms |
| Input focus | Border turns purple, ring glow | `border-color: var(--accent); box-shadow: var(--ring)` |
| Nav item hover | Soft bg tint | `background: var(--surface-3)`, 130ms |
| Progress bar | Width animates on mount | `width: 0 → X%`, `var(--t-spring)` |
| Accordion | Height expands | CSS grid `0fr → 1fr` trick, 300ms |
| All transitions | Respect reduced motion | `@media (prefers-reduced-motion: no-preference)` gate |

---

## 27. SKELETON / LOADING STATE

```css
@keyframes shimmer { 100% { background-position: -200% 0; } }
.shimmer {
  background: linear-gradient(
    90deg, var(--surface-3) 25%, var(--surface-2) 37%, var(--surface-3) 63%
  );
  background-size: 200% 100%;
  animation: shimmer 1.3s infinite;
  border-radius: var(--r-sm);
}
```

---

## 28. WHAT NOT TO DO

These are the most common deviations that break the design language:

- ❌ **Do not use Inter, Roboto, or any other font** — IBM Plex Sans only
- ❌ **Do not add gradients to cards, panels, or page backgrounds** — only the brand mark has a gradient
- ❌ **Do not use glassmorphism on content** — topbar frosted glass is the only exception
- ❌ **Do not add large box-shadows to resting cards** — `shadow-xs` only; elevation on hover only
- ❌ **Do not use border-radius above 22px** except avatar circles
- ❌ **Do not use full-saturation badge backgrounds** — always `*-soft` pastel
- ❌ **Do not use `left:` / `right:` CSS** — always logical properties for RTL support
- ❌ **Do not use emoji as UI icons** — Lucide outlined icons only
- ❌ **Do not use the purple accent for AI features** — teal (`var(--ai)`) is reserved for AI
- ❌ **Do not use the teal accent for non-AI features** — teal is reserved for AI
- ❌ **Do not add footer sections**
- ❌ **Do not add decorative infinite animations** on content cards
- ❌ **Do not invent new color values** — every color must map to a CSS token

---

*Apply this spec to any screen, page, or component in your product. The goal is a single, consistent visual language across every surface — not a "redesign," but a precise reskin that makes everything feel like it belongs together.*

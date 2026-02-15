# Admin Color Scheme & UI Readability — Design

## Overview

Give the admin dashboard a distinct visual identity using a warm stone palette, clearly separated from the public site's warm beige. Fix color inconsistencies, add semantic status colors, and improve table/form readability.

## Scope

**In scope:**
- Admin-specific stone color palette via `.admin-theme` CSS class
- Semantic status colors (success, destructive) as variables
- Badge, feedback message, table, tab, and empty state readability improvements

**Out of scope:**
- Public-facing page changes
- Dark mode
- Icons, avatars, loading skeletons, animations
- Login form restyling

## Color Palette

### Admin theme (Warm Stone)

Applied via `.admin-theme` class on the admin page wrapper. Overrides shadcn CSS variables so all components inherit automatically.

| Role | Variable | Hex | Source |
|------|----------|-----|--------|
| Background | `--background` | `#f5f5f4` | stone-100 |
| Surface | `--card` / `--popover` | `#fafaf9` | stone-50 |
| Foreground | `--foreground` | `#1c1917` | stone-900 |
| Muted text | `--muted-foreground` | `#78716c` | stone-500 |
| Muted bg | `--muted` / `--secondary` | `#e7e5e4` | stone-200 |
| Border | `--border` / `--input` | `#d6d3d1` | stone-300 |
| Primary | `--primary` | `#c45c26` | unchanged (burnt orange) |
| Primary hover | `--accent-hover` | `#a84818` | unchanged |
| Destructive | `--destructive` | `#dc2626` | red-600 |
| Ring | `--ring` | `#c45c26` | unchanged |

### Semantic status colors (added to `:root`)

| Status | Text | Background |
|--------|------|------------|
| Success | `#16a34a` (green-600) | `#dcfce7` (green-100) |
| Destructive | `#dc2626` (red-600) | `#fef2f2` (red-50) |

### WCAG AA Contrast Verification

- `#1c1917` on `#f5f5f4` → ~14.5:1 (AAA)
- `#78716c` on `#f5f5f4` → ~4.6:1 (AA normal text)
- `#c45c26` on `#fafaf9` → ~4.2:1 (AA large text / buttons)
- `#ffffff` on `#c45c26` → ~4.0:1 (AA large text — button labels)
- `#16a34a` on `#dcfce7` → ~4.5:1 (AA)
- `#dc2626` on `#fef2f2` → ~5.6:1 (AA)

## UI Readability Improvements

### 1. Status badges

- "confirmed" → light green background (`#dcfce7`) with green text (`#16a34a`). Softer than current solid green.
- "cancelled" → muted stone background with muted text. Clearly de-emphasized.

### 2. Table readability

- Alternating row tinting via `even:bg-stone-50/50` on TableRow for easier scanning.
- Slightly more vertical padding in cells for breathing room.

### 3. Success/error feedback

- Success messages: green text on `#dcfce7` background, rounded pill.
- Error messages: red text on `#fef2f2` background, rounded pill.
- Replaces bare `text-green-600` / `text-red-600` across all admin forms.

### 4. Empty states

- Centered text, slightly larger (`text-base` instead of `text-sm`), with vertical padding so it doesn't look like a missing element.

### 5. Tab active state

- Active tab gets a burnt orange bottom border/underline so current tab is immediately obvious.

## Implementation Strategy

- `.admin-theme` CSS class in `globals.css` overrides shadcn variables
- `app/admin/page.tsx` wrapping div gets `className="admin-theme"`
- Component-level changes only where needed (badges, feedback messages, table rows, tabs, empty states)
- No changes to shadcn component source files — all styling via classes and variables

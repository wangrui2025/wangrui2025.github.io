# Design System - Claude Style

## Overview

This site uses a warm, paper-like aesthetic inspired by Anthropic's Claude design language. The design emphasizes readability, warmth, and a natural feel.

## Color Palette

### Primary Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `heading-primary` | `#141413` | Anthropic Near Black - headings, titles |
| `link-primary` | `#c96442` | Terracotta Brand - links, CTAs |
| `link-dark` | `#d97757` | Coral Accent - links in dark mode |

### Surface Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-primary` | `#f5f4ed` | Parchment - main background |
| `paper-bg` | `#faf9f5` | Ivory - card backgrounds |
| `border-primary` | `#f0eee6` | Border Cream - borders in light mode |

### Neutrals (All Warm Tones)

| Token | Hex | Usage |
|-------|-----|-------|
| `text-secondary` | `#5e5d59` | Olive Gray - secondary text |
| Stone Gray | `#87867f` | tertiary text |
| Warm Silver | `#b0aea5` | dark text (light bg) |

### Dark Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `bg-dark` | `#141413` | Deep Dark |
| `border-dark` | `#30302e` | Dark Surface |
| `paper-bg-dark` | `#30302e` | Dark Surface |
| `paper-accent-dark` | `#d97757` | Coral Accent |

### Tag Colors (Warm Tones)

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `tag-field-bg` | `#e8dcc8` (warm tan) | `#3d3529` | Field tags background |
| `tag-field-text` | `#5e4a3a` (dark brown) | `#c9b89a` | Field tags text |
| `tag-tech-bg` | `#e8e6dc` (warm sand) | `#3a3a36` | Tech tags background |
| `tag-tech-text` | `#4d4c48` (charcoal warm) | `#b0aea5` | Tech tags text |

### Brand Colors (Unchanged)

- `scholar-icon`: `#4A90E2` - Google Scholar icon
- `scholar-badge-count`: `#4A90E2` - Citation count

## Typography

### Font Families

- **Sans**: Inter, system-ui, -apple-system, sans-serif
- **Serif**: "Source Serif 4", Georgia, serif - headings
- **Mono**: Fira Code, Consolas, monospace
- **Chinese Serif**: "Noto Serif SC", serif

### Body Text

- Line height: `1.60` (reduced from 1.7 for tighter reading)
- Font: Inter (sans-serif)

## Spacing & Layout

### Card Styling

- Border radius: `0.75rem` (12px) - slightly rounded
- Padding: `1rem 1.25rem`
- Background: paper-bg (Ivory)
- Border: 1px solid border-primary

### Timeline

- Node color: Stone Gray (`#87867f`)
- Period text: Olive Gray (`#5e5d59`)
- Border left: 2px solid Border Cream (`#f0eee6`)
- Tag background: warm sand (`#e8e6dc`)

## Component Patterns

### PaperCard

- Rounded corners (xl: 12px)
- Left accent border (4px) in paper-accent color
- Shadow on hover
- Slight lift animation on hover

### Buttons/Links

- Hover: terracotta color transition
- Focus: visible outline for accessibility

## Dark Mode

Dark mode uses warm dark surfaces instead of pure black:
- Background: `#141413` (near black, warm)
- Cards: `#30302e` (dark surface)
- Borders: `#30302e`

## CSS Custom Properties

Colors are defined in `tailwind.config.mjs` and automatically applied via Tailwind classes throughout the site.

## Migration Notes

- All cold grays (`#666`, `#999`, `#ccc`) replaced with warm equivalents
- Line height reduced from 1.7 to 1.60
- Card border-radius increased from 0.5rem to 0.75rem

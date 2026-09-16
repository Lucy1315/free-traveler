---
name: Artisanal Atelier Cafe
colors:
  surface: '#fff8f6'
  surface-dim: '#e8d6d0'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ec'
  surface-container: '#fdeae3'
  surface-container-high: '#f7e4de'
  surface-container-highest: '#f1dfd8'
  on-surface: '#231916'
  on-surface-variant: '#53433c'
  inverse-surface: '#392e2a'
  inverse-on-surface: '#ffede7'
  outline: '#86736b'
  outline-variant: '#d8c2b8'
  surface-tint: '#8e4d2a'
  primary: '#8b4b27'
  on-primary: '#ffffff'
  primary-container: '#a8633d'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb691'
  secondary: '#8c4e2d'
  on-secondary: '#ffffff'
  secondary-container: '#feae86'
  on-secondary-container: '#793f20'
  tertiary: '#705748'
  on-tertiary: '#ffffff'
  tertiary-container: '#8a6f60'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcb'
  primary-fixed-dim: '#ffb691'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#713714'
  secondary-fixed: '#ffdbcb'
  secondary-fixed-dim: '#ffb692'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#6f3818'
  tertiary-fixed: '#fedcc9'
  tertiary-fixed-dim: '#e1c0ae'
  on-tertiary-fixed: '#29170c'
  on-tertiary-fixed-variant: '#594234'
  background: '#fff8f6'
  on-background: '#231916'
  surface-variant: '#f1dfd8'
typography:
  display-lg:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Epilogue
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Epilogue
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Noto Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Noto Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Noto Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Noto Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Noto Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system channels the refined, serene atmosphere of boutique roasteries and design-forward cafes in Seoul's Seongsu-dong (성수) and Yeonnam-dong (연남). The visual language captures the warmth of slow pour-overs, raw architectural plaster, and sun-drenched wooden interiors.

### Core Attributes
- **Atmosphere:** Serene, intimate, textural, artisanal.
- **Aesthetic Movement:** Warm Organic Minimalism blended with soft tactile craftsmanship. 
- **Emotional Resonance:** An unhurried pause; tactile luxury that feels inviting rather than intimidating.

### Visual Rules
- Abundant negative space that lets photography of ceramic cups, seasonal pastries, and warm wood breathe.
- Avoid harsh pure blacks, cold grays, or clinical drop shadows.
- Micro-interactions must feel fluid, soft, and deliberate, mimicking the quiet rhythm of an espresso drip.

## Colors

The palette is rooted in coffee culture and architectural ceramic tones, creating an organic sensory experience.

### Palette Roles
- **Background Tiers:** 
  - Canvas Base: `#FAF8F5` (Soft warm oat milk)
  - Surface Subdued: `#F5F0EA` (Warm raw linen)
  - Surface Raised: `#FFFFFF` (Pure porcelain, used sparingly for floating layers)
- **Typography & Structural Neutrals:**
  - Neutral Base / Text Primary: `#2C221E` (Warm deep espresso roast)
  - Text Muted: `#705E57` (Steamed cocoa)
  - Border Subdued: `#EBE3D8` (Warm stoneware line)
- **Brand Accents:**
  - Primary: `#C87D55` (Muted terracotta caramel)
  - Secondary: `#9A5A38` (Deep roasted almond)
  - Tertiary / Tint: `#E3C2B0` (Blushed terracotta wash)

### Usage Rules
- Pure black (`#000000`) is strictly prohibited.
- Maintain soft contrast for long-form reading while ensuring critical call-to-action buttons meet WCAG AA standards against cream backgrounds using `#2C221E` or darkened terracotta `#9A5A38`.

## Typography

The type system blends the contemporary editorial warmth of **Epilogue** for latin headlines and display titles with **Noto Sans** for pristine, natural Korean (한글) and body readability.

### Type Guidance
- **Headings (Epilogue):** Set with slight negative letter-spacing for tight, boutique editorial elegance. For Korean headlines, fallback smoothly to `Noto Sans KR` at Medium (500) and Bold (700) weights with `word-break: keep-all;`.
- **Body & Captions (Noto Sans):** Prioritize readability with relaxed line heights (`1.5` - `1.6`) to provide a calm, leisurely reading tempo.
- **Korean Typography Setting:** Always apply `break-keep` (단어 단위 줄바꿈) across Korean text to preserve holistic syllable groups and maintain pristine typographic cadence.

## Layout & Spacing

The layout embraces generous breathing room, mirroring the airy architecture of converted industrial warehouses in Seongsu.

### Layout Model
- **Desktop (1024px+):** Max content width of `1200px` centered on canvas. Standard 12-column fluid grid with `1.5rem` gutters and minimum `3rem` side canvas margins.
- **Tablet (768px - 1023px):** 8-column layout with `1.25rem` gutters and `2rem` side margins.
- **Mobile (<768px):** 4-column layout with `1rem` gutters and `1.25rem` outer margins.

### Rhythms & Spacing
- Vertical flow prioritizes generous negative space: sections should be spaced at least `space-xl` to `4rem` apart to prevent visual clutter.
- Asymmetry is encouraged in curated lookbooks and menu showcases to evoke a printed lifestyle zine format.

## Elevation & Depth

Depth is established primarily through warm tonal surfaces and low-contrast perimeter lines rather than heavy drop shadows.

### Tonal Stratification
- **Ground Floor:** `#FAF8F5` serves as the canvas foundation.
- **Mid-Tier (Cards & Insets):** `#F5F0EA` creates calm containment without casting shadows.
- **Top-Tier (Modals, Overlays, Floating Menus):** `#FFFFFF` paired with an ultra-diffused, ambient warm shadow:
  - `box-shadow: 0 12px 32px -8px rgba(44, 34, 30, 0.07), 0 4px 12px -2px rgba(44, 34, 30, 0.04);`

### Border Framing
- Cards and segmented controls use delicate, single-pixel borders in `#EBE3D8` (`rgba(44, 34, 30, 0.08)`) to outline edges crisply against the warm cream background.

## Shapes

The shape grammar is soft, friendly, and organic, echoing rounded stoneware cups and curved wooden bar counters.

### Curvature Tokens
- **Standard UI Containers (`rounded-2xl`):** `1rem` (16px) radius applied to cards, image frames, and panels.
- **Buttons & Interactive Tags:** `rounded-xl` (`0.75rem` / 12px) to full pill (`9999px`) for quick-filter chips.
- **Inputs & Field Elements:** `0.75rem` (12px) radius.
- **Media Assets:** All lifestyle photography and drink showcases must feature softly rounded corners (`1rem` to `1.5rem`) to retain tactile warmth.

## Components

### Buttons
- **Primary:** Filled `#2C221E` with `#FAF8F5` text, or filled `#C87D55` with white text. Height `48px`, rounded-xl (`12px`), medium weight typography. Smooth scale transition on hover (`scale-[1.01]`).
- **Secondary / Outlined:** Transparent background, 1px border `#2C221E` or `#EBE3D8`, text `#2C221E`. Hover fills with `#F5F0EA`.
- **Text Link:** Deep espresso text with delicate bottom underline offset by 4px in muted terracotta `#C87D55`.

### Chips & Badges
- Filter chips (e.g., "Filter Roast", "Single Origin", "Dessert"): Pill-shaped (`rounded-full`), padding `6px 14px`, text-sm.
  - Active: Background `#2C221E`, text `#FAF8F5`.
  - Inactive: Background `#F5F0EA`, border 1px solid `#EBE3D8`, text `#705E57`.

### Cards (Menu Items & Stories)
- Background `#FFFFFF` or `#F5F0EA`, border 1px solid `#EBE3D8`, padding `space-md` (`1rem`) to `space-lg` (`1.5rem`), corner radius `1rem` (16px).
- Image thumbnails sit inside the card with matching internal rounding.

### Input Fields & Selectors
- Height `48px`, background `#FFFFFF`, border 1px solid `#EBE3D8`, corner radius `12px`.
- Focus state: Border transitions to `#C87D55` with a subtle outline glow: `0 0 0 3px rgba(200, 125, 85, 0.15)`. Text `#2C221E`, placeholder `#A59891`.

### Checkboxes & Radio Buttons
- Custom circular radios and rounded square checkboxes (4px radius).
- Unchecked: 1.5px border `#EBE3D8` on `#FAF8F5`.
- Checked: Fill `#C87D55` with pure white checkmark icon.

### Domain-Specific Components
- **Tasting Note Pills:** Micro-tags with soft pastel washes (`#F5EBE6`, `#EFECE6`) to highlight notes such as "Plum", "Jasmine", "Dark Cocoa".
- **Origin Bar Indicator:** Minimalist horizontal slider displaying roast profiles from Light (약배전) to Dark (강배전) using a single espresso-toned track and terracotta indicator.
---
name: Industrial Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dde9ff'
  surface-container-highest: '#d5e3fd'
  on-surface: '#0d1c2f'
  on-surface-variant: '#45464d'
  inverse-surface: '#233144'
  inverse-on-surface: '#ebf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#191c1e'
  on-tertiary-container: '#818486'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0d1c2f'
  surface-variant: '#d5e3fd'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  element-gap: 12px
  row-height-dense: 32px
  row-height-standard: 48px
  grid-columns-desktop: '12'
  grid-columns-tablet: '8'
  grid-columns-mobile: '4'
---

## Brand & Style

The design system is engineered for mission-critical industrial environments where clarity, speed of cognition, and operational safety are paramount. The brand personality is authoritative, systematic, and uncompromisingly professional, targeting safety officers, field engineers, and operations managers in the oil and gas sector.

The visual style is **Corporate / Modern** with a strong emphasis on **Functional Minimalism**. It prioritizes information density without sacrificing legibility. Every pixel must serve a functional purpose; decorative elements are eliminated to prevent cognitive load during high-stress safety events. The aesthetic utilizes a flat architectural approach, relying on structural alignment and strict typographic hierarchy rather than depth or ornamentation to organize complex data sets.

## Colors

The palette is anchored by a high-contrast foundation to ensure readability under varying field lighting conditions. 

- **Primary & Neutral:** Deep Navy (#0f172a) is used for primary navigation and critical headers, providing a "heavy" grounding for the UI. Slate tones (50–700) handle borders, secondary text, and background layering.
- **Backgrounds:** The interface utilizes an off-white/slate-50 base to reduce screen glare while maintaining a clean, professional canvas.
- **Semantic Accents:** Red (#dc2626) and Orange (#f97316) are reserved strictly for high-priority safety alerts, risk indicators, and hazardous status changes. Their usage must be restrained to ensure they retain "alarm equity"—the ability to draw immediate attention when a threshold is crossed.
- **Success/Info:** Muted greens and blues are used for "Safe" states and "Routine" operations to maintain a calm baseline.

## Typography

This design system utilizes **Inter** for all roles due to its exceptional legibility in data-heavy interfaces and its tall x-height, which aids readability at small sizes.

- **Numerical Data:** For sensor readings, coordinates, and timestamps, always enable tabular figures (`tnum`) to ensure numbers align vertically in tables.
- **Hierarchy:** Use `label-md` (uppercase) for category headers and table column titles to differentiate metadata from content.
- **Density:** Use `body-sm` as the primary size for table rows and card content to maximize the amount of information visible on a single screen.
- **Mobile Adaptivity:** For small screens, `display-lg` should scale down to `24px` to prevent text wrapping on critical safety headers.

## Layout & Spacing

The layout follows a **Rigid Grid System** designed for structural integrity.

- **Grid Model:** A 12-column fluid grid on desktop (min-width: 1280px) that collapses to 8 columns on tablets and 4 columns on mobile. 
- **Rhythm:** A 4px baseline grid governs all spacing. Gutters are fixed at 16px to maintain high information density while preventing visual crowding.
- **Margins:** Page margins are set to 24px on desktop to provide a professional "frame" for the data.
- **Density Toggles:** Interfaces should support two density modes. "Standard" for administrative tasks and "Dense" for real-time monitoring dashboards, where row heights are reduced to 32px.

## Elevation & Depth

This design system avoids shadows to maintain a clean, "printed" feel that suggests precision. Depth is communicated through **Tonal Layering** and **Structural Outlines**.

- **Surfaces:** The primary background is `slate-50`. Surface containers (cards, sidebars) are white (#FFFFFF) with a 1px solid border in `slate-200`.
- **Active States:** Elements being interacted with do not lift; instead, they receive a subtle interior tint or a thicker 2px border in the primary navy color.
- **Z-Index:** Modals and critical alerts are the only elements that use a shadow. Use a very tight, 4px blur with 10% opacity black to indicate the element is temporarily "above" the operational workflow.

## Shapes

The shape language is **Soft (0.25rem)**. This provides a subtle modern touch that softens the "brutalist" efficiency of the industrial layout without appearing overly consumer-focused or playful.

- **Elements:** Buttons, input fields, and small badges use the 4px (`rounded`) radius.
- **Containers:** Large cards and panel groups use 8px (`rounded-lg`).
- **Icons:** System icons should be 2px stroke weight with slight corner rounds to match the UI components.

## Components

- **Buttons:** Primary buttons are solid Deep Navy (#0f172a) with white text. Secondary buttons use a white background with a `slate-200` border. High-risk actions (e.g., "Emergency Shutdown") use a solid Red (#dc2626) background.
- **Tables:** Tables are the core of the system. Use "Zebra striping" with `slate-50` and `white`. Header rows are `slate-100` with `label-md` typography.
- **Status Badges:** High-contrast, small-caps badges. Use "pill" shapes only for status. Backgrounds are low-saturation (e.g., light red tint) with high-saturation text (e.g., dark red) to ensure readability.
- **Cards:** Flat cards with 1px `slate-200` borders. Headers should be separated by a 1px horizontal divider. No internal padding greater than 16px.
- **Input Fields:** Rectangular with 1px border. Focus state is a 2px primary navy border. Label text is always visible (never floating) using `label-md`.
- **Sensors & Gauges:** Use linear progress bars or simple numerical readouts. Avoid circular dials to maximize horizontal space in narrow columns.
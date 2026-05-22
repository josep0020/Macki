---
name: Maule Leña
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#444840'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0ef'
  outline: '#74786f'
  outline-variant: '#c4c8bd'
  surface-tint: '#516445'
  primary: '#334529'
  on-primary: '#ffffff'
  primary-container: '#4a5d3f'
  on-primary-container: '#bfd5af'
  inverse-primary: '#b7cda8'
  secondary: '#77574d'
  on-secondary: '#ffffff'
  secondary-container: '#fed3c7'
  on-secondary-container: '#795950'
  tertiary: '#41413b'
  on-tertiary: '#ffffff'
  tertiary-container: '#595852'
  on-tertiary-container: '#d1cec7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d3e9c3'
  primary-fixed-dim: '#b7cda8'
  on-primary-fixed: '#0f2008'
  on-primary-fixed-variant: '#394c2f'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#e7bdb1'
  on-secondary-fixed: '#2c160e'
  on-secondary-fixed-variant: '#5d4037'
  tertiary-fixed: '#e5e2da'
  tertiary-fixed-dim: '#c9c6bf'
  on-tertiary-fixed: '#1c1c17'
  on-tertiary-fixed-variant: '#474741'
  background: '#fcf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-margin: 24px
  gutter: 16px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The brand personality for this design system is **Rustic Modern**. It bridges the gap between traditional Chilean wood-burning heritage and premium digital service. The design aims to evoke feelings of warmth, dependability, and artisan quality. 

The visual style is a blend of **Minimalism** and **Tactile** design. It utilizes a spacious, card-based layout that prioritizes high-quality photography of natural textures—specifically the grain and tones of dried firewood. By combining a "paper-like" cream background with sophisticated typography, the UI avoids the coldness of standard e-commerce, opting instead for a cozy, editorial feel that reflects the comfort of a home fireplace.

## Colors
The palette is rooted in the natural landscape of the Maule region. 
- **Primary (Forest Green):** Used for primary actions, success states, and brand markers. It represents the source and sustainability.
- **Secondary (Wood Brown):** Used for accents, specialized badges, and iconography related to the product material.
- **Tertiary (Cream/Beige):** This is the foundation of the UI, used for the main background to provide a warmer, more organic feel than pure white.
- **Neutral (Charcoal):** Used for primary text and high-contrast UI elements like borders or heavy icons.
- **Surface Accents:** Use a slightly darker shade of the cream background (#EDE9DE) for card backgrounds and input fields to maintain a soft depth.

## Typography
The typography system uses a high-contrast pairing to establish a premium editorial feel. 
- **Headlines:** Use **Playfair Display**. Its elegant serifs suggest authority and tradition. For large displays, use a slightly tighter letter-spacing to emphasize its sophisticated silhouette.
- **Body & UI:** Use **Montserrat**. Its geometric clarity balances the traditional serif, ensuring legibility in data-heavy areas like checkout or product specifications.
- **Hierarchy:** Use the Label-LG style for navigation and category headers to provide a clear structural anchor through capitalization and letter spacing.

## Layout & Spacing
The design system utilizes a **Fixed Grid** approach for desktop (12 columns, 1200px max-width) and a **Fluid Grid** for mobile (4 columns).

- **Vertical Rhythm:** Built on an 8px base unit. Component internal padding should favor larger breathability (e.g., 24px padding on cards) to maintain a premium feel.
- **Safe Zones:** Mobile margins are set to 24px to keep content away from screen edges, emphasizing the "contained" card-based aesthetic.
- **Content Reflow:** On desktop, product cards should occupy 3 or 4 columns depending on the view density. On mobile, cards default to a single-column stack or a 2-column grid for smaller accessory items.

## Elevation & Depth
Depth in this design system is created through **Tonal Layers** and **Ambient Shadows**. 

Avoid heavy, dark shadows. Instead, use "Organic Shadows"—soft, diffused offsets with a slight brown or green tint (#4A3A2F at 8-12% opacity) to make cards feel like they are resting gently on the cream surface. 
- **Level 0:** Main page background (Cream).
- **Level 1:** Content cards, input fields (White or light-cream with subtle 1px border #DEDACF).
- **Level 2:** Floating action buttons or active state cards (8px blur, 4px Y-offset).

## Shapes
The shape language is **Rounded**, signifying friendliness and the organic nature of wood logs. 
- **Standard UI (Buttons, Inputs):** 0.5rem (8px) radius.
- **Product Cards:** 1rem (16px) radius to create a soft, frame-like enclosure for photography.
- **Visual Elements:** Icons should utilize rounded terminals rather than sharp points to remain consistent with the soft-shadow aesthetic.

## Components
- **Buttons:** Primary buttons use the Forest Green background with Montserrat Bold in white. Secondary buttons use a Charcoal outline. Buttons should have a generous horizontal padding (min 24px).
- **Cards:** Product cards must feature a "full-bleed" image at the top with a 16px radius, followed by content on a white or off-white background. The bottom edge of the image should be slightly separated from the text by 16px of padding.
- **Input Fields:** Fields should have a light beige fill and a subtle 1px border. On focus, the border transitions to Forest Green.
- **Chips/Badges:** Used for wood types (e.g., "Seco," "Eucalipto"). These use the Wood Brown color with low-opacity backgrounds (10-15%) and dark brown text.
- **Quantity Selector:** A custom component with rounded `-` and `+` buttons, emphasizing the physical volume of the order.
- **Trust Indicators:** Icons for "Guaranteed Dry" or "Local Delivery" should use the Forest Green color in a thin-line, elegant style.

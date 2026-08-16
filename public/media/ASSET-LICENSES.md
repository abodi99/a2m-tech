# Asset licenses

Third-party media used on a2m-tech.com.

| File | Source | License | Notes |
|------|--------|---------|-------|
| — | — | — | No third-party stock photos or video in current phase |

## First-party / brand

| File | Notes |
|------|-------|
| `public/brand/logo.png` | Company logo |
| `public/brand/favicon.png` | Favicon |
| `public/brand/og-sv.jpg` / `og-en.jpg` | Locale Open Graph images (1200×630 JPEG) |
| `public/brand/og-sv.svg` / `og-en.svg` | Vector OG sources / editable drafts |
| `public/brand/hero-visual*.svg` | Legacy illustrations (optional archive) |

## First-party visual system (code)

Institutional diagrams and placeholders are implemented as React SVG components (no external media):

- `components/brand/hero-plane.tsx` — full-bleed continuity hero
- `components/brand/continuity-motif.tsx` — delivery stages motif  
- `components/brand/visual-system.tsx` — governance layers, accountability chain, fact-sheet panel, section atmosphere
- `components/media/placeholder-generator.tsx` — development placeholders for team photos and context images
- `components/media/image-responsive.tsx` — responsive image handling with modern formats
- `components/media/image-optimizer.tsx` — optimized loading with blur placeholders
- `components/media/video-player.tsx` — accessible video component for authentic material

## Media placeholders (development)

Current placeholders demonstrate layout and will be replaced with authentic content:

- Team portraits: placeholder SVGs in brand colors (300×400px, portrait aspect)
- Context images: workplace/location placeholders (600×400px, 4:3 aspect)
- Video posters: placeholder frames for authentic video content

## Content replacement checklist

Before production deployment, replace placeholders with:

- [ ] Real team portraits (with written permission)
- [ ] Authentic workspace photos from Helsingborg office
- [ ] Process/planning session photos (without sensitive content)
- [ ] Optional: brief founder/responsible person video statement
- [ ] Verify all image alt texts are descriptive and accurate

When adding licensed media, record license, author, URL, and purchase/order ID here before publishing.

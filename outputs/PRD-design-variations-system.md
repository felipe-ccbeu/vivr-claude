# PRD: Design Variation System for Vivr Social Posts

**Version:** 1.0
**Date:** 2026-03-26
**Status:** Ready for Implementation
**Owner:** Product & Design

---

## 1. Executive Summary

The Design Variation System enables automated generation of multiple design styles from a single content JSON file. It maintains consistent HTML structure while varying color palettes, typography, and visual treatments across 6 distinct aesthetic directions. The system optimizes for Instagram feed (540×675px) and story (540×960px) formats, integrating seamlessly with the existing render pipeline.

**Key Benefit:** Enable A/B testing and audience-specific creative directions without duplicating copy or managing separate content files.

---

## 2. Problem Statement

Currently, Vivr's marketing system:
- Generates posts with fixed visual styling (the Vivr gradient + dark OLED aesthetic)
- Requires manual template creation for each new visual direction
- Cannot test multiple design approaches against the same copy
- Lacks design flexibility for different audience segments and campaign goals

### Use Cases

1. **A/B Testing:** Compare dark bold vs. minimal clean to identify highest engagement aesthetic
2. **Audience Segmentation:** High-contrast design for older demographics, futuristic for Gen Z audiences
3. **Campaign Themes:** Editorial direction for thought leadership, bold for product launches
4. **Platform Optimization:** Fine-tune designs for feed vs. story placement

---

## 3. Scope

### What's Included

- Design variation system supporting 6 distinct styles
- Integration with existing `ContentJSON` → render pipeline
- Style definitions (colors, typography, visual treatment)
- Safe zone compliance and layout consistency across all styles
- Support for feed (540×675) and story (540×960) formats
- Each style applicable to all existing templates (split, overlay, frame, phone-float, phone-tilt, story)

### What's Out of Scope

- Creation of new template layouts (overlay, split, frame, etc. remain unchanged)
- Custom fonts beyond current Nunito family
- Animated transitions or interactions
- A/B testing infrastructure or analytics integration
- Admin UI for style selection (CLI-driven for this phase)

---

## 4. Design Specifications

### 4.1 Style Directory

Each design style is a self-contained definition file with:
- **Color Palette:** Primary, secondary, accent, backgrounds, text colors
- **Typography Direction:** Font sizes, weights, letter-spacing, line-height adjustments
- **Visual Treatment:** Background patterns, contrast levels, shadow/glow effects, borders
- **CTA Style:** Button appearance, hover states (theoretical)
- **Safe Zone Compliance:** Padding, margins, position constraints for feed/story

### 4.2 The Six Design Styles

#### Style 1: **Dark Bold** (Vivr Core Identity)
**Purpose:** Default Vivr aesthetic; high energy, premium feel; proven conversion.

| Property | Specification |
|----------|---|
| **Primary Colors** | Vivr Gradient: f7c948→f97040→e94899→9b5de5→26c6da→80e27e |
| **Background** | #0d0d0d (OLED black) |
| **Text Primary** | #ffffff (white, 100%) |
| **Text Secondary** | rgba(255,255,255,0.70) (70% opacity) |
| **Accent Gradient** | Vivr gradient (applied to accent word + CTA) |
| **Headline** | 36px / 900 weight / -0.8px letter-spacing / text-shadow |
| **Body** | 14px / 500 weight / 0.70 opacity / 1.6 line-height |
| **CTA Button** | Vivr gradient BG, 900 weight, multi-layer glow (0-32px), pill shape (50px radius) |
| **Visual Accents** | Gradient line separators, vignette overlays, frosted glass hook tag |
| **Safe Zone** | Standard padding (20-36px sides), top/bottom buffers for feed/story |

**Design DNA:** Premium, energetic, conversion-focused. Glow effects and gradient-heavy. Maximum contrast and visual hierarchy.

---

#### Style 2: **Minimal Clean**
**Purpose:** Distraction-free, readable, modern minimalism; tests with design-conscious audiences.

| Property | Specification |
|----------|---|
| **Primary Colors** | Single accent: #26c6da (Vivr cyan, refined from gradient) |
| **Background** | #ffffff (clean white) |
| **Text Primary** | #1a1a1a (near-black, 95%) |
| **Text Secondary** | #666666 (medium gray, 40% opacity equivalent) |
| **Accent Color** | #26c6da (cyan, no glow) |
| **Headline** | 32px / 800 weight / 0px letter-spacing / no text-shadow |
| **Body** | 13px / 400 weight / #333333 / 1.5 line-height |
| **CTA Button** | Solid cyan (#26c6da) BG, white text, 700 weight, no glow, subtle border (1px, rgba(38,198,218,0.3)) |
| **Visual Accents** | Thin 2px accent line (top of text section), minimal shadows (0 2px 8px rgba(0,0,0,0.08)), clean borders |
| **Safe Zone** | Generous padding (28-40px sides), whitespace-heavy layout |

**Design DNA:** Clarity, elegance, trust. Zero gradients. Maximum whitespace. Subtle interaction hints.

---

#### Style 3: **Editorial**
**Purpose:** Thought leadership, magazine-like authority; for insights and brand positioning content.

| Property | Specification |
|----------|---|
| **Primary Colors** | Serif serif accent: #2c2c2c (charcoal), with #e94899 (magenta) as highlight |
| **Background** | #f5f3f0 (warm off-white, editorial paper) |
| **Text Primary** | #2c2c2c (charcoal, 98%) |
| **Text Secondary** | #8a8a8a (taupe gray) |
| **Accent Color** | #e94899 (magenta, underline style) |
| **Headline** | 34px / 700 weight / 0px letter-spacing / serif font (Georgia-fallback) / line-height 1.2 |
| **Body** | 14px / 400 weight / serif-light / #555555 / 1.65 line-height |
| **CTA Button** | Solid charcoal (#2c2c2c) BG, white text, 600 weight, simple rectangular (8px radius), no glow |
| **Visual Accents** | Top border (3px solid magenta), serif pull-quotes, subtle grain texture (optional), thin divider lines |
| **Safe Zone** | Balanced padding (24-32px), centered text layout, max-width content blocks |

**Design DNA:** Sophisticated, authoritative, print-inspired. Serif typography. Understated elegance.

---

#### Style 4: **Futuristic**
**Purpose:** Innovation-forward, tech-forward aesthetic; appeals to early adopters and engineers.

| Property | Specification |
|----------|---|
| **Primary Colors** | Neon palette: #00d9ff (cyan), #a000ff (magenta), #ff006e (hot pink) |
| **Background** | #0a0e27 (deep navy-black) |
| **Text Primary** | #e0e0ff (cool white) |
| **Text Secondary** | #7d9fff (light blue-gray, 65%) |
| **Accent Colors** | Cyan (#00d9ff) + magenta (#a000ff) layered or alternating |
| **Headline** | 38px / 900 weight / 0.5px letter-spacing / all-caps or title case / glow effect (drop-shadow: 0 0 12px #00d9ff, 0 0 24px #a000ff) |
| **Body** | 13px / 400 weight / #b0d0ff / 1.55 line-height / monospace-inspired tracking |
| **CTA Button** | Neon cyan BG (#00d9ff), navy text (#0a0e27), 800 weight, rectangular (4px radius), dual-layer glow (cyan + magenta), animated border (theoretical) |
| **Visual Accents** | Glowing lines, grid overlays, tech-inspired borders (1px solid with glow), geometric shapes, accent word in alternate neon color |
| **Safe Zone** | Standard padding, layered depth via glow stacking |

**Design DNA:** Bold, cutting-edge, high-energy. Neon + glow. Tech aesthetics. High visual intensity.

---

#### Style 5: **High Contrast**
**Purpose:** Accessibility-first, maximum readability; ensures WCAG AAA compliance for all demographics.

| Property | Specification |
|----------|---|
| **Primary Colors** | Pure contrast: #000000 (black) + #ffffff (white), accent #ffcc00 (high-contrast yellow) |
| **Background** | #ffffff (pure white) or #000000 (toggle-ready) |
| **Text Primary** | #000000 (on white) / #ffffff (on black) — 21:1 contrast ratio |
| **Text Secondary** | #1a1a1a / #e6e6e6 — 19:1 contrast ratio |
| **Accent Color** | #ffcc00 (golden yellow, 99% contrast against both backgrounds) |
| **Headline** | 40px / 900 weight / 0px letter-spacing / no shadows |
| **Body** | 15px / 600 weight / high opacity (100% or 95%) / 1.75 line-height |
| **CTA Button** | Solid accent (#ffcc00) BG, black text, 900 weight, bold border (2px solid #000000), rectangular (0px radius) |
| **Visual Accents** | Bold geometric borders (2-3px), strong divider lines, minimal shadows, flat design, icon-ready |
| **Safe Zone** | Comfortable padding (30px sides), large touch targets (min 48×48px CTA) |

**Design DNA:** Maximum accessibility, highest contrast, clarity-first. Geometric and bold. No subtle effects.

---

#### Style 6: **Dark & White** (Stark Dual-Tone)
**Purpose:** Minimalist sophistication; elegant simplicity for premium positioning.

| Property | Specification |
|----------|---|
| **Primary Colors** | Pure black + pure white, accent: #f0f0f0 (light gray accent) or #1a1a1a (dark gray) |
| **Background** | #ffffff (white) — can be inverted for dark variant |
| **Text Primary** | #000000 (pure black, 100%) |
| **Text Secondary** | #4a4a4a (dark gray, 60%) |
| **Accent Color** | #e0e0e0 (subtle light gray) for underlines / borders |
| **Headline** | 35px / 700 weight / -0.5px letter-spacing / clean serif or geometric sans-serif / no effects |
| **Body** | 14px / 400 weight / #333333 / 1.6 line-height |
| **CTA Button** | Solid black (#000000) BG, white text, 700 weight, minimal border (1px solid #000000), square-ish (6px radius) |
| **Visual Accents** | Thin borders (1px), geometric dividers, stark shadows (0 1px 4px rgba(0,0,0,0.1)), monochrome illustration compatibility |
| **Safe Zone** | Balanced padding (24-32px), symmetrical layout |

**Design DNA:** Timeless, elegant, understated. Monochromatic. Geometry and whitespace. Premium restraint.

---

### 4.3 Safe Zone Specifications (All Styles)

Safe zones ensure content visibility across platforms and devices without being cut off by screen bezels or UI chrome.

#### Feed (540×675)
```
Top Buffer:    20px  (hook tag, badges)
Bottom Buffer: 26px  (CTA button)
Side Margins:  20-36px
Max Content Width: 468px
Critical Zone: center 300×400px (logo, main message must be here)
```

#### Story (540×960)
```
Top Buffer:    60px  (status bar + safe area)
Bottom Buffer: 60px  (reply affordances)
Side Margins:  20px
Max Content Width: 500px
Critical Zone: center 400×600px
```

**Application:** All styles must respect these margins regardless of visual treatment. No critical content outside critical zones.

---

### 4.4 Color Reference Table

| Color | Hex | RGB | Use Case | Contrast vs. White | Contrast vs. Black |
|-------|-----|-----|----------|----|----|
| Vivr Gradient (primary) | var | - | Dark Bold accent | 4.5:1 | 3.2:1 |
| Cyan | #26c6da | 38,198,218 | Minimal accent | 3.8:1 | 4.2:1 |
| Magenta | #e94899 | 233,72,153 | Editorial/Futuristic | 3.2:1 | 4.8:1 |
| Neon Cyan | #00d9ff | 0,217,255 | Futuristic primary | 5.2:1 | 2.1:1 |
| Neon Magenta | #a000ff | 160,0,255 | Futuristic secondary | 2.3:1 | 5.8:1 |
| High-Contrast Yellow | #ffcc00 | 255,204,0 | Accessibility accent | 19.5:1 | 2.5:1 |
| OLED Black | #0d0d0d | 13,13,13 | Dark bold BG | 19.7:1 | - |
| Warm Off-White | #f5f3f0 | 245,243,240 | Editorial BG | 2.3:1 | 17.8:1 |
| Navy Blue | #0a0e27 | 10,14,39 | Futuristic BG | 18.6:1 | - |

All text colors meet WCAG AA minimum (4.5:1) except where noted as decorative. Futuristic style is high-contrast for impact, not accessibility.

---

## 5. System Architecture

### 5.1 Data Structure

The system extends `ContentJSON` with an optional `designVariation` field:

```typescript
export interface ContentJSON {
  campaignId: string
  template: TemplateName
  imagePath: string
  variants: CopyVariant[]
  designVariation?: 'dark-bold' | 'minimal-clean' | 'editorial' | 'futuristic' | 'high-contrast' | 'dark-white'
}
```

**Default:** If omitted, uses `'dark-bold'` for backward compatibility.

### 5.2 Implementation Pattern

Each design variation is a style composition module that:
1. Exports a `styleConfig` object (colors, typography, visual effects)
2. Provides CSS class definitions for all elements
3. Returns complete HTML with injected styles

File structure:
```
src/styles/
├── dark-bold.ts
├── minimal-clean.ts
├── editorial.ts
├── futuristic.ts
├── high-contrast.ts
├── dark-white.ts
└── index.ts  (exports all styles)
```

### 5.3 Integration with Render Pipeline

**Changes to renderer.ts:**
```typescript
function applyTemplate(
  templateName: TemplateName,
  variant: CopyVariant,
  imageSrc: string,
  designVariation?: string
): string {
  const styleConfig = getStyleConfig(designVariation || 'dark-bold')
  // Apply template with injected style config
  switch (templateName) {
    case 'split': return buildSplit(variant, imageSrc, styleConfig)
    // ... other templates
  }
}
```

**Changes to templates (split.ts example):**
```typescript
export function buildSplit(
  variant: CopyVariant,
  imageSrc: string,
  styleConfig: StyleConfig
): string {
  // Use styleConfig for color/typography values instead of hardcoded values
  const css = `
    .headline {
      font-size: ${styleConfig.typography.headline.size};
      color: ${styleConfig.colors.textPrimary};
      // ...
    }
  `
  // Return HTML with dynamic styles
}
```

### 5.4 Style Config Object (TypeScript Interface)

```typescript
export interface StyleConfig {
  name: string
  description: string

  colors: {
    primary: string          // Main brand color or gradient
    secondary: string        // Secondary accent
    background: string       // Background color
    textPrimary: string      // Headline + primary copy
    textSecondary: string    // Body copy
    accentWord: string       // Gradient/color for accent word
    ctaBg: string           // CTA button background
    ctaText: string         // CTA button text color
    borders?: string        // Optional border color
  }

  typography: {
    headline: {
      size: string          // e.g. "36px"
      weight: number        // 400, 500, 600, 700, 800, 900
      spacing: string       // letter-spacing in px
      lineHeight: number    // 1.0, 1.08, etc.
      textShadow?: string   // Optional
    }
    body: {
      size: string
      weight: number
      spacing: string
      lineHeight: number
      opacity?: number      // 0-1 for alpha
    }
    cta: {
      size: string
      weight: number
      spacing: string
    }
  }

  visual: {
    backgroundGradient?: string
    vignette?: VignetteConfig
    borders?: BorderConfig
    shadows?: ShadowConfig
    glows?: GlowConfig[]
    patterns?: PatternConfig
    accentWordStyle: 'gradient' | 'color' | 'underline' | 'glow'
  }

  cta: {
    borderRadius: string    // e.g. "50px" for pill
    padding: string         // e.g. "13px 30px"
    textTransform?: string  // "uppercase", "none"
    boxShadow?: string
    border?: string
  }

  safeZone: {
    sidePadding: string
    topBuffer: string
    bottomBuffer: string
  }
}
```

---

## 6. Feature List

### Phase 1 (MVP)

- [ ] **Style Config System:** Create style definition files for all 6 designs
- [ ] **Template Integration:** Modify split, overlay, frame, phone-float, phone-tilt, story templates to accept StyleConfig
- [ ] **Renderer Update:** Wire designVariation param through render pipeline
- [ ] **ContentJSON Extension:** Add designVariation field to schema
- [ ] **CLI Support:** Enable style selection via CLI args or content file
- [ ] **Testing:** Render all 6 styles across all templates + formats

### Phase 2 (Enhancement)

- [ ] Preview UI for style selection
- [ ] Multi-style batch rendering (same content, multiple designs)
- [ ] Style customization API (override specific colors)
- [ ] Animation/interaction hooks for premium templates
- [ ] Social preview mockups (feed thumbnail, story preview)

### Phase 3 (Analytics)

- [ ] A/B test tracking tags per design
- [ ] Performance dashboard (engagement by style)
- [ ] Automated style recommendations based on audience
- [ ] Design trend analysis

---

## 7. Acceptance Criteria

### Functional

1. ✅ All 6 design styles render correctly for feed (540×675) and story (540×960)
2. ✅ Each style is usable across all 6 existing templates (split, overlay, frame, phone-float, phone-tilt, story)
3. ✅ Safe zones respected on all designs (no content cutoff on mobile)
4. ✅ Color contrast meets WCAG AA minimum (4.5:1 text:background)
5. ✅ ContentJSON with designVariation field correctly triggers style application
6. ✅ Backward compatibility: missing designVariation defaults to 'dark-bold'
7. ✅ All templates generate valid HTML without console errors

### Quality

1. ✅ Visual fidelity matches design spec (color accuracy, typography scale)
2. ✅ No layout shifts or overflow issues at target resolutions
3. ✅ Glow/shadow effects render cleanly (no banding or artifacts)
4. ✅ Typography rendering is consistent across browsers (tested: Chrome, Safari, Firefox)
5. ✅ Images display correctly with all visual treatments applied

### Performance

1. ✅ HTML file size does not exceed 45KB per design
2. ✅ Screenshot export time < 2s per design (no observable lag)
3. ✅ CPU usage stable when rendering batch of 6 styles

### Documentation

1. ✅ Style guide document created (colors, typography, visual effects)
2. ✅ Implementation guide for engineers (how to add new style)
3. ✅ Brand voice guide updated (when to use each style)

---

## 8. Visual Hierarchy & Consistency

### Component Priority (All Styles)

```
1. Image (context + emotional anchor)
2. Hook Tag (curiosity + categorization)
3. Headline (primary message)
4. Accent Word (emphasis + brand presence)
5. Body Copy (supporting context)
6. CTA Button (conversion element)
```

### Layout Guardrails

- **Headline** always largest text, dominant position
- **Body copy** always secondary visual weight
- **CTA button** always aligned left or bottom-left for thumb accessibility
- **Image** always top section (feed) or full-bleed (story)
- **Hook tag** always top-left corner with transparency/frosted-glass effect

---

## 9. Success Metrics

### Engagement (Post-Launch)

- Design variation with highest CTR (hypothesis: minimal-clean for design-conscious segments)
- Style-specific engagement variance (target: ±25% from baseline)
- Audience segment preference correlation (high-contrast for 45+ demographic)

### Technical

- 100% HTML render success rate across all 6 styles
- Zero layout regressions in existing templates
- <1% visual bug reports in first 4 weeks

### Business

- Reduced time to test new creative directions (CLI-driven, no design handoff needed)
- Increased A/B testing cadence (2-3 new style tests per month)
- Improved campaign performance through audience-matched aesthetics

---

## 10. Dependencies & Risks

### Dependencies

- Google Fonts API (Nunito family) — no additional fonts needed
- Existing template structure (split, overlay, frame, etc.)
- CSS support for modern browsers (flexbox, backdrop-filter, CSS variables)

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| Glow effects render poorly on older devices | Medium | Low | Test on iOS 14+, Android 10+ |
| Serif fonts (editorial) don't load fallback correctly | Low | Medium | Use system serif stack, test carefully |
| High contrast style looks too harsh in preview | Medium | Low | Validate with user testing before launch |
| Color contrast fails WCAG on certain combinations | Low | High | Automated contrast checker in CI |

---

## 11. Timeline & Resources

### Phase 1: Core Implementation (1-2 weeks)

1. **Days 1-2:** Style config system design + documentation
2. **Days 3-5:** Template integration (split, overlay, frame)
3. **Days 6-7:** Remaining templates (phone-float, phone-tilt, story)
4. **Days 8-10:** Testing + visual QA across all combinations
5. **Days 11-14:** Documentation + CLI improvements

### Resources Needed

- 1 Engineer (full-stack TypeScript)
- 1 Designer (visual QA + iteration)
- 1 Product Manager (testing strategy)

---

## 12. Appendix: Design Guidelines by Use Case

### Campaign Type → Recommended Style

| Campaign Type | Primary Style | Secondary | Rationale |
|---|---|---|---|
| Product Launch | Dark Bold | Futuristic | High energy, proven conversion |
| Thought Leadership | Editorial | Dark & White | Authority, sophisticated tone |
| Feature Highlight | Minimal Clean | Dark Bold | Focus on clarity + feature details |
| Testimonial/Social Proof | Dark & White | Minimal Clean | Trust + authenticity |
| Accessibility Focus | High Contrast | Dark & White | Maximum readability |
| Tech/Developer Outreach | Futuristic | Dark Bold | Innovation messaging |

### Audience Segment → Recommended Style

| Segment | Primary | Notes |
|---|---|---|
| Designers/Creatives | Minimal Clean | Appreciate whitespace, subtle effects |
| Executives/B2B | Editorial | Trust through sophistication |
| Gen Z/Mobile Native | Futuristic | Neon, energy, trend-forward |
| 45+ Demographics | High Contrast | Accessibility + clarity first |
| General Users | Dark Bold | Proven baseline |
| Budget-Conscious | Dark & White | No processing overhead, loads fast |

---

## 13. Glossary

- **WCAG:** Web Content Accessibility Guidelines (international standard)
- **Vignette:** Gradient overlay darkening edges of image
- **Frosted Glass:** Backdrop-filter blur effect for modern depth
- **Glow:** CSS drop-shadow creating light halo effect
- **Safe Zone:** Area guaranteed visible without cutoff on mobile
- **Accent Word:** Highlighted keyword in headline (auto-detected or manual)
- **A/B Testing:** Comparing two design versions with same copy
- **Style Config:** Centralized color/typography/effects definition

---

**End of PRD**

Generated on 2026-03-26 for the Vivr Marketing System.

---
title: "Contain Mobile Icon Shine and Replace Emoji Arrows - Plan"
type: fix
date: 2026-08-04
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
---

# Contain Mobile Icon Shine and Replace Emoji Arrows - Plan

## Goal Capsule

Make the Expected End homepage project icons look finished on iPhone by keeping every shine pixel inside each rounded icon shell. Replace arrow characters that iOS renders as emoji with consistent vector icons. Preserve the current blue design, project artwork, six-second shine timing, 3D depth, links, and contact behavior.

## Product Contract

### Summary

Harden the existing project-icon presentation for mobile Safari and replace character-based arrows with professional vector marks. Do not redesign the homepage or change its content.

### Problem Frame

The project shine is drawn by a transformed pseudo-element inside a rounded wrapper. The current `overflow: hidden` and inherited radius do not reliably clip that composited layer on iPhone Safari, so the rectangular shine becomes visible outside the intended rounded icon surface.

The outbound arrow is currently a Unicode character. iOS may render that character as a boxed emoji instead of a normal interface arrow, which creates the unprofessional appearance visible beside `Prepare email` and the project visit actions.

### Requirements

#### Project artwork

- R1. Both homepage project icons must contain the entire animated shine within their rounded visible artwork at desktop and mobile widths.
- R2. The hard clipping boundary must follow the icon radius without removing the existing outer rim, depth shadow, hover response, or six-second animation cadence.
- R3. MyBibleLens keeps its gold shine and The Water Check keeps its blue shine.

#### Interface arrows

- R4. Character-based action arrows must be replaced by SVG icons that cannot render as platform emoji.
- R5. The vector arrows must inherit the surrounding text color, remain decorative to assistive technology, and align cleanly with button and link labels.

#### Scope protection

- R6. Project destinations, contact-email composition, copy, navigation, branding, and the rest of the homepage layout must remain unchanged.

### Acceptance Examples

- AE1. Given the homepage at a 390 px viewport, when either project shine crosses an icon corner, then no shine is visible beyond the rounded artwork shell.
- AE2. Given the MyBibleLens and The Water Check icons, when their animations run, then each keeps its existing gold or blue treatment and six-second rhythm.
- AE3. Given Expected End is opened on iPhone, when a visitor views `Prepare email`, `Visit app`, `Visit Instagram`, or the project jump action, then each arrow appears as a clean vector mark rather than an emoji glyph.
- AE4. Given reduced motion is enabled, when the homepage loads, then the icon content and vector arrows remain visible and usable without requiring the shine animation.

### Scope Boundaries

The work is limited to project-art clipping, arrow rendering, related tests, and mobile/desktop visual verification. It does not resize the project cards, replace logos, change animation timing, rewrite contact copy, or alter navigation behavior.

## Planning Contract

### Key Technical Decisions

- KTD1. **Separate depth from clipping.** Keep `.projectArt` as the outer rim and shadow layer. Turn `.projectArtClip` into an explicit paint-containment shell with its own full-size geometry and rounded clipping boundary. This preserves the 3D shadow while forcing the image, inset highlights, and moving pseudo-element through one Safari-safe clip.
- KTD2. **Use shared inline SVG arrows.** Add a small local icon component instead of adding an icon package or relying on text glyphs. Use `currentColor`, fixed vector geometry, `aria-hidden`, and `focusable="false"` so the label remains the accessible name.
- KTD3. **Remove the full character-arrow surface.** Replace the upward-right arrows in project links and the contact submit button, plus the downward project-jump arrow, so no nearby action still depends on iOS character rendering.

### Patterns to Follow

- Preserve the existing project DOM seam in `src/company-site/home.tsx`: outer link, inner artwork clip, image, and decorative pseudo-elements.
- Preserve the current contact behavior and accessible button name in `src/company-site/contact-form.tsx`.
- Extend the existing homepage and contact tests in `src/company-site/index.test.tsx` and `src/company-site/contact-form.test.tsx`.

## Implementation Units

### U1. Enforce the rounded project-art shell

- **Goal:** Make the moving shine impossible to paint outside either icon while retaining the existing 3D presentation.
- **Requirements:** R1, R2, R3, R6; covers AE1, AE2, and AE4.
- **Dependencies:** None.
- **Files:** `src/company-site/style.module.css`, `src/company-site/home.tsx`, `src/company-site/index.test.tsx`.
- **Approach:** Define one shared radius value for the outer rim and inner clip. Give the inner shell explicit width and aspect geometry, hard paint containment, and a rounded clip that survives transformed pseudo-elements on mobile Safari. Keep the shadow on the outer element and the shine inside the inner shell.
- **Test scenarios:**
  - Render both project links and confirm each retains a dedicated inner artwork shell around its image.
  - Verify MyBibleLens and The Water Check still expose their distinct artwork variants.
  - At 390 px, observe a complete animation cycle and confirm the shine never crosses any rounded corner.
  - At desktop width, confirm the rim, depth shadow, image crop, hover state, and original proportions remain unchanged.
  - With reduced motion enabled, confirm both icons remain intact and linked after animation suppression.
- **Verification:** The two icons retain their existing visual identity, and no moving rectangular layer appears beyond their rounded surfaces on phone or desktop.

### U2. Replace character arrows with vector icons

- **Goal:** Prevent iOS from displaying boxed emoji arrows in Expected End actions.
- **Requirements:** R4, R5, R6; covers AE3 and AE4.
- **Dependencies:** None.
- **Files:** `src/company-site/action-icons.tsx`, `src/company-site/home.tsx`, `src/company-site/contact-form.tsx`, `src/company-site/style.module.css`, `src/company-site/index.test.tsx`, `src/company-site/contact-form.test.tsx`.
- **Approach:** Create reusable up-right and down vector icons, place them beside the existing labels, and align them through the shared site styles. Remove the corresponding Unicode arrow characters without changing link destinations, button types, or accessible names.
- **Test scenarios:**
  - Render the homepage and confirm the project jump and both external project actions include decorative SVG icons.
  - Render the contact form and confirm `Prepare email` includes a decorative SVG icon while retaining the same accessible button name.
  - Assert that the affected action surfaces contain no Unicode arrow characters.
  - Complete the contact form and confirm it still prepares the same `mailto:` destination and structured message.
  - On iPhone and desktop, confirm icons inherit the correct text color and align with the labels without shifting button dimensions.
- **Verification:** No affected action renders an emoji arrow, and all actions keep their previous behavior and accessibility.

## Verification Contract

- `npm test -- --run` proves the homepage, contact composer, accessible names, links, and SVG-arrow structure.
- `npm run check` proves TypeScript and Biome quality gates.
- `npm run build` proves the production bundle compiles.
- Browser verification must cover one full shine cycle at 390 px, a common laptop width, reduced motion, and the blue production theme.
- Final owner verification must use the phone-accessible Vite preview on the same Wi-Fi because the reported defect is specific to physical iPhone rendering.

## Definition of Done

- The shine never paints outside either rounded project icon on iPhone or desktop.
- The current gold and blue shine treatments still run every six seconds.
- `Prepare email`, project visit actions, and the project jump action use vector arrows with no emoji rendering.
- Project links and contact-email preparation behave exactly as before.
- Automated checks and production build pass.
- The diff contains no abandoned clipping experiments or unrelated redesign work.

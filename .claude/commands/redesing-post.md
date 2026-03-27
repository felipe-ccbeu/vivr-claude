---
description: Redesign the current campaign HTML with a stronger visual direction, improving impact, hierarchy, and composition while keeping the local screenshot workflow intact
agent: frontend
---

Redesign the current campaign HTML from a stronger visual and aesthetic perspective.

This is not a small refinement. You are allowed to significantly improve or restructure the layout if needed.

## Objective

Create a visually striking, production-grade campaign piece aligned with the Vivr brand.

The result should feel:
- bold
- intentional
- memorable
- high-conversion
- clearly designed (not template-based)

## Rules

- preserve the core message and campaign intent
- keep the copy unless there is a clear improvement opportunity
- improve hierarchy, contrast, spacing, and visual flow
- avoid generic ad layouts and AI-looking designs
- maintain compatibility with the local html-to-png screenshot workflow
- keep the code simple enough for manual editing in VS Code
- do not introduce frameworks or dependencies

## Design direction

Before implementing, define a clear visual direction.

Choose ONE strong direction and commit to it, such as:
- bold typographic layout
- minimal high-contrast design
- editorial/magazine style
- futuristic/digital energy
- premium tech aesthetic
- radical direct-response style

Do not mix multiple directions randomly.

## Typography (critical)

- redesign headline layout intentionally
- avoid awkward automatic line breaks
- prefer balanced headline shapes
- aim for more square, stable compositions
- ensure the bottom line is not visually weaker than the top
- adjust container width, font-size, or manual line breaks if needed

## Layout and composition

- rethink spacing and layout structure
- create stronger visual hierarchy between:
  headline → body → CTA
- improve alignment and grouping
- use negative space intentionally
- allow asymmetry if it strengthens the composition
- avoid “everything centered and generic” unless intentional

## Safe zone (very important)

- increase margins and padding
- keep all important content well inside the frame
- ensure better framing for social media usage
- avoid edge-clinging elements
- design as if slight cropping could happen

## Visual treatment

- improve background, contrast, and depth if needed
- use color intentionally (not randomly)
- emphasize the CTA clearly
- create at least one strong focal point
- avoid over-decoration without purpose

## When redesigning

You may:
- restructure containers
- change layout flow
- adjust typography scale
- reposition elements
- simplify or remove weak parts

You should NOT:
- overcomplicate the code
- break readability
- create fragile layouts
- introduce unnecessary effects

## Output expectations

- clean, readable HTML/CSS
- visually stronger than the original
- still easy to edit manually
- fully compatible with local screenshot rendering

## At the end

Provide a short summary including:
- what was changed
- what design direction was chosen
- why the redesign is stronger
- how to preview or render locally
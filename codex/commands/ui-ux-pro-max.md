---
name: ui-ux-pro-max
description: Comprehensive UI/UX design workflow — styles, palettes, typography, UX guidelines, and stack-specific patterns.
argument-hint: <what to design>
tier: HEAVY
estimated-tokens: "60k–180k"
platform: codex
---

# @hub ui-ux-pro-max — AI-Powered Design Intelligence

$ARGUMENTS

## Flow

**Step 1 — Parse bypass flag.**

**Step 2 — Analyse requirements (no agents).**
Extract: product type, style keywords, industry, stack, scope. Ask 1–2 Socratic questions if unclear.

**Step 3 — Render HEAVY gate.**

**Step 4 — Dispatch `hub:frontend-specialist`** with design skills loaded:
`hub:frontend-design`, `hub:web-design-guidelines`, `hub:tailwind-patterns`.

If scope = landing page: also dispatch `hub:seo-specialist` for metadata + crawlability review.

**Step 5 — Write usage log.**
Append to `.hub/usage.json` in the user's project directory.

## Examples
```
@hub ui-ux-pro-max redesign landing hero
@hub ui-ux-pro-max SaaS dashboard dark mode
@hub ui-ux-pro-max -y mobile onboarding flow
```

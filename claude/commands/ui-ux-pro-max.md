---
description: Comprehensive UI/UX design workflow — styles, color palettes, typography, UX guidelines, and stack-specific patterns.
argument-hint: <what to design>
tier: HEAVY
tier-rationale: frontend-specialist + 3 design skills (frontend-design, web-design-guidelines, tailwind-patterns); comprehensive output, many component writes.
estimated-tokens: "60k–180k"
risk: Full-product design passes (whole app theming) can exceed the upper bound; scope tightly or chunk.
---

# /hub:ui-ux-pro-max — AI-Powered Design Intelligence

$ARGUMENTS

> Comprehensive design guide for web and mobile applications. Synthesises styles, color palettes, font pairings, UX guidelines, and stack-specific patterns via `hub:frontend-specialist` + the three design skills.

---

## Flow

**Step 1 — Parse bypass flag.**
If `$ARGUMENTS` starts with `--yes` or `-y`, set `bypass = true` and strip the flag.

**Step 2 — Load the approval-gate skill.**
Read `skills/approval-gate/SKILL.md`.

**Step 3 — Analyse requirements (main-context, cheap).**

Before the gate, extract from `$ARGUMENTS`:

- **Product type** — SaaS / e-commerce / portfolio / dashboard / landing / mobile onboarding / admin / other
- **Style keywords** — minimal / playful / professional / elegant / dark-mode-first / ...
- **Industry** — healthcare / fintech / gaming / education / ...
- **Stack** — React / Vue / Next.js / Tailwind (default) / Flutter / SwiftUI / Jetpack Compose / shadcn-ui
- **Scope** — single page / multi-page / full-product design system

Grep the current repo for existing design tokens, Tailwind config, or a `design-system/` folder so we don't redesign what already exists.

If essentials are unclear, ask 1–2 Socratic questions (e.g. "light-mode-first, dark-mode-first, or both?"). Never more than 2. Skip if `bypass`.

**Step 4 — Build the agent plan.**

- Primary agent: `hub:frontend-specialist`
- Skills the agent will load: `hub:frontend-design`, `hub:web-design-guidelines`, `hub:tailwind-patterns` (if Tailwind), `hub:nextjs-react-expert` (if Next.js), `hub:mobile-design` (if Flutter/SwiftUI/Jetpack)
- Second agent only if full-product scope: `hub:seo-specialist` for landing-page metadata and crawlability
- Third agent only if accessibility-critical: no separate agent — the web-design-guidelines skill already covers WCAG. Don't over-staff.

**Step 5 — Render the HEAVY gate (skip if `bypass`).**

```
⚖️  Kit dispatch preview — /hub:ui-ux-pro-max

Task: "<stripped args>"
Interpreted: <product type> · <style> · <industry> · <stack> · scope: <single-page | multi-page | full-product>

Planned agents (in order):
  hub:frontend-specialist   — design system + component generation
  hub:seo-specialist        — landing metadata + crawlability    [landing pages only]

Planned skills: <from Step 4>

Tier: HEAVY  (60k–180k tokens, ~4–10 min wall-clock)
Why:  Comprehensive design pass with 3+ design skills and component generation for the chosen stack.
Risk: Full-product theming (every page) can exceed the upper bound. Prefer to chunk: do one page / flow at a time.

MoSCoW for this task:
  MUST    — design tokens (colors, type, spacing), key components, accessibility baseline
  SHOULD  — dark-mode variants, responsive breakpoints, hover/focus states, empty/loading/error states
  COULD   — motion/transitions spec, iconography system, illustration guidelines
  WON'T   — full brand identity / logo design, marketing copywriting

Alternatives:
  (a) Proceed as-is                                                   ~60k–180k
  (b) Tokens + 1 key page only                                        ~25k–60k   (≈MEDIUM)
  (c) Design-spec only: propose the system, no code, review before build  ~15k–35k  (≈MEDIUM)

[if budget file present: budget line + recommendation]

Reply:  go / a   — proceed full design pass
        b        — tokens + one page
        c        — design-spec only (review before implementing)
        tweak    — edit stack / scope / style direction
        cancel
```

Reply parsing per §3.4 of the approval-gate skill.
On cancel: append cancelled-run entry, print `🚫 Cancelled. No design files written.` and stop.

**Step 6 — Dispatch.**

```
Agent(
  subagent_type="hub:frontend-specialist",
  description="Design: <short slice>",
  prompt=<<
    PROJECT: "$ARGUMENTS" (interpreted: <type>, <style>, <stack>, scope=<alt>)
    TASK:
    1. Load hub:frontend-design, hub:web-design-guidelines,
       and the stack-specific skill (hub:tailwind-patterns / hub:nextjs-react-expert / hub:mobile-design).
    2. Produce a complete design system for the chosen scope:
       tokens (color, type, spacing, radius, shadow), components,
       anti-patterns to avoid, and a Pre-Delivery Checklist tailored to this product.
    3. Implement the MUSTs for this scope. Skip SHOULDs/COULDs if alternative = (b). Skip implementation entirely if alternative = (c).
    4. Follow the 'Common Rules for Professional UI' at the bottom of the command file — they encode years of gotchas (no emoji icons, stable hover, light-mode contrast floors, etc.).
    5. If a design-system/ folder exists or user wants it persistent, write:
       design-system/MASTER.md + design-system/pages/<page>.md
       so future work can reference a single source of truth.
  >>
)
```

If `scope = landing`, additionally dispatch `hub:seo-specialist` with a prompt to verify the metadata, heading structure, and crawlability of the landing output.

**Step 7 — Write usage log (MANDATORY — use the Write tool, do not skip).**

Path: `.hub/usage.json` in the **user's current working directory** (their project), NOT inside `${CLAUDE_PLUGIN_ROOT}`.

1. Read `.hub/usage.json` if it exists → parse the JSON. If absent → start with `{"runs": []}`.
2. Append one entry to `runs`:
   - `id`: `"r_<YYYY-MM-DD>_<NNN>"` (today + zero-padded seq = existing length + 1)
   - `started_at` / `ended_at`: ISO-8601 UTC, `command`: `"/hub:ui-ux-pro-max"`, `args`: stripped args
   - `tier_declared`: `"HEAVY"`, `tier_observed`: recomputed from output size
   - `approved`: `true` (or `false` if cancelled), `chosen_alternative`: `"a"` | `"b"` | `"c"`
   - `agents`: array of `{"name": "hub:<name>", "approx_tokens": <N>}` for each dispatched agent
   - `skills`: `["hub:frontend-design", "hub:web-design-guidelines", "hub:tailwind-patterns"]` plus any loaded
   - `files_written`: integer, `approx_total_tokens`: sum across agents, `user_verdict`: `null`, `notes`: `null`
3. Write the updated JSON back using the **Write tool**.

**Step 8 — Print the inline HEAVY ledger.**

```
📒  /hub:ui-ux-pro-max ledger
Ran: <N> of <M> planned agents
Skills: <list>
Files written: <N>  (examples: design-system/MASTER.md, components/Button.tsx, app/layout.tsx, ...)
Approximate token share:
  hub:frontend-specialist  <N>%   (~<N>k)
  hub:seo-specialist       <N>%   (~<N>k)   [if landing]
  other                    <N>%   (~<N>k)
Tier declared: HEAVY (60k–180k) · observed: ~<N>k (<in-tier ✓ | drift ✗>) · duration: <Xm Ys>
Pre-delivery checklist: <PASS | N issues>
Logged to .hub/usage.json (<run-id>)
Worth it? — you now have: <1-sentence summary of design deliverables>.
Next suggested: /hub:preview start   (LIGHT)   or   /hub:test <page>   (MEDIUM)
```

---

## Common Rules for Professional UI (inherited by the dispatched agent)

### Icons & visuals

| Rule | Do | Don't |
|---|---|---|
| No emoji icons | SVG icons (Heroicons, Lucide, Simple Icons) | Emojis like 🎨 🚀 ⚙️ |
| Stable hover states | Color/opacity transitions | Scale transforms that shift layout |
| Correct brand logos | Official SVG from Simple Icons | Guessed paths |
| Consistent icon sizing | Fixed `24x24` viewBox with `w-6 h-6` | Random mixed sizes |

### Interaction

| Rule | Do | Don't |
|---|---|---|
| `cursor-pointer` on clickables | Always | Default cursor on interactive elements |
| Hover feedback | Color/shadow/border change | No indication |
| Transitions | `transition-colors duration-200` | Instant or >500ms |

### Light/dark mode

| Rule | Do | Don't |
|---|---|---|
| Glass card light mode | `bg-white/80`+ | `bg-white/10` (too transparent) |
| Light mode body text | `#0F172A` (slate-900) | `#94A3B8` (slate-400) |
| Muted light text | `#475569` (slate-600) min | gray-400 or lighter |
| Border visibility | `border-gray-200` | `border-white/10` (invisible) |

### Layout

| Rule | Do | Don't |
|---|---|---|
| Floating navbar | `top-4 left-4 right-4` spacing | `top-0 left-0 right-0` |
| Content padding | Offset for fixed navbar height | Content hidden behind fixed elements |
| Max-width consistency | One of `max-w-6xl` / `max-w-7xl` | Random mixed widths |

---

## Pre-delivery checklist (run as part of Step 8)

### Visual quality
- [ ] No emojis used as icons
- [ ] All icons from one set (Heroicons / Lucide)
- [ ] Brand logos verified from Simple Icons
- [ ] Hover states don't cause layout shift

### Interaction
- [ ] All clickables have `cursor-pointer`
- [ ] Hover states give clear visual feedback
- [ ] Transitions smooth (150–300ms)
- [ ] Focus states visible for keyboard nav

### Light/dark mode
- [ ] Light-mode text contrast ≥ 4.5:1
- [ ] Glass / transparent elements visible in light mode
- [ ] Borders visible in both modes
- [ ] Both modes tested

### Layout
- [ ] Floating elements have edge spacing
- [ ] No content hidden behind fixed navbars
- [ ] Responsive at 375 / 768 / 1024 / 1440px
- [ ] No horizontal scroll on mobile

### Accessibility
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color is never the sole indicator
- [ ] `prefers-reduced-motion` respected

---

## Examples

```
/hub:ui-ux-pro-max landing page for a beauty spa
/hub:ui-ux-pro-max SaaS dashboard for fintech analytics
/hub:ui-ux-pro-max mobile onboarding for a fitness app
/hub:ui-ux-pro-max -y admin panel for a CRM with a minimal aesthetic   (bypass gate)
```

---

## Related

| Need | Skill / Agent |
|---|---|
| Design tokens + components | `hub:frontend-design` |
| Accessibility + contrast | `hub:web-design-guidelines` |
| Tailwind v4 patterns | `hub:tailwind-patterns` |
| Next.js / React perf | `hub:nextjs-react-expert` |
| Mobile-first UX | `hub:mobile-design` |
| Implementation | `hub:frontend-specialist` |

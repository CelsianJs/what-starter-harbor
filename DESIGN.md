# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-10-02
- Primary product surfaces: overview, incident queue, incident detail, services, deploy ledger, activity log, build notes
- Evidence reviewed: What Framework routing/state examples, current getting-started guidance, and the Vura deploy script pattern used by these starters

## Brand
- Personality: industrial, precise, nocturnal, operator-friendly
- Trust signals: clearly synthetic data labels, deterministic workflows, audit log, saved filters that are easy to clear
- Avoid: pretending to monitor real infrastructure, vague AI ops claims, crypto/neon excess, skeleton dashboards without actions

## Product goals
- Goals: demonstrate routeable incident detail, shared global state, computed health summaries, effects for saved filters/activity persistence, and smooth route transitions
- Non-goals: real uptime monitoring, alerts to external people, backend auth, incident paging integrations
- Success signals: user can filter incidents, save a filter view, open an incident, change status/severity/owner, see the service summary and activity log update

## Personas and jobs
- Primary personas: agents building B2B SaaS dashboards; developers evaluating What Framework for operational apps
- User jobs: triage synthetic incidents, review service status, inspect deploy history, understand app architecture
- Key contexts of use: desktop command center, mobile review during commute, agent reference

## Information architecture
- Primary navigation: Overview, Incidents, Services, Deploys, Activity, Build Notes
- Core routes/screens: `/`, `/incidents`, `/incidents/:id`, `/services`, `/deploys`, `/activity`, `/build`, `404`
- Content hierarchy: status matrix, incident queue, route detail, action rail, activity audit trail

## Design principles
- Principle 1: Every stat must be tied to an actionable list or workflow.
- Principle 2: Make synthetic/demo boundaries explicit without weakening realism.
- Tradeoffs: no real backend or timers; persistence is local browser state to keep the starter portable.

## Visual language
- Color: oxidized slate, cold cyan, amber warning, red critical, steel borders
- Typography: compact system sans with tabular numeric labels; no external fonts
- Spacing/layout rhythm: dense but breathable console grid; compact ops hero; panels align to a strict 12px rhythm
- Shape/radius/elevation: clipped corners, fine borders, luminous but restrained focus
- Motion: short panel fades and route slides; disabled under reduced motion
- Imagery/iconography: CSS status bars, grid lines, deploy pulses; no stock art

## Components
- Existing components to reuse: none; standalone starter
- New/changed components: app shell, KPI tile, incident row, padded incident detail rail, service tile, deploy risk meter, owner load meter, activity event
- Variants and states: empty filters, active saved filters, status/severity changes, 404, mobile stacked console
- Token/component ownership: `src/styles.css` owns all visual tokens

## Accessibility
- Target standard: WCAG 2.1 AA-minded implementation
- Keyboard/focus behavior: links/buttons/selects visible on focus; incident actions are native controls
- Contrast/readability: dark panels with high-contrast text and non-color status labels
- Screen-reader semantics: route headings, labelled filters, status labels in text
- Reduced motion and sensory considerations: `prefers-reduced-motion` removes transitions and animations

## Responsive behavior
- Supported breakpoints/devices: 360px mobile through wide dashboard displays
- Layout adaptations: console grids collapse to one column; nav wraps; incident detail rail stacks
- Touch/hover differences: hover affordances have focus equivalents; controls keep large tap targets

## Interaction states
- Loading: not applicable; synthetic data is bundled
- Empty: no incident results and no activity results have explicit panels
- Error: unknown incident and malformed storage fall back safely
- Success: activity log records every status/filter mutation
- Disabled: destructive/reset actions remain explicit; no hidden disabled state
- Offline/slow network: static local app once loaded

## Content voice
- Tone: terse operator notes, no hype
- Terminology: incident, service, deploy, owner, severity, status
- Microcopy rules: state that all telemetry is synthetic; never imply live monitoring

## Implementation constraints
- Framework/styling system: What Framework 0.13.10, what-compiler 0.13.10, Vite, plain CSS
- Design-token constraints: CSS custom properties
- Performance constraints: no external assets, computed filters over small local data, route aliases after build
- Compatibility constraints: modern browsers supported by Vite output and What router
- Test/screenshot expectations: Vitest reducer/filter tests plus Playwright desktop/mobile flows and screenshots

## Open questions
- [ ] Choose the final Vura subdomain during deployment.

## Visual QA audit
- External reference: independent visual review plus local screenshots rather than a pixel target.
- Current judgment: Harbor remains a dense nocturnal operations console. The overview no longer duplicates KPI values in the status strip, the hero is compact enough for the active queue to lead, owner/service/deploy rollups use fixture-driven meters and tones, and the incident detail severity rail now has enough padding around the back link, title and summary.
- Follow-up after deployment: capture desktop/mobile/detail screenshots from the live Vura URL and verify the console density survives production fonts and route aliases.

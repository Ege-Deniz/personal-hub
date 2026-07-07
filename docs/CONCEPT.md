# rowy.engineer — Redesign Concept (Stage 1)

Status: **foundation locked · board choice OPEN — awaiting Ege's direction on the Stage 1 boards**
Boards artifact: claude.ai/code/artifact/1de022cd-8710-4d8f-aab8-187f350e8ab1
Research: 6-agent bundle-verified Awwwards pass, 2026-07-07.

## Premise (shared across all boards)

An AI-native developer's portfolio where every claim is a verifiable receipt and
the page itself is the proof of craft. Juror target feeling in 10 seconds:
**"What IS this thing?"**

Three candidate expressions (see boards):
1. **Awake Instrument** — the site knows you arrived; scripted address; scroll operates the machine.
2. **Cascade Observatory** — one persistent canvas threads the field 3D→2D→3D through an editorial page.
3. **Cinematic Ledger** — monochrome statement + indexed archive; field as one act + footer re-expansion.

## Locked foundation (direction-independent, research-verified)

- **Palette law**: near-black ground + ONE accent, used systematically (cursor,
  CTA, hover, progress). Accent candidate set: cyan #00e5ff (continuity) /
  signal orange #ff8539 / acid lime #beff8b. Multi-tone dark gradients are out.
- **Motion spine**: Lenis + GSAP ScrollTrigger + SplitText line-mask reveals +
  CustomEase (all verified importable from installed gsap 3.15 at $0).
  **framer-motion is retired from the redesign** — zero hits in winner bundles.
- **Type plan**: distinctive free display face (shortlist after board choice;
  Fontshare candidates prepared) + Geist Mono for telemetry. Never
  default-stack-only.
- **Content layer**: `src/data/artifacts.ts` — single source of truth; every
  receipt verifiable. Media slots await Ege's ~10s captures (Brain Operator,
  backprop demo, SIBA).
- **Field engine**: `SpatialBackground` survives; its role differs per board
  (narrator / spine / single act). Never wallpaper again.
- **Boot**: preloader doubles as GPGPU shader warm-up; pays off into the hero
  (dennissnellenberg/osmo grammar). ≤1.5s, real-asset-gated.
- **Footer as act** + AI-referral furniture ("ask Claude about me", llms.txt) —
  on-brand, currently rare (bymonolog.com grammar).
- **Anti-goals**: image-after-image grids; purple AI-glow; cursor-follower
  blobs; grain-on-everything; scrolljacked 3D worlds; fake telemetry of any
  kind; three accents; chatbot cuteness in the doorman copy.

## Scene spine (draft — 6 acts, refined after board choice)

1. Boot (preloader → hero handoff)
2. Statement hero (+ field, role per board)
3. Archive/ledger (indexed, expands in place, hover receipts)
4. Flagship act (Brain Operator deep receipt)
5. Signal (identity: Istanbul → Cyprus → Maastricht; archer discipline)
6. Footer-as-act (field re-expansion + AI-referral + llms.txt)

## Open decisions (Ege)

1. Board pick/mix. 2. Accent. 3. Doorman moment yes/no. 4. Statement-vs-name
hero. 5. Artifact captures. 6. Display face pick from shortlist (after 1).

## Stack

Next.js 14 App Router · vanilla-three-style control of the existing r3f field
(no new r3f surface area) · Lenis · GSAP (ScrollTrigger, SplitText, CustomEase)
· zero paid services.

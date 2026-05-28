# CONCEPT — rowy.engineer (Awwwards-pass)

**Status:** Stage 1 draft (2026-05-29). Scene spine + lifts refined by Stage 2 research → `PATTERNS.md` / `LIFTS.md`.
**Target:** Awwwards SOTM/SOTY-class personal hub for Ege Deniz, "AI-Native Developer."

## Protagonist check

A personal hub is normally **editorial-typography lane** (no single visual object). BUT rowy.engineer already owns a legitimate 3D-cinematic protagonist: the **particle-brain / neural field** in the hero. So this is a **hybrid**: a 3D-cinematic spine (the neural system) carrying editorial-typographic acts (identity, disciplines, work). We do not bolt product-launch patterns onto abstract text — the brain is the through-object.

## Premise / core metaphor

**"The brain is the interface."** The site is not a portfolio page — it's a living AI system you **boot and scroll *through***. The camera travels into the neural field; regions ignite as disciplines and artifacts come online. Ege is the operator; the visitor navigates his operating layer. This ties the existing particle brain, the AI-native identity, and the Brain Operator product line into one idea instead of a stack of sections.

Why this and not generic award-bait: it is the only concept that is *uniquely his*. It cannot be reskinned onto another portfolio.

## Scene spine (draft — 7 acts)

1. **BOOT** — branded loader ≤1.5s; neural field assembles from scattered points. Hero: `EGE DENIZ / AI-Native Developer`, `System.Init()` HUD.
2. **THE OPERATOR** — pinned act, camera pushes into the field; editorial identity statement scrubs in (agent infra + ML, heading to AI Masters). One kinetic-type moment.
3. **DISCIPLINES** — pinned scrubbed act; each discipline (AI Agent Infrastructure / ML Foundations / Spatial Web / Competitive FPS) ignites a region of the brain; layout grammar changes per beat (split → diptych → kinetic numerals).
4. **SIGNATURE ARTIFACT — BRAIN OPERATOR** — centerpiece. The field morphs into Brain Operator's own particle hero (meta: the brain *is* the product). Live preview, modes (Ask/Trace/Evolve/Ship/Pulse). **Gold accent zone.**
5. **THE LAB / SELECTED SYSTEMS** — addressable layers: rowy-operator, spatial-web pieces, ML-from-scratch, SIBA / Akdeniz product builds. Hover-reactive previews.
6. **SIGNAL** — the human layer: live ticker, now-playing, Twitch/Steam, the operator behind the code. Warmer, faster cut.
7. **OPEN CHANNEL (footer-as-act)** — oversized kinetic marquee `rowy.engineer`; contact; the field disperses ("the shell disperses" motif). Credits as finale, not sitemap.

## Design language

- **Dark-dominant** abyss `#030812`.
- **ONE system accent: cyan `#00e5ff`** for all chrome — cursor, CTA, links, progress, focus, active. **Gold `#d4a853` demoted** to the Brain Operator artifact zone + inside imagery only. (Fixes current 2-accents-in-chrome problem.)
- **Type:** Syne (display) / Instrument Serif (editorial italic accent — the "cinematic" treatment) / Space Mono (HUD, labels, **tabular numerals as a signal**) / Inter (body). Evaluate a variable display axis for kinetic moments.
- **Texture:** hairline grid + fine grain (present). AI-native micro-detail: status dots, keyboard hints, terminal/CLI motifs, scramble-on-hover links.
- **Motion:** Linear-grade easing; scroll-pinned scrubbed acts; the camera-through-the-brain spine; magnetic cursor; clip-path/curtain wipes between acts.

## Anti-goals (taste guardrails)

- No luxury ad-agency editorial; no Pentagram/foil cliché.
- No giant-serif-over-fullscreen-video award-bait.
- No 3+ accents competing in chrome.
- No generic gradient/particle decoration; the field must read as a *system*, not a blob.
- No template bento that "looks like the template."
- No scroll-jacking that traps the user; pinned acts must degrade on iOS Safari.

## Stack (current + proposed)

- **Current:** Next.js 14 App Router · React Three Fiber + Three.js 0.169 + `@react-three/postprocessing` + three-stdlib · Framer Motion 11 · Tailwind 3.4 · lucide-react.
- **Proposed additions (pending Stage 2 confirmation):** **Lenis** (smooth-scroll — currently missing; award table-stakes). Evaluate **GSAP + ScrollTrigger** for pinned/scrubbed acts vs. Framer Motion `useScroll`. Keep R3F + postprocessing for the neural field.
- **Ship constraint:** personal-hub blocks direct pushes to `main`; ship via feature branch + PR (pre-push hook runs `next build`).

## See also

- `docs/PATTERNS.md` (Stage 3) · `docs/LIFTS.md` (Stage 3)
- auto-memory: `feedback_awwwards_quality_floor.md`, `feedback_aesthetic_ground_in_observed_taste.md`, `ai-masters-maastricht-identity`

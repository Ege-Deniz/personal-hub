# BUILD-PLAN — rowy.engineer Awwwards rebuild

**Scope:** Full rebuild, go all out (Ege, 2026-05-29). Multi-session, checkpoint after each phase. Refines the spine in `CONCEPT.md` with the research in `PATTERNS.md` / `LIFTS.md`.

## Locked decisions

- **Concept:** "The brain is the interface" — single persistent GPGPU particle-brain canvas that morphs across pinned scroll acts. (Research-validated: it IS the SOTM architecture.)
- **Stack:** keep Next 14 + R3F + Three + `@react-three/postprocessing` + Framer Motion. **Add `gsap` (+ ScrollTrigger) and `lenis`.** Brain = `GPUComputationRenderer` (already in `three-stdlib`). No OGL, no WebGPU for v1.
- **Scroll spine:** Lenis (smooth) → `lenis.on('scroll', ScrollTrigger.update)`, Lenis driven by GSAP ticker. ScrollTrigger owns pin/scrub/snap. Brain reads a shared scroll-progress value into uniforms. Framer Motion = component micro-motion only.
- **Accent:** cyan `#00e5ff` = SOLE system accent (cursor, CTA, links, focus, progress, status). Gold `#d4a853` → Brain Operator zone + imagery only.

## Open decisions (need Ege)

- **TYPE.** Research says dev-award lane = technical neo-grotesque + mono, no editorial serif. Current = Syne / Inter / Space Mono / Instrument Serif. **Recommendation:** migrate to **Geist + Geist Mono** (the literal Vercel/AI-native reference; mono `tabular-nums` for HUD), drop Instrument Serif (or keep for ONE rare accent word). Alternative: keep Syne as the distinctive display face. → decide before Phase 0.
- **Audio.** Optional ambient/boot SFX on user gesture, or zero audio (both award-valid). Default: zero audio for v1.

## Act skeleton (mapped to real content)

| Act | Pin | Mechanic | Content |
|---|---|---|---|
| **0 Boot** | no | loader → brain "powers on," continuous handoff (no cut) | branded loader ≤1.5s |
| **1 The Mind** | ~250vh | canvas-pinned single-stage; scrub morphs brain cloud→pathways→settle | hero + `EGE DENIZ / AI-Native Developer` kinetic split-type |
| **2 The Operator** | ~150vh | pinned, scrubbed kinetic-type beats + oversized numerals | identity: agent infra + ML, AI Masters trajectory |
| **3 Disciplines** | ~300vh | horizontal track inside vertical pin | AI Agent Infrastructure · ML Foundations · Spatial Web · Competitive FPS |
| **4 Brain Operator** | ~200vh | sticky-side diptych, letterbox→full-bleed climax | featured artifact; live preview; CTA → brainoperator.rowy.engineer (gold zone) |
| **5 Selected Systems** | ~150vh | scrubbed bento reveal + project-index catalog, scramble hovers | rowy-operator, spatial pieces, ML-from-scratch, SIBA, Akdeniz |
| **6 Signal** | no | velocity-coupled marquee, slight warm-up | live HUD, now-playing, Twitch/Steam — the human |
| **7 Open Channel** | on entry | footer-as-finale; brain returns + disperses | oversized contact CTA, rowy.engineer surfaces; act-nav rail |

Connective layer: cyan self-drawing neural thread + fixed act dot-nav across 1→7. Global: magnetic cursor, shader wipe between acts, mask-fade edges, blend-mode grain, shine-beam hairlines, Linear easing tokens.

## Phased build (checkpoint after each)

- **Phase 0 — Foundation.** Add `gsap`+`lenis`; Lenis+ScrollTrigger+R3F glue; design tokens (accent discipline, Geist type, easing pair, mask/grain/hairline utilities); magnetic custom cursor. No act rebuild yet. → verify scroll feel + tokens.
- **Phase 1 — The Mind (Act 0+1). ★ centerpiece.** GPGPU brain (structure-sampled home positions, cursor repulsion, curl-noise idle, velocity-keyed bloom via merged EffectComposer); boot loader→hero handoff; kinetic split-type headline; canvas-pinned single-stage scrub. → **hard checkpoint** (verify before continuing — this is what wins or loses).
- **Phase 2 — Acts 2–3.** Operator (pinned kinetic type) + Disciplines (horizontal-in-pin). Oryzo shader-wipe act transitions. → checkpoint.
- **Phase 3 — Acts 4–5.** Brain Operator diptych + Selected Systems (project index-as-catalog with real metrics, scrubbed bento, scramble hovers, velocity-skew). → checkpoint.
- **Phase 4 — Acts 6–7.** Signal marquee + Contact footer-finale (brain disperses) + act-nav rail / neural thread. → checkpoint.
- **Phase 5 — Polish + pre-flight.** Perf (defer canvas `dynamic ssr:false`, static poster LCP, DPR `[1,1.5]`, frameloop demand + IntersectionObserver gating); mobile pin degradation (`svh`/`dvh`, `matchMedia` collapse, `ScrollTrigger.refresh()` after assets); green the 12-item checklist; run Stage 7 critique-agent loop (rebuild on architectural feedback, not polish). → final checkpoint → feature branch + PR (`next build` pre-push hook).

## Verification (every phase)
Live preview (`rowy-dev`): snapshot for content, screenshot desktop+mobile, console clean, `preview_inspect` for layout/perf. Real iPhone check for pinned acts before PR (per portfolio visual-verification rule). Never report a phase done without browser proof.

## Risks
- **Perf under fullscreen GPGPU + postprocessing** → DPR cap, high bloom threshold, demand frameloop, deferred canvas.
- **iOS Safari pin breakage** → svh/dvh, ignoreMobileResize, matchMedia pin-disable on small screens.
- **Scope (1500vh of acts)** → each pin must earn its length with a structural beat change; cut pins that don't transform.

## See also
`docs/CONCEPT.md` · `docs/PATTERNS.md` · `docs/LIFTS.md` · auto-memory `feedback_awwwards_quality_floor`, `feedback_portfolio_visual_verification`, `feedback_aesthetic_ground_in_observed_taste`

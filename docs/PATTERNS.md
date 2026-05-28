# PATTERNS — Awwwards SOTM/SOTY pattern catalog (rowy.engineer)

Built from 5 parallel bundle-verified research passes (2026-05-29): dev portfolios, 3D/WebGL, current SOTD/SOTM census, AI/dev-tool product axis, agency scroll-architecture. Tech claims here are bundle-confirmed unless flagged.

## 12 recurring patterns at award tier

1. **Single persistent canvas, many states** — one WebGL canvas pins; scroll drives *uniforms/camera/morph*, never remounts. (Oryzo 7.86, Messenger 7.92, Exo Ape, Lusion.) → our particle-brain spine.
2. **Pinned + scroll-scrubbed acts, layout changes per beat** — section pins N viewports; GSAP timeline crossfades through *structurally different* layouts (full-bleed → split → numeral), not the same layout fading. (Cuberto, Epic, Terminal Industries.)
3. **Single-uniform shader wipe transition** — noise mask + displacement warp + chromatic aberration, all bridged by ONE 0→1 GSAP-tweened uniform. The signature 2026 cut. (Oryzo; Codrops portfolio breakdown.)
4. **Cursor-velocity flowmap distortion** on type/media (RGB sampled at different magnitudes). (Codrops; makemepulse.)
5. **Scramble / character-resolve text reveal** (pre-scrambled to prevent reflow), often paired with a clip-path wipe. (Cuberto signature; multiple portfolios.)
6. **Self-drawing thread** — an SVG/line that draws across the page on scroll as a nav/connective gesture. (MindMarket 7.85.)
7. **Footer-as-finale (WebGL beat, not sitemap)** — oversized CTA, a final canvas moment, loader logo returns; scroll *resolves*. (Oryzo, Darkroom, Exo Ape.)
8. **Horizontal-scroll act inside a vertical pin** — vertical input remapped to `xPercent` of a wide track. (Durimel, Lusion, Fix Studio.)
9. **Oversized kinetic numerals / section indices** — huge `01/02/03` parallax or count-up per act. (Garden Eight, Cuberto.)
10. **Velocity-coupled marquee** — looping ticker whose speed/direction couples to `lenis.velocity`. (Darkroom, Cuberto.)
11. **Magnetic custom cursor + scramble link hovers** — DOM/WebGL cursor distorts/magnetizes near interactive els. (Cuberto, Active Theory.)
12. **Velocity skew/scale on media** — `skewY ~ scroll velocity` (clamped) for "film" weight. (Exo Ape, Locomotive.)

## 5 layout grammars (per-beat building blocks)

1. **Canvas-pinned stage** (sticky full-bleed WebGL, content overlays scrub in/out).
2. **Split / diptych** (pinned title column + scrolling content column; or 50/50 media|text).
3. **Letterbox → full-bleed** (centered media with aspect bars that expand on scroll).
4. **Horizontal track** (wide row of full-height panels, vertical→horizontal remap).
5. **Kinetic-numeral chapter stamp** (oversized index + large left-aligned statement).

## Material + type + color signatures

- **Merged postprocessing pass** — bloom + chromatic aberration + grain + vignette in ONE fullscreen pass (`@react-three/postprocessing` `<EffectComposer>`), not stacked composers. Bloom threshold HIGH so only bright cores glow.
- **GPGPU particle sim** — position+velocity in float textures via `GPUComputationRenderer` (in `three-stdlib`); 256² texture = 65k particles in one cheap fragment pass.
- **Additive point sprites** — `gl_PointSize = uSize / -mvPosition.z`, circular discard, additive blend, `depthTest:false` → "energy field," not dots.
- **Mask-fade edges** (Linear) — `mask-image: linear-gradient(...)` dissolves sections/canvas into the field instead of hard borders.
- **Shine-beam hairline** (Linear) — `radial-gradient(ellipse ...)` traveling highlight on card/button edges; the "lit hairline."
- **Blend-mode grain** (Resend) — tiling noise at low opacity, `mix-blend-mode: overlay`; resolution-independent, keeps navy true.
- **Type:** technical neo-grotesque + mono; dev-award lane avoids editorial serif. Geist/Inter/Helvetica-Now class. **Mono always `tabular-nums`** for HUD/metrics/coords. (Vercel = Geist+GeistMono; Clerk ships a numbers-only variable font.)
- **Color:** dark-dominant; ONE system accent on all interactive chrome; second color only inside imagery/data-viz.
- **Easing:** Linear pair — `cubic-bezier(0.25,0.46,0.45,0.94)` entrances, `cubic-bezier(1,0,0,1)` instant-then-settle toggles. Material `(0.4,0,0.2,1)` workhorse. Overshoot reserved for rare delight.

## Pre-flight checklist (must be green to ship)

1. ⬜ Magnetic custom cursor (or deliberate zero-cursor)
2. ⬜ Smooth-scroll layer (Lenis), synced to GSAP ticker
3. ⬜ Branded loading sequence ≤1.5s, real-asset-gated, continuous handoff to hero
4. ⬜ Neo-grotesque + mono type system; tabular numerals in chrome
5. ⬜ ≥1 kinetic typography moment
6. ⬜ ≥1 scroll-pinned act with scrubbed timeline (structural layout change per beat)
7. ⬜ WebGL surface = the GPGPU particle brain (single persistent canvas, state morph)
8. ⬜ Cyan used as the SOLE system accent; gold demoted to artifact/imagery
9. ⬜ Footer as act, not sitemap
10. ⬜ Mobile parity: pins degrade gracefully on iOS Safari (`svh`/`dvh`, matchMedia)
11. ⬜ LCP ≤2.5s (deferred canvas, static poster) and CLS <0.1
12. ⬜ Soundtrack only on user gesture (or zero audio)

## Anti-patterns (verified, do NOT ship)

- **Two chrome accents** (current cyan+gold) — textbook rainbow-UI; pick one.
- **Glassmorphism as the primary surface** — overused; demote to rare low-opacity HUD accent, depth from blur+1px border, NOT glow.
- **Over-glow / neon bloom halos** on every card — reads "template," not "Linear."
- **Default particle sphere / generic gradient dots** — structure (sampled from a real graph) + reactivity is what separates "neural field" from decoration.
- **Giant-serif-over-fullscreen-video** editorial award-bait — wrong axis.
- **Spring-everything + fake-AI sparkle** — deterministic cubic-beziers; spend spectacle on the brain, keep the rest restrained.
- **Explorable 3D game-room** (Bruno Simon / Samsy rooms) — reads playful creative-coder, not precise AI engineer.
- **Eager canvas as LCP** / 5s loader gate — defer canvas, static poster, instant light content.
- **Hard scroll-jacking** (forced dwell/full-page snap that traps) — accessibility + jury rejection trigger.
- **Over-pinning** — every act pinned 300vh with little change = "image after image" fatigue; each pin earns its length with a structural beat change.

## See also
`docs/CONCEPT.md` · `docs/LIFTS.md` · `docs/BUILD-PLAN.md`

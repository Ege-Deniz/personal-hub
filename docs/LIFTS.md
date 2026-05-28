# LIFTS — what we steal, from where, and what we change (rowy.engineer)

Top lift targets from the 2026-05-29 research, each adapted to the dark AI-native system (#030812 + cyan #00e5ff, gold→artifact only). "Lift the technique, change the skin."

## Top 5 lifts

### 1. Oryzo — single-uniform shader wipe `oryzo.ai` (SOTM, 7.86)
- **Lift:** the act-to-act transition — one `0→1` GSAP-tweened uniform driving noise mask + displacement warp + chromatic aberration simultaneously.
- **Change:** recolor to navy→cyan; trigger it on each ScrollTrigger act boundary instead of route changes. This is THE signature move; high craft, restrained, not editorial.
- **Where it lands:** transitions between ACT 1↔2↔3 (and the brain↔artifact handoff).

### 2. Codrops GPGPU "Dreamy Particle" — the brain blueprint `tympanus.net/codrops/2024/12/19/...`
- **Lift:** `GPUComputationRenderer` position+velocity sim — `velocity *= damping` + pull toward home positions + cursor repulsion; velocity-keyed bloom; curl-noise idle advection.
- **Change:** home positions sampled from a **neural/graph structure** (not a generic mesh) so it reads as a *system*; cursor = "thought disturbing the field," self-heals; idle curl-noise = the brain "thinking." Cyan additive points on #030812.
- **Where:** ACT 0/1 the particle-brain hero (single persistent canvas). On our exact stack (`three-stdlib` + `@react-three/postprocessing`) — near line-for-line.

### 3. julienrenau — project index-as-catalog `julienrenau.com` (21 Awwwards)
- **Lift:** work presented as a typographic catalog — `identifier · title · client · [tech tags] · hard metric` — plus an aggregate credibility ledger.
- **Change:** `01 BRAIN OPERATOR · AI agent infra · [Next · LangGraph · RAG] · live` with **real engineering metrics** (latency, model, throughput) as the "file-size" equivalent. Lands "AI-Native Developer" far harder than prose. Feeds both the Disciplines act and Selected Work.
- **Where:** ACT 3 (Disciplines) + ACT 5 (Selected Work).

### 4. Linear — the craft kit `linear.app` (all CSS-cheap, bundle-confirmed)
- **Lift:** (a) mask-fade section/canvas edges `mask-image: linear-gradient(...)`; (b) the easing pair `[0.25,0.46,0.45,0.94]` + `[1,0,0,1]`; (c) shine-beam hairline `radial-gradient(ellipse...)` on cards; (d) tabular-num mono for all chrome numerics; (e) blend-mode grain.
- **Change:** apply as global tokens. The brain's bottom edge mask-fades into navy instead of ending on a hard canvas line. Replaces our cyan glow-on-everything with lit hairlines.
- **Where:** global (cursor, cards, HUD, act edges).

### 5. MindMarket — self-drawing thread `awwwards.com/sites/mindmarket` (7.85)
- **Lift:** an SVG line that draws across the page on scroll as a nav/connective gesture.
- **Change:** a cyan **neural/circuit trace** connecting the brain hero to project nodes — reads as a data pathway, on-concept for "AI-native," not decoration. Doubles as the dot-nav spine.
- **Where:** connective layer across ACT 1→7; the fixed act-nav rail.

## Secondary lifts (apply opportunistically)

- **stefanvitasovic.dev** (SOTD+Dev 8.04) — kinetic split-type hero (name/role split-by-char, masked, x-offset reveal) over the dim brain field. → ACT 1 headline.
- **Cuberto** `cuberto.com` — scramble/decode link hovers + magnetic cursor. → global nav + cursor.
- **Exo Ape** `exoape.com` — velocity-skew on media + clip-path scene wipes. → ACT 5 tiles, act boundaries.
- **Live-HUD telemetry** (from julienrenau live clock) — show agent status / commit hash / FPS / local time as load-bearing HUD content. → persistent HUD.
- **Anderson Mancini** `andersonmancini.dev` — proof the R3F + postprocessing stack wins SOTD; reference implementation for merged EffectComposer.

## Stack-fork warnings (do NOT lift directly)

- **OGL refraction** (dorianlods.fr, AIR) — OGL stack; on R3F substitute drei `MeshTransmissionMaterial`. Don't introduce OGL alongside R3F.
- **WebGPURenderer** (samsy.ninja) — emerging top-tier flex but premature for v1; revisit post-launch.
- **Explorable 3D rooms** (Bruno Simon, Samsy) — wrong identity (playful, not precise-engineer). Lift their *rigor*, not the room UX.

## Build-tech reality (bundle-verified consensus)
Award scroll grammar = **GSAP ScrollTrigger + Lenis + WebGL**, near-universal. Keep **R3F + Three + @react-three/postprocessing** (award-proven). Add `gsap` + `lenis`. Keep Framer Motion for component micro-motion only. GPGPU via `GPUComputationRenderer` (already in `three-stdlib`).

## See also
`docs/CONCEPT.md` · `docs/PATTERNS.md` · `docs/BUILD-PLAN.md`

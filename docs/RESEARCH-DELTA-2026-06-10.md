# RESEARCH DELTA — 2026-06-10 (mid-build refresh)

Fresh research run against the locked plan, executed the night the act spine
shipped (PR #7). Two of four lenses completed before the host session
restarted (census + AI-craft lenses lost; re-run if needed). Findings below
are from the completed lenses: dev/AI-portfolio landscape and
implementation technique.

## Verdict on the locked plan

The build direction holds. The technique lens validated the engine's choices
almost line-for-line (frame-rate-independent damping via `pow(damp, dt*60)`,
dt clamp 1/30, pointer-speed-scaled repulsion, per-particle size variance,
`multisampling={0}`, `mipmapBlur`, Lenis→ScrollTrigger via single GSAP ticker
with `lagSmoothing(0)`, no `normalizeScroll`, body-scroller `pinType: fixed`).
One production gap found and fixed same night: **iOS cannot render to
full-float GPGPU targets** (three.js #9628/#19837) → `setDataType(HalfFloatType)`
on Apple touch devices / missing `EXT_color_buffer_float`.

## Portfolio landscape (mid-2026, completed lens)

- **stefanvitasovic.dev** — typographic motion entrance, no 3D world; credibility = 14islands + Awwwards jury seat.
- **julienrenau.com** — lettered project list with per-project award badges + bundle-size metric; credibility = award ledger (21 Awwwards / 20 FWA) + agency timeline.
- **andersonmancini.dev** — center of gravity moved OFF the site: open-source starters (`ektogamat`), YouTube teaching, viral X recreations of platform trends. Site is the storefront.
- **bruno-simon.com** — 2025 WebGPU rebuild (SOTM Jan 2026); ships full MIT source + devlogs + course. Radical transparency as funnel.
- New winners: pacomepertant.com (SOTD Jun 2026, original audio as material), samsy.ninja (WebGPU city, 120fps), juanmora.co (SOTD May 2026). Rising trend: "chat with my portfolio" RAG chatbots.
- **Key fact: no AI-engineer portfolio won a major web award in 2026.** AI-engineer credibility lives on GitHub/blogs/X; award sites are the creative-dev game. rowy.engineer playing BOTH lanes (award-grade craft + real agent artifacts) is an open niche.

## Recruiter layer — the content roadmap (highest-leverage next moves)

These are content moves, independent of tonight's visual build:

1. **Published evals are the #1 hiring signal.** Eval suites in the repo (golden datasets, LLM-as-judge rubrics, retrieval metrics) + one story of a production failure the eval caught. A published domain benchmark is the single highest-signal artifact — people get recruited off benchmarks.
2. **Numbers on every claim.** Latency, accuracy with methodology, throughput, cost. "Implemented RAG" without a retrieval metric is a screener red flag. The Selected Systems catalog should grow real metrics per project as they exist — never fabricated.
3. **Cost engineering is portfolio content.** Per-task cost, model-routing logic, prompt-cache breakeven math. Zero cost discussion reads as "lab, not production."
4. **Clickable beats readable.** Live demos / runnable repos get ~80% more engagement; demo video in every README; traces (LangSmith-style) and failure logs read as senior.
5. **Transparency as distribution (Bruno Simon pattern).** Open-source the portfolio engine itself (NeuralField + act spine as an MIT starter?), devlog the build, write up the eval/cost analyses. Honest "limitations" sections outperform hype.

## Applied tonight

- iOS half-float GPGPU fallback (NeuralField.tsx) — real-device iPhone check still required before merge, per the visual-verification rule.

## Deferred (cheap, high-value, not tonight)

- DPR-aware `gl_PointSize` resolution factor (`uResolution.y/1080 * dpr`) if adaptive DPR is ever added.
- `PerformanceMonitor` + `performance.regress()` wired to Lenis scroll for auto-DPR.
- Re-run the lost census/craft lenses + adversarial critique against the SHIPPED site (not the plan) before submitting to Awwwards.

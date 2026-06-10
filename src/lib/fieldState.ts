// Shared act-timeline signal between the DOM scroll acts and the WebGL field.
// Each act's ScrollTrigger writes its local 0..1 progress into `acts[i]`;
// the canvas derives a continuous act timeline by summing clamped progresses
// (acts are sequential, so during act k: acts[<k]=1, acts[k]=local, acts[>k]=0).
// Module singleton avoids R3F context-bridge issues — same pattern as scrollState.
export const fieldState = {
  /** 0→1 boot assembly, tweened by the page when the loader completes */
  boot: 0,
  /** per-act local scroll progress, index 1..7 (0 unused) */
  acts: [0, 0, 0, 0, 0, 0, 0, 0] as number[],
};

/** Continuous act timeline: k-1..k while act k scrubs. */
export function actTimeline(): number {
  let t = 0;
  for (let i = 1; i < fieldState.acts.length; i++) {
    const p = fieldState.acts[i];
    t += p > 1 ? 1 : p < 0 ? 0 : p;
  }
  return t;
}

// ScrollTrigger onUpdate can latch stale progress when a refresh lands while
// Lenis is mid-lerp (onUpdate only fires on change). Acts therefore register
// their measured trigger ranges here, and the canvas recomputes progress from
// absolute scroll every frame — deterministic, immune to scrub transients.
export type ActRange = { start: number; end: number };
export const actRanges: (ActRange | null)[] = [
  null, null, null, null, null, null, null, null,
];

/** Recompute every act's progress from absolute scroll. Called per frame. */
export function syncActs(scroll: number) {
  for (let i = 1; i < actRanges.length; i++) {
    const r = actRanges[i];
    if (!r) continue;
    const span = r.end - r.start;
    if (span <= 0) continue;
    const p = (scroll - r.start) / span;
    fieldState.acts[i] = p < 0 ? 0 : p > 1 ? 1 : p;
  }
}

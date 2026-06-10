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

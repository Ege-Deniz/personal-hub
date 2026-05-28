// Shared scroll signal — mutated by the Lenis provider, read inside R3F useFrame
// and DOM components. Module singleton avoids R3F context-bridge issues.
export const scrollState = {
  /** 0..1 normalized document scroll progress */
  progress: 0,
  /** instantaneous scroll velocity from Lenis */
  velocity: 0,
};

// When using @remotion/transitions' TransitionSeries, each transition
// overlaps its two neighboring sequences, which shrinks the total timeline
// by the transition's length at every junction — meaning later scenes land
// *earlier* than their true narration-derived frame unless compensated.
//
// The fix: inflate every sequence's duration (except the last) by exactly
// the following transition's length. The inflation and the overlap-subtraction
// cancel out at every junction, so absolute cut positions land exactly where
// the real audio timing says they should — see scripts/render.mjs / the
// treatment's `timings` prop for where those absolute positions come from.
export function compensateForTransitions(naturalDurations: number[], transitionLength: number): number[] {
  return naturalDurations.map((d, i) => (i === naturalDurations.length - 1 ? d : d + transitionLength));
}

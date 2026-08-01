import type { ComparisonTreatmentProps } from "./schema";

// Every comparison style skill (skills/scenepipe-comparison-<style>/component.tsx)
// exports one component matching this shape. index.tsx computes `durations`
// once (shared timing math via compensateForTransitions) and picks which
// style's component to render — the style itself owns everything visual,
// including its own <TransitionSeries> wiring.
export type ComparisonScenesProps = {
  content: ComparisonTreatmentProps;
  durations: number[]; // [coldOpen, hook, conceptA, limitation, conceptB, analogy, closer, outro], transition-compensated
  transitionLength: number;
};

import type { WeatherReportTreatmentProps } from "./schema";

// Every weather-report style skill (skills/scenepipe-weather-report-<style>/component.tsx)
// exports one component matching this shape — same pattern as the
// comparison treatment's styleTypes.ts.
export type WeatherScenesProps = {
  content: WeatherReportTreatmentProps;
  durations: number[]; // [coldOpen, intro, current, forecast, closing, outro], transition-compensated
  transitionLength: number;
};

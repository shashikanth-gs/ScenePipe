import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../../src/theme";

const COMPASS_DEGREES: Record<string, number> = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315,
};

export const SunIcon: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, 300], [0, 60], {
    extrapolateLeft: "extend",
    extrapolateRight: "extend",
  });

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.highlight} stopOpacity="1" />
          <stop offset="100%" stopColor={COLORS.highlight} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="46" fill="url(#sunGlow)" opacity="0.5" />
      <g style={{ rotate: `${rotation}deg`, transformOrigin: "50px 50px" }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8;
          return (
            <line
              key={i}
              x1="50"
              y1="14"
              x2="50"
              y2="4"
              stroke={COLORS.highlight}
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${angle} 50 50)`}
            />
          );
        })}
      </g>
      <circle cx="50" cy="50" r="22" fill={COLORS.highlight} />
    </svg>
  );
};

export const CloudIcon: React.FC<{ size: number; tone?: "light" | "dark" }> = ({ size, tone = "light" }) => {
  const frame = useCurrentFrame();
  const bob = interpolate(frame % 90, [0, 45, 90], [0, -4, 0], {
    easing: Easing.inOut(Easing.ease),
  });
  const fill = tone === "light" ? COLORS.text : COLORS.dim;

  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 100 70"
      style={{ translate: `0px ${bob}px` }}
    >
      <ellipse cx="35" cy="45" rx="26" ry="20" fill={fill} opacity="0.92" />
      <ellipse cx="60" cy="38" rx="30" ry="24" fill={fill} opacity="0.92" />
      <ellipse cx="80" cy="48" rx="20" ry="16" fill={fill} opacity="0.92" />
      <rect x="20" y="45" width="70" height="20" rx="10" fill={fill} opacity="0.92" />
    </svg>
  );
};

export const PartlyCloudyIcon: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ position: "relative", width: size, height: size }}>
    <div style={{ position: "absolute", top: 0, right: 0 }}>
      <SunIcon size={size * 0.62} />
    </div>
    <div style={{ position: "absolute", bottom: 0, left: 0 }}>
      <CloudIcon size={size * 0.8} tone="light" />
    </div>
  </div>
);

export const RainIcon: React.FC<{ size: number }> = ({ size }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <CloudIcon size={size * 0.85} tone="dark" />
      <svg
        width={size}
        height={size * 0.5}
        viewBox="0 0 100 50"
        style={{ position: "absolute", top: size * 0.5, left: 0 }}
      >
        {[18, 40, 62, 84].map((x, i) => {
          const cycle = 40;
          const local = (frame + i * 10) % cycle;
          const y = interpolate(local, [0, cycle], [0, 40], { extrapolateRight: "clamp" });
          const opacity = interpolate(local, [0, 8, cycle - 8, cycle], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return (
            <line
              key={x}
              x1={x}
              y1={y}
              x2={x - 4}
              y2={y + 12}
              stroke={COLORS.primary}
              strokeWidth="4"
              strokeLinecap="round"
              opacity={opacity}
            />
          );
        })}
      </svg>
    </div>
  );
};

export const WindIcon: React.FC<{ size: number; directionDeg: number }> = ({ size, directionDeg }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <g opacity="0.5">
      <path d="M20 40 H60" stroke={COLORS.dim} strokeWidth="5" strokeLinecap="round" />
      <path d="M20 55 H50" stroke={COLORS.dim} strokeWidth="5" strokeLinecap="round" />
    </g>
    <g transform={`rotate(${directionDeg} 50 50)`}>
      <path
        d="M50 20 L68 55 L50 46 L32 55 Z"
        fill={COLORS.primary}
      />
    </g>
  </svg>
);

export const HumidityIcon: React.FC<{ size: number; percent: number }> = ({ size, percent }) => {
  const fillHeight = (percent / 100) * 70;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <clipPath id="dropClip">
          <path d="M50 8 C50 8 20 48 20 68 A30 30 0 0 0 80 68 C80 48 50 8 50 8 Z" />
        </clipPath>
      </defs>
      <path
        d="M50 8 C50 8 20 48 20 68 A30 30 0 0 0 80 68 C80 48 50 8 50 8 Z"
        fill="none"
        stroke={COLORS.primary}
        strokeWidth="4"
      />
      <rect
        x="15"
        y={98 - fillHeight}
        width="70"
        height={fillHeight}
        fill={COLORS.primary}
        opacity="0.75"
        clipPath="url(#dropClip)"
      />
    </svg>
  );
};

export function compassToDegrees(direction: string): number {
  return COMPASS_DEGREES[direction.toUpperCase()] ?? 0;
}

export type ConditionCategory = "sunny" | "partly-cloudy" | "cloudy" | "rainy";

export const ConditionIcon: React.FC<{ category: ConditionCategory; size: number }> = ({ category, size }) => {
  switch (category) {
    case "sunny":
      return <SunIcon size={size} />;
    case "cloudy":
      return <CloudIcon size={size} tone="light" />;
    case "rainy":
      return <RainIcon size={size} />;
    case "partly-cloudy":
    default:
      return <PartlyCloudyIcon size={size} />;
  }
};

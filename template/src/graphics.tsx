import { Easing, interpolate, useCurrentFrame } from "remotion";

// Generated vector graphics — no emoji, no stock imagery. Every color comes
// in as a prop (usually from brand-kit.json's tokens), so these are reusable
// across brands and across treatments.

/** A cluster of connected nodes with a slow pulse — represents "a system thinking". */
export const NodeNetwork: React.FC<{ width: number; height: number; color: string; drawFrames?: number }> = ({
  width,
  height,
  color,
  drawFrames = 30,
}) => {
  const frame = useCurrentFrame();
  const nodes = [
    { x: width * 0.5, y: height * 0.15 },
    { x: width * 0.15, y: height * 0.45 },
    { x: width * 0.85, y: height * 0.4 },
    { x: width * 0.3, y: height * 0.8 },
    { x: width * 0.75, y: height * 0.85 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 4],
    [1, 2],
    [3, 4],
  ];

  const draw = interpolate(frame, [0, drawFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {edges.map(([a, b], i) => {
        const n1 = nodes[a];
        const n2 = nodes[b];
        const length = Math.hypot(n2.x - n1.x, n2.y - n1.y);
        return (
          <line
            key={i}
            x1={n1.x}
            y1={n1.y}
            x2={n2.x}
            y2={n2.y}
            stroke={color}
            strokeWidth={2}
            strokeOpacity={0.55}
            strokeDasharray={length}
            strokeDashoffset={length * (1 - draw)}
          />
        );
      })}
      {nodes.map((n, i) => {
        const pulse = interpolate((frame + i * 14) % 90, [0, 45, 90], [0.85, 1.15, 0.85], {
          easing: Easing.inOut(Easing.ease),
        });
        const nodeOpacity = interpolate(frame, [i * 4, i * 4 + 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return <circle key={i} cx={n.x} cy={n.y} r={(i === 0 ? 10 : 6) * pulse} fill={color} opacity={nodeOpacity} />;
      })}
    </svg>
  );
};

/** A line traveling right, stopped by a hard barrier — represents a hard limitation. */
export const BlockedPath: React.FC<{ width: number; height: number; color: string; accent: string }> = ({
  width,
  height,
  color,
  accent,
}) => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame, [0, 40], [0, width * 0.62], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const shake = interpolate(frame % 26, [0, 3, 6, 26], [0, -6, 0, 0], { extrapolateRight: "clamp" });
  const barrierX = width * 0.68;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <line x1={0} y1={height * 0.5} x2={travel} y2={height * 0.5} stroke={color} strokeWidth={4} strokeOpacity={0.7} />
      <circle cx={Math.min(travel, barrierX) + (travel >= barrierX ? shake : 0)} cy={height * 0.5} r={10} fill={color} />
      <line
        x1={barrierX}
        y1={height * 0.5 - 60}
        x2={barrierX}
        y2={height * 0.5 + 60}
        stroke={accent}
        strokeWidth={8}
        strokeLinecap="round"
        opacity={interpolate(frame, [8, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </svg>
  );
};

/** Three nodes in a loop with a traveling pulse — represents act / check / retry. */
export const LoopDiagram: React.FC<{ width: number; height: number; color: string }> = ({ width, height, color }) => {
  const frame = useCurrentFrame();
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) * 0.38;
  const angleFor = (t: number) => -Math.PI / 2 + t * Math.PI * 2;
  const points = [0, 1 / 3, 2 / 3].map((t) => ({ x: cx + r * Math.cos(angleFor(t)), y: cy + r * Math.sin(angleFor(t)) }));

  const travelT = (frame / 90) % 1;
  const travelAngle = angleFor(travelT);
  const dotX = cx + r * Math.cos(travelAngle);
  const dotY = cy + r * Math.sin(travelAngle);

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={2} strokeDasharray="6 10" opacity={0.5} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={9} fill={color} opacity={0.9} />
      ))}
      <circle cx={dotX} cy={dotY} r={13} fill={color} />
    </svg>
  );
};

/** A dashed connector path drawing on between two fixed points. */
export const Connector: React.FC<{ x1: number; y1: number; x2: number; y2: number; color: string; delay?: number }> = ({
  x1,
  y1,
  x2,
  y2,
  color,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [delay, delay + 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={3}
        strokeDasharray="8 8"
        opacity={0.8}
        style={{ strokeDashoffset: 16 * (1 - draw) - frame * 0.4 }}
      />
    </svg>
  );
};

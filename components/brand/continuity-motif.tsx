type ContinuityStage = {
  label: string;
  number: string;
};

type ContinuityMotifProps = {
  stages: ContinuityStage[];
  spanLabels?: string[];
  caption?: string;
  className?: string;
  /** Larger editorial treatment for landing / delivery pages. */
  variant?: "compact" | "editorial";
};

/** Static continuity motif with optional spanning responsibility markers. */
export function ContinuityMotif({
  stages,
  spanLabels = [],
  caption,
  className,
  variant = "compact",
}: ContinuityMotifProps) {
  const aria =
    caption ??
    `${stages.map((s) => s.label).join(" → ")}${
      spanLabels.length ? `. ${spanLabels.join(", ")}` : ""
    }`;

  const height = variant === "editorial" ? 220 : 148;
  const stageY = variant === "editorial" ? 88 : 52;
  const labelY = variant === "editorial" ? 140 : 100;
  const spanY = variant === "editorial" ? 180 : 122;
  const spanLabelY = variant === "editorial" ? 204 : 140;

  return (
    <figure className={className}>
      <div className="overflow-hidden border border-line bg-surface">
        <svg
          viewBox={`0 0 960 ${height}`}
          role="img"
          aria-label={aria}
          className="h-auto w-full"
        >
          <title>{aria}</title>
          <rect width="960" height={height} fill="#f7f9f8" />
          <rect width="960" height={height} fill="url(#motifGrid)" opacity="0.5" />
          <defs>
            <pattern id="motifGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path
                d="M32 0H0V32"
                fill="none"
                stroke="#d7e1e5"
                strokeWidth="1"
              />
            </pattern>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
            </marker>
          </defs>

          <line
            x1="40"
            y1={stageY}
            x2="776"
            y2={stageY}
            stroke="#bceaf2"
            strokeWidth="4"
            className="continuity-line"
          />

          {stages.map((stage, index) => {
            const x = 40 + index * 184;
            const nextX = x + 184;
            return (
              <g key={stage.number}>
                <circle
                  cx={x}
                  cy={stageY}
                  r={variant === "editorial" ? 26 : 22}
                  fill="#004869"
                  stroke="#003347"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={stageY + 5}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="14"
                  fontFamily="var(--font-ubuntu), sans-serif"
                  fontWeight="700"
                >
                  {stage.number}
                </text>
                <text
                  x={x}
                  y={labelY}
                  textAnchor="middle"
                  fill="#0b1820"
                  fontSize={variant === "editorial" ? 14 : 13}
                  fontFamily="var(--font-source-sans), sans-serif"
                  fontWeight="600"
                >
                  {stage.label}
                </text>
                {index < stages.length - 1 ? (
                  <path
                    d={`M ${x + 30} ${stageY} H ${nextX - 30}`}
                    stroke="#d7e1e5"
                    strokeWidth="2"
                    markerEnd="url(#arrow)"
                  />
                ) : null}
              </g>
            );
          })}
          {spanLabels.length > 0 ? (
            <g>
              <line
                x1="40"
                y1={spanY}
                x2="776"
                y2={spanY}
                stroke="#004869"
                strokeOpacity="0.25"
                strokeWidth="2"
              />
              {spanLabels.map((label, index) => {
                const x = 40 + (index * 736) / Math.max(spanLabels.length - 1, 1);
                return (
                  <text
                    key={label}
                    x={x}
                    y={spanLabelY}
                    textAnchor={
                      index === 0
                        ? "start"
                        : index === spanLabels.length - 1
                          ? "end"
                          : "middle"
                    }
                    fill="#334b58"
                    fontSize="12"
                    fontFamily="var(--font-source-sans), sans-serif"
                    fontWeight="600"
                  >
                    {label}
                  </text>
                );
              })}
            </g>
          ) : null}
        </svg>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm text-ink-500">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

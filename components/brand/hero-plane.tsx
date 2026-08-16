/**
 * Full-bleed institutional hero plane: need → commitment → delivery → follow-up → stewardship.
 * Static SVG composition — no stock imagery.
 */
export function HeroPlane({
  title,
  stages,
  spanLabels,
}: {
  title: string;
  stages: string[];
  spanLabels: string[];
}) {
  const [s1, s2, s3, s4, s5] = stages;
  const [a1, a2, a3] = spanLabels;

  return (
    <svg
      viewBox="0 0 1440 520"
      className="h-auto w-full"
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid slice"
    >
      <title>{title}</title>
      <defs>
        <linearGradient id="heroField" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#003347" />
          <stop offset="55%" stopColor="#004869" />
          <stop offset="100%" stopColor="#0a4a63" />
        </linearGradient>
        <linearGradient id="heroSignal" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#bceaf2" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#bceaf2" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#bceaf2" stopOpacity="0.15" />
        </linearGradient>
        <pattern id="heroGrid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path
            d="M48 0H0V48"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.05"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect width="1440" height="520" fill="url(#heroField)" />
      <rect width="1440" height="520" fill="url(#heroGrid)" />
      <rect x="0" y="210" width="1440" height="48" fill="url(#heroSignal)" />

      {/* Continuity spine */}
      <line
        x1="96"
        y1="234"
        x2="1344"
        y2="234"
        stroke="#bceaf2"
        strokeWidth="3"
        className="continuity-line"
      />

      {[
        { x: 160, label: s1, n: "01" },
        { x: 420, label: s2, n: "02" },
        { x: 720, label: s3, n: "03" },
        { x: 1020, label: s4, n: "04" },
        { x: 1280, label: s5, n: "05" },
      ].map((node, index, arr) => (
        <g key={node.n}>
          {index < arr.length - 1 ? (
            <line
              x1={node.x + 36}
              y1="234"
              x2={arr[index + 1].x - 36}
              y2="234"
              stroke="#ffffff"
              strokeOpacity="0.28"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
          ) : null}
          <circle
            cx={node.x}
            cy="234"
            r="28"
            fill="#f7f9f8"
            stroke="#bceaf2"
            strokeWidth="2"
          />
          <text
            x={node.x}
            y="239"
            textAnchor="middle"
            fill="#003347"
            fontSize="13"
            fontWeight="700"
            fontFamily="var(--font-ubuntu), sans-serif"
          >
            {node.n}
          </text>
          <text
            x={node.x}
            y="292"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="15"
            fontWeight="600"
            fontFamily="var(--font-source-sans), sans-serif"
          >
            {node.label}
          </text>
        </g>
      ))}

      {/* Span markers */}
      <g fill="#bceaf2" fontSize="13" fontWeight="600" fontFamily="var(--font-source-sans), sans-serif">
        <text x="160" y="360">{a1}</text>
        <text x="720" y="360" textAnchor="middle">
          {a2}
        </text>
        <text x="1280" y="360" textAnchor="end">
          {a3}
        </text>
      </g>
      <line x1="160" y1="340" x2="1280" y2="340" stroke="#bceaf2" strokeOpacity="0.45" strokeWidth="1" />

      {/* Editorial corner marks */}
      <path d="M64 64h48M64 64v48" stroke="#bceaf2" strokeOpacity="0.5" strokeWidth="1.5" />
      <path d="M1376 64h-48M1376 64v48" stroke="#bceaf2" strokeOpacity="0.5" strokeWidth="1.5" />
      <path d="M64 456h48M64 456v-48" stroke="#bceaf2" strokeOpacity="0.5" strokeWidth="1.5" />
      <path d="M1376 456h-48M1376 456v-48" stroke="#bceaf2" strokeOpacity="0.5" strokeWidth="1.5" />
    </svg>
  );
}

import { cn } from "@/lib/utils";

type VisualPanelProps = {
  className?: string;
  title: string;
  children: React.ReactNode;
};

/** Document-like visual frame for diagrams and fact panels. */
export function VisualPanel({ className, title, children }: VisualPanelProps) {
  return (
    <figure
      className={cn(
        "overflow-hidden border border-line bg-surface shadow-[0_1px_0_rgba(11,24,32,0.04)]",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-line bg-[#eef3f5] px-4 py-2.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-800">
          {title}
        </p>
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="h-2 w-2 rounded-full bg-signal" />
          <span className="h-2 w-2 rounded-full bg-brand-800/40" />
        </span>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </figure>
  );
}

/** Layered governance / quality diagram. */
export function GovernanceLayersVisual({
  layers,
  caption,
}: {
  layers: string[];
  caption: string;
}) {
  return (
    <VisualPanel title={caption}>
      <svg
        viewBox="0 0 560 280"
        className="h-auto w-full"
        role="img"
        aria-label={caption}
      >
        <title>{caption}</title>
        {layers.map((label, index) => {
          const y = 28 + index * 52;
          const width = 480 - index * 28;
          const x = 40 + index * 14;
          return (
            <g key={label}>
              <rect
                x={x}
                y={y}
                width={width}
                height="40"
                rx="4"
                fill={index % 2 === 0 ? "#004869" : "#e6eef4"}
                stroke="#d7e1e5"
                strokeWidth="1"
              />
              <text
                x={x + 16}
                y={y + 25}
                fill={index % 2 === 0 ? "#ffffff" : "#003347"}
                fontSize="14"
                fontWeight="600"
                fontFamily="var(--font-source-sans), sans-serif"
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
    </VisualPanel>
  );
}

/** Vertical accountability chain for risk / continuity. */
export function AccountabilityChainVisual({
  steps,
  caption,
}: {
  steps: string[];
  caption: string;
}) {
  return (
    <VisualPanel title={caption}>
      <svg
        viewBox="0 0 560 300"
        className="h-auto w-full"
        role="img"
        aria-label={caption}
      >
        <title>{caption}</title>
        <line
          x1="48"
          y1="28"
          x2="48"
          y2="272"
          stroke="#bceaf2"
          strokeWidth="4"
        />
        {steps.map((label, index) => {
          const y = 40 + index * 64;
          return (
            <g key={label}>
              <circle cx="48" cy={y} r="10" fill="#004869" />
              <rect
                x="80"
                y={y - 18}
                width="440"
                height="36"
                rx="4"
                fill="#f7f9f8"
                stroke="#d7e1e5"
              />
              <text
                x="96"
                y={y + 5}
                fill="#0b1820"
                fontSize="14"
                fontWeight="600"
                fontFamily="var(--font-source-sans), sans-serif"
              >
                {String(index + 1).padStart(2, "0")} · {label}
              </text>
            </g>
          );
        })}
      </svg>
    </VisualPanel>
  );
}

/** Supplier fact-sheet style diagram. */
export function FactSheetVisual({
  rows,
  caption,
}: {
  rows: { label: string; value: string }[];
  caption: string;
}) {
  return (
    <VisualPanel title={caption}>
      <svg
        viewBox="0 0 560 260"
        className="h-auto w-full"
        role="img"
        aria-label={caption}
      >
        <title>{caption}</title>
        <rect x="16" y="12" width="528" height="236" rx="4" fill="#ffffff" stroke="#d7e1e5" />
        <rect x="16" y="12" width="8" height="236" fill="#004869" />
        {rows.map((row, index) => {
          const y = 44 + index * 48;
          return (
            <g key={row.label}>
              <text
                x="48"
                y={y}
                fill="#64748b"
                fontSize="12"
                fontWeight="600"
                fontFamily="var(--font-source-sans), sans-serif"
              >
                {row.label}
              </text>
              <text
                x="48"
                y={y + 20}
                fill="#003347"
                fontSize="16"
                fontWeight="700"
                fontFamily="var(--font-ubuntu), sans-serif"
              >
                {row.value}
              </text>
              {index < rows.length - 1 ? (
                <line
                  x1="48"
                  y1={y + 32}
                  x2="520"
                  y2={y + 32}
                  stroke="#d7e1e5"
                />
              ) : null}
            </g>
          );
        })}
      </svg>
    </VisualPanel>
  );
}

/** Atmospheric section backdrop with restrained grid. */
export function SectionAtmosphere({
  children,
  tone = "paper",
  className,
}: {
  children: React.ReactNode;
  tone?: "paper" | "surface" | "brand";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        tone === "paper" && "bg-paper",
        tone === "surface" && "bg-surface",
        tone === "brand" && "bg-brand-900 text-white",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
        style={{
          backgroundImage:
            tone === "brand"
              ? "linear-gradient(135deg, rgba(188,234,242,0.12), transparent 45%), radial-gradient(circle at 90% 10%, rgba(188,234,242,0.18), transparent 35%)"
              : "radial-gradient(circle at 92% 8%, rgba(188,234,242,0.45), transparent 36%), linear-gradient(180deg, transparent, rgba(0,72,105,0.03))",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(215,225,229,0.55) 1px, transparent 1px), linear-gradient(to bottom, rgba(215,225,229,0.45) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(180deg, black, transparent 92%)",
        }}
      />
      <div className="relative">{children}</div>
    </section>
  );
}

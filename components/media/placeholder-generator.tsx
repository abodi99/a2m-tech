/**
 * Generates high-quality placeholder images for development and content planning.
 * Replace with real photography before production deployment.
 */

import { cn } from "@/lib/utils";

type PlaceholderProps = {
  width: number;
  height: number;
  text: string;
  className?: string;
  type?: "portrait" | "context" | "logo" | "generic";
};

export function PlaceholderImage({
  width,
  height,
  text,
  className,
  type = "generic",
}: PlaceholderProps) {
  const aspectRatio = width / height;
  const bgColor = {
    portrait: "#004869",
    context: "#176BE0",
    logo: "#003347",
    generic: "#64748b",
  }[type];

  const textColor = {
    portrait: "#BCEAF2",
    context: "#F7F9F8",
    logo: "#BCEAF2",
    generic: "#F7F9F8",
  }[type];

  return (
    <div
      className={cn(
        "flex items-center justify-center text-center",
        className
      )}
      style={{
        width,
        height,
        backgroundColor: bgColor,
        aspectRatio,
      }}
    >
      <div className="max-w-[80%] p-4">
        <p
          className="font-semibold leading-tight"
          style={{
            color: textColor,
            fontSize: Math.min(width / 12, height / 8, 24),
          }}
        >
          {text}
        </p>
        <p
          className="mt-2 opacity-75"
          style={{
            color: textColor,
            fontSize: Math.min(width / 20, height / 15, 12),
          }}
        >
          {width}×{height} placeholder
        </p>
      </div>
    </div>
  );
}

/**
 * Creates a data URL for a placeholder image that can be used as src.
 */
export function createPlaceholderDataUrl(
  width: number,
  height: number,
  text: string,
  type: PlaceholderProps["type"] = "generic"
): string {
  const bgColor = {
    portrait: "004869",
    context: "176BE0", 
    logo: "003347",
    generic: "64748b",
  }[type];

  const textColor = {
    portrait: "BCEAF2",
    context: "F7F9F8",
    logo: "BCEAF2", 
    generic: "F7F9F8",
  }[type];

  // Create SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="#${bgColor}"/>
      <text 
        x="50%" 
        y="45%" 
        text-anchor="middle" 
        dominant-baseline="middle"
        fill="#${textColor}" 
        font-family="system-ui, sans-serif" 
        font-size="${Math.min(width / 12, height / 8, 24)}" 
        font-weight="600"
      >
        ${text}
      </text>
      <text 
        x="50%" 
        y="65%" 
        text-anchor="middle" 
        dominant-baseline="middle"
        fill="#${textColor}" 
        font-family="system-ui, sans-serif" 
        font-size="${Math.min(width / 20, height / 15, 12)}" 
        opacity="0.75"
      >
        ${width}×${height} placeholder
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
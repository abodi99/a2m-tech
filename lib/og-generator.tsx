import { company } from "@/content/site";

/**
 * Generates dynamic Open Graph images with consistent branding.
 * For static export compatibility, these generate data URLs or SVGs.
 */

type OGImageProps = {
  title: string;
  description: string;
  locale: "sv" | "en";
  page?: "home" | "services" | "about" | "contact" | "public-sector" | "delivery";
};

/**
 * Creates a branded SVG for Open Graph sharing.
 */
export function createOGImage({ 
  title, 
  description, 
  locale,
  page: _page = "home" 
}: OGImageProps): string {
  const brandText = locale === "sv" ? "Leveranspartner för offentlig sektor" : "Delivery partner for public sector";
  
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#003347" />
          <stop offset="100%" stop-color="#004869" />
        </linearGradient>
        <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1" />
        </pattern>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bgGrad)" />
      <rect width="1200" height="630" fill="url(#gridPattern)" />
      
      <!-- Brand mark -->
      <rect x="60" y="0" width="4" height="630" fill="#BCEAF2" opacity="0.6" />
      
      <!-- Company name -->
      <text x="100" y="120" fill="#BCEAF2" font-family="system-ui, sans-serif" font-size="32" font-weight="700">
        ${company.legalName}
      </text>
      
      <!-- Brand tagline -->
      <text x="100" y="160" fill="#BCEAF2" font-family="system-ui, sans-serif" font-size="18" font-weight="500" opacity="0.8">
        ${brandText}
      </text>
      
      <!-- Title -->
      <text x="100" y="280" fill="#ffffff" font-family="system-ui, sans-serif" font-size="48" font-weight="700">
        ${title.length > 40 ? title.substring(0, 37) + "..." : title}
      </text>
      
      <!-- Description -->
      <text x="100" y="360" fill="#ffffff" font-family="system-ui, sans-serif" font-size="24" font-weight="400" opacity="0.9">
        ${description.length > 80 ? description.substring(0, 77) + "..." : description}
      </text>
      
      <!-- Domain -->
      <text x="100" y="550" fill="#BCEAF2" font-family="system-ui, sans-serif" font-size="20" font-weight="500">
        a2m-tech.com
      </text>
      
      <!-- Accent corner -->
      <path d="M1140 60h-40M1140 60v40" stroke="#BCEAF2" stroke-width="2" opacity="0.6" />
      <path d="M1140 570h-40M1140 570v-40" stroke="#BCEAF2" stroke-width="2" opacity="0.6" />
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Gets the appropriate OG image URL for a page and locale.
 */
export function getOGImageUrl(metaKey: string, locale: "sv" | "en"): string {
  // For production, use static images
  return `/brand/og-${locale}.jpg`;
}

/**
 * Generates page-specific OG image metadata.
 */
export function generateOGImageData(
  title: string,
  description: string,
  locale: "sv" | "en",
  metaKey: string
) {
  return {
    url: getOGImageUrl(metaKey, locale),
    width: 1200,
    height: 630,
    alt: `${title} – ${company.legalName}`,
    type: "image/jpeg",
  };
}
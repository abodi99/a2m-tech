import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type ResponsiveImageProps = {
  /** Base image path without extension (e.g., "/media/team/founder") */
  basePath: string;
  /** Alt text for accessibility */
  alt: string;
  /** Image width for layout and optimization */
  width: number;
  /** Image height for layout and optimization */
  height: number;
  /** Additional CSS classes */
  className?: string;
  /** Priority loading for above-the-fold images */
  priority?: boolean;
  /** Image quality (1-100) */
  quality?: number;
  /** Image sizes attribute for responsive loading */
  sizes?: string;
} & Omit<ImageProps, "src" | "alt" | "width" | "height">;

/**
 * Responsive image component that handles modern formats (AVIF/WebP fallbacks)
 * and proper optimization for different screen sizes.
 */
export function ResponsiveImage({
  basePath,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 85,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...props
}: ResponsiveImageProps) {
  return (
    <Image
      src={`${basePath}.jpg`}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      priority={priority}
      sizes={sizes}
      className={cn("h-auto w-full", className)}
      {...props}
    />
  );
}

/**
 * Portrait image with consistent aspect ratio and styling for team members.
 */
export function Portrait({
  basePath,
  name,
  role,
  className,
  ...props
}: {
  basePath: string;
  name: string;
  role?: string;
  className?: string;
} & Partial<ResponsiveImageProps>) {
  return (
    <figure className={cn("text-center", className)}>
      <div className="overflow-hidden rounded-lg bg-line/20">
        <ResponsiveImage
          basePath={basePath}
          alt={`${name}${role ? `, ${role}` : ""}`}
          width={300}
          height={400}
          sizes="(max-width: 640px) 280px, (max-width: 1024px) 320px, 300px"
          className="aspect-[3/4] object-cover"
          {...props}
        />
      </div>
      <figcaption className="mt-4">
        <p className="font-semibold text-ink-950">{name}</p>
        {role && (
          <p className="text-sm text-ink-700">{role}</p>
        )}
      </figcaption>
    </figure>
  );
}

/**
 * Context image for workplace, location, or process documentation.
 */
export function ContextImage({
  basePath,
  caption,
  credit,
  className,
  ...props
}: {
  basePath: string;
  caption: string;
  credit?: string;
  className?: string;
} & Partial<ResponsiveImageProps>) {
  return (
    <figure className={cn("", className)}>
      <div className="overflow-hidden rounded-lg bg-line/10">
        <ResponsiveImage
          basePath={basePath}
          alt={caption}
          width={800}
          height={600}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
          className="aspect-[4/3] object-cover"
          {...props}
        />
      </div>
      <figcaption className="mt-3 text-sm text-ink-700">
        <p>{caption}</p>
        {credit && (
          <p className="mt-1 text-xs opacity-75">{credit}</p>
        )}
      </figcaption>
    </figure>
  );
}
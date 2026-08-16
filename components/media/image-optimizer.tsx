"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type OptimizedImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
};

/**
 * Enhanced image component with loading states, error handling, and optimization.
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 85,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  placeholder = "empty",
  blurDataURL,
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-line/20 text-ink-700",
          className
        )}
        style={{ width, height }}
      >
        <div className="text-center p-4">
          <p className="text-sm font-medium">Bilden kunde inte laddas</p>
          <p className="text-xs opacity-75 mt-1">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div 
          className="absolute inset-0 animate-pulse bg-line/20"
          style={{ width, height }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
      />
    </div>
  );
}

/**
 * Creates optimized blur data URLs for image placeholders.
 */
export function createBlurDataURL(
  width: number = 40,
  height: number = 40,
  color: string = "#f1f5f9"
): string {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}" />
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * Progressive image loader that handles multiple formats.
 */
export function ProgressiveImage({
  basePath,
  alt,
  width,
  height,
  className,
  ...props
}: {
  basePath: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
} & Partial<OptimizedImageProps>) {
  const [currentSrc, setCurrentSrc] = useState(`${basePath}.jpg`);

  const handleError = () => {
    // Fallback to WebP if AVIF fails, then to JPG
    if (currentSrc.endsWith('.avif')) {
      setCurrentSrc(`${basePath}.webp`);
    } else if (currentSrc.endsWith('.webp')) {
      setCurrentSrc(`${basePath}.jpg`);
    }
  };

  return (
    <OptimizedImage
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      blurDataURL={createBlurDataURL(width / 10, height / 10)}
      placeholder="blur"
      {...props}
    />
  );
}
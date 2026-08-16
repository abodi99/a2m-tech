"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveImage } from "./image-responsive";

type VideoPlayerProps = {
  /** Base path for video files (without extension) */
  basePath: string;
  /** Poster image base path (without extension) */
  posterBasePath: string;
  /** Video title for accessibility */
  title: string;
  /** Video description */
  description?: string;
  /** Additional CSS classes */
  className?: string;
  /** Auto-play (muted only, respects prefers-reduced-motion) */
  autoPlay?: boolean;
  /** Show controls */
  controls?: boolean;
  /** Loop video */
  loop?: boolean;
};

/**
 * Accessible video player with multiple format support and motion preferences.
 * Only auto-plays when muted and user hasn't set prefers-reduced-motion.
 */
export function VideoPlayer({
  basePath,
  posterBasePath,
  title,
  description,
  className,
  autoPlay = false,
  controls = true,
  loop = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(autoPlay);
  const [showPoster, setShowPoster] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    // Set initial value
    handleChange(mediaQuery as unknown as MediaQueryListEvent);
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setShowPoster(false);
    };
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      if (!loop) setShowPoster(true);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [loop]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  // Don't auto-play if user prefers reduced motion
  const shouldAutoPlay = autoPlay && !prefersReducedMotion;

  return (
    <figure className={cn("relative overflow-hidden rounded-lg bg-ink-950", className)}>
      <div className="relative aspect-[16/9]">
        <video
          ref={videoRef}
          className={cn("h-full w-full object-cover", showPoster && "opacity-0")}
          muted={isMuted}
          autoPlay={shouldAutoPlay}
          loop={loop}
          playsInline
          preload="metadata"
          aria-label={title}
        >
          <source src={`${basePath}.webm`} type="video/webm" />
          <source src={`${basePath}.mp4`} type="video/mp4" />
          <p>
            Din webbläsare stöder inte video. Ladda ner{" "}
            <a href={`${basePath}.mp4`} className="underline">
              {title}
            </a>
            .
          </p>
        </video>

        {/* Poster image overlay */}
        {showPoster && (
          <div className="absolute inset-0">
            <ResponsiveImage
              basePath={posterBasePath}
              alt={`${title} - klicka för att spela`}
              width={800}
              height={450}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 800px"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-ink-950/20">
              <button
                onClick={togglePlay}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-surface/90 shadow-lg backdrop-blur-sm transition hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-600"
                aria-label={`Spela ${title}`}
              >
                <Play className="h-6 w-6 translate-x-0.5 text-ink-950" />
              </button>
            </div>
          </div>
        )}

        {/* Custom controls */}
        {controls && !showPoster && (
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-950/70 backdrop-blur-sm transition hover:bg-ink-950/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface"
              aria-label={isPlaying ? "Pausa video" : "Spela video"}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-surface" />
              ) : (
                <Play className="h-4 w-4 translate-x-0.5 text-surface" />
              )}
            </button>
            <button
              onClick={toggleMute}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-ink-950/70 backdrop-blur-sm transition hover:bg-ink-950/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface"
              aria-label={isMuted ? "Slå på ljud" : "Stäng av ljud"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-surface" />
              ) : (
                <Volume2 className="h-4 w-4 text-surface" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Caption */}
      {description && (
        <figcaption className="p-4 text-sm text-ink-700">
          <p className="font-semibold text-ink-950">{title}</p>
          <p className="mt-1">{description}</p>
        </figcaption>
      )}
    </figure>
  );
}
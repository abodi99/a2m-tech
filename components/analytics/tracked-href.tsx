"use client";

import NextLink from "next/link";
import { trackEvent } from "@/lib/analytics";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof NextLink> & {
  event?: string;
  eventData?: Record<string, string | number | boolean | undefined>;
};

/** next/link wrapper for absolute locale paths (insights, etc.). */
export function TrackedHref({
  event = "link_click",
  eventData,
  onClick,
  href,
  ...props
}: Props) {
  return (
    <NextLink
      href={href}
      {...props}
      onClick={(e) => {
        trackEvent(event, {
          href: typeof href === "string" ? href : undefined,
          ...eventData,
        });
        onClick?.(e);
      }}
    />
  );
}

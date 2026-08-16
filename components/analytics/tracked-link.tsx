"use client";

import { Link } from "@/i18n/navigation";
import { trackEvent } from "@/lib/analytics";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & {
  event?: string;
  eventData?: Record<string, string | number | boolean | undefined>;
};

/** next-intl Link that records an Umami event on click. */
export function TrackedLink({
  event = "cta_click",
  eventData,
  onClick,
  ...props
}: Props) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent(event, {
          href: typeof props.href === "string" ? props.href : undefined,
          ...eventData,
        });
        onClick?.(e);
      }}
    />
  );
}

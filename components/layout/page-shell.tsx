import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8", className)}>
      {children}
    </div>
  );
}

export function PageHero({
  title,
  intro,
  visual,
}: {
  title: string;
  intro: string;
  visual?: React.ReactNode;
}) {
  return (
    <header className={visual ? "grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end" : "max-w-3xl"}>
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-700">{intro}</p>
      </div>
      {visual ? <div className="min-w-0">{visual}</div> : null}
    </header>
  );
}

export function PrimaryLink({
  href,
  children,
  external,
  className,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  const classes = cn(buttonVariants(), className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}

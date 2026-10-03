import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "accent";

/** Shared button / link-button styles. */
export function buttonClass(variant: Variant = "solid", className?: string) {
  return cn(
    "group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full px-5 text-sm font-medium",
    "transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60",
    variant === "solid" && "bg-ink text-canvas hover:bg-accent hover:text-on-accent",
    variant === "accent" && "bg-accent text-on-accent hover:bg-ink hover:text-canvas",
    variant === "outline" && "border border-line bg-frame text-ink hover:border-ink",
    className,
  );
}

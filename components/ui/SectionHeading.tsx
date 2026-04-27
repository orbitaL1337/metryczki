import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div className={cn(isCenter ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-left", className)}>
      {eyebrow ? <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-ink/70">{eyebrow}</p> : null}
      <h2 className="font-display text-4xl font-extrabold uppercase tracking-[0.02em] leading-tight text-ink md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 text-lg leading-relaxed text-ink/80">{description}</p> : null}
    </div>
  );
}
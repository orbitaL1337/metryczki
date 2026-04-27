type SectionSeparatorProps = {
  className?: string;
};

export default function SectionSeparator({ className = "" }: SectionSeparatorProps) {
  return (
    <div aria-hidden className={["mx-auto flex h-20 w-full max-w-[1400px] items-center justify-center", className].join(" ")}>
      <div className="relative h-px w-[min(88%,900px)] bg-gradient-to-r from-transparent via-white/70 to-transparent">
        <span className="absolute left-1/2 top-1/2 h-2 w-0 -translate-x-1/2 -translate-y-1/2 bg-white/55 blur-sm" />
      </div>
    </div>
  );
}
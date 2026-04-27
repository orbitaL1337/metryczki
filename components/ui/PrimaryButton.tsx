import Link from "next/link";
import { cn } from "@/lib/utils";

type PrimaryButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "pink" | "blue" | "soft" | "cloud";
  className?: string;
};

export default function PrimaryButton({ href, children, variant = "pink", className }: PrimaryButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden border rounded-none px-7 py-3.5 text-[15px] font-extrabold tracking-[0.01em] transition-all duration-500 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky/45 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        "active:translate-y-[1px]",
        variant === "pink" &&
          "border-coral/20 bg-gradient-to-b from-[#ff9ab0] to-[#ff7f97] text-white shadow-[0_12px_28px_rgba(255,127,151,0.34)] hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(255,127,151,0.42)]",
        variant === "blue" &&
          "border-sky/20 bg-gradient-to-b from-[#66b6ed] to-[#4ea3df] text-white shadow-[0_12px_28px_rgba(78,163,223,0.34)] hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(78,163,223,0.42)]",
        variant === "soft" &&
          "border-white/80 bg-white/88 text-ink shadow-[0_10px_24px_rgba(64,108,164,0.16)] backdrop-blur hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_16px_30px_rgba(64,108,164,0.24)]",
        variant === "cloud" &&
          "border-sky/20 bg-gradient-to-b from-[#66b6ed] to-[#4ea3df] text-white shadow-[0_12px_28px_rgba(78,163,223,0.34)] hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(78,163,223,0.42)]",
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />

      <span className="relative z-10">{children}</span>

      <span className="relative z-10 ml-2 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
        ›
      </span>
    </Link>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navItems } from "@/lib/data";
import { cn } from "@/lib/utils";
import PrimaryButton from "./ui/PrimaryButton";
import SectionContainer from "./ui/SectionContainer";
import ThemeToggle from "./ui/ThemeToggle";

const SCROLL_THRESHOLD = 24;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const updateState = () => {
      const next = window.scrollY > SCROLL_THRESHOLD;
      setScrolled((prev) => (prev === next ? prev : next));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateState);
        ticking = true;
      }
    };

    updateState();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 py-2 backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-500 ease-out",
        scrolled
          ? "border-b border-sky/25 bg-[#2f5b9f]/88 shadow-[0_10px_26px_rgba(34,66,116,0.28)]"
          : "border-b border-white/55 bg-[#eef8ff]/78",
      )}
    >
      <SectionContainer>
        <nav className="flex min-h-[82px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center py-1" aria-label={"Strona g\u0142\u00f3wna Metryczki dla Dzieci"}>
            <Image
              src="/logo/logo.png"
              alt="Metryczki Dla Dzieci"
              width={1024}
              height={683}
              className="h-auto w-[220px] sm:w-[280px] lg:w-[340px]"
              priority
            />
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="group relative text-lg font-extrabold tracking-[0.01em] text-ink/90 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky/60"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-sky to-pink transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <PrimaryButton href="#zamowienie" variant="cloud" className="hidden sm:inline-flex">
              {"Zam\u00f3w metryczk\u0119"}
            </PrimaryButton>
          </div>
        </nav>
      </SectionContainer>
    </header>
  );
}

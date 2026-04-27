"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import FadeInSection from "./ui/FadeInSection";
import PrimaryButton from "./ui/PrimaryButton";
import SectionContainer from "./ui/SectionContainer";
import SectionHeading from "./ui/SectionHeading";

type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  label: string;
};

const MAX_TILES = 6;
const FALLBACK_PNG = "/assets/posters/poster-placeholder.png";

const sourceImages: Array<Omit<GalleryItem, "id">> = [
  { src: "/assets/posters/poster-zosia.png", alt: "Metryczka 1", label: "1" },
  { src: "/assets/posters/poster-olivier.png", alt: "Metryczka 2", label: "2" },
  { src: "/assets/posters/poster-antosia.png", alt: "Metryczka 3", label: "3" },
  { src: "/assets/posters/poster-leon.png", alt: "Metryczka 4", label: "4" },
  { src: "/assets/posters/poster-amelia.png", alt: "Metryczka 5", label: "5" },
];

function normalizeGalleryItems(items: Array<Omit<GalleryItem, "id">>): GalleryItem[] {
  const base = items.slice(0, MAX_TILES).map((item, idx) => ({ id: `gallery-${idx}`, ...item }));

  while (base.length < MAX_TILES) {
    const index = base.length + 1;
    base.push({
      id: `gallery-${base.length}`,
      src: FALLBACK_PNG,
      alt: `Metryczka ${index}`,
      label: `${index}`,
    });
  }

  return base;
}

export default function GallerySection() {
  const items = useMemo(() => normalizeGalleryItems(sourceImages), []);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [failedIndices, setFailedIndices] = useState<Record<number, boolean>>({});

  const isLightboxOpen = openIndex !== null;

  useEffect(() => {
    if (!isLightboxOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenIndex(null);
      }
      if (event.key === "ArrowRight") {
        setOpenIndex((prev) => (prev === null ? 0 : (prev + 1) % MAX_TILES));
      }
      if (event.key === "ArrowLeft") {
        setOpenIndex((prev) => (prev === null ? 0 : (prev - 1 + MAX_TILES) % MAX_TILES));
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isLightboxOpen]);

  const resolveSrc = (index: number): string => {
    if (failedIndices[index]) {
      return FALLBACK_PNG;
    }

    return items[index]?.src ?? FALLBACK_PNG;
  };

  const markFailed = (index: number) => {
    setFailedIndices((prev) => ({ ...prev, [index]: true }));
  };

  const goNext = () => setOpenIndex((prev) => (prev === null ? 0 : (prev + 1) % MAX_TILES));
  const goPrev = () => setOpenIndex((prev) => (prev === null ? 0 : (prev - 1 + MAX_TILES) % MAX_TILES));

  return (
    <section id="realizacje" className="gallery-glass-section py-16 md:py-24">
      <SectionContainer>
        <FadeInSection className="mx-auto max-w-4xl px-6 py-7 sm:px-10 sm:py-8">
          <SectionHeading
            eyebrow={"Przyk\u0142adowe realizacje"}
            title={"ZOBACZ, JAK WYGL\u0104DA NASZE PRACE"}
            description={"Ka\u017cdy projekt przygotowujemy indywidualnie, dbaj\u0105c o estetyk\u0119 i czytelno\u015b\u0107 najwa\u017cniejszych informacji."}
            className="[&_h2]:font-extrabold"
          />
        </FadeInSection>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <FadeInSection key={item.id} delay={idx * 0.05}>
              <button
                type="button"
                onClick={() => setOpenIndex(idx)}
                className="group glass-panel glass-panel--interactive relative w-full overflow-hidden rounded-none shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky/60"
                aria-label={`Otw\u00f3rz galeri\u0119: ${item.label}`}
                aria-haspopup="dialog"
              >
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={resolveSrc(idx)}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    onError={() => markFailed(idx)}
                  />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1f3658]/72 to-transparent px-4 py-3 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-base font-bold text-white">{item.label}</p>
                </div>
              </button>
            </FadeInSection>
          ))}
        </div>

        <FadeInSection className="mt-10 flex justify-center">
          <PrimaryButton href="#zamowienie" variant="blue">{"Chc\u0119 podobny projekt"}</PrimaryButton>
        </FadeInSection>
      </SectionContainer>

      {isLightboxOpen ? (
        <div
          className="fixed inset-0 z-[80] bg-black/80 p-4 backdrop-blur-sm sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={"Galeria zdj\u0119\u0107"}
          onClick={() => setOpenIndex(null)}
        >
          <div className="mx-auto flex h-full w-full max-w-6xl flex-col" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setOpenIndex(null)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-none border border-white/30 bg-white/10 text-2xl text-white transition hover:bg-white/20"
                aria-label={"Zamknij galeri\u0119"}
              >
                {"\u00d7"}
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center gap-2 sm:gap-4">
              <button
                type="button"
                onClick={goPrev}
                className="inline-flex h-11 w-11 items-center justify-center rounded-none border border-white/30 bg-white/10 text-2xl text-white transition hover:bg-white/20"
                aria-label={"Poprzedni obraz"}
              >
                {"\u2039"}
              </button>

              <div className="relative h-full w-full max-w-4xl overflow-hidden border border-white/20 bg-black/25">
                <Image
                  src={resolveSrc(openIndex)}
                  alt={items[openIndex].alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  onError={() => markFailed(openIndex)}
                />
              </div>

              <button
                type="button"
                onClick={goNext}
                className="inline-flex h-11 w-11 items-center justify-center rounded-none border border-white/30 bg-white/10 text-2xl text-white transition hover:bg-white/20"
                aria-label={"Nast\u0119pny obraz"}
              >
                {"\u203a"}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-6 gap-2">
              {items.map((item, idx) => (
                <button
                  key={`thumb-${item.id}`}
                  type="button"
                  onClick={() => setOpenIndex(idx)}
                  className={`relative aspect-[4/5] overflow-hidden rounded-none border transition ${
                    idx === openIndex ? "border-white shadow-[0_0_0_2px_rgba(255,255,255,0.45)]" : "border-white/20 opacity-80 hover:opacity-100"
                  }`}
                  aria-label={`Poka\u017c obraz ${idx + 1}`}
                >
                  <Image src={resolveSrc(idx)} alt={item.alt} fill className="object-cover" sizes="120px" onError={() => markFailed(idx)} />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}




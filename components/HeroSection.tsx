import PosterCard from "./PosterCard";
import FadeInSection from "./ui/FadeInSection";
import PrimaryButton from "./ui/PrimaryButton";
import SectionContainer from "./ui/SectionContainer";

export default function HeroSection() {
  return (
    <section className="hero-main-section relative pb-16 pt-12 md:pb-24 md:pt-16">
      <SectionContainer className="grid items-center gap-10 lg:grid-cols-[1.1fr,0.9fr]">
        <FadeInSection className="max-w-2xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.15em] text-ink/70">Personalizowane metryczki</p>
          <div className="font-display text-xl font-extrabold uppercase leading-tight text-ink sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
            <p>{"projektujemy"}</p>
            <p>{"metryczki i zaproszenia"}</p>
          </div>
          <p className="mt-5 text-lg leading-relaxed text-ink/80 md:text-xl">
            {"Projektujemy subtelne metryczki, które łączą emocjonalną wartość rodzinnej historii z estetyką butikowego produktu."}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton href="#zamowienie" variant="cloud">
              {"Zamów metryczkę"}
            </PrimaryButton>
            <PrimaryButton href="#realizacje" variant="soft">
              {"Zobacz realizacje"}
            </PrimaryButton>
          </div>

          <p className="mt-5 text-sm font-semibold text-ink/70">
            {"Starannie opracowana kompozycja, przejrzysty proces i pełna personalizacja bez zbędnych formalności."}
          </p>
        </FadeInSection>

        <FadeInSection delay={0.1} className="mx-auto w-full max-w-[560px]">
          <div className="relative h-[390px] md:h-[430px]">
            <PosterCard
              image="/assets/posters/poster-zosia.png"
              alt="Przykładowa metryczka 1"
              variant="hero"
              rotation="rotate-[-4deg]"
              size="lg"
              className="absolute left-1 top-4"
              priority
            />
            <PosterCard
              image="/assets/posters/poster-olivier.png"
              alt="Przykładowa metryczka 2"
              variant="hero"
              rotation="rotate-[4deg]"
              size="lg"
              className="absolute right-1 top-12"
              priority
            />
          </div>
        </FadeInSection>
      </SectionContainer>
    </section>
  );
}


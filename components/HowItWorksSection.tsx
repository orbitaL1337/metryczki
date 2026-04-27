import Image from "next/image";
import { steps } from "@/lib/data";
import FadeInSection from "./ui/FadeInSection";
import SectionContainer from "./ui/SectionContainer";
import SectionHeading from "./ui/SectionHeading";

const stepImages = ["/logo/1.png", "/logo/2.png", "/logo/3.png", "/logo/4.png"];

export default function HowItWorksSection() {
  return (
    <section id="jak-to-dziala" className="py-16 md:py-24">
      <SectionContainer>
        <FadeInSection>
          <SectionHeading
            eyebrow="Jak to działa"
            title="Prosty proces, dopracowany efekt"
            description="Od pierwszej wiadomości do gotowej pamiątki prowadzimy Cię krok po kroku, jasno i bez komplikacji."
          />
        </FadeInSection>

        <div className="how-steps-grid mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, idx) => {
            const imageSrc = stepImages[idx % stepImages.length];

            return (
              <FadeInSection key={step.title} delay={idx * 0.08} variant="dynamic" direction={idx % 2 === 0 ? "left" : "right"}>
                <article className="cloud-step-card relative h-full p-7 sm:p-8">
                  <div className="relative z-10">
                    <div className="relative left-1/2 mb-5 w-[min(92vw,22rem)] -translate-x-1/2 md:left-auto md:mx-auto md:w-full md:max-w-[22rem] md:translate-x-0">
                      <Image src={imageSrc} alt={step.title} width={704} height={160} className="h-auto w-full object-contain" />
                    </div>

                    <div className="mx-auto w-full max-w-[22rem]">
                      <h3 className="font-display text-[22px] text-ink">{step.title}</h3>
                      <p className="mt-2 text-[14px] leading-relaxed text-ink/80">{step.desc}</p>
                    </div>
                  </div>
                </article>
              </FadeInSection>
            );
          })}
        </div>
      </SectionContainer>
    </section>
  );
}

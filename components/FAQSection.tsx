import { faqItems } from "@/lib/data";
import FadeInSection from "./ui/FadeInSection";
import SectionContainer from "./ui/SectionContainer";
import SectionHeading from "./ui/SectionHeading";

export default function FAQSection() {
  return (
    <section id="faq" className="py-16 md:py-24">
      <SectionContainer>
        <FadeInSection>
          <SectionHeading
            eyebrow="FAQ"
            title="Najczęściej zadawane pytania"
            description="Najważniejsze informacje w jednym miejscu, aby decyzja o zamówieniu była łatwa i spokojna."
          />
        </FadeInSection>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4">
          {faqItems.map((item, index) => (
            <FadeInSection key={item.q} delay={index * 0.04}>
              <article className="glass-panel p-6 shadow-soft">
                <h3 className="text-xl font-extrabold text-ink">{item.q}</h3>
                <p className="mt-2 text-ink/80">{item.a}</p>
              </article>
            </FadeInSection>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}

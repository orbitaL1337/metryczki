import FadeInSection from "./ui/FadeInSection";
import SectionContainer from "./ui/SectionContainer";
import SectionHeading from "./ui/SectionHeading";

type PricingPlan = {
  name: string;
  price: string;
  priceSecondary?: string;
  imageSrc?: string;
  imageAlt?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

const pricingPlans: PricingPlan[] = [
  {
    name: "Metryczki personalizowane",
    price: "30 zł / 1 sztuka",
    priceSecondary: "50 zł / 3 sztuki",
    imageSrc: "/assets/posters/met1.png",
    imageAlt: "Przykładowa metryczka personalizowana",
    description:
      "Elegancka, personalizowana metryczka w formacie A4, przygotowana na podstawie danych dziecka — wyjątkowa pamiątka na lata lub piękny prezent dla bliskich.",
    features: [
      "Projekt personalizowany danymi dziecka",
      "Starannie dopracowany design",
      "Gotowa metryczka w formacie A4",
      "Idealna do oprawy lub wręczenia jako prezent",
      "Inny format lub większa ilość sztuk – do indywidualnego uzgodnienia",
    ],
  },
  {
    name: "Zaproszenia personalizowane",
    price: "199 zł",
    imageSrc: "/assets/posters/met2.png",
    imageAlt: "Przykładowe zaproszenie personalizowane",
    description:
      "Stylowe zaproszenia w formacie A6, przygotowane według Twoich informacji — wyjątkowy sposób, aby zaprosić bliskich na ważne wydarzenie.",
    features: [
      "Projekt dopasowany do treści zaproszenia",
      "Starannie przygotowany, estetyczny design",
      "Gotowe zaproszenia w formacie A6",
      "Idealne na uroczystości rodzinne, przyjęcia i wyjątkowe okazje",
      "Inny format lub większa ilość sztuk – do indywidualnego uzgodnienia",
    ],
    highlighted: true,
  },
  {
    name: "Gift Box – zestaw prezentowy",
    price: "279 zł",
    imageSrc: "/assets/posters/met3.png",
    imageAlt: "Przykładowa metryczka pakietu Gift Box",
    description:
      "Wyjątkowy zestaw prezentowy przygotowany z myślą o najmłodszych — piękna pamiątka oraz kreatywna zabawa w jednym.",
    features: [
      "Personalizowana metryczka z danymi dziecka",
      "Dekoracyjny plakat pasujący do pokoju dziecięcego",
      "Kolorowanki dla dzieci rozwijające kreatywność",
      "Starannie przygotowany, estetyczny zestaw idealny na prezent",
      "Możliwość dopasowania elementów zestawu – do indywidualnego uzgodnienia",
    ],
  },
];

export default function PricingSection() {
  return (
    <section id="cennik" className="py-16 md:py-24">
      <SectionContainer>
        <FadeInSection>
          <SectionHeading
            eyebrow="Cennik"
            title="Wybierz pakiet dopasowany do Twoich potrzeb"
            description="Przejrzyste opcje cenowe bez ukrytych kosztów. Każdy pakiet zawiera indywidualne podejście i spójną estetykę."
            className="mx-auto"
          />
        </FadeInSection>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan, idx) => (
            <FadeInSection key={plan.name} delay={idx * 0.05}>
              <article
                className={`cloud-pricing-card relative h-full p-7 sm:p-8 ${plan.highlighted ? "cloud-pricing-card--highlight" : ""}`}
                aria-label={plan.name}
              >
                <span className="cloud-pricing-card__shape" aria-hidden="true" />
                {plan.highlighted ? <span className="cloud-pricing-badge">Polecany</span> : null}

                <div className="relative z-10 flex h-full flex-col">
                  {plan.imageSrc ? (
                    <div className="mb-5 overflow-hidden rounded-[18px] shadow-soft">
                      <div className="aspect-[4/3] w-full">
                        <img src={plan.imageSrc} alt={plan.imageAlt ?? plan.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                    </div>
                  ) : null}

                  <header className="cloud-pricing-card__header">
                    <h3 className="cloud-pricing-card__name text-ink">{plan.name}</h3>
                    <div className="cloud-pricing-card__price-wrap" aria-label={`Cena pakietu ${plan.name}`}>
                      <p className="cloud-pricing-card__price text-ink">{plan.price}</p>
                      {plan.priceSecondary ? <p className="cloud-pricing-card__price-secondary text-ink/80">{plan.priceSecondary}</p> : null}
                    </div>
                  </header>

                  <p className="mt-4 text-ink/80">{plan.description}</p>

                  <ul className="mt-6 space-y-2 text-sm font-semibold text-ink/80">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5">
                        <span className="cloud-pricing-card__bullet" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </FadeInSection>
          ))}
        </div>
      </SectionContainer>
    </section>
  );
}



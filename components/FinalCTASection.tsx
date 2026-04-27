"use client";

import { useMemo, useState } from "react";
import FadeInSection from "./ui/FadeInSection";
import PrimaryButton from "./ui/PrimaryButton";
import SectionContainer from "./ui/SectionContainer";
import SectionHeading from "./ui/SectionHeading";

type FormState = {
  childName: string;
  birthDate: string;
  email: string;
  phone: string;
  notes: string;
  website: string;
};

const initialFormState: FormState = {
  childName: "",
  birthDate: "",
  email: "",
  phone: "",
  notes: "",
  website: "",
};

export default function FinalCTASection() {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const formStartedAt = useMemo(() => Date.now(), []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!formState.childName.trim() || !formState.birthDate.trim() || !formState.email.trim() || !formState.notes.trim()) {
      setStatus({ type: "error", message: "Uzupe\u0142nij wszystkie wymagane pola formularza." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formState,
          formTs: formStartedAt,
        }),
      });

      const payload = (await response.json()) as { ok: boolean; message: string };

      if (!response.ok || !payload.ok) {
        setStatus({ type: "error", message: payload.message || "Nie uda\u0142o si\u0119 wys\u0142a\u0107 wiadomo\u015bci." });
        return;
      }

      setStatus({ type: "success", message: payload.message || "Wiadomo\u015b\u0107 zosta\u0142a wys\u0142ana." });
      setFormState(initialFormState);
    } catch {
      setStatus({ type: "error", message: "Wyst\u0105pi\u0142 b\u0142\u0105d po\u0142\u0105czenia. Spr\u00f3buj ponownie." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="zamowienie" className="py-16 md:py-24">
      <SectionContainer>
        <FadeInSection className="glass-panel px-6 py-10 shadow-soft md:px-12 md:py-14">
          <SectionHeading
            align="left"
            eyebrow={"Z\u0142\u00f3\u017c zam\u00f3wienie"}
            title={"Podaj dane, a my przygotujemy Twoj\u0105 metryczk\u0119 z dba\u0142o\u015bci\u0105 o ka\u017cdy szczeg\u00f3\u0142"}
            description={"To pierwszy krok do stworzenia eleganckiej pami\u0105tki narodzin. Odpowiadamy z propozycj\u0105 realizacji i dalszymi instrukcjami."}
            className="max-w-4xl"
          />

          <form id="contact-form" className="mt-8 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
            <label className="grid gap-2 text-sm font-bold text-ink/80">
              {"Imi\u0119 dziecka"}
              <input
                className="glass-input px-4 py-3 text-base text-ink outline-none transition focus:border-sky"
                type="text"
                name="childName"
                placeholder="Np. Zofia"
                value={formState.childName}
                onChange={handleChange}
                required
                maxLength={120}
                aria-required="true"
              />
            </label>

            <label className="grid gap-2 text-sm font-bold text-ink/80">
              {"Data urodzenia"}
              <input
                className="glass-input px-4 py-3 text-base text-ink outline-none transition focus:border-sky"
                type="text"
                name="birthDate"
                placeholder="Np. 12.04.2026"
                value={formState.birthDate}
                onChange={handleChange}
                required
                maxLength={80}
                aria-required="true"
              />
            </label>

            <label className="grid gap-2 text-sm font-bold text-ink/80">
              E-mail kontaktowy
              <input
                className="glass-input px-4 py-3 text-base text-ink outline-none transition focus:border-sky"
                type="email"
                name="email"
                placeholder="twoj@email.pl"
                value={formState.email}
                onChange={handleChange}
                required
                maxLength={160}
                aria-required="true"
              />
            </label>

            <label className="grid gap-2 text-sm font-bold text-ink/80">
              {"Telefon (opcjonalnie)"}
              <input
                className="glass-input px-4 py-3 text-base text-ink outline-none transition focus:border-sky"
                type="tel"
                name="phone"
                placeholder="+48 ..."
                value={formState.phone}
                onChange={handleChange}
                maxLength={40}
              />
            </label>

            <label className="hidden" aria-hidden="true">
              Website
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={formState.website}
                onChange={handleChange}
              />
            </label>

            <label className="grid gap-2 text-sm font-bold text-ink/80 md:col-span-2">
              {"Dodatkowe informacje"}
              <textarea
                className="glass-input min-h-32 px-4 py-3 text-base text-ink outline-none transition focus:border-sky"
                name="notes"
                placeholder={"Wpisz dane do metryczki, preferowany styl i ewentualn\u0105 dedykacj\u0119."}
                value={formState.notes}
                onChange={handleChange}
                required
                maxLength={2500}
                aria-required="true"
              />
            </label>
          </form>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-ink/70">
              {"Wysy\u0142aj\u0105c formularz, rozpoczynasz niezobowi\u0105zuj\u0105c\u0105 konsultacj\u0119 zam\u00f3wienia."}
            </p>
            <div className="flex gap-3">
              <PrimaryButton href="mailto:damiannrams@gmail.com" variant="soft">
                Napisz e-mail
              </PrimaryButton>

              <button
                type="submit"
                form="contact-form"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-none border border-coral/20 bg-gradient-to-b from-[#ff9ab0] to-[#ff7f97] px-7 py-3.5 text-[15px] font-extrabold tracking-[0.01em] text-white shadow-[0_12px_28px_rgba(255,127,151,0.34)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(255,127,151,0.42)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky/45 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-75"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
                <span className="relative z-10">{isSubmitting ? "Wysy\u0142anie..." : "Wy\u015blij zapytanie"}</span>
                <span className="relative z-10 ml-2 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                  {">"}
                </span>
              </button>
            </div>
          </div>

          {status ? (
            <p
              className={`mt-4 text-sm font-semibold ${status.type === "success" ? "text-[#0f766e]" : "text-[#b42318]"}`}
              role={status.type === "error" ? "alert" : "status"}
              aria-live="polite"
            >
              {status.message}
            </p>
          ) : null}
        </FadeInSection>
      </SectionContainer>
    </section>
  );
}

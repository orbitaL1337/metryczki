import Image from "next/image";
import Link from "next/link";
import { footerLinkGroups } from "@/lib/data";
import SectionContainer from "./ui/SectionContainer";
import VisitCounter from "./ui/VisitCounter";

export default function Footer() {
  return (
    <footer className="mt-4 border-t border-white/55 bg-[#eef8ff]/78 py-12 backdrop-blur-md shadow-[0_-10px_26px_rgba(34,66,116,0.16)]">
      <SectionContainer>
        <div className="grid gap-8 md:grid-cols-[1.1fr,1fr,1fr]">
          <div>
            <Image
              src="/logo/logo.png"
              alt="Metryczki Dla Dzieci"
              width={1024}
              height={683}
              className="h-auto w-[220px] sm:w-[280px] lg:w-[320px]"
            />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/75">
              {"Tworzymy eleganckie, personalizowane metryczki narodzin dla rodzin, które cenią estetykę, emocje i ponadczasową jakość."}
            </p>
          </div>

          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-display text-2xl text-ink">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.label}`}>
                    <Link href={link.href} className="text-sm font-semibold text-ink/75 transition hover:text-ink">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-sky/20 pt-4 text-sm font-semibold text-ink/65 sm:flex-row sm:items-center sm:justify-between">
          <span>{"Metryczki dla Dzieci • butikowa marka personalizowanych pamiątek narodzin"}</span>
          <VisitCounter />
        </div>
      </SectionContainer>
    </footer>
  );
}

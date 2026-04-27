export type NavItem = { label: string; href: string };
export type StepItem = { title: string; desc: string };
export type FaqItem = { q: string; a: string };
export type FooterLinkGroup = { title: string; links: NavItem[] };

export const navItems: NavItem[] = [
  { label: "Realizacje", href: "#realizacje" },
  { label: "Jak to działa", href: "#jak-to-dziala" },
  { label: "Cennik", href: "#cennik" },
  { label: "FAQ", href: "#faq" },
  { label: "Zamówienie", href: "#zamowienie" },
];

export const steps: StepItem[] = [
  {
    title: "Wybierz styl",
    desc: "Przejrzyj dostępne wzory i wybierz projekt, który najlepiej pasuje do Twojej okazji.",
  },
  {
    title: "Podaj szczegóły",
    desc: "Wprowadź potrzebne informacje oraz elementy, które mają znaleźć się na projekcie.",
  },
  {
    title: "Akceptuj i zamów",
    desc: "Sprawdź przygotowany projekt i potwierdź zamówienie.",
  },
  {
    title: "Odbierz gotowy produkt",
    desc: "Twój produkt zostanie starannie przygotowany i trafi do Ciebie gotowy.",
  },
];

export const faqItems: FaqItem[] = [
  {
    q: "Jakie dane są potrzebne do wykonania metryczki?",
    a: "Najczęściej potrzebujemy: imienia dziecka, daty i godziny urodzenia, wagi oraz wzrostu. Jeśli chcesz, możesz dodać także miejsce urodzenia lub krótką dedykację.",
  },
  {
    q: "Czy mogę zobaczyć projekt przed finalną realizacją?",
    a: "Tak. Przed finalizacją zamówienia otrzymujesz podgląd kompozycji, aby potwierdzić poprawność danych i ogólny kierunek wizualny.",
  },
  {
    q: "Ile trwa realizacja?",
    a: "Realizacja przebiega sprawnie i zależy od aktualnej kolejki. Na każdym etapie informujemy o przewidywanym terminie.",
  },
  {
    q: "Czy metryczka nadaje się na prezent?",
    a: "Zdecydowanie tak. To jedna z najczęściej wybieranych form osobistego prezentu z okazji narodzin i ważnych rodzinnych uroczystości.",
  },
  {
    q: "Jakie formaty są dostępne?",
    a: "W zależności od projektu oferujemy popularne formaty dekoracyjne. Konkretne warianty przekazujemy podczas składania zamówienia.",
  },
];

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    title: "Nawigacja",
    links: navItems,
  },
  {
    title: "Kontakt",
    links: [
      { label: "kontakt@metryczkidladzieci.pl", href: "mailto:kontakt@metryczkidladzieci.pl" },
      { label: "+48 000 000 000", href: "tel:+48000000000" },
      { label: "Instagram", href: "https://instagram.com/metryczkidladzieci" },
    ],
  },
];

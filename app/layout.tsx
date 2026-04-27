import type { Metadata } from "next";
import { Baloo_2, Great_Vibes, Nunito } from "next/font/google";
import SiteBackground from "@/components/SiteBackground";
import "./globals.css";

const nunito = Nunito({ subsets: ["latin", "latin-ext"], variable: "--font-body" });
const baloo = Baloo_2({ subsets: ["latin", "latin-ext"], variable: "--font-display" });
const script = Great_Vibes({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--font-script" });

export const metadata: Metadata = {
  title: "Metryczki dla Dzieci | Personalizowane metryczki narodzin",
  description:
    "Butikowe metryczki urodzeniowe tworzone na zam\u00f3wienie. Elegancka pami\u0105tka narodzin i wyj\u0105tkowy prezent dla rodziny.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('site-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}",
          }}
        />
      </head>
      <body className={`${nunito.variable} ${baloo.variable} ${script.variable} bg-sky-soft font-body text-ink`}>
        <SiteBackground />
        {children}
      </body>
    </html>
  );
}

import FAQSection from "@/components/FAQSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PricingSection from "@/components/PricingSection";
import SectionSeparator from "@/components/SectionSeparator";

export default function Page() {
  return (
    <main className="page-surface relative">
      <Header />
      <HeroSection />
      <SectionSeparator />
      <HowItWorksSection />
      <SectionSeparator />
      <GallerySection />
      <SectionSeparator />
      <PricingSection />
      <SectionSeparator />
      <FAQSection />
      <SectionSeparator />
      <FinalCTASection />
      <Footer />
    </main>
  );
}

import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ApproachSection from "@/components/ApproachSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import IndustriesSection from "@/components/IndustriesSection";
import SamplesGallery from "@/components/SamplesGallery";
import WhyChooseSection from "@/components/WhyChooseSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      // Ensure sections are mounted before scrolling
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }, [hash]);

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ApproachSection />
      <HowItWorksSection />
      <IndustriesSection />
      <SamplesGallery />
      <WhyChooseSection />
      <TestimonialsSection />
      <ContactSection />
      <FloatingWhatsApp />
    </main>
  );
};

export default Index;
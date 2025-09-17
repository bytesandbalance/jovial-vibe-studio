import HeroSection from "@/components/HeroSection";
import ApproachSection from "@/components/ApproachSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import IndustriesSection from "@/components/IndustriesSection";
import SamplesGallery from "@/components/SamplesGallery";
import WhyChooseSection from "@/components/WhyChooseSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <ApproachSection />
      <HowItWorksSection />
      <IndustriesSection />
      <SamplesGallery />
      <WhyChooseSection />
      <TestimonialsSection />
      <ContactSection />
      <FloatingWhatsApp />
      <Toaster />
    </main>
  );
};

export default Index;
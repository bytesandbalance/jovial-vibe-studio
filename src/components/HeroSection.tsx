import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Simplified Background with Orange Accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-coral/5" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-coral/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in-up">
          Your Complete{" "}
          <span className="bg-gradient-to-r from-coral to-primary bg-clip-text text-transparent">
            Creative Tech Partner
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-3xl mx-auto animate-fade-in-up leading-relaxed">
          From web development to AI marketing agents — we build the complete digital ecosystem that grows your business.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up">
          <Button 
            onClick={() => scrollToSection('portfolio-preview')}
            className="bg-coral hover:bg-coral/90 text-white text-lg px-10 py-6 rounded-lg shadow-lg hover:shadow-coral/50 transition-all duration-300"
          >
            See Samples
          </Button>
          <Button 
            onClick={() => scrollToSection('contact')}
            className="bg-transparent border-2 border-coral text-coral hover:bg-coral hover:text-white text-lg px-10 py-6 rounded-lg transition-all duration-300"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Simplified Floating Elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-coral rounded-full floating opacity-40" />
      <div className="absolute bottom-32 right-16 w-4 h-4 bg-coral rounded-full floating opacity-30" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-10 w-2 h-2 bg-coral rounded-full floating opacity-35" style={{ animationDelay: '0.5s' }} />
    </section>
  );
};

export default HeroSection;
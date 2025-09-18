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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroBackground})`
        }}
      />
      
      {/* Background Video Placeholder */}
      <div className="absolute inset-0 video-placeholder">
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <Play className="w-24 h-24 text-white opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
          Your Complete{" "}
          <span className="gradient-text">Creative Tech Partner</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fade-in-up">
          From web development to AI marketing agents — we build the complete digital ecosystem that grows your business.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up">
          <Button 
            onClick={() => scrollToSection('samples')}
            className="btn-hero text-lg px-10 py-6"
          >
            See Samples
          </Button>
          <Button 
            onClick={() => scrollToSection('contact')}
            className="btn-hero-outline text-lg px-10 py-6"
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-coral rounded-full floating opacity-60" />
      <div className="absolute bottom-32 right-16 w-6 h-6 bg-primary rounded-full floating opacity-40" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-10 w-3 h-3 bg-coral-light rounded-full floating opacity-50" style={{ animationDelay: '0.5s' }} />
    </section>
  );
};

export default HeroSection;
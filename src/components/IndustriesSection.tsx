import { 
  UtensilsCrossed, 
  Dumbbell, 
  ShoppingBag, 
  Car, 
  Home, 
  Scissors,
  Shirt,
  Key,
  MapPin,
  Laptop,
  CreditCard,
  Heart,
  GraduationCap,
  Film,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";

const IndustriesSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const industries = [
    { icon: UtensilsCrossed, title: "Food & Beverage", value: "food", color: "from-orange-500 to-red-500" },
    { icon: Dumbbell, title: "Fitness & Health", value: "fitness", color: "from-green-500 to-emerald-500" },
    { icon: ShoppingBag, title: "Retail & E-commerce", value: "retail", color: "from-purple-500 to-pink-500" },
    { icon: Car, title: "Automotive", value: "automotive", color: "from-blue-500 to-cyan-500" },
    { icon: Home, title: "Real Estate", value: "real_estate", color: "from-amber-500 to-orange-500" },
    { icon: Scissors, title: "Beauty & Cosmetics", value: "beauty", color: "from-pink-500 to-rose-500" },
    { icon: Shirt, title: "Fashion & Clothing", value: "fashion", color: "from-indigo-500 to-purple-500" },
    { icon: Key, title: "Rentals & Equipment", value: "rentals", color: "from-gray-500 to-slate-500" },
    { icon: MapPin, title: "Tourism & Travel", value: "tourism", color: "from-teal-500 to-cyan-500" },
    { icon: Laptop, title: "Technology", value: "tech", color: "from-violet-500 to-purple-500" },
    { icon: CreditCard, title: "Finance & Banking", value: "finance", color: "from-yellow-500 to-amber-500" },
    { icon: Heart, title: "Healthcare", value: "healthcare", color: "from-red-500 to-pink-500" },
    { icon: GraduationCap, title: "Education", value: "education", color: "from-blue-500 to-indigo-500" },
    { icon: Film, title: "Entertainment", value: "entertainment", color: "from-purple-500 to-violet-500" },
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemsPerView = isMobile ? 2 : 4;
  const maxIndex = Math.max(0, industries.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-background via-accent/20 to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Industries We <span className="gradient-text">Serve</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From restaurants to retail, we build complete digital solutions tailored to each industry's unique needs
          </p>
        </div>

        {/* Desktop: Flowing layout */}
        <div className="hidden md:block">
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
            {industries.map((industry, index) => (
              <div 
                key={index} 
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="flex flex-col items-center space-y-4 p-6 rounded-3xl hover:bg-card/50 transition-all duration-300">
                  <div className={`w-20 h-20 bg-gradient-to-br ${industry.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:shadow-primary/25 transition-all duration-300`}>
                    <industry.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground text-center max-w-[120px] leading-tight">
                    {industry.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Carousel layout */}
        <div className="block md:hidden">
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
              >
                {industries.map((industry, index) => (
                  <div 
                    key={index}
                    className="w-1/2 flex-shrink-0 px-2"
                  >
                    <div className="group cursor-pointer">
                      <div className="flex flex-col items-center space-y-3 p-4 rounded-2xl hover:bg-card/50 transition-all duration-300">
                        <div className={`w-16 h-16 bg-gradient-to-br ${industry.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-all duration-300`}>
                          <industry.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground text-center leading-tight">
                          {industry.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 bg-card border shadow-lg rounded-full flex items-center justify-center text-foreground hover:bg-accent transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 bg-card border shadow-lg rounded-full flex items-center justify-center text-foreground hover:bg-accent transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
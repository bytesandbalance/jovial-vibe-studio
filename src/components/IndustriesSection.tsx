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
  Film
} from "lucide-react";

const IndustriesSection = () => {
  const industries = [
    { icon: UtensilsCrossed, title: "Food & Beverage", value: "food" },
    { icon: Dumbbell, title: "Fitness & Health", value: "fitness" },
    { icon: ShoppingBag, title: "Retail & E-commerce", value: "retail" },
    { icon: Car, title: "Automotive", value: "automotive" },
    { icon: Home, title: "Real Estate", value: "real_estate" },
    { icon: Scissors, title: "Beauty & Cosmetics", value: "beauty" },
    { icon: Shirt, title: "Fashion & Clothing", value: "fashion" },
    { icon: Key, title: "Rentals & Equipment", value: "rentals" },
    { icon: MapPin, title: "Tourism & Travel", value: "tourism" },
    { icon: Laptop, title: "Technology", value: "tech" },
    { icon: CreditCard, title: "Finance & Banking", value: "finance" },
    { icon: Heart, title: "Healthcare", value: "healthcare" },
    { icon: GraduationCap, title: "Education", value: "education" },
    { icon: Film, title: "Entertainment", value: "entertainment" },
  ];

  return (
    <section className="py-20 px-6 bg-accent/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Industries We <span className="gradient-text">Serve</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From restaurants to retail, we build complete digital solutions tailored to each industry's unique needs
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {industries.map((industry, index) => (
            <div 
              key={index} 
              className="industry-card group cursor-pointer text-center"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-hero rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <industry.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground leading-tight">
                  {industry.title}
                </h3>
              </div>
              
              <div className="mt-3 w-full h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-hero rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;
import { 
  UtensilsCrossed, 
  Dumbbell, 
  ShoppingBag, 
  Car, 
  Home, 
  Scissors 
} from "lucide-react";

const IndustriesSection = () => {
  const industries = [
    {
      icon: UtensilsCrossed,
      title: "Food & Restaurants",
      description: "Showcase your culinary artistry and dining atmosphere"
    },
    {
      icon: Dumbbell,
      title: "Fitness & Gyms",
      description: "Motivate and inspire with high-energy fitness content"
    },
    {
      icon: ShoppingBag,
      title: "Retail",
      description: "Highlight products and create shopping experiences"
    },
    {
      icon: Car,
      title: "Automotive",
      description: "Display vehicles and services with dynamic visuals"
    },
    {
      icon: Home,
      title: "Real Estate",
      description: "Bring properties to life with immersive tours"
    },
    {
      icon: Scissors,
      title: "Beauty & Salons",
      description: "Capture transformations and beauty experiences"
    }
  ];

  return (
    <section className="py-20 px-6 bg-accent/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Industries We <span className="gradient-text">Serve</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From restaurants to retail, we understand what makes each industry unique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <div 
              key={index} 
              className="industry-card group cursor-pointer"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <industry.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {industry.title}
                </h3>
              </div>
              
              <p className="text-muted-foreground leading-relaxed">
                {industry.description}
              </p>
              
              <div className="mt-4 w-full h-2 bg-muted rounded-full overflow-hidden">
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
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
      description: "Complete ordering systems, AI chatbots, and engagement videos that showcase your culinary artistry"
    },
    {
      icon: Dumbbell,
      title: "Fitness & Gyms",
      description: "Member portals, automated marketing, and motivational content that drives membership growth"
    },
    {
      icon: ShoppingBag,
      title: "Retail",
      description: "E-commerce platforms, inventory dashboards, and product videos that boost sales"
    },
    {
      icon: Car,
      title: "Automotive",
      description: "Customer management systems, AI lead qualification, and showcase videos that sell vehicles"
    },
    {
      icon: Home,
      title: "Real Estate",
      description: "Property management platforms, automated follow-ups, and immersive virtual tours"
    },
    {
      icon: Scissors,
      title: "Beauty & Salons",
      description: "Booking systems, client engagement tools, and transformation videos that attract customers"
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
            From restaurants to retail, we build complete digital solutions tailored to each industry's unique needs
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
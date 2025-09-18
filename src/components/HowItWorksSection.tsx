import { MessageSquare, Code, Zap } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: MessageSquare,
      title: "Discover & Strategy",
      description: "We analyze your business needs and design a complete digital strategy tailored to your goals",
      color: "bg-primary"
    },
    {
      icon: Code,
      title: "Build & Integrate",
      description: "Our team develops your web platform, AI agents, videos, and dashboards as one cohesive system",
      color: "bg-coral"
    },
    {
      icon: Zap,
      title: "Launch & Scale",
      description: "Deploy your complete digital ecosystem and watch your business grow with automated marketing",
      color: "bg-primary-dark"
    }
  ];

  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to build your complete digital ecosystem
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-10 h-10 text-white" />
              </div>
              
              <div className="relative">
                <div className="text-6xl font-bold text-muted/10 absolute -top-4 left-1/2 transform -translate-x-1/2 -z-10">
                  {String(index + 1).padStart(2, '0')}
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-4 relative z-10">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gradient-hero" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
import { Lightbulb, Zap, Clock, Share2 } from "lucide-react";

const WhyChooseSection = () => {
  const reasons = [
    {
      icon: Lightbulb,
      title: "Complete Tech Partner",
      description: "From web development to AI marketing agents, we build integrated systems that work together seamlessly."
    },
    {
      icon: Zap,
      title: "AI-Powered Growth",
      description: "Our automated marketing agents and engagement videos work 24/7 to attract and convert customers."
    },
    {
      icon: Clock,
      title: "Rapid Development",
      description: "Modern development practices and agile workflows mean faster time-to-market for your digital solutions."
    },
    {
      icon: Share2,
      title: "Scalable Solutions",
      description: "Built for growth - our platforms and systems scale automatically as your business expands."
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why Choose <span className="gradient-text">Jovial</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're not just another development agency - we're your complete creative tech partner
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {reasons.map((reason, index) => (
            <div key={index} className="flex items-start space-x-6 group">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <reason.icon className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                  {reason.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-card rounded-3xl p-8 md:p-12 border border-border shadow-soft">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">
                Ready to Build Your Digital Empire?
              </h3>
              <p className="text-lg text-muted-foreground mb-8">
                Join hundreds of businesses that have transformed their operations with Jovial's integrated tech solutions.
              </p>
              <button 
                onClick={() => {
                  const element = document.getElementById('contact');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="btn-hero"
              >
                Start Your Journey
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">200+</div>
                <p className="text-muted-foreground">Projects Delivered</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">98%</div>
                <p className="text-muted-foreground">Client Satisfaction</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">48h</div>
                <p className="text-muted-foreground">Average Response</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">50+</div>
                <p className="text-muted-foreground">Industries Served</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
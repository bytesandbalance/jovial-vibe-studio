import { Play, Volume2 } from "lucide-react";

const SamplesGallery = () => {
  const samples = [
    {
      title: "Restaurant Ambiance",
      description: "Creating the perfect dining atmosphere",
      category: "Food & Beverage"
    },
    {
      title: "Fitness Motivation",
      description: "High-energy workout inspiration",
      category: "Fitness"
    },
    {
      title: "Retail Experience",
      description: "Product showcase and store culture",
      category: "Retail"
    },
    {
      title: "Automotive Excellence",
      description: "Vehicle presentation and service quality",
      category: "Automotive"
    },
    {
      title: "Property Showcase",
      description: "Immersive real estate tours",
      category: "Real Estate"
    },
    {
      title: "Beauty Transformation",
      description: "Capturing style and elegance",
      category: "Beauty"
    }
  ];

  return (
    <section id="samples" className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Sample <span className="gradient-text">Gallery</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how we transform businesses through the power of video storytelling
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {samples.map((sample, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="video-placeholder h-64 rounded-2xl mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-coral/20" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Play className="w-8 h-8 text-primary ml-1" />
                  </div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-white" />
                    <div className="w-16 h-1 bg-white/30 rounded-full">
                      <div className="w-8 h-1 bg-white rounded-full" />
                    </div>
                  </div>
                  <span className="text-white text-sm font-medium">2:34</span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {sample.category}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {sample.title}
                </h3>
                <p className="text-muted-foreground">
                  {sample.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => {
              const element = document.getElementById('contact');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="btn-hero"
          >
            View Full Portfolio
          </button>
        </div>
      </div>
    </section>
  );
};

export default SamplesGallery;
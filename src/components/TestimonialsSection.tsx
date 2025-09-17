import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      business: "Bloom Cafe",
      industry: "Restaurant",
      rating: 5,
      quote: "Jovial didn't just make us a video - they captured the soul of our cafe. Our customers now come not just for coffee, but for the experience we've built together.",
      image: "/placeholder-testimonial-1.jpg"
    },
    {
      name: "Marcus Rodriguez",
      business: "FitZone Gym",
      industry: "Fitness",
      rating: 5,
      quote: "The energy in their videos is contagious. Our membership has grown 40% since launching our brand content with Jovial. People want to be part of our fitness community.",
      image: "/placeholder-testimonial-2.jpg"
    },
    {
      name: "Jennifer Chen",
      business: "Luxe Auto Dealership",
      industry: "Automotive",
      rating: 5,
      quote: "They understood that we're not just selling cars - we're selling dreams and lifestyle. Their holistic approach has transformed how customers see our brand.",
      image: "/placeholder-testimonial-3.jpg"
    }
  ];

  return (
    <section className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            What Our Clients <span className="gradient-text">Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Real businesses, real results, real transformations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card rounded-3xl p-8 border border-border shadow-soft hover:shadow-brand transition-all duration-300 group">
              {/* Quote Icon */}
              <div className="w-12 h-12 bg-gradient-hero rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Quote className="w-6 h-6 text-white" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-coral text-coral" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-lg text-foreground mb-8 leading-relaxed italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Client Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-brand rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-muted-foreground text-sm">
                    {testimonial.business} • {testimonial.industry}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-6">
            Join over 200+ satisfied businesses
          </p>
          <button className="btn-hero-outline">
            Read More Reviews
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
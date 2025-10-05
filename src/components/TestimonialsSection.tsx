import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Michael Weber",
      business: "Erste-Hilfe-Rettet-Leben.de",
      website: "https://erste-hilfe-rettet-leben.de",
      industry: "Online Education",
      rating: 5,
      quote: "We were stuck depending on influencers and paid ads to sell our first aid courses. Jovial's automation changed everything - now we sell courses every single day through automated content, smart lead capture, and engagement workflows. It just runs in the background while we focus on creating better courses.",
      image: "/placeholder-testimonial-1.jpg"
    },
    {
      name: "Sarah Klein",
      business: "ProAvatar.de",
      website: "https://proavatar.de",
      industry: "Interactive Tech",
      rating: 5,
      quote: "Honestly, promoting our avatar service was taking up too much time. Jovial set up this whole system that creates content, integrates our video avatars, and posts across channels automatically. We're getting way more visibility now and I barely have to think about marketing anymore.",
      image: "/placeholder-testimonial-2.jpg"
    },
    {
      name: "Isabella Torres",
      business: "ICNZ",
      website: "https://icnz.co.nz",
      industry: "Fashion",
      rating: 5,
      quote: "Launching our online store felt overwhelming, but Jovial Studio made it seamless. They built us a beautiful modern website and automated our whole marketing flow. Now our campaigns run smoothly from the website straight through to sales - it's exactly what we needed.",
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
                    {testimonial.business.split(/[\s.-]/)[0].substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div>
                  <a 
                    href={testimonial.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 font-semibold transition-colors"
                  >
                    {testimonial.business}
                  </a>
                  <p className="text-muted-foreground text-xs">
                    {testimonial.industry}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Join over 200+ satisfied businesses creating authentic brand experiences
          </p>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
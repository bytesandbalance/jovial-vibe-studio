const ApproachSection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our <span className="gradient-text">Approach</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-hero mx-auto mb-8 rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground leading-relaxed">
              We don't just target customers like a single antibody
            </h3>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Instead, we create the energy that makes your audience respond naturally, 
              like a fever that activates the body's defenses. Our holistic approach 
              builds genuine culture and excitement around your brand.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-primary rounded-full flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Culture-First Content</h4>
                  <p className="text-muted-foreground">We focus on building your brand's personality and community</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-coral rounded-full flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Energy-Driven Strategy</h4>
                  <p className="text-muted-foreground">Create content that naturally attracts and engages your audience</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-primary-light rounded-full flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Organic Growth</h4>
                  <p className="text-muted-foreground">Build lasting relationships, not just quick conversions</p>
                </div>
              </div>
            </div>
          </div>

          <div className="video-placeholder h-96 rounded-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-white rounded-full" />
              </div>
              <p className="text-white/80 font-medium">Video Placeholder</p>
              <p className="text-white/60 text-sm mt-2">Approach explanation video</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApproachSection;
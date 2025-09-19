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
              We build complete digital ecosystems, not just isolated solutions
            </h3>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your business needs more than a website or a video. We create integrated 
              systems that work together — from web development and AI marketing agents 
              to engagement videos and backend dashboards — all designed to amplify your growth.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-primary rounded-full flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Full-Stack Development</h4>
                  <p className="text-muted-foreground">Web apps, mobile solutions, and backend dashboards that scale with your business</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-coral rounded-full flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">AI-Powered Marketing</h4>
                  <p className="text-muted-foreground">Automated agents and engagement videos that work 24/7 to grow your audience</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-6 h-6 bg-primary-light rounded-full flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Integrated Solutions</h4>
                  <p className="text-muted-foreground">Everything works together seamlessly for maximum impact and efficiency</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative h-96 rounded-2xl overflow-hidden shadow-brand">
            <video 
              className="w-full h-full object-cover rounded-2xl"
              controls
              poster="https://gvcaipqaspgguzgncupa.supabase.co/storage/v1/object/public/videos/document_5650178328569577477.mp4"
            >
              <source 
                src="https://gvcaipqaspgguzgncupa.supabase.co/storage/v1/object/public/videos/document_5650178328569577477.mp4" 
                type="video/mp4" 
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApproachSection;
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MarketingDashboard from '@/components/dashboards/MarketingDashboard';

const PortfolioPreviewLink = () => {

  return (
    <section id="portfolio-preview" className="py-24 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--coral))] to-[hsl(var(--foreground))] bg-clip-text text-transparent">
            Our Portfolio
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our complete range of creative solutions - dashboards, web applications, and AI automation
          </p>
        </div>

        <Link to="/portfolio" className="block group">
          <div className="relative max-w-7xl mx-auto bg-gradient-to-br from-background/95 to-secondary/30 backdrop-blur-sm border border-primary/20 hover:border-coral/50 rounded-3xl p-10 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
            
            {/* Top Section - Dashboard */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 text-[hsl(var(--coral))]">Analytics Dashboards</h3>
              <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-card border border-border shadow-lg">
                <div className="w-full h-full scale-[0.4] origin-top-left transform -translate-x-[30%] -translate-y-[30%]">
                  <div style={{ width: '250%', height: '250%' }}>
                    <MarketingDashboard />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 bg-[hsl(var(--coral))]/90 text-white text-sm px-3 py-1.5 rounded-full font-medium">
                  Interactive Dashboards
                </div>
              </div>
            </div>

            {/* Web Applications Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 text-[hsl(var(--coral))]">Web Applications</h3>
              <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-gradient-to-br from-background to-secondary/10 border border-primary/20 shadow-lg">
                <img 
                  src="/jovial-screenshot.png" 
                  alt="Jovial Modulet Web Application"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Code className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-[hsl(var(--coral))]/90 text-white text-sm px-3 py-1.5 rounded-full font-medium">
                  Live Web Platform
                </div>
              </div>
            </div>

            {/* AI Automation Preview */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4 text-[hsl(var(--coral))]">AI Agents & Automation</h3>
              <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-accent/10 to-coral/10 border border-primary/20 shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-6 px-8">
                    <Bot className="w-20 h-20 text-primary mx-auto animate-pulse" />
                    <div>
                      <h4 className="text-2xl font-bold text-foreground mb-3">Intelligent Automation Solutions</h4>
                      <p className="text-muted-foreground text-lg">AI-powered chatbots, email campaigns, and workflow automation</p>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 bg-[hsl(var(--coral))]/90 text-white text-sm px-3 py-1.5 rounded-full font-medium">
                  AI-Powered Solutions
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center pt-4">
              <Button size="lg" className="bg-gradient-to-r from-[hsl(var(--coral))] to-[hsl(var(--primary))] hover:from-[hsl(var(--coral))]/90 hover:to-[hsl(var(--primary))]/90 text-white group-hover:scale-105 transition-all duration-300 px-8 py-3 text-lg">
                View Full Portfolio
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-muted-foreground mt-4 text-sm">
                Click to explore all our projects and detailed case studies
              </p>
            </div>

            {/* Enhanced Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--coral))]/5 via-transparent to-[hsl(var(--primary))]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        </Link>
      </div>
    </section>
  );
};

export default PortfolioPreviewLink;
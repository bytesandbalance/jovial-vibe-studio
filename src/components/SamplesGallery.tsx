import { useState, useEffect } from "react";
import { Play, Volume2, Code, BarChart3, Bot, ExternalLink, Sparkles, Zap, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Import dashboard components
import MarketingDashboard from './dashboards/MarketingDashboard';
import SalesDashboard from './dashboards/SalesDashboard';

interface Video {
  id?: string;
  title: string;
  description: string;
  category: string;
  file_url?: string;
  thumbnail_url?: string;
  duration?: number;
}

interface SampleItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'video' | 'mockup' | 'dashboard' | 'webapp';
  file_url?: string;
  thumbnail_url?: string;
  mockup_url?: string;
  duration?: number;
  demo_url?: string;
  component?: React.ComponentType;
}

const CATEGORY_MAP = {
  'ads': 'Creative Campaigns',
  'web_apps': 'Web & Apps',
  'dashboards': 'Analytics',
  'ai_agents': 'AI Automation',
} as const;

// Sample items showcasing different services
const SAMPLE_SHOWCASE_ITEMS: SampleItem[] = [
  {
    id: 'sample-web-1',
    title: 'Jovial Studio Platform',
    description: 'Live responsive business platform with full functionality',
    category: 'web_apps',
    type: 'webapp',
    demo_url: 'https://jovial.modulet.de'
  },
  {
    id: 'sample-dash-1',
    title: 'Marketing Analytics',
    description: 'Interactive dashboard with campaign performance metrics',
    category: 'dashboards',
    type: 'dashboard',
    component: MarketingDashboard
  },
  {
    id: 'sample-dash-2',
    title: 'Sales Performance',
    description: 'Real-time sales tracking and revenue analytics',
    category: 'dashboards',
    type: 'dashboard',
    component: SalesDashboard
  }
];

// Helper function to convert category value to display label
const getCategoryLabel = (category: string): string => {
  if (category in CATEGORY_MAP) {
    return CATEGORY_MAP[category as keyof typeof CATEGORY_MAP];
  }
  // For dynamic categories, convert snake_case to Title Case
  return category
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const SamplesGallery = () => {
  const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);
  const [allSampleItems, setAllSampleItems] = useState<SampleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSampleData();
  }, []);

  const fetchSampleData = async () => {
    try {
      // Get featured videos from database
      const { data: allFeaturedVideos, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert one featured video to sample item for ads category
      let videoSampleItems: SampleItem[] = [];
      if (allFeaturedVideos && allFeaturedVideos.length > 0) {
        const featuredVideo = allFeaturedVideos[0]; // Take the most recent
        videoSampleItems = [{
          id: featuredVideo.id,
          title: featuredVideo.title,
          description: featuredVideo.description,
          category: 'ads',
          type: 'video',
          file_url: featuredVideo.file_url,
          thumbnail_url: featuredVideo.thumbnail_url,
          duration: featuredVideo.duration
        }];
        setFeaturedVideos([featuredVideo]);
      }

      // Combine video samples with service showcase items
      setAllSampleItems([...videoSampleItems, ...SAMPLE_SHOWCASE_ITEMS]);
    } catch (error) {
      console.error('Error fetching sample data:', error);
      setAllSampleItems(SAMPLE_SHOWCASE_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  const displayItems = allSampleItems.length > 0 ? allSampleItems : SAMPLE_SHOWCASE_ITEMS;

  return (
    <section id="samples" className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our <span className="gradient-text">Solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From compelling video campaigns to intelligent web applications - discover how we transform businesses with complete creative tech solutions
          </p>
        </div>

        {/* Main Service Categories */}
        <div className="space-y-20">
          {/* Row 0: Tools - New Section */}
          <section className="relative border-b border-border/50 pb-16">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-coral/10 rounded-3xl -z-10" />
            
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our <span className="gradient-text">Tools</span>
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
                Powerful automation tools that transform your content and workflows
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">More coming soon — All at very low prices, one-off payment + light maintenance</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* CourseSpark */}
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 border-2 border-primary/40 hover:border-primary/70 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  
                  <div className="relative p-8 space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-brand rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        CourseSpark
                      </h3>
                      <p className="text-base font-semibold text-primary/90 italic">
                        Turn your course into a content galaxy — videos, freebies, and social posts, all auto-generated.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        CourseSpark transforms your video course into bite-sized marketing gold. It writes your captions, builds your PDF freebies, and crafts ready-to-post reels — all from your own lessons. One click, and your next lead magnet, newsletter, and promo post are done.
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      <Zap className="w-4 h-4" />
                      <span>Auto-generate marketing content from courses</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BookFlow */}
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-coral/20 via-accent/15 to-coral/10 border-2 border-coral/40 hover:border-coral/70 transition-all duration-500 hover:shadow-2xl hover:shadow-coral/30 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  
                  <div className="relative p-8 space-y-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-coral to-coral/70 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-coral transition-colors duration-300">
                        BookFlow
                      </h3>
                      <p className="text-base font-semibold text-coral italic">
                        Keep clients, forget the admin.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        BookFlow automates your entire client journey. It logs every new booking, sends reminders, follows up for feedback, and nudges clients to rebook — all through Outlook. Focus on your business, BookFlow handles the rest.
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-coral font-medium">
                      <Zap className="w-4 h-4" />
                      <span>Complete booking automation via Outlook</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Row 1: Marketing & Sales Dashboards */}
          <section className="border-b border-border/50 pb-16">
            <div className="mb-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Marketing & Sales Dashboards</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">Interactive analytics and performance tracking tools for data-driven insights</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayItems
                .filter(item => item.category === 'dashboards')
                .slice(0, 2)
                .map((item, index) => (
                  <div key={item.id || index} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-2xl aspect-[16/9] h-52 bg-card border border-border">
                      {item.component && (
                        <div className="w-full h-full overflow-hidden">
                          <div className="scale-[0.25] origin-top-left transform -translate-x-[25%] -translate-y-[25%]">
                            <div style={{ width: '400%', height: '400%' }}>
                              <item.component />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-14 h-14 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <BarChart3 className="w-7 h-7 text-primary" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h4>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* Row 3: Web & App Development */}
          <section className="border-b border-border/50 pb-16">
            <div className="mb-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Web & App Development</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">Custom web applications and platforms built with modern technology</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group cursor-pointer" onClick={() => window.open('https://jovial.modulet.de', '_blank')}>
                <div className="relative overflow-hidden rounded-2xl aspect-[16/9] h-52 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-colors duration-300">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Code className="w-14 h-14 text-primary mx-auto" />
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Jovial Studio Platform</h4>
                        <p className="text-sm text-muted-foreground px-4">Live responsive business platform</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="bg-background/90 hover:bg-background"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Demo
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="group cursor-pointer opacity-60">
                <div className="relative overflow-hidden rounded-2xl aspect-[16/9] h-52 bg-gradient-to-br from-muted/20 to-muted/10 border-2 border-dashed border-muted">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Code className="w-10 h-10 text-muted-foreground mx-auto" />
                      <p className="text-sm text-muted-foreground">More Projects Coming Soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI Agents & Automation - Enhanced */}
          <section className="relative">
            {/* Gradient Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-coral/5 rounded-3xl -z-10" />
            
            <div className="mb-16 text-center">
              <div className="inline-flex items-center justify-center mb-4">
                <Bot className="w-12 h-12 text-primary animate-pulse" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                AI Agents & <span className="gradient-text">Intelligent Automation</span>
              </h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Transform your business with cutting-edge AI solutions that work 24/7 to enhance customer engagement, 
                streamline operations, and drive measurable growth
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {/* AI Chatbot */}
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-3xl aspect-[4/3] bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border-2 border-primary/30 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-60" />
                  
                  <div className="relative w-full h-full flex items-center justify-center p-8">
                    <div className="text-center space-y-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-background/90 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Bot className="w-10 h-10 text-primary" />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          AI-Powered Chatbots
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Intelligent conversational AI that handles customer inquiries, provides instant support, 
                          and learns from every interaction
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Automation */}
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-3xl aspect-[4/3] bg-gradient-to-br from-coral/20 via-coral/10 to-primary/20 border-2 border-coral/30 hover:border-coral/60 transition-all duration-500 hover:shadow-2xl hover:shadow-coral/20 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-60" />
                  
                  <div className="relative w-full h-full flex items-center justify-center p-8">
                    <div className="text-center space-y-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-background/90 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Volume2 className="w-10 h-10 text-coral" />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-xl font-bold text-foreground group-hover:text-coral transition-colors duration-300">
                          Smart Email Campaigns
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Personalized marketing automation that delivers the right message at the perfect time, 
                          maximizing engagement and conversions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow Automation */}
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-3xl aspect-[4/3] bg-gradient-to-br from-accent/20 via-accent/10 to-primary/20 border-2 border-accent/30 hover:border-accent/60 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-60" />
                  
                  <div className="relative w-full h-full flex items-center justify-center p-8">
                    <div className="text-center space-y-6">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-background/90 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <BarChart3 className="w-10 h-10 text-accent-foreground" />
                      </div>
                      <div className="space-y-3">
                        <h4 className="text-xl font-bold text-foreground group-hover:text-accent-foreground transition-colors duration-300">
                          Intelligent Workflows
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          Advanced automation systems that optimize processes, reduce manual tasks, 
                          and free your team to focus on strategic growth
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Benefits Section */}
            <div className="mt-12 text-center">
              <div className="inline-flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 px-4 py-2 bg-background/60 rounded-full border border-border">
                  <span className="text-primary">✓</span>
                  <span>24/7 Availability</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-background/60 rounded-full border border-border">
                  <span className="text-primary">✓</span>
                  <span>Scalable Solutions</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-background/60 rounded-full border border-border">
                  <span className="text-primary">✓</span>
                  <span>Data-Driven Insights</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-background/60 rounded-full border border-border">
                  <span className="text-primary">✓</span>
                  <span>Seamless Integration</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/portfolio')}
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
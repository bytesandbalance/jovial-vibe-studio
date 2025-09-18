import { useState, useEffect } from "react";
import { Play, Volume2, Code, BarChart3, Bot, ExternalLink } from "lucide-react";
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

        {/* Five Main Service Categories */}
        <div className="space-y-20">
          {/* Row 1: Video Ads & Creative Campaigns */}
          <section className="border-b border-border/50 pb-16">
            <div className="mb-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Video Ads & Creative Campaigns</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">Dynamic video content that captures attention and drives engagement across industries</p>
            </div>
            
            {/* Video Ads Subcategories */}
            <div className="space-y-12">
              {/* Clothing & Fashion */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-6 border-l-4 border-primary pl-4">Clothing & Fashion</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayItems
                    .filter(item => item.category === 'ads' && (item.title.toLowerCase().includes('clothing') || item.title.toLowerCase().includes('fashion')))
                    .slice(0, 4)
                    .map((item, index) => (
                      <div key={item.id || index} className="group cursor-pointer text-center">
                        <div className="relative overflow-hidden rounded-2xl aspect-[9/16] h-56 max-w-xs mx-auto mb-4">
                          {item.file_url ? (
                            <video
                              src={item.file_url}
                              poster={item.thumbnail_url}
                              className="w-full h-full object-cover"
                              controls={false}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-coral/20" />
                          )}
                          
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <Play className="w-6 h-6 text-primary ml-1" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <h5 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors duration-300">
                            {item.title}
                          </h5>
                          <p className="text-muted-foreground text-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  {displayItems.filter(item => item.category === 'ads' && (item.title.toLowerCase().includes('clothing') || item.title.toLowerCase().includes('fashion'))).length === 0 && (
                    <div className="col-span-full text-center py-6">
                      <p className="text-muted-foreground text-sm">Fashion campaign samples coming soon</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Food & Beverage */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-6 border-l-4 border-coral pl-4">Food & Beverage</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayItems
                    .filter(item => item.category === 'ads' && (item.title.toLowerCase().includes('food') || item.title.toLowerCase().includes('beverage') || item.title.toLowerCase().includes('restaurant')))
                    .slice(0, 4)
                    .map((item, index) => (
                      <div key={item.id || index} className="group cursor-pointer text-center">
                        <div className="relative overflow-hidden rounded-2xl aspect-[9/16] h-56 max-w-xs mx-auto mb-4">
                          {item.file_url ? (
                            <video
                              src={item.file_url}
                              poster={item.thumbnail_url}
                              className="w-full h-full object-cover"
                              controls={false}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-coral/20 to-primary/20" />
                          )}
                          
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <Play className="w-6 h-6 text-coral ml-1" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <h5 className="font-semibold text-foreground text-sm group-hover:text-coral transition-colors duration-300">
                            {item.title}
                          </h5>
                          <p className="text-muted-foreground text-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  {displayItems.filter(item => item.category === 'ads' && (item.title.toLowerCase().includes('food') || item.title.toLowerCase().includes('beverage') || item.title.toLowerCase().includes('restaurant'))).length === 0 && (
                    <div className="col-span-full text-center py-6">
                      <p className="text-muted-foreground text-sm">Food & beverage campaign samples coming soon</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Fitness & Health */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-6 border-l-4 border-accent pl-4">Fitness & Health</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayItems
                    .filter(item => item.category === 'ads' && (item.title.toLowerCase().includes('fitness') || item.title.toLowerCase().includes('health') || item.title.toLowerCase().includes('gym')))
                    .slice(0, 4)
                    .map((item, index) => (
                      <div key={item.id || index} className="group cursor-pointer text-center">
                        <div className="relative overflow-hidden rounded-2xl aspect-[9/16] h-56 max-w-xs mx-auto mb-4">
                          {item.file_url ? (
                            <video
                              src={item.file_url}
                              poster={item.thumbnail_url}
                              className="w-full h-full object-cover"
                              controls={false}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20" />
                          )}
                          
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <Play className="w-6 h-6 text-accent ml-1" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <h5 className="font-semibold text-foreground text-sm group-hover:text-accent transition-colors duration-300">
                            {item.title}
                          </h5>
                          <p className="text-muted-foreground text-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  {displayItems.filter(item => item.category === 'ads' && (item.title.toLowerCase().includes('fitness') || item.title.toLowerCase().includes('health') || item.title.toLowerCase().includes('gym'))).length === 0 && (
                    <div className="col-span-full text-center py-6">
                      <p className="text-muted-foreground text-sm">Fitness & health campaign samples coming soon</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Automotive */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-6 border-l-4 border-muted-foreground pl-4">Automotive</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayItems
                    .filter(item => item.category === 'ads' && (item.title.toLowerCase().includes('car') || item.title.toLowerCase().includes('auto') || item.title.toLowerCase().includes('bike') || item.title.toLowerCase().includes('vehicle')))
                    .slice(0, 4)
                    .map((item, index) => (
                      <div key={item.id || index} className="group cursor-pointer text-center">
                        <div className="relative overflow-hidden rounded-2xl aspect-[9/16] h-56 max-w-xs mx-auto mb-4">
                          {item.file_url ? (
                            <video
                              src={item.file_url}
                              poster={item.thumbnail_url}
                              className="w-full h-full object-cover"
                              controls={false}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-primary/20" />
                          )}
                          
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <Play className="w-6 h-6 text-muted-foreground ml-1" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <h5 className="font-semibold text-foreground text-sm group-hover:text-muted-foreground transition-colors duration-300">
                            {item.title}
                          </h5>
                          <p className="text-muted-foreground text-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  {displayItems.filter(item => item.category === 'ads' && (item.title.toLowerCase().includes('car') || item.title.toLowerCase().includes('auto') || item.title.toLowerCase().includes('bike') || item.title.toLowerCase().includes('vehicle'))).length === 0 && (
                    <div className="col-span-full text-center py-6">
                      <p className="text-muted-foreground text-sm">Automotive campaign samples coming soon</p>
                    </div>
                  )}
                </div>
              </div>

              {/* General & Others */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-6 border-l-4 border-primary pl-4">General & Others</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {displayItems
                    .filter(item => item.category === 'ads' && 
                      !item.title.toLowerCase().includes('clothing') && 
                      !item.title.toLowerCase().includes('fashion') &&
                      !item.title.toLowerCase().includes('food') && 
                      !item.title.toLowerCase().includes('beverage') && 
                      !item.title.toLowerCase().includes('restaurant') &&
                      !item.title.toLowerCase().includes('fitness') && 
                      !item.title.toLowerCase().includes('health') && 
                      !item.title.toLowerCase().includes('gym') &&
                      !item.title.toLowerCase().includes('car') && 
                      !item.title.toLowerCase().includes('auto') && 
                      !item.title.toLowerCase().includes('bike') && 
                      !item.title.toLowerCase().includes('vehicle'))
                    .slice(0, 4)
                    .map((item, index) => (
                      <div key={item.id || index} className="group cursor-pointer text-center">
                        <div className="relative overflow-hidden rounded-2xl aspect-[9/16] h-56 max-w-xs mx-auto mb-4">
                          {item.file_url ? (
                            <video
                              src={item.file_url}
                              poster={item.thumbnail_url}
                              className="w-full h-full object-cover"
                              controls={false}
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-coral/20" />
                          )}
                          
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                              <Play className="w-6 h-6 text-primary ml-1" />
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <h5 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors duration-300">
                            {item.title}
                          </h5>
                          <p className="text-muted-foreground text-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  {displayItems.filter(item => item.category === 'ads').length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <p className="text-muted-foreground">Video ad showcase coming soon</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Row 2: Marketing & Sales Dashboards */}
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

          {/* Row 4: Virtual Spokesperson Videos */}
          <section className="border-b border-border/50 pb-16">
            <div className="mb-12 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Virtual Spokesperson Videos</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">AI-powered spokesperson content for engaging communication and brand messaging</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group cursor-pointer" onClick={() => window.open('https://www.youtube.com/@BytesBalance/shorts', '_blank')}>
                <div className="relative overflow-hidden rounded-2xl aspect-[9/16] h-72 max-w-xs mx-auto bg-gradient-to-br from-coral/20 to-primary/20">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Play className="w-14 h-14 text-coral mx-auto" />
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Product Explainer</h4>
                        <p className="text-sm text-muted-foreground">YouTube Shorts</p>
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
                      YouTube
                    </Button>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer" onClick={() => window.open('https://www.youtube.com/@BytesBalance/shorts', '_blank')}>
                <div className="relative overflow-hidden rounded-2xl aspect-[9/16] h-72 max-w-xs mx-auto bg-gradient-to-br from-primary/20 to-coral/20">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Play className="w-14 h-14 text-primary mx-auto" />
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Welcome Message</h4>
                        <p className="text-sm text-muted-foreground">Engaging intro</p>
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
                      YouTube
                    </Button>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer" onClick={() => window.open('https://www.youtube.com/@BytesBalance/shorts', '_blank')}>
                <div className="relative overflow-hidden rounded-2xl aspect-[9/16] h-72 max-w-xs mx-auto bg-gradient-to-br from-accent/20 to-primary/20">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Play className="w-14 h-14 text-accent-foreground mx-auto" />
                      <div className="space-y-2">
                        <h4 className="font-semibold text-foreground">Training Video</h4>
                        <p className="text-sm text-muted-foreground">Educational content</p>
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
                      YouTube
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Row 5: AI Agents & Automation */}
          <section>
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-3">AI Agents for Automated Marketing</h3>
              <p className="text-muted-foreground">Intelligent automation solutions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] h-48 bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Bot className="w-12 h-12 text-primary mx-auto" />
                      <div className="space-y-1">
                        <h4 className="font-semibold text-foreground text-sm">AI Chatbot</h4>
                        <p className="text-xs text-muted-foreground px-3">Customer service automation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] h-48 bg-gradient-to-br from-coral/10 to-primary/10 border-2 border-coral/20">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Bot className="w-12 h-12 text-coral mx-auto" />
                      <div className="space-y-1">
                        <h4 className="font-semibold text-foreground text-sm">Email Automation</h4>
                        <p className="text-xs text-muted-foreground px-3">Marketing sequences</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] h-48 bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/20">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-3">
                      <Bot className="w-12 h-12 text-accent-foreground mx-auto" />
                      <div className="space-y-1">
                        <h4 className="font-semibold text-foreground text-sm">Marketing Workflows</h4>
                        <p className="text-xs text-muted-foreground px-3">Lead nurturing systems</p>
                      </div>
                    </div>
                  </div>
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
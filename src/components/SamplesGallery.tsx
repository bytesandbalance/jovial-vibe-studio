import { useState, useEffect } from "react";
import { Play, Volume2, Code, BarChart3, Bot, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Import mock images
import dashboardMockup from '@/assets/dashboard-mockup.jpg';
import webappMockup from '@/assets/webapp-mockup.jpg';
import aiAgentMockup from '@/assets/ai-agent-mockup.jpg';

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
  type: 'video' | 'mockup';
  file_url?: string;
  thumbnail_url?: string;
  mockup_url?: string;
  duration?: number;
  demo_url?: string;
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
    title: 'Modern Business Platform',
    description: 'Responsive web application with cutting-edge design',
    category: 'web_apps',
    type: 'mockup',
    mockup_url: webappMockup,
    demo_url: 'https://jovial.modulet.de'
  },
  {
    id: 'sample-dash-1',
    title: 'Performance Analytics',
    description: 'Real-time marketing and sales dashboard',
    category: 'dashboards',
    type: 'mockup',
    mockup_url: dashboardMockup
  },
  {
    id: 'sample-ai-1',
    title: 'AI Customer Assistant',
    description: 'Intelligent automation for customer engagement',
    category: 'ai_agents',
    type: 'mockup',
    mockup_url: aiAgentMockup
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayItems.map((item, index) => (
            <div key={item.id || index} className="group cursor-pointer text-center">
              <div className={`relative overflow-hidden rounded-2xl mb-4 mx-auto ${
                item.type === 'video' ? 'aspect-[9/16] h-80 max-w-xs' : 'aspect-[16/9] h-64'
              }`}>
                {item.type === 'video' ? (
                  <>
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
                    
                    {/* Play Button for Videos */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Play className="w-8 h-8 text-primary ml-1" />
                      </div>
                    </div>

                    {/* Video Controls */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center space-x-2">
                        <Volume2 className="w-4 h-4 text-background" />
                        <div className="w-16 h-1 bg-background/30 rounded-full">
                          <div className="w-8 h-1 bg-background rounded-full" />
                        </div>
                      </div>
                      <span className="text-background text-sm font-medium">
                        {item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : '2:34'}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Mockup Image */}
                    <img
                      src={item.mockup_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay with Service Icon */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        {item.category === 'web_apps' && <Code className="w-8 h-8 text-primary" />}
                        {item.category === 'dashboards' && <BarChart3 className="w-8 h-8 text-primary" />}
                        {item.category === 'ai_agents' && <Bot className="w-8 h-8 text-primary" />}
                      </div>
                    </div>

                    {/* Demo Link */}
                    {item.demo_url && (
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button 
                          size="sm" 
                          variant="secondary" 
                          className="h-8 px-3 bg-background/90 hover:bg-background"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(item.demo_url, '_blank');
                          }}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Demo
                        </Button>
                      </div>
                    )}
                  </>
                )}

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground">
                    {getCategoryLabel(item.category)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
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
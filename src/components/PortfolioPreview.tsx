import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, ExternalLink, Code, BarChart3, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import MarketingDashboard from '@/components/dashboards/MarketingDashboard';
import SalesDashboard from '@/components/dashboards/SalesDashboard';

interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  thumbnail_url: string;
  duration: number;
}

interface PortfolioItem {
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

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  youtube_id: string;
  thumbnail_url?: string;
  display_order: number;
}

// Sample portfolio items for preview
const PREVIEW_PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'web-preview',
    title: 'Jovial Studio Platform',
    description: 'Live responsive business platform with modern design and full functionality.',
    category: 'web_apps',
    type: 'webapp',
    demo_url: 'https://jovial.modulet.de'
  },
  {
    id: 'dash-preview',
    title: 'Marketing Performance Dashboard',
    description: 'Interactive dashboard showing campaign performance, conversion rates, and ROI metrics.',
    category: 'dashboards',
    type: 'dashboard',
    component: MarketingDashboard
  }
];

const PortfolioPreview = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPreviewData();
  }, []);

  const fetchPreviewData = async () => {
    try {
      const [videosResponse, youtubeResponse] = await Promise.all([
        supabase.from('videos').select('*').limit(2),
        supabase.from('youtube_videos').select('*').order('display_order').limit(1)
      ]);

      if (videosResponse.data) setVideos(videosResponse.data);
      if (youtubeResponse.data) setYoutubeVideos(youtubeResponse.data);
    } catch (error) {
      console.error('Error fetching preview data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web_apps': return <Code className="w-5 h-5" />;
      case 'dashboards': return <BarChart3 className="w-5 h-5" />;
      case 'ai_agents': return <Bot className="w-5 h-5" />;
      default: return <Play className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <section id="portfolio-preview" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Portfolio</h2>
            <div className="animate-pulse bg-muted h-4 w-64 mx-auto rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio-preview" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Portfolio</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse range of creative campaigns, web applications, data dashboards, and AI solutions
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Video Ads Preview */}
          {videos.slice(0, 1).map((video) => (
            <Card key={video.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img 
                  src={video.thumbnail_url} 
                  alt={video.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <Badge variant="secondary" className="absolute top-3 left-3">
                  {formatDuration(video.duration)}
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon('ads')}
                  <Badge variant="outline">Video Campaign</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{video.description}</p>
              </CardContent>
            </Card>
          ))}

          {/* Web Apps & Dashboards Preview */}
          {PREVIEW_PORTFOLIO_ITEMS.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 h-48 flex items-center justify-center">
                {item.type === 'dashboard' && item.component && (
                  <div className="w-full h-full scale-75 origin-center transform transition-transform group-hover:scale-80">
                    <item.component />
                  </div>
                )}
                {item.type === 'webapp' && (
                  <div className="flex flex-col items-center justify-center text-center p-6">
                    <Code className="w-16 h-16 text-primary mb-4" />
                    <h4 className="font-semibold text-lg">Live Platform</h4>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon(item.category)}
                  <Badge variant="outline">
                    {item.type === 'dashboard' ? 'Dashboard' : 'Web App'}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{item.description}</p>
              </CardContent>
            </Card>
          ))}

          {/* AI Agents Preview */}
          {youtubeVideos.slice(0, 1).map((video) => (
            <Card key={video.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img 
                  src={video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
                  alt={video.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Play className="w-12 h-12 text-white" />
                </div>
                <Badge variant="secondary" className="absolute top-3 left-3">
                  YouTube
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  {getCategoryIcon('ai_agents')}
                  <Badge variant="outline">AI Agent</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{video.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Link to="/portfolio">
            <Button size="lg" className="group">
              View Full Portfolio
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="text-muted-foreground mt-3">
            Discover all our projects, case studies, and success stories
          </p>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPreview;
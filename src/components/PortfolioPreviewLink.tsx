import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, BarChart3, Code, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import MarketingDashboard from '@/components/dashboards/MarketingDashboard';

interface Video {
  id: string;
  title: string;
  description: string;
  file_url: string;
  thumbnail_url: string;
}

interface YouTubeVideo {
  id: string;
  title: string;
  youtube_id: string;
  thumbnail_url?: string;
}

const PortfolioPreviewLink = () => {
  const [video, setVideo] = useState<Video | null>(null);
  const [youtubeVideo, setYoutubeVideo] = useState<YouTubeVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPreviewData();
  }, []);

  const fetchPreviewData = async () => {
    try {
      const [videosResponse, youtubeResponse] = await Promise.all([
        supabase.from('videos').select('*').limit(1).single(),
        supabase.from('youtube_videos').select('*').order('display_order').limit(1).single()
      ]);

      if (videosResponse.data) setVideo(videosResponse.data);
      if (youtubeResponse.data) setYoutubeVideo(youtubeResponse.data);
    } catch (error) {
      console.error('Error fetching preview data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section id="portfolio-preview" className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse bg-muted h-64 w-full max-w-4xl mx-auto rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio-preview" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Our Portfolio</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our complete range of creative solutions - videos, dashboards, web apps, and AI agents
          </p>
        </div>

        <Link to="/portfolio" className="block group">
          <div className="relative max-w-6xl mx-auto bg-background/80 backdrop-blur-sm border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl overflow-hidden">
            
            {/* Preview Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              
              {/* Video Preview */}
              {video && (
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-coral/20">
                  {video.thumbnail_url ? (
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={video.file_url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-primary ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-background/80 text-xs px-2 py-1 rounded">
                    Video Ads
                  </div>
                </div>
              )}

              {/* Dashboard Preview */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-card border border-border">
                <div className="w-full h-full scale-[0.3] origin-top-left transform -translate-x-[35%] -translate-y-[35%]">
                  <div style={{ width: '333%', height: '333%' }}>
                    <MarketingDashboard />
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2 bg-background/80 text-xs px-2 py-1 rounded">
                  Dashboards
                </div>
              </div>

              {/* Web App Preview */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Code className="w-12 h-12 text-primary mb-2" />
                  <span className="text-xs font-medium">Live Platform</span>
                </div>
                <div className="absolute bottom-2 left-2 bg-background/80 text-xs px-2 py-1 rounded">
                  Web Apps
                </div>
              </div>

              {/* AI Agent Preview */}
              {youtubeVideo && (
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden">
                  <img 
                    src={youtubeVideo.thumbnail_url || `https://img.youtube.com/vi/${youtubeVideo.youtube_id}/maxresdefault.jpg`}
                    alt={youtubeVideo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    AI Agents
                  </div>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <Button size="lg" className="group-hover:scale-105 transition-transform duration-300">
                View Full Portfolio
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-muted-foreground mt-3 text-sm">
                Click to explore all our projects and case studies
              </p>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        </Link>
      </div>
    </section>
  );
};

export default PortfolioPreviewLink;
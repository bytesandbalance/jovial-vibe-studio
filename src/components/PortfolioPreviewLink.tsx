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
    <section id="portfolio-preview" className="py-24 bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[hsl(var(--coral))] to-[hsl(var(--foreground))] bg-clip-text text-transparent">
            Our Portfolio
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our complete range of creative solutions - videos, dashboards, web apps, and spokeswoman content
          </p>
        </div>

        <Link to="/portfolio" className="block group">
          <div className="relative max-w-7xl mx-auto bg-gradient-to-br from-background/95 to-secondary/30 backdrop-blur-sm border border-primary/20 hover:border-coral/50 rounded-3xl p-10 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden">
            
            {/* Top Section - Dashboard Only */}
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

            {/* Middle Grid - Video and Web App */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              
              {/* Video Preview */}
              {video && (
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-[hsl(var(--coral))]">Video Content</h3>
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-coral/20 shadow-lg">
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
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-[hsl(var(--coral))]/90 text-white text-sm px-3 py-1.5 rounded-full font-medium">
                      Video Ads
                    </div>
                  </div>
                </div>
              )}

              {/* Spokeswoman Preview */}
              {youtubeVideo && (
                <div>
                  <h3 className="text-2xl font-bold mb-4 text-[hsl(var(--coral))]">Spokeswoman Videos</h3>
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src={youtubeVideo.thumbnail_url || `https://img.youtube.com/vi/${youtubeVideo.youtube_id}/maxresdefault.jpg`}
                      alt={youtubeVideo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-primary ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 bg-[hsl(var(--coral))]/90 text-white text-sm px-3 py-1.5 rounded-full font-medium">
                      Spokeswoman
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Section - Web Apps */}
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
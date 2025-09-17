import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';

interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string;
  thumbnail_url: string;
  duration: number;
}

const CATEGORIES = [
  { value: 'all', label: 'All Videos', color: 'bg-primary' },
  { value: 'food', label: 'Food & Beverage', color: 'bg-coral' },
  { value: 'fitness', label: 'Fitness', color: 'bg-primary-dark' },
  { value: 'retail', label: 'Retail', color: 'bg-accent-foreground' },
  { value: 'automotive', label: 'Automotive', color: 'bg-muted-foreground' },
  { value: 'real_estate', label: 'Real Estate', color: 'bg-coral-light' },
  { value: 'beauty', label: 'Beauty', color: 'bg-primary-light' },
];

export default function PortfolioPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">Loading portfolio...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Button asChild variant="outline" className="group">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Our <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Explore our collection of videos that bring brands to life and create lasting connections with customers.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button asChild className="btn-hero">
              <Link to="/auth?mode=signup">
                Start Your Project <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8">
            {CATEGORIES.map((category) => (
              <TabsTrigger key={category.value} value={category.value}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory}>
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  No videos available in this category yet.
                </p>
                <p className="text-muted-foreground">
                  Check back soon for amazing content!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-accent h-64 mb-4">
                      {video.file_url ? (
                        <video
                          src={video.file_url}
                          poster={video.thumbnail_url}
                          className="w-full h-full object-cover"
                          controls={false}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-coral/20" />
                      )}
                      
                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <Play className="w-8 h-8 text-primary ml-1" />
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="absolute bottom-4 right-4">
                        <Badge variant="secondary" className="bg-background/80">
                          {formatDuration(video.duration || 0)}
                        </Badge>
                      </div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary text-primary-foreground">
                          {CATEGORIES.find(c => c.value === video.category)?.label || video.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-muted-foreground">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/10 to-coral/10 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Ready to Create Something Amazing?
          </h3>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let&apos;s bring your brand to life with professional video content that engages and inspires.
          </p>
          <Button asChild className="btn-hero">
            <Link to="/auth?mode=signup">
              Start Your Project Today <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
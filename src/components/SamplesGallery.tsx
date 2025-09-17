import { useState, useEffect } from "react";
import { Play, Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface Video {
  id?: string;
  title: string;
  description: string;
  category: string;
  file_url?: string;
  thumbnail_url?: string;
  duration?: number;
}

const CATEGORY_MAP = {
  'food': 'Food & Beverage',
  'fitness': 'Fitness', 
  'retail': 'Retail',
  'automotive': 'Automotive',
  'real_estate': 'Real Estate',
  'beauty': 'Beauty',
  'clothing': 'Clothing',
} as const;

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedVideos();
  }, []);

  const fetchFeaturedVideos = async () => {
    try {
      // Get all featured videos, then group by category to show one per category
      const { data: allFeaturedVideos, error } = await supabase
        .from('videos')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (allFeaturedVideos && allFeaturedVideos.length > 0) {
        // Group videos by category and take the first (most recent) from each category
        const videosByCategory = new Map<string, Video>();
        
        allFeaturedVideos.forEach(video => {
          if (!videosByCategory.has(video.category)) {
            videosByCategory.set(video.category, video);
          }
        });

        setFeaturedVideos(Array.from(videosByCategory.values()));
      } else {
        setFeaturedVideos([]);
      }
    } catch (error) {
      console.error('Error fetching featured videos:', error);
      setFeaturedVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback samples for empty categories
  const fallbackSamples: Video[] = [
    {
      id: 'fallback-1',
      title: "Restaurant Ambiance",
      description: "Creating the perfect dining atmosphere",
      category: "food"
    },
    {
      id: 'fallback-2',
      title: "Fitness Motivation", 
      description: "High-energy workout inspiration",
      category: "fitness"
    },
    {
      id: 'fallback-3',
      title: "Retail Experience",
      description: "Product showcase and store culture", 
      category: "retail"
    },
    {
      id: 'fallback-4',
      title: "Automotive Excellence",
      description: "Vehicle presentation and service quality",
      category: "automotive"
    },
    {
      id: 'fallback-5',
      title: "Property Showcase",
      description: "Immersive real estate tours",
      category: "real_estate"
    },
    {
      id: 'fallback-6',
      title: "Beauty Transformation",
      description: "Capturing style and elegance",
      category: "beauty"
    }
  ];

  const displayItems = featuredVideos.length > 0 ? featuredVideos : fallbackSamples;

  return (
    <section id="samples" className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Sample <span className="gradient-text">Gallery</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how we transform businesses through the power of video storytelling
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayItems.map((item, index) => (
            <div key={item.id || index} className="group cursor-pointer text-center">
              <div className="video-placeholder aspect-[9/16] h-80 rounded-2xl mb-4 relative overflow-hidden mx-auto max-w-xs">
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
                
                {/* Play Button */}
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
            onClick={() => {
              window.location.href = '/portfolio';
            }}
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
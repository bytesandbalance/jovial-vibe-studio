import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, DollarSign, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';

interface Purchase {
  id: string;
  video_id: string;
  purchase_price: number;
  purchase_date: string;
  download_url: string;
  videos: {
    title: string;
    description: string;
    category: string;
    file_url: string;
    thumbnail_url: string;
    duration: number;
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  'food': 'Food & Beverage',
  'fitness': 'Fitness',
  'retail': 'Retail',
  'automotive': 'Automotive',
  'real_estate': 'Real Estate',
  'beauty': 'Beauty',
};

export default function CustomerDashboard() {
  const { user, userRole, loading: authLoading } = useAuth();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    if (!authLoading && user) {
      if (userRole !== 'customer') {
        // Redirect non-customers
        window.location.href = userRole === 'owner' ? '/dashboard' : '/auth';
        return;
      }
      fetchPurchases();
    } else if (!authLoading && !user) {
      window.location.href = '/auth';
    }
  }, [user, userRole, authLoading]);

  const fetchPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select(`
          *,
          videos (
            title,
            description,
            category,
            file_url,
            thumbnail_url,
            duration
          )
        `)
        .eq('customer_id', user?.id)
        .order('purchase_date', { ascending: false });

      if (error) throw error;

      setPurchases(data || []);
      
      // Calculate total spent
      const total = data?.reduce((sum, purchase) => sum + (purchase.purchase_price || 0), 0) || 0;
      setTotalSpent(total);
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownload = (downloadUrl: string, title: string) => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${title}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-24">
        <Navigation />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">Loading your dashboard...</div>
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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your purchased videos and track your investment in professional content.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchases.length}</div>
              <p className="text-xs text-muted-foreground">
                Professional videos owned
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                In video content
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Purchased Videos */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Your Purchased Videos</h2>
          
          {purchases.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No purchases yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start building your video library with professional content.
                </p>
                <Button asChild className="btn-hero">
                  <Link to="/portfolio">
                    Browse Portfolio
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((purchase) => (
                <Card key={purchase.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <div className="relative overflow-hidden rounded-t-lg h-48">
                    {purchase.videos.file_url ? (
                      <video
                        src={purchase.videos.file_url}
                        poster={purchase.videos.thumbnail_url}
                        className="w-full h-full object-cover"
                        controls={false}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-coral/20" />
                    )}
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-4 right-4">
                      <Badge variant="secondary" className="bg-background/80">
                        {formatDuration(purchase.videos.duration || 0)}
                      </Badge>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-primary-foreground">
                        {CATEGORY_LABELS[purchase.videos.category] || purchase.videos.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {purchase.videos.title}
                    </CardTitle>
                    <CardDescription>
                      {purchase.videos.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Purchased: {formatDate(purchase.purchase_date)}</span>
                      <span className="font-semibold text-foreground">
                        ${purchase.purchase_price?.toFixed(2)}
                      </span>
                    </div>
                    
                    <Button 
                      onClick={() => handleDownload(purchase.download_url || purchase.videos.file_url, purchase.videos.title)}
                      className="w-full"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download MP4
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Call to Action */}
        {purchases.length > 0 && (
          <div className="mt-12 text-center bg-gradient-to-r from-primary/10 to-coral/10 rounded-3xl p-8">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              Need More Professional Content?
            </h3>
            <p className="text-muted-foreground mb-4">
              Explore our portfolio for more high-quality videos to elevate your brand.
            </p>
            <Button asChild className="btn-hero">
              <Link to="/portfolio">
                Browse More Videos
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
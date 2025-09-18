import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, Edit, Trash2, Plus, ExternalLink, Code, BarChart3, Bot, Volume2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CategorySelector from '@/components/CategorySelector';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

// Import dashboard components
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

const CATEGORIES = [
  { value: 'all', label: 'All Services', color: 'bg-primary' },
  { value: 'ads', label: 'Ads & Creative Campaigns', color: 'bg-coral' },
  { value: 'web_apps', label: 'Web & App Development', color: 'bg-primary-dark' },
  { value: 'dashboards', label: 'Marketing & Sales Dashboards', color: 'bg-accent-foreground' },
  { value: 'ai_agents', label: 'AI Agents & Automation', color: 'bg-muted-foreground' },
];

// Mock portfolio items for different service categories
const MOCK_PORTFOLIO_ITEMS: PortfolioItem[] = [
  // Web & App Development
  {
    id: 'web-1',
    title: 'Jovial Studio Platform',
    description: 'Live responsive business platform with modern design and full functionality.',
    category: 'web_apps',
    type: 'webapp',
    demo_url: 'https://jovial.modulet.de'
  },
  // Marketing & Sales Dashboards
  {
    id: 'dash-1',
    title: 'Marketing Performance Dashboard',
    description: 'Interactive dashboard showing campaign performance, conversion rates, and ROI metrics with real-time data.',
    category: 'dashboards',
    type: 'dashboard',
    component: MarketingDashboard
  },
  {
    id: 'dash-2',
    title: 'Sales Analytics Dashboard',
    description: 'Comprehensive sales tracking with revenue trends, customer acquisition, and product performance analytics.',
    category: 'dashboards',
    type: 'dashboard',
    component: SalesDashboard
  }
];

const PortfolioCollapsible = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [allPortfolioItems, setAllPortfolioItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    file: null as File | null,
    is_featured: false
  });

  useEffect(() => {
    if (isOpen) {
      fetchPortfolioData();
    }
  }, [isOpen]);

  const fetchPortfolioData = async () => {
    try {
      const [videosResponse, youtubeResponse] = await Promise.all([
        supabase.from('videos').select('*').order('created_at', { ascending: false }),
        supabase.from('youtube_videos').select('*').order('display_order').eq('is_active', true)
      ]);

      const fetchedVideos = videosResponse.data || [];
      const fetchedYoutubeVideos = youtubeResponse.data || [];

      setVideos(fetchedVideos);
      setYoutubeVideos(fetchedYoutubeVideos);

      // Combine all portfolio items
      const videoPortfolioItems: PortfolioItem[] = fetchedVideos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description || '',
        category: 'ads', // Assuming videos are ads for now
        type: 'video' as const,
        file_url: video.file_url,
        thumbnail_url: video.thumbnail_url,
        duration: video.duration
      }));

      const youtubePortfolioItems: PortfolioItem[] = fetchedYoutubeVideos.map(video => ({
        id: video.id,
        title: video.title,
        description: video.description || '',
        category: 'ai_agents',
        type: 'video' as const,
        file_url: video.youtube_url,
        thumbnail_url: video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`
      }));

      setAllPortfolioItems([...videoPortfolioItems, ...youtubePortfolioItems, ...MOCK_PORTFOLIO_ITEMS]);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      toast({
        title: "Error loading portfolio",
        description: "Failed to load portfolio items. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPortfolioItems = selectedCategory === 'all' 
    ? allPortfolioItems 
    : allPortfolioItems.filter(item => item.category === selectedCategory);

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file || !user) return;

    setUploading(true);
    try {
      const fileExt = uploadForm.file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, uploadForm.file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('videos')
        .insert({
          title: uploadForm.title,
          description: uploadForm.description,
          category: uploadForm.category as any,
          file_url: publicUrl,
          file_size: uploadForm.file.size,
          is_featured: uploadForm.is_featured,
          uploaded_by: user.id
        });

      if (insertError) throw insertError;

      toast({
        title: "Video uploaded successfully",
        description: "Your video has been added to the portfolio."
      });

      setShowUploadDialog(false);
      setUploadForm({
        title: '',
        description: '',
        category: '',
        file: null,
        is_featured: false
      });
      
      fetchPortfolioData();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEditClick = (video: Video) => {
    setEditingVideo(video);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;

    try {
      const { error } = await supabase
        .from('videos')
        .update({
          title: editingVideo.title,
          description: editingVideo.description,
          category: editingVideo.category as any
        })
        .eq('id', editingVideo.id);

      if (error) throw error;

      toast({
        title: "Video updated successfully"
      });

      setShowEditDialog(false);
      setEditingVideo(null);
      fetchPortfolioData();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;

      toast({
        title: "Video deleted successfully"
      });

      fetchPortfolioData();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="text-center mb-8">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="lg" className="group h-auto p-8 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 rounded-2xl w-full max-w-2xl mx-auto bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-4xl font-bold">Our Portfolio</h2>
                    {isOpen ? (
                      <ChevronUp className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    ) : (
                      <ChevronDown className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {isOpen ? 'Hide portfolio' : 'Click to explore our complete range of creative solutions'}
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="space-y-16">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-pulse">Loading portfolio...</div>
              </div>
            ) : (
              <div className="max-w-7xl mx-auto">
                {/* Header with Upload Button and Category Selector */}
                <div className="text-center mb-16">
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                    Explore our complete range of creative tech solutions - from dynamic video campaigns to powerful web applications, intelligent dashboards, and AI-driven automation systems that transform how businesses connect with their customers.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {userRole === 'owner' ? (
                      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                        <DialogTrigger asChild>
                          <Button className="btn-hero">
                            <Plus className="w-4 h-4 mr-2" />
                            Upload New Video
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Upload New Video</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                              <Label htmlFor="title">Title</Label>
                              <Input
                                id="title"
                                value={uploadForm.title}
                                onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                                required
                              />
                            </div>
                            <div>
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={uploadForm.description}
                                onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="category">Category</Label>
                              <Select value={uploadForm.category} onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {CATEGORIES.filter(c => c.value !== 'all').map((category) => (
                                    <SelectItem key={category.value} value={category.value}>
                                      {category.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="video">Video File (MP4)</Label>
                              <Input
                                id="video"
                                type="file"
                                accept=".mp4,video/mp4"
                                onChange={(e) => setUploadForm(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                                required
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="featured"
                                checked={uploadForm.is_featured}
                                onChange={(e) => setUploadForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                              />
                              <Label htmlFor="featured">Featured (show in homepage gallery)</Label>
                            </div>
                            <Button type="submit" className="w-full" disabled={uploading}>
                              {uploading ? 'Uploading...' : 'Upload Video'}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    ) : null}
                    
                    <Link to="/portfolio">
                      <Button variant="outline">
                        View Full Portfolio
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                  
                  <CategorySelector 
                    categories={CATEGORIES}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </div>

                {/* Row 1: Video Ads & Creative Campaigns */}
                {(selectedCategory === 'all' || selectedCategory === 'ads') && (
                  <section className="border-b border-border/50 pb-16 mb-16">
                    <div className="mb-12 text-center">
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Video Ads & Creative Campaigns</h2>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">High-impact video content that captures attention and drives engagement</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {allPortfolioItems
                        .filter(item => item.category === 'ads')
                        .map((item) => (
                          <div key={item.id} className="group cursor-pointer relative text-center">
                            <div className="relative overflow-hidden rounded-2xl aspect-[9/16] h-80 mx-auto mb-4">
                              {item.file_url ? (
                                <video
                                  src={item.file_url}
                                  poster={item.thumbnail_url}
                                  className="w-full h-full object-cover"
                                  controls
                                  muted
                                  playsInline
                                  preload="metadata"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-coral/20" />
                              )}
                              
                              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                  <Play className="w-8 h-8 text-primary ml-1" />
                                </div>
                              </div>

                              {item.duration && (
                                <div className="absolute bottom-2 right-2 bg-background/80 text-foreground text-xs px-2 py-1 rounded">
                                  {formatDuration(item.duration)}
                                </div>
                              )}

                              {userRole === 'owner' && item.type === 'video' && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const video = videos.find(v => v.id === item.id);
                                      if (video) handleEditClick(video);
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDelete(item.id);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                {item.title}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      
                      {allPortfolioItems.filter(item => item.category === 'ads').length === 0 && (
                        <div className="col-span-full text-center py-12">
                          <p className="text-muted-foreground">Video ad showcase coming soon</p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Row 2: Marketing & Sales Dashboards */}
                {(selectedCategory === 'all' || selectedCategory === 'dashboards') && (
                  <section className="border-b border-border/50 pb-16 mb-16">
                    <div className="mb-12 text-center">
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Marketing & Sales Dashboards</h2>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Interactive analytics and performance tracking tools for data-driven insights</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {allPortfolioItems
                        .filter(item => item.category === 'dashboards')
                        .map((item) => (
                          <div key={item.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-2xl aspect-[16/9] h-80 bg-card border border-border shadow-lg">
                              {item.component && (
                                <div className="w-full h-full overflow-hidden">
                                  <div className="scale-[0.4] origin-top-left transform -translate-x-[12.5%] -translate-y-[12.5%]">
                                    <div style={{ width: '250%', height: '250%' }}>
                                      <item.component />
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="w-16 h-16 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                  <BarChart3 className="w-8 h-8 text-primary" />
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 space-y-2">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                {item.title}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      
                      {allPortfolioItems.filter(item => item.category === 'dashboards').length === 0 && (
                        <div className="col-span-full text-center py-12">
                          <p className="text-muted-foreground">Dashboard samples coming soon</p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Row 3: Web & App Development */}
                {(selectedCategory === 'all' || selectedCategory === 'web_apps') && (
                  <section className="border-b border-border/50 pb-16 mb-16">
                    <div className="mb-12 text-center">
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Web & App Development</h2>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Custom web applications and platforms built with modern technology</p>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-full max-w-4xl mx-auto">
                        <div className="group cursor-pointer" onClick={() => window.open('https://jovial.modulet.de', '_blank')}>
                          <div className="relative overflow-hidden rounded-2xl aspect-[16/9] h-96 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-colors duration-300 mx-auto">
                            <iframe
                              src="https://jovial.modulet.de"
                              className="w-full h-full border-0"
                              title="Jovial Studio Platform"
                              loading="lazy"
                            />
                            
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Button size="lg" variant="secondary" className="bg-background/90 hover:bg-background shadow-lg">
                                <ExternalLink className="w-5 h-5 mr-2" />
                                Visit Live Site
                              </Button>
                            </div>
                          </div>
                          
                          <div className="mt-6 text-center">
                            <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                              Jovial Studio Platform
                            </h3>
                            <p className="text-muted-foreground">
                              Live responsive business platform with modern design and full functionality.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Row 4: Virtual Spokesperson Videos */}
                {(selectedCategory === 'all' || selectedCategory === 'ai_agents') && (
                  <section className="border-b border-border/50 pb-16 mb-16">
                    <div className="mb-12 text-center">
                      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">AI Agents & Automation</h2>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Intelligent virtual assistants and automated systems for enhanced customer engagement</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      {allPortfolioItems
                        .filter(item => item.category === 'ai_agents')
                        .map((item) => (
                          <div key={item.id} className="group cursor-pointer text-center" onClick={() => window.open(item.file_url, '_blank')}>
                            <div className="relative overflow-hidden rounded-2xl aspect-[9/16] h-80 mx-auto mb-4">
                              <img 
                                src={item.thumbnail_url}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                              
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="w-16 h-16 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                  <Play className="w-8 h-8 text-primary ml-1" />
                                </div>
                              </div>

                              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                <Volume2 className="w-3 h-3" />
                                YouTube
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                                {item.title}
                              </h3>
                              <p className="text-muted-foreground text-sm">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      
                      {allPortfolioItems.filter(item => item.category === 'ai_agents').length === 0 && (
                        <div className="col-span-full text-center py-12">
                          <p className="text-muted-foreground">AI agent showcase coming soon</p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Call to Action */}
                <div className="text-center pt-8">
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
            )}
          </CollapsibleContent>
        </Collapsible>

        {/* Edit Video Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingVideo?.title || ''}
                  onChange={(e) => setEditingVideo(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingVideo?.description || ''}
                  onChange={(e) => setEditingVideo(prev => prev ? { ...prev, description: e.target.value } : null)}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  value={editingVideo?.category || ''} 
                  onValueChange={(value) => setEditingVideo(prev => prev ? { ...prev, category: value } : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter(c => c.value !== 'all').map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSaveEdit} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default PortfolioCollapsible;
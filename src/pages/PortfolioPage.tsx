import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, ArrowLeft, Edit, Trash2, Plus, ExternalLink, Code, BarChart3, Bot, Volume2 } from 'lucide-react';
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
import Navigation from '@/components/Navigation';

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

export default function PortfolioPage() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YouTubeVideo[]>([]);
  const [allPortfolioItems, setAllPortfolioItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  // Form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: '',
    file: null as File | null,
    is_featured: false
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      // Fetch real videos from database
      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (videoError) throw videoError;
      setVideos(videoData || []);

      // Fetch YouTube videos from database
      const { data: youtubeData, error: youtubeError } = await supabase
        .from('youtube_videos')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (youtubeError) throw youtubeError;
      setYoutubeVideos(youtubeData || []);

      // Convert videos to portfolio items and categorize existing videos as "ads"
      const videoPortfolioItems: PortfolioItem[] = (videoData || []).map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        category: 'ads', // Categorize existing videos as ads/creative campaigns
        type: 'video' as const,
        file_url: video.file_url,
        thumbnail_url: video.thumbnail_url,
        duration: video.duration
      }));

      // Combine real videos with mock portfolio items
      setAllPortfolioItems([...videoPortfolioItems, ...MOCK_PORTFOLIO_ITEMS]);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPortfolioItems = selectedCategory === 'all' 
    ? allPortfolioItems 
    : allPortfolioItems.filter(item => item.category === selectedCategory);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.file || !uploadForm.title || !uploadForm.category) return;
    
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
          uploaded_by: user?.id,
          is_featured: uploadForm.is_featured,
          file_size: uploadForm.file.size
        });
      
      if (insertError) throw insertError;
      
      toast({ title: "Video uploaded successfully!" });
      setShowUploadDialog(false);
      setUploadForm({ title: '', description: '', category: '', file: null, is_featured: false });
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
    setEditForm({
      title: video.title,
      description: video.description || '',
      category: video.category
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editingVideo) return;
    
    try {
      const { error } = await supabase
        .from('videos')
        .update({
          title: editForm.title,
          description: editForm.description,
          category: editForm.category as any
        })
        .eq('id', editingVideo.id);
      
      if (error) throw error;
      
      toast({ title: "Video updated successfully!" });
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
      
      toast({ title: "Video deleted successfully!" });
      fetchPortfolioData();
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
    }
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
            </div>
          </div>

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
                   value={editForm.title}
                   onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                 />
               </div>
               <div>
                 <Label htmlFor="edit-description">Description</Label>
                 <Textarea
                   id="edit-description"
                   value={editForm.description}
                   onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                 />
               </div>
               <div>
                 <Label htmlFor="edit-category">Category</Label>
                 <Select value={editForm.category} onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value }))}>
                   <SelectTrigger>
                     <SelectValue />
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

        {/* Five Main Service Categories */}
        <div className="space-y-24">
          {/* Row 1: Video Ads & Creative Campaigns */}
          <section className="border-b border-border/50 pb-16">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Video Ads & Creative Campaigns</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Dynamic video content that captures attention and drives engagement across all platforms</p>
            </div>
            
            {/* 3-Column Grid Layout */}
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

          {/* Row 2: Marketing & Sales Dashboards */}
          <section className="border-b border-border/50 pb-16 overflow-x-hidden">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Marketing & Sales Dashboards</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Interactive analytics and performance tracking tools for data-driven insights</p>
            </div>
            <div className="flex justify-center">
              <div className="grid grid-cols-1 gap-6 lg:gap-8 w-full max-w-[clamp(12rem,82vw,16rem)] sm:max-w-[clamp(16rem,86vw,20rem)] md:max-w-2xl lg:max-w-3xl">
              {allPortfolioItems
                .filter(item => item.category === 'dashboards')
                .map((item) => (
                  <div key={item.id} className="group cursor-pointer mx-auto">
                    <div className="relative w-full overflow-hidden rounded-2xl aspect-[4/3] h-[26rem] sm:h-[28rem] lg:h-[30rem] bg-card border border-border shadow-lg mx-auto">
                      {item.component && (
                        <div className="w-full h-full overflow-hidden flex items-center justify-center">
                          <div className="scale-[0.45] sm:scale-[0.5] lg:scale-[0.55] origin-center">
                            <div style={{ width: '222%', height: '222%' }} className="sm:w-[200%] sm:h-[200%] lg:w-[182%] lg:h-[182%]">
                              <item.component />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 space-y-2 text-center">
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
            </div>
          </section>

          {/* Row 3: Web & App Development */}
          <section className="border-b border-border/50 pb-16">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Web & App Development</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Custom web applications and platforms built with modern technology</p>
            </div>
            
            {/* Responsive centered layout */}
            <div className="flex justify-center">
              <div className="w-full max-w-[clamp(12rem,82vw,16rem)] sm:max-w-[clamp(16rem,86vw,20rem)] md:max-w-xl lg:max-w-3xl mx-auto">
                <div className="group cursor-pointer" onClick={() => window.open('https://jovial.modulet.de', '_blank')}>
                  <div className="relative w-full overflow-hidden rounded-2xl aspect-[4/3] h-[28rem] sm:h-[30rem] md:h-[34rem] lg:h-[38rem] bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-colors duration-300 mx-auto">
                    {/* Live Preview Using Iframe */}
                    <iframe
                      src="https://jovial.modulet.de"
                      className="w-full h-full border-0"
                      title="Jovial Studio Platform"
                      loading="lazy"
                    />
                    
                    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background shadow-lg sm:text-base text-xs">
                        <ExternalLink className="w-3 h-3 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Visit Live Site</span>
                        <span className="sm:hidden">Visit</span>
                      </Button>
                    </div>
                    
                    <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-background/90 backdrop-blur-sm rounded-lg p-2 sm:p-4 shadow-lg max-w-[calc(100%-6rem)] sm:max-w-none">
                        <h3 className="font-semibold text-foreground text-sm sm:text-lg mb-1 sm:mb-2">Jovial Studio Platform</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm hidden sm:block">Full-stack business platform with responsive design, modern UI, and complete functionality</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Row 4: Virtual Spokesperson Videos */}
          <section className="border-b border-border/50 pb-16">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Virtual Spokesperson Videos</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">AI-powered spokesperson content for engaging communication and brand messaging</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {youtubeVideos.map((video) => (
                <div key={video.id} className="group cursor-pointer" onClick={() => window.open(video.youtube_url, '_blank')}>
                  <div className="relative overflow-hidden rounded-2xl aspect-[9/16] h-80 max-w-xs mx-auto">
                    {/* YouTube Thumbnail */}
                    <img
                      src={`https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to high quality thumbnail if maxres fails
                        (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`;
                      }}
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="sm" variant="secondary" className="bg-background/90 hover:bg-background">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        YouTube
                      </Button>
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h4 className="font-semibold text-white text-sm mb-1">{video.title}</h4>
                      <p className="text-white/80 text-xs">{video.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {youtubeVideos.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Virtual spokesperson videos coming soon</p>
                </div>
              )}
            </div>
          </section>

          {/* Row 5: AI Agents & Automation */}
          <section>
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">AI Agents & Automation</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Intelligent automation solutions that streamline operations and enhance customer engagement</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] h-64 bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 hover:border-primary/40 transition-colors duration-300">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Bot className="w-16 h-16 text-primary mx-auto" />
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">AI Chatbot</h3>
                        <p className="text-sm text-muted-foreground px-4">Intelligent customer service automation with natural language processing</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] h-64 bg-gradient-to-br from-coral/10 to-primary/10 border-2 border-coral/20 hover:border-coral/40 transition-colors duration-300">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Volume2 className="w-16 h-16 text-coral mx-auto" />
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">Email Automation</h3>
                        <p className="text-sm text-muted-foreground px-4">Personalized marketing campaign sequences with smart targeting</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] h-64 bg-gradient-to-br from-accent/10 to-primary/10 border-2 border-accent/20 hover:border-accent/40 transition-colors duration-300">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <ArrowRight className="w-16 h-16 text-accent-foreground mx-auto" />
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">Workflow Automation</h3>
                        <p className="text-sm text-muted-foreground px-4">Process optimization systems that reduce manual work</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20 py-16 border-t border-border/50">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Transform Your Business?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss how our creative tech solutions can help you achieve your goals and stand out in the digital landscape.
          </p>
          <Button asChild size="lg" className="btn-hero">
            <Link to="/#contact">
              Get Started Today
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
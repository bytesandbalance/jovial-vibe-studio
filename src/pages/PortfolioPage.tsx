import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, ArrowLeft, Edit, Edit2, Trash2, Plus, ExternalLink, Code, BarChart3, Bot, Volume2, Sparkles, Zap, Calendar } from 'lucide-react';
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
  labels?: string[];
  file_url: string;
  thumbnail_url: string;
  duration: number;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  labels?: string[];
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
  labels?: string[];
  display_order: number;
}

const CATEGORIES = [
  { value: 'all', label: 'All Services', color: 'bg-primary' },
  { value: 'ads', label: 'Video Ads & Creative Campaigns', color: 'bg-coral' },
  { value: 'web_apps', label: 'Web & App Development', color: 'bg-primary-dark' },
  { value: 'spokesperson', label: 'Virtual Spokesperson', color: 'bg-accent' },
  { value: 'dashboards', label: 'Marketing & Sales Dashboards', color: 'bg-accent-foreground' },
  { value: 'ai_agents', label: 'AI Agents & Automation', color: 'bg-muted-foreground' },
  // Include existing video categories for display only
  { value: 'clothing', label: 'Fashion & Clothing', color: 'bg-purple-500' },
  { value: 'retail', label: 'Retail & E-commerce', color: 'bg-blue-500' },
  { value: 'automotive', label: 'Automotive', color: 'bg-red-500' },
  { value: 'food', label: 'Food & Beverage', color: 'bg-green-500' },
  { value: 'fitness', label: 'Fitness & Health', color: 'bg-orange-500' },
  { value: 'real_estate', label: 'Real Estate', color: 'bg-teal-500' },
  { value: 'beauty', label: 'Beauty & Cosmetics', color: 'bg-pink-500' },
];

// Upload categories - only the main service types
const UPLOAD_CATEGORIES = [
  { value: 'ads', label: 'Video Ads & Creative Campaigns', color: 'bg-coral' },
  { value: 'web_apps', label: 'Web & App Development', color: 'bg-primary-dark' },
  { value: 'spokesperson', label: 'Virtual Spokesperson', color: 'bg-accent' },
];

// Industry labels that can be applied to any category
const INDUSTRY_LABELS = [
  { value: 'automotive', label: 'Automotive' },
  { value: 'fashion', label: 'Fashion & Clothing' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'fitness', label: 'Fitness & Health' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'beauty', label: 'Beauty & Cosmetics' },
  { value: 'tech', label: 'Technology' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'rentals', label: 'Rentals & Equipment' },
  { value: 'tourism', label: 'Tourism & Travel' },
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
    labels: [] as string[],
    file: null as File | null,
    url: '',
    is_featured: false
  });

  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    labels: [] as string[]
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

      // Convert videos to portfolio items using their actual category
      const videoPortfolioItems: PortfolioItem[] = (videoData || []).map(video => ({
        id: video.id,
        title: video.title,
        description: video.description,
        category: video.category as string, // Cast to string to avoid enum type issues
        labels: video.labels, // Include labels from database
        type: (video.category as string) === 'web_apps' ? 'webapp' as const : 'video' as const,
        file_url: video.file_url,
        thumbnail_url: video.thumbnail_url,
        duration: video.duration,
        demo_url: (video.category as string) === 'web_apps' ? video.file_url : undefined
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

  // Helper function to extract YouTube ID from URL
  const extractYouTubeId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:shorts\/|(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.category) return;
    
    // Validate based on category
    if (uploadForm.category === 'ads' && !uploadForm.file) {
      toast({ title: "Please select a video file", variant: "destructive" });
      return;
    }
    if ((uploadForm.category === 'web_apps' || uploadForm.category === 'spokesperson') && !uploadForm.url) {
      toast({ title: "Please enter a URL", variant: "destructive" });
      return;
    }
    
    setUploading(true);
    try {
      let fileUrl = uploadForm.url;
      let fileSize = null;

      // Handle file upload for video categories
      if (uploadForm.category === 'ads' && uploadForm.file) {
        const fileExt = uploadForm.file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(fileName, uploadForm.file);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(fileName);
        
        fileUrl = publicUrl;
        fileSize = uploadForm.file.size;
      }
      
      // Handle YouTube spokesperson videos - save to youtube_videos table
      if (uploadForm.category === 'spokesperson') {
        const youtubeId = extractYouTubeId(fileUrl);
        if (!youtubeId) {
          throw new Error('Invalid YouTube URL');
        }

        const { error: insertError } = await supabase
          .from('youtube_videos')
          .insert({
            title: uploadForm.title,
            description: uploadForm.description,
            youtube_url: fileUrl,
            youtube_id: youtubeId,
            labels: uploadForm.labels.length > 0 ? uploadForm.labels : null, // Only set if not empty
            category: 'spokesperson',
            display_order: 999 // Add to end
          });
        
        if (insertError) throw insertError;
      } else {
        // Handle regular videos and web apps
        const { error: insertError } = await supabase
          .from('videos')
          .insert({
            title: uploadForm.title,
            description: uploadForm.description,
            category: uploadForm.category as any,
            labels: uploadForm.labels.length > 0 ? uploadForm.labels : null, // Only set if not empty
            file_url: fileUrl,
            thumbnail_url: fileUrl, // Add thumbnail_url
            uploaded_by: user?.id,
            is_featured: uploadForm.is_featured,
            file_size: fileSize
          });
        
        if (insertError) throw insertError;
      }
      
      toast({ title: "Content uploaded successfully!" });
      setShowUploadDialog(false);
      setUploadForm({ title: '', description: '', category: '', labels: [], file: null, url: '', is_featured: false });
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
      category: video.category,
      labels: video.labels || []
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
          category: editForm.category as any,
          labels: editForm.labels.length > 0 ? editForm.labels : null // Handle empty arrays
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

  const handleDeleteYouTube = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this YouTube video?')) return;
    
    try {
      const { error } = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', videoId);
      
      if (error) throw error;
      
      toast({ title: "YouTube video deleted successfully!" });
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
                    Upload New Content
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload New Content</DialogTitle>
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
                            {UPLOAD_CATEGORIES.map((category) => (
                              <SelectItem key={category.value} value={category.value}>
                                {category.label}
                              </SelectItem>
                            ))}
                         </SelectContent>
                      </Select>
                     </div>
                     <div>
                       <Label htmlFor="labels">Industry Labels (optional)</Label>
                       <Select 
                         onValueChange={(value) => {
                           if (!uploadForm.labels.includes(value)) {
                             setUploadForm(prev => ({ ...prev, labels: [...prev.labels, value] }));
                           }
                         }}
                       >
                         <SelectTrigger>
                           <SelectValue placeholder="Add industry labels" />
                         </SelectTrigger>
                         <SelectContent>
                           {INDUSTRY_LABELS.map((label) => (
                             <SelectItem key={label.value} value={label.value}>
                               {label.label}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                       {uploadForm.labels.length > 0 && (
                         <div className="flex flex-wrap gap-2 mt-2">
                           {uploadForm.labels.map((label, index) => (
                             <Badge 
                               key={index} 
                               variant="secondary" 
                               className="cursor-pointer"
                               onClick={() => setUploadForm(prev => ({ 
                                 ...prev, 
                                 labels: prev.labels.filter(l => l !== label) 
                               }))}
                             >
                               {INDUSTRY_LABELS.find(l => l.value === label)?.label || label} ×
                             </Badge>
                           ))}
                         </div>
                       )}
                     </div>
                    {/* Conditional input based on category */}
                    {uploadForm.category === 'ads' ? (
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
                    ) : uploadForm.category === 'web_apps' ? (
                      <div>
                        <Label htmlFor="url">Website URL</Label>
                        <Input
                          id="url"
                          type="url"
                          placeholder="https://example.com"
                          value={uploadForm.url}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, url: e.target.value }))}
                          required
                        />
                      </div>
                    ) : uploadForm.category === 'spokesperson' ? (
                      <div>
                        <Label htmlFor="url">YouTube URL</Label>
                        <Input
                          id="url"
                          type="url"
                          placeholder="https://youtube.com/watch?v=..."
                          value={uploadForm.url}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, url: e.target.value }))}
                          required
                        />
                      </div>
                    ) : uploadForm.category ? (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Please select a category first to see upload options.
                        </p>
                      </div>
                    ) : null}
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
                      {uploading ? 'Uploading...' : 'Upload Content'}
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
                      {UPLOAD_CATEGORIES.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                 </Select>
                </div>
                <div>
                  <Label htmlFor="edit-labels">Industry Labels (optional)</Label>
                  <Select 
                    onValueChange={(value) => {
                      if (!editForm.labels.includes(value)) {
                        setEditForm(prev => ({ ...prev, labels: [...prev.labels, value] }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Add industry labels" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_LABELS.map((label) => (
                        <SelectItem key={label.value} value={label.value}>
                          {label.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {editForm.labels.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {editForm.labels.map((label, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary" 
                          className="cursor-pointer"
                          onClick={() => setEditForm(prev => ({ 
                            ...prev, 
                            labels: prev.labels.filter(l => l !== label) 
                          }))}
                        >
                          {INDUSTRY_LABELS.find(l => l.value === label)?.label || label} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
               <Button onClick={handleSaveEdit} className="w-full">
                 Save Changes
               </Button>
             </div>
           </DialogContent>
         </Dialog>

        {/* Five Main Service Categories */}
        <div className="space-y-24">
          {/* Row 0: Tools - New Section */}
          <section className="relative border-b border-border/50 pb-16">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-coral/10 rounded-3xl -z-10 animate-gradient" />
            
            <div className="mb-12 text-center">
              <div className="inline-flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-brand rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Our <span className="gradient-text">Tools</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
                Powerful automation tools that transform your content and workflows
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">More coming soon — All at very low prices, one-off payment + light maintenance</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* CourseSpark */}
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/10 border-2 border-primary/40 hover:border-primary/70 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 min-h-[380px] flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  
                  <div className="relative p-8 space-y-6 flex-1 flex flex-col">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-brand rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="space-y-3 flex-1">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        CourseSpark
                      </h3>
                      <p className="text-base font-semibold text-primary/90 italic">
                        Create content once, share anytime.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        CourseSpark turns your video course into ready-to-use social clips, PDF freebies, and captions, all automatically. Set it up once, and your materials are generated for daily, weekly, or any schedule you want. No extra work, no constant planning, just content ready when you need it.
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      <Zap className="w-4 h-4" />
                      <span>Auto-generate marketing content from courses</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* BookFlow */}
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-coral/20 via-accent/15 to-coral/10 border-2 border-coral/40 hover:border-coral/70 transition-all duration-500 hover:shadow-2xl hover:shadow-coral/30 hover:scale-105 min-h-[380px] flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  
                  <div className="relative p-8 space-y-6 flex-1 flex flex-col">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-coral to-coral/70 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="space-y-3 flex-1">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-coral transition-colors duration-300">
                        BookFlow
                      </h3>
                      <p className="text-base font-semibold text-coral italic">
                        Bookings and follow-ups, handled automatically.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        BookFlow manages your entire client journey without you thinking about it. It logs appointments, sends reminders, follows up for feedback, and nudges clients to rebook, all automatically through Outlook. Set it up once and let it run on your preferred schedule, daily or weekly, while you focus on your business.
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-coral font-medium">
                      <Zap className="w-4 h-4" />
                      <span>Complete booking automation via Outlook</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Row 1: Web & App Development */}
          <section className="border-b border-border/50 pb-16">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Web & App Development</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Custom web applications and platforms built with modern technology</p>
            </div>
            
            <div className={`grid gap-8 ${
              allPortfolioItems.filter(item => item.category === 'web_apps').length === 1 
                ? 'grid-cols-1 max-w-2xl mx-auto' 
                : 'grid-cols-1 md:grid-cols-2'
            }`}>
              {/* Display uploaded web apps from database */}
              {allPortfolioItems.filter(item => item.category === 'web_apps').map((item) => (
                <div key={item.id} className="group cursor-pointer" onClick={() => window.open(item.demo_url || item.file_url, '_blank')}>
                  <div className="relative w-full overflow-hidden rounded-2xl aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 hover:border-primary/40 transition-colors duration-300 mx-auto">
                    {/* Live Preview Using Iframe */}
                    <iframe
                      src={item.demo_url || item.file_url}
                      className="w-full h-full border-0 scale-75 origin-top-left"
                      style={{ width: '133.33%', height: '133.33%' }}
                      title={item.title}
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
                        <h3 className="font-semibold text-foreground text-sm sm:text-lg mb-1 sm:mb-2">{item.title}</h3>
                        <p className="text-muted-foreground text-xs sm:text-sm hidden sm:block">{item.description}</p>
                      </div>
                    </div>

                    {/* Edit and delete buttons for owners */}
                    {userRole === 'owner' && item.type === 'webapp' && (
                      <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            const video = videos.find(v => v.id === item.id);
                            if (video) handleEditClick(video);
                          }}
                          className="bg-background/90 hover:bg-background"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          className="bg-destructive/90 hover:bg-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {allPortfolioItems.filter(item => item.category === 'web_apps').length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No web applications uploaded yet</p>
                </div>
              )}
            </div>
          </section>

          {/* Row 2: Marketing & Sales Dashboards */}
          <section className="border-b border-border/50 pb-16">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Marketing & Sales Dashboards</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Interactive analytics and performance tracking tools for data-driven insights
              </p>
            </div>

            <div className="flex flex-col gap-12 px-4">
              {allPortfolioItems
                .filter(item => item.category === 'dashboards')
                .map(item => (
                  <div key={item.id} className="group w-full max-w-[600px] sm:max-w-[700px] md:max-w-[800px] mx-auto">
                    <div className="relative w-full overflow-auto rounded-2xl aspect-[4/3] bg-card border border-border shadow-lg">
                      {item.component && (
                        <div className="w-full h-full flex items-center justify-center scale-75">
                          <item.component />
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
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Dashboard samples coming soon</p>
                </div>
              )}
            </div>
          </section>


          {/* AI Agents & Automation - Enhanced Hero Section */}
          <section className="relative py-16">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-coral/10 rounded-3xl -z-10 animate-fade-in" />
            <div className="absolute inset-0 bg-gradient-to-tl from-primary/5 via-transparent to-accent/5 rounded-3xl -z-10" />
            
            <div className="mb-20 text-center">
              <div className="inline-flex items-center justify-center mb-6 animate-scale-in">
                <div className="relative">
                  <Bot className="w-16 h-16 text-primary animate-pulse" />
                  <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl -z-10 animate-pulse" />
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-fade-in">
                AI Agents & <span className="gradient-text">Intelligent Automation</span>
              </h2>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
                Harness the power of cutting-edge artificial intelligence to revolutionize your business operations. 
                Our AI solutions work tirelessly to enhance customer engagement, automate complex workflows, and drive exponential growth.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-12">
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 hover:bg-primary/20 transition-colors">
                  <Bot className="w-4 h-4 mr-2 inline" />
                  Powered by Advanced AI
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-accent/10 hover:bg-accent/20 transition-colors">
                  <BarChart3 className="w-4 h-4 mr-2 inline" />
                  Data-Driven Results
                </Badge>
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-coral/10 hover:bg-coral/20 transition-colors">
                  <ArrowRight className="w-4 h-4 mr-2 inline" />
                  24/7 Automation
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-4 max-w-7xl mx-auto">
              {/* AI Chatbot - Enhanced */}
              <div className="group cursor-pointer animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="relative overflow-hidden rounded-3xl h-full bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border-2 border-primary/40 hover:border-primary/80 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-2">
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative p-10">
                    <div className="flex flex-col items-center text-center space-y-6">
                      {/* Icon Container */}
                      <div className="relative">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-background/95 rounded-2xl shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <Bot className="w-12 h-12 text-primary" />
                        </div>
                        <div className="absolute -inset-3 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                      </div>
                      
                      {/* Content */}
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                          AI-Powered Chatbots
                        </h3>
                        <p className="text-base text-muted-foreground leading-relaxed">
                          Deploy intelligent conversational AI that provides instant customer support, answers queries 24/7, 
                          and continuously learns from interactions to deliver increasingly personalized experiences.
                        </p>
                        
                        {/* Feature Pills */}
                        <div className="flex flex-wrap justify-center gap-2 pt-4">
                          <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">Natural Language</span>
                          <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">Multi-Channel</span>
                          <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">Self-Learning</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Automation - Enhanced */}
              <div className="group cursor-pointer animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="relative overflow-hidden rounded-3xl h-full bg-gradient-to-br from-coral/20 via-coral/10 to-primary/20 border-2 border-coral/40 hover:border-coral/80 transition-all duration-500 hover:shadow-2xl hover:shadow-coral/30 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-gradient-radial from-coral/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative p-10">
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="relative">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-background/95 rounded-2xl shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <Volume2 className="w-12 h-12 text-coral" />
                        </div>
                        <div className="absolute -inset-3 bg-coral/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-coral transition-colors duration-300">
                          Smart Marketing Automation
                        </h3>
                        <p className="text-base text-muted-foreground leading-relaxed">
                          Create sophisticated email campaigns that adapt to user behavior, deliver personalized content at optimal times, 
                          and nurture leads automatically through intelligent segmentation and targeting.
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-2 pt-4">
                          <span className="px-3 py-1 text-xs bg-coral/10 text-coral rounded-full">Personalization</span>
                          <span className="px-3 py-1 text-xs bg-coral/10 text-coral rounded-full">A/B Testing</span>
                          <span className="px-3 py-1 text-xs bg-coral/10 text-coral rounded-full">Analytics</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Workflow Automation - Enhanced */}
              <div className="group cursor-pointer animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="relative overflow-hidden rounded-3xl h-full bg-gradient-to-br from-accent/20 via-accent/10 to-primary/20 border-2 border-accent/40 hover:border-accent/80 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/30 hover:-translate-y-2">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative p-10">
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="relative">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-background/95 rounded-2xl shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                          <BarChart3 className="w-12 h-12 text-accent-foreground" />
                        </div>
                        <div className="absolute -inset-3 bg-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-foreground group-hover:text-accent-foreground transition-colors duration-300">
                          Intelligent Workflows
                        </h3>
                        <p className="text-base text-muted-foreground leading-relaxed">
                          Transform complex business processes with AI-driven automation that eliminates repetitive tasks, 
                          optimizes resource allocation, and empowers your team to focus on strategic initiatives and creative work.
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-2 pt-4">
                          <span className="px-3 py-1 text-xs bg-accent/10 text-accent-foreground rounded-full">Process Mining</span>
                          <span className="px-3 py-1 text-xs bg-accent/10 text-accent-foreground rounded-full">Integration</span>
                          <span className="px-3 py-1 text-xs bg-accent/10 text-accent-foreground rounded-full">Optimization</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
              <div className="text-center p-6 rounded-2xl bg-background/60 border border-border hover:border-primary/50 transition-colors">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Always Available</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-background/60 border border-border hover:border-primary/50 transition-colors">
                <div className="text-3xl font-bold text-primary mb-2">10x</div>
                <div className="text-sm text-muted-foreground">Efficiency Boost</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-background/60 border border-border hover:border-primary/50 transition-colors">
                <div className="text-3xl font-bold text-primary mb-2">90%</div>
                <div className="text-sm text-muted-foreground">Cost Reduction</div>
              </div>
              <div className="text-center p-6 rounded-2xl bg-background/60 border border-border hover:border-primary/50 transition-colors">
                <div className="text-3xl font-bold text-primary mb-2">∞</div>
                <div className="text-sm text-muted-foreground">Scalability</div>
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
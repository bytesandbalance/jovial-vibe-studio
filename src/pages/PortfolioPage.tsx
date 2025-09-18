import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, ArrowLeft, Edit, Trash2, Plus, ExternalLink, Code, BarChart3, Bot } from 'lucide-react';
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
      const { data: videoData, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(videoData || []);

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

        {/* Category Selector */}
        <CategorySelector
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Portfolio Grid */}
        <div>
            {filteredPortfolioItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  No items available in this category yet.
                </p>
                <p className="text-muted-foreground">
                  Check back soon for amazing content!
                </p>
              </div>
            ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {filteredPortfolioItems.map((item) => (
                   <div key={item.id} className="group cursor-pointer relative text-center">
                     <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-accent mb-4 mx-auto ${
                       item.type === 'video' ? 'aspect-[9/16] h-80 max-w-xs' : 
                       item.type === 'dashboard' ? 'aspect-[16/9] h-80' :
                       'aspect-[16/9] h-64'
                     }`}>
                       {item.type === 'video' ? (
                         <>
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
                           
                           {/* Play Button for Videos */}
                           <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                             <div className="w-16 h-16 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                               <Play className="w-8 h-8 text-primary ml-1" />
                             </div>
                           </div>

                           {/* Duration */}
                           <div className="pointer-events-none absolute bottom-4 right-4">
                             <Badge variant="secondary" className="bg-background/80">
                               {formatDuration(item.duration || 0)}
                             </Badge>
                           </div>
                         </>
                       ) : item.type === 'dashboard' && item.component ? (
                         <>
                           {/* Dashboard Component */}
                           <div className="w-full h-full overflow-hidden">
                             <div className="scale-[0.4] origin-top-left transform -translate-x-[10%] -translate-y-[5%]">
                               <div style={{ width: '250%', height: '250%' }}>
                                 <item.component />
                               </div>
                             </div>
                           </div>
                           
                           {/* Overlay with Dashboard Icon */}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                             <div className="w-16 h-16 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                               <BarChart3 className="w-8 h-8 text-primary" />
                             </div>
                           </div>
                         </>
                       ) : item.type === 'webapp' ? (
                         <>
                           {/* Web App Preview */}
                           <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                             <div className="text-center space-y-4">
                               <Code className="w-16 h-16 text-primary mx-auto" />
                               <div className="space-y-2">
                                 <h3 className="font-semibold text-foreground">Live Demo Available</h3>
                                 <p className="text-sm text-muted-foreground">Click to explore the full platform</p>
                               </div>
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
                                 Live Demo
                               </Button>
                             </div>
                           )}
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
                             <div className="absolute top-4 right-4">
                               <Button 
                                 size="sm" 
                                 variant="secondary" 
                                 className="h-8 px-3 bg-background/90 hover:bg-background"
                                 onClick={() => window.open(item.demo_url, '_blank')}
                               >
                                 <ExternalLink className="h-4 w-4 mr-1" />
                                 Demo
                               </Button>
                             </div>
                           )}
                         </>
                       )}

                       {/* Category Badge */}
                       <div className="pointer-events-none absolute top-4 left-4">
                         <Badge className="bg-primary text-primary-foreground">
                           {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                         </Badge>
                       </div>
                       
                        {/* Owner Controls - Only for real videos */}
                        {userRole === 'owner' && item.type === 'video' && (
                          <div className="absolute top-4 right-4 flex gap-2">
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditClick(item as Video)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                           <Button 
                             size="sm" 
                             variant="destructive" 
                             className="h-8 w-8 p-0"
                             onClick={() => handleDelete(item.id)}
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </div>
                       )}
                     </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary/10 to-coral/10 rounded-3xl p-12">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Ready to Transform Your Business?
          </h3>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            From compelling video campaigns to powerful web applications and intelligent automation - let&apos;s build the complete digital solution your business needs to thrive.
          </p>
          <Button className="btn-hero" asChild>
            <Link to="/#contact">
              Start Your Project Today <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
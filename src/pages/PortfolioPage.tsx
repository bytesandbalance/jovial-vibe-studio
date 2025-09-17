import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowRight, ArrowLeft, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
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
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [videos, setVideos] = useState<Video[]>([]);
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
      fetchVideos();
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
      fetchVideos();
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
      fetchVideos();
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
            Explore our collection of videos that bring brands to life and create lasting connections with customers.
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

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <div className="mb-8 overflow-x-auto">
            <TabsList className="inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-full lg:grid lg:grid-cols-7">
              {CATEGORIES.map((category) => (
                <TabsTrigger key={category.value} value={category.value} className="whitespace-nowrap px-3 py-1.5 text-sm font-medium">
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

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
                  <div key={video.id} className="group cursor-pointer relative">
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-accent h-64 mb-4">
                      {video.file_url ? (
                        <video
                          src={video.file_url}
                          poster={video.thumbnail_url}
                          className="w-full h-full object-cover"
                          controls
                          muted
                          playsInline
                          preload="metadata"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-coral/20" />
                      )}
                      
                      {/* Play Button */}
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-background/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <Play className="w-8 h-8 text-primary ml-1" />
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="pointer-events-none absolute bottom-4 right-4">
                        <Badge variant="secondary" className="bg-background/80">
                          {formatDuration(video.duration || 0)}
                        </Badge>
                      </div>

                      {/* Category Badge */}
                      <div className="pointer-events-none absolute top-4 left-4">
                        <Badge className="bg-primary text-primary-foreground">
                          {CATEGORIES.find(c => c.value === video.category)?.label || video.category}
                        </Badge>
                      </div>
                      
                       {/* Owner Controls */}
                       {userRole === 'owner' && (
                         <div className="absolute top-4 right-4 flex gap-2">
                           <Button 
                             size="sm" 
                             variant="secondary" 
                             className="h-8 w-8 p-0"
                             onClick={() => handleEditClick(video)}
                           >
                             <Edit className="h-4 w-4" />
                           </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleDelete(video.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
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
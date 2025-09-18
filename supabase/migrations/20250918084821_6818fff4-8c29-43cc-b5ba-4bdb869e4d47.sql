-- Create table for YouTube spokesperson videos
CREATE TABLE public.youtube_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  youtube_id TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT DEFAULT 'spokesperson',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for YouTube videos
CREATE POLICY "Anyone can view active YouTube videos" 
ON public.youtube_videos 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only owners can insert YouTube videos" 
ON public.youtube_videos 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'owner'::user_role
));

CREATE POLICY "Only owners can update YouTube videos" 
ON public.youtube_videos 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'owner'::user_role
));

CREATE POLICY "Only owners can delete YouTube videos" 
ON public.youtube_videos 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'owner'::user_role
));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_youtube_videos_updated_at
BEFORE UPDATE ON public.youtube_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert the three YouTube Shorts
INSERT INTO public.youtube_videos (title, description, youtube_url, youtube_id, display_order) VALUES
('Product Explainer', 'AI-powered product demonstration and explanation', 'https://www.youtube.com/shorts/a5Gw_uMTQkA', 'a5Gw_uMTQkA', 1),
('Welcome Message', 'Engaging welcome and introduction video', 'https://www.youtube.com/shorts/mYQ1g4sgx0E', 'mYQ1g4sgx0E', 2),
('Training Video', 'Educational content and training material', 'https://www.youtube.com/shorts/4zESohEpSPY', '4zESohEpSPY', 3);
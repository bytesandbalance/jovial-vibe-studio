-- Add labels column to videos table
ALTER TABLE public.videos ADD COLUMN labels text[];

-- Add labels column to youtube_videos table  
ALTER TABLE public.youtube_videos ADD COLUMN labels text[];

-- Update existing records to convert category to labels where appropriate
UPDATE public.videos 
SET labels = ARRAY[category::text]
WHERE category::text IN ('automotive', 'fashion', 'food', 'fitness', 'retail', 'real_estate', 'beauty', 'clothing');

UPDATE public.videos
SET category = CASE 
  WHEN category::text = 'spokesperson' THEN 'spokesperson'::video_category
  ELSE 'ads'::video_category
END
WHERE category::text IN ('automotive', 'fashion', 'food', 'fitness', 'retail', 'real_estate', 'beauty', 'clothing');

UPDATE public.youtube_videos
SET labels = ARRAY[category]
WHERE category IN ('automotive', 'fashion', 'food', 'fitness', 'retail', 'real_estate', 'beauty', 'clothing');

UPDATE public.youtube_videos
SET category = CASE 
  WHEN category = 'spokesperson' THEN 'spokesperson'
  ELSE 'ads'
END
WHERE category IN ('automotive', 'fashion', 'food', 'fitness', 'retail', 'real_estate', 'beauty', 'clothing');

-- Create indexes for better performance on labels
CREATE INDEX idx_videos_labels ON public.videos USING GIN(labels);
CREATE INDEX idx_youtube_videos_labels ON public.youtube_videos USING GIN(labels);
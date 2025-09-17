-- Create owner_emails table for pre-approved owners
CREATE TABLE public.owner_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on owner_emails
ALTER TABLE public.owner_emails ENABLE ROW LEVEL SECURITY;

-- Policy to allow reading owner emails (needed for signup process)
CREATE POLICY "Anyone can check owner emails for signup" 
ON public.owner_emails 
FOR SELECT 
USING (true);

-- Insert the pre-approved owner emails
INSERT INTO public.owner_emails (email) VALUES 
  ('pflashgary@gmail.com'),
  ('jorgetaylor@hotmail.co.nz'),
  ('jorgegodfreytaylor@gmail.com'),
  ('pegah@jovial.co.nz');

-- Create purchases table for customer video purchases
CREATE TABLE public.purchases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  purchase_price DECIMAL(10,2),
  purchase_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  download_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(customer_id, video_id)
);

-- Enable RLS on purchases
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Customers can view their own purchases
CREATE POLICY "Customers can view their own purchases" 
ON public.purchases 
FOR SELECT 
USING (auth.uid() = customer_id);

-- Customers can create their own purchases
CREATE POLICY "Customers can create their own purchases" 
ON public.purchases 
FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

-- Owners can view all purchases
CREATE POLICY "Owners can view all purchases" 
ON public.purchases 
FOR SELECT 
USING (EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'owner'::user_role));

-- Add trigger for purchases timestamp updates
CREATE TRIGGER update_purchases_updated_at
BEFORE UPDATE ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update the handle_new_user function to check owner_emails
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  is_owner BOOLEAN;
BEGIN
  -- Check if email is in owner_emails table
  SELECT EXISTS(SELECT 1 FROM public.owner_emails WHERE email = NEW.email) INTO is_owner;
  
  -- Insert new profile with role based on owner_emails check
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name,
    role
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE 
      WHEN is_owner THEN 'owner'::user_role
      ELSE 'customer'::user_role
    END
  );
  
  RETURN NEW;
END;
$$;
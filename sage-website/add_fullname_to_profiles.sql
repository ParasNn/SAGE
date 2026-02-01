-- Add full_name column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name text;

-- (Optional) Update RLS policies if you want to restrict who can read/update this new column specifically, 
-- though usually the existing profile policies cover the whole row.

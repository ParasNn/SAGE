-- OPTION 1: Check JWT Metadata (As requested)
-- This is faster as it doesn't need to join tables, but ensure users cannot update their own metadata roles client-side.
CREATE POLICY "Admins and Officers can update articles"
ON public.articles
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') ILIKE ANY (ARRAY['admin', 'officer'])
);

-- Policy for Deleting
CREATE POLICY "Admins and Officers can delete articles"
ON public.articles
FOR DELETE
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') ILIKE ANY (ARRAY['admin', 'officer'])
);


-- OPTION 2: Check Profiles Table (Recommended for Security)
-- This ensures the role is verified against the database of truth, ignoring any tampered JWTs.
/*
CREATE POLICY "Admins and Officers can update articles"
ON public.articles
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role IN ('admin', 'officer')
  )
);
*/

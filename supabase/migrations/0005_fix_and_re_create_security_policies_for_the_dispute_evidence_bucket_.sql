-- Drop the previously created policies that caused an error
DROP POLICY IF EXISTS "allow_user_uploads" ON storage.objects;
DROP POLICY IF EXISTS "allow_user_downloads" ON storage.objects;
DROP POLICY IF EXISTS "allow_reviewer_downloads" ON storage.objects;

-- Re-create the policy for user uploads with the corrected syntax
CREATE POLICY "allow_user_uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'dispute_evidence' AND (string_to_array(name, '/'))[1] = auth.uid()::text);

-- Re-create the policy for user downloads with the corrected syntax
CREATE POLICY "allow_user_downloads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'dispute_evidence' AND (string_to_array(name, '/'))[1] = auth.uid()::text);

-- Re-create the policy for reviewers, which was correct but is re-added for completeness
CREATE POLICY "allow_reviewer_downloads"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'dispute_evidence' AND (get_user_role(auth.uid()) IN ('officer', 'admin', 'department_admin')));
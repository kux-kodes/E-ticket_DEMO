-- Create the departments table
CREATE TABLE public.departments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  district TEXT,
  address TEXT,
  contact_first_name TEXT,
  contact_last_name TEXT,
  contact_email TEXT NOT NULL UNIQUE,
  contact_phone TEXT,
  status VARCHAR(255) DEFAULT 'pending_review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (REQUIRED)
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Policies for the departments table
-- For now, we will not create policies, as inserts will be handled by a secure Edge Function.
-- Admin-level access for SELECT, UPDATE, DELETE would be added later.
-- This ensures that the table is secure by default.
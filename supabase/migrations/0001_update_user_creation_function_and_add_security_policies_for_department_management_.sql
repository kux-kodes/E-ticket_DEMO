-- First, update the handle_new_user function to assign a role on creation
-- This allows the admin function to create new department heads with the correct role.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone_number, license_number, vehicle_registration, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone_number',
    new.raw_user_meta_data ->> 'license_number',
    new.raw_user_meta_data ->> 'vehicle_registration',
    COALESCE(new.raw_user_meta_data ->> 'role', 'citizen') -- Assign role from metadata, default to 'citizen'
  );
  RETURN new;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to get a user's role from their profile
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add policies to the departments table so only admins can manage them
-- Policy for admins to view all department requests
CREATE POLICY "Admins can view department requests"
ON public.departments FOR SELECT
TO authenticated
USING (get_user_role(auth.uid()) = 'admin');

-- Policy for admins to update department requests (e.g., change status)
CREATE POLICY "Admins can update department requests"
ON public.departments FOR UPDATE
TO authenticated
USING (get_user_role(auth.uid()) = 'admin');
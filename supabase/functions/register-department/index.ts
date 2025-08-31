// @ts-nocheck
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const departmentData = await req.json()

    // Basic validation
    if (!departmentData.name || !departmentData.region || !departmentData.contact_email) {
      throw new Error('Missing required fields: Department name, region, and contact email are required.');
    }

    const { error } = await supabaseAdmin
      .from('departments')
      .insert([
        {
          name: departmentData.name,
          region: departmentData.region,
          district: departmentData.district,
          address: departmentData.address,
          contact_first_name: departmentData.contact_first_name,
          contact_last_name: departmentData.contact_last_name,
          contact_email: departmentData.contact_email,
          contact_phone: departmentData.contact_phone,
          status: 'pending_review' // Default status
        }
      ]);

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('A department with this email address has already been registered.');
      }
      throw error;
    }

    return new Response(JSON.stringify({ message: "Department registration submitted successfully." }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
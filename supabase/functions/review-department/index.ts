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

    const { departmentId, decision } = await req.json()

    if (!departmentId || !decision) {
      throw new Error('departmentId and decision are required.');
    }

    // 1. Fetch the department to get its details
    const { data: department, error: fetchError } = await supabaseAdmin
      .from('departments')
      .select('*')
      .eq('id', departmentId)
      .single();

    if (fetchError || !department) {
      throw new Error('Department not found or already reviewed.');
    }

    // 2. Update the department status
    const newStatus = decision === 'approved' ? 'approved' : 'rejected';
    const { error: updateError } = await supabaseAdmin
      .from('departments')
      .update({ status: newStatus })
      .eq('id', departmentId);

    if (updateError) throw updateError;

    // 3. If approved, invite the contact person as a new user
    if (decision === 'approved') {
      const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
        department.contact_email,
        {
          data: {
            first_name: department.contact_first_name,
            last_name: department.contact_last_name,
            role: 'department_admin' // This will be picked up by the handle_new_user trigger
          }
        }
      );

      if (inviteError) {
        // If invite fails, roll back the status update for consistency
        await supabaseAdmin.from('departments').update({ status: 'pending_review' }).eq('id', departmentId);
        throw new Error(`Failed to invite user: ${inviteError.message}`);
      }
    }
    
    // In a real-world scenario, you would also send a notification email here
    // confirming the approval or rejection to the contact person.

    return new Response(JSON.stringify({ message: `Department successfully ${newStatus}.` }), {
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
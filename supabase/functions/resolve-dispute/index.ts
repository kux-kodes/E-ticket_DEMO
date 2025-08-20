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
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { fineId, decision, notes, officerId } = await req.json()

    if (!fineId || !decision || !officerId) {
      throw new Error('Missing required parameters: fineId, decision, and officerId are required.');
    }

    // 1. Find the dispute and related fine
    const { data: dispute, error: disputeError } = await supabaseAdmin
      .from('disputes')
      .select('id, user_id, fines(*)')
      .eq('fine_id', fineId)
      .single()

    if (disputeError || !dispute || !dispute.fines) {
      throw new Error(`Dispute not found for fine ID ${fineId}.`);
    }

    const citizenUserId = dispute.user_id;

    // 2. Update the status of the dispute and the fine
    const newDisputeStatus = decision === 'Approved' ? 'approved' : 'rejected';
    const newFineStatus = decision === 'Approved' ? 'waived' : 'outstanding';

    const { error: updateDisputeError } = await supabaseAdmin
      .from('disputes')
      .update({
        status: newDisputeStatus,
        reviewed_at: new Date().toISOString(),
        reviewed_by: officerId,
      })
      .eq('id', dispute.id);

    if (updateDisputeError) throw updateDisputeError;

    const { error: updateFineError } = await supabaseAdmin
      .from('fines')
      .update({ status: newFineStatus })
      .eq('id', fineId);

    if (updateFineError) throw updateFineError;

    // 3. Get citizen's email and simulate sending a notification
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(citizenUserId);
    if (userError || !user.user.email) throw new Error('Could not find user email.');

    const citizenEmail = user.user.email;
    const fineIdentifier = fineId.substring(0, 8).toUpperCase();
    const emailSubject = `Update on your dispute for fine #${fineIdentifier}`;
    let emailBody = '';

    if (decision === 'Approved') {
      emailBody = `Dear Citizen,\n\nGood news! Your dispute for fine #${fineIdentifier} regarding "${dispute.fines.violation_type}" has been approved.\n\nThe fine has been waived, and no further action is required.\n\nOfficer notes: ${notes || 'N/A'}\n\nRegards,\nDRIVA System`;
    } else {
      emailBody = `Dear Citizen,\n\nThis email is to inform you that your dispute for fine #${fineIdentifier} regarding "${dispute.fines.violation_type}" has been reviewed and rejected.\n\nThe fine is now considered outstanding and is due by ${new Date(dispute.fines.due_date).toLocaleDateString()}.\nPlease log in to the citizen portal to view details and settle the payment.\n\nOfficer notes: ${notes || 'N/A'}\n\nRegards,\nDRIVA System`;
    }

    // In a real application, you would use an email service like Resend or SendGrid here.
    // For now, we log the email to the console.
    console.log("--- SIMULATING EMAIL NOTIFICATION ---");
    console.log(`To: ${citizenEmail}`);
    console.log(`Subject: ${emailSubject}`);
    console.log(`Body:\n${emailBody}`);
    console.log("-----------------------------------");

    return new Response(JSON.stringify({ message: "Dispute resolved successfully" }), {
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
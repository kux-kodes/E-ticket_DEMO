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

    const { fineIds, userId, paymentMethod } = await req.json()

    if (!fineIds || !Array.isArray(fineIds) || fineIds.length === 0 || !userId) {
      throw new Error('Missing required parameters: fineIds array and userId are required.');
    }

    // 1. Fetch the fines to get their amounts and verify they belong to the user
    const { data: fines, error: finesError } = await supabaseAdmin
      .from('fines')
      .select('id, amount')
      .in('id', fineIds)
      .eq('user_id', userId)
      .in('status', ['outstanding', 'overdue']);

    if (finesError) throw finesError;
    if (fines.length !== fineIds.length) {
      throw new Error('One or more fines could not be found, do not belong to the user, or are not payable.');
    }

    // 2. Create payment records for each fine
    const paymentRecords = fines.map(fine => ({
      user_id: userId,
      fine_id: fine.id,
      amount: fine.amount,
      payment_method: paymentMethod || 'Credit Card',
      payment_status: 'completed',
      transaction_id: `txn_${crypto.randomUUID()}`,
    }));

    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert(paymentRecords);

    if (paymentError) throw paymentError;

    // 3. Update the status of the fines to 'paid'
    const { error: updateError } = await supabaseAdmin
      .from('fines')
      .update({ status: 'paid' })
      .in('id', fineIds);

    if (updateError) throw updateError;

    return new Response(JSON.stringify({ message: `${fines.length} fines paid successfully.` }), {
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
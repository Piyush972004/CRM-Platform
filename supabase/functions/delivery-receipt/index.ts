
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { vendor_message_id, delivery_status, delivered_at, error_message } = await req.json()

    // Find the communication log by vendor_message_id
    const { data: logs, error: findError } = await supabaseClient
      .from('communication_logs')
      .select('*')
      .eq('vendor_message_id', vendor_message_id)
      .single()

    if (findError || !logs) {
      console.error('Communication log not found:', findError)
      return new Response(
        JSON.stringify({ error: 'Communication log not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 404 
        }
      )
    }

    // Update communication log with delivery status
    const { error: updateError } = await supabaseClient
      .from('communication_logs')
      .update({
        status: delivery_status,
        delivered_at: delivered_at,
        error_message: error_message,
        updated_at: new Date().toISOString()
      })
      .eq('vendor_message_id', vendor_message_id)

    if (updateError) {
      throw updateError
    }

    // Insert delivery receipt
    const { error: receiptError } = await supabaseClient
      .from('delivery_receipts')
      .insert({
        communication_log_id: logs.id,
        delivery_status,
        delivered_at,
        error_message,
        vendor_response: { vendor_message_id, timestamp: new Date().toISOString() }
      })

    if (receiptError) {
      throw receiptError
    }

    // Update campaign statistics
    if (logs.campaign_id) {
      await supabaseClient.rpc('update_campaign_stats', {
        p_campaign_id: logs.campaign_id,
        p_status: delivery_status
      })
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Delivery receipt processed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Delivery receipt error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})

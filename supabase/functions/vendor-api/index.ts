
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
    const { customer_id, campaign_id, message } = await req.json()
    
    // Simulate 90% success rate
    const success = Math.random() < 0.9
    const vendor_message_id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000))
    
    const response = {
      vendor_message_id,
      status: success ? 'sent' : 'failed',
      error_message: success ? null : 'Simulated delivery failure',
      customer_id,
      campaign_id,
      timestamp: new Date().toISOString()
    }

    // Call delivery receipt webhook
    const deliveryReceiptUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/delivery-receipt`
    await fetch(deliveryReceiptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      },
      body: JSON.stringify({
        vendor_message_id,
        delivery_status: success ? 'delivered' : 'failed',
        delivered_at: success ? new Date().toISOString() : null,
        error_message: response.error_message
      })
    })

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

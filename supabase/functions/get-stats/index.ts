import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get vote stats
    const { data: stats, error: statsError } = await supabaseClient
      .from('vote_stats')
      .select('*')

    if (statsError) {
      throw statsError
    }

    // Get total stats
    const { data: totalStat, error: totalError } = await supabaseClient
      .from('total_stats')
      .select('*')
      .single()

    if (totalError) {
      throw totalError
    }

    return new Response(
      JSON.stringify({
        stats: stats || [],
        total: totalStat || { total_votes: 0, total_voters: 0 },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error getting stats:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

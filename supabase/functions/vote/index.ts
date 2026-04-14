import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VoteRequest {
  votes: Record<string, number>
  voterId: string
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

    const { votes, voterId }: VoteRequest = await req.json()

    // Validate input
    if (!votes || typeof votes !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid votes data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!voterId) {
      return new Response(
        JSON.stringify({ error: 'Missing voterId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if voter has already voted
    const { data: existingVotes, error: checkError } = await supabaseClient
      .from('votes')
      .select('id')
      .eq('voter_id', voterId)
      .limit(1)

    if (checkError) {
      throw checkError
    }

    if (existingVotes && existingVotes.length > 0) {
      return new Response(
        JSON.stringify({ error: 'You have already voted' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate total votes <= 5
    const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0)
    if (totalVotes > 5 || totalVotes === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid vote count. Must be between 1 and 5.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Insert votes
    const voteRecords = Object.entries(votes)
      .filter(([, count]) => count > 0)
      .map(([issueId, voteCount]) => ({
        issue_id: issueId,
        vote_count: voteCount,
        voter_id: voterId,
      }))

    const { error: insertError } = await supabaseClient
      .from('votes')
      .insert(voteRecords)

    if (insertError) {
      throw insertError
    }

    // Get updated stats
    const { data: stats, error: statsError } = await supabaseClient
      .from('vote_stats')
      .select('*')

    if (statsError) {
      throw statsError
    }

    const { data: totalStat, error: totalError } = await supabaseClient
      .from('total_stats')
      .select('*')
      .single()

    if (totalError) {
      throw totalError
    }

    return new Response(
      JSON.stringify({
        success: true,
        stats: stats || [],
        total: totalStat || { total_votes: 0, total_voters: 0 },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing vote:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

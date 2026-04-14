import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 生成匿名用户ID
export function generateVoterId(): string {
  const stored = localStorage.getItem('bupd-voter-id')
  if (stored) return stored
  
  const newId = `voter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  localStorage.setItem('bupd-voter-id', newId)
  return newId
}

// 获取投票统计数据
export async function getVoteStats() {
  try {
    const { data, error } = await supabase
      .from('vote_stats')
      .select('*')
    
    if (error) throw error
    
    const { data: totalData, error: totalError } = await supabase
      .from('total_stats')
      .select('*')
      .single()
    
    if (totalError) throw totalError
    
    // 转换为对象格式
    const votes: Record<string, number> = {}
    data?.forEach((stat: { issue_id: string; total_votes: number }) => {
      votes[stat.issue_id] = stat.total_votes
    })
    
    return {
      votes,
      totalVotes: totalData?.total_votes || 0,
      voterCount: totalData?.total_voters || 0,
    }
  } catch (error) {
    console.error('Error fetching vote stats:', error)
    return null
  }
}

// 检查用户是否已投票
export async function checkHasVoted(voterId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('votes')
      .select('id')
      .eq('voter_id', voterId)
      .limit(1)
    
    if (error) throw error
    return data && data.length > 0
  } catch (error) {
    console.error('Error checking vote status:', error)
    return false
  }
}

// 提交投票
export async function submitVotes(
  votes: Record<string, number>,
  voterId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 准备投票记录
    const voteRecords = Object.entries(votes)
      .filter(([, count]) => count > 0)
      .map(([issue_id, vote_count]) => ({
        issue_id,
        vote_count,
        voter_id: voterId,
      }))

    const { error } = await supabase
      .from('votes')
      .insert(voteRecords)

    if (error) {
      if (error.code === '23505') {
        return { success: false, error: '您已经投过票了' }
      }
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('Error submitting votes:', error)
    return { success: false, error: '提交失败，请重试' }
  }
}

// 订阅实时投票更新
export function subscribeToVotes(callback: (payload: unknown) => void) {
  return supabase
    .channel('votes-channel')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'votes' },
      callback
    )
    .subscribe()
}

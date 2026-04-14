import { useState, useEffect, useCallback } from 'react';
import type { VoteState } from '@/types';
import { MAX_VOTES } from '@/data/issues';
import { 
  generateVoterId, 
  getVoteStats, 
  checkHasVoted, 
  submitVotes as submitToSupabase,
  subscribeToVotes
} from '@/lib/supabase';

interface VotingData {
  votes: Record<string, number>;
  totalVotes: number;
  voterCount: number;
}

export function useVoting() {
  const [voterId] = useState(() => generateVoterId());
  const [userVotes, setUserVotes] = useState<VoteState>({});
  const [totalData, setTotalData] = useState<VotingData>({
    votes: {},
    totalVotes: 0,
    voterCount: 0,
  });
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载初始数据
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // 获取投票统计
        const stats = await getVoteStats();
        if (stats) {
          setTotalData(stats);
        }
        
        // 检查用户是否已投票
        const voted = await checkHasVoted(voterId);
        setHasVoted(voted);
        
        // 如果已投票，从本地存储加载用户的投票记录
        if (voted) {
          const savedVotes = localStorage.getItem(`bupd-votes-${voterId}`);
          if (savedVotes) {
            setUserVotes(JSON.parse(savedVotes));
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('加载数据失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [voterId]);

  // 订阅实时更新
  useEffect(() => {
    const subscription = subscribeToVotes(() => {
      // 有新投票时刷新数据
      getVoteStats().then(stats => {
        if (stats) {
          setTotalData(stats);
        }
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 定期刷新数据（每10秒）
  useEffect(() => {
    const interval = setInterval(async () => {
      const stats = await getVoteStats();
      if (stats) {
        setTotalData(stats);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getUserTotalVotes = useCallback(() => {
    return Object.values(userVotes).reduce((sum, count) => sum + count, 0);
  }, [userVotes]);

  const getRemainingVotes = useCallback(() => {
    return MAX_VOTES - getUserTotalVotes();
  }, [getUserTotalVotes]);

  const addVote = useCallback((issueId: string) => {
    if (getRemainingVotes() <= 0) return false;
    
    setUserVotes(prev => ({
      ...prev,
      [issueId]: (prev[issueId] || 0) + 1,
    }));
    return true;
  }, [getRemainingVotes]);

  const removeVote = useCallback((issueId: string) => {
    setUserVotes(prev => {
      const current = prev[issueId] || 0;
      if (current <= 1) {
        const { [issueId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [issueId]: current - 1,
      };
    });
  }, []);

  const getVoteCount = useCallback((issueId: string) => {
    return userVotes[issueId] || 0;
  }, [userVotes]);

  const submitVotesCallback = useCallback(async () => {
    if (getUserTotalVotes() === 0) return false;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await submitToSupabase(userVotes, voterId);
      
      if (result.success) {
        setHasVoted(true);
        // 保存用户的投票记录到本地
        localStorage.setItem(`bupd-votes-${voterId}`, JSON.stringify(userVotes));
        
        // 刷新统计数据
        const stats = await getVoteStats();
        if (stats) {
          setTotalData(stats);
        }
        
        return true;
      } else {
        setError(result.error || '提交失败');
        return false;
      }
    } catch (err) {
      console.error('Error submitting votes:', err);
      setError('提交失败，请重试');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [userVotes, voterId, getUserTotalVotes]);

  const resetVotes = useCallback(() => {
    // 注意：实际环境中不应该允许重置投票
    // 这里仅用于测试
    setUserVotes({});
    setHasVoted(false);
    localStorage.removeItem(`bupd-votes-${voterId}`);
  }, [voterId]);

  const getTotalVotesForIssue = useCallback((issueId: string) => {
    return totalData.votes[issueId] || 0;
  }, [totalData.votes]);

  const getTopIssues = useCallback((limit: number = 10) => {
    return Object.entries(totalData.votes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }, [totalData.votes]);

  return {
    userVotes,
    totalData,
    hasVoted,
    isSubmitting,
    isLoading,
    error,
    maxVotes: MAX_VOTES,
    userTotalVotes: getUserTotalVotes(),
    remainingVotes: getRemainingVotes(),
    addVote,
    removeVote,
    getVoteCount,
    submitVotes: submitVotesCallback,
    resetVotes,
    getTotalVotesForIssue,
    getTopIssues,
  };
}

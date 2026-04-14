import { useState, useEffect, useCallback } from 'react';
import type { VoteState } from '@/types';
import { MAX_VOTES } from '@/data/issues';
import { 
  generateVoterId, 
  getVoteStats, 
  checkHasVoted, 
  submitVotes as submitToSupabase,
  subscribeToVotes,
  getVoterName,
  saveVoterName,
} from '@/lib/supabase';

interface VotingData {
  votes: Record<string, number>;
  totalVotes: number;
  voterCount: number;
}

export function useVoting() {
  const [voterId] = useState(() => generateVoterId());
  const [voterName, setVoterName] = useState<string>(() => getVoterName() || '');
  const [isNameSet, setIsNameSet] = useState<boolean>(() => !!getVoterName());
  
  // 维度投票状态：维度ID -> 投票数
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
          const savedVotes = localStorage.getItem(`bupd-dimension-votes-${voterId}`);
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

  // 设置投票人姓名
  const setVoterNameAndSave = useCallback((name: string) => {
    const trimmedName = name.trim();
    if (trimmedName) {
      saveVoterName(trimmedName);
      setVoterName(trimmedName);
      setIsNameSet(true);
    }
  }, []);

  // 获取用户总投票数
  const getUserTotalVotes = useCallback(() => {
    return Object.values(userVotes).reduce((sum, count) => sum + count, 0);
  }, [userVotes]);

  // 获取剩余票数
  const getRemainingVotes = useCallback(() => {
    return MAX_VOTES - getUserTotalVotes();
  }, [getUserTotalVotes]);

  // 获取某个维度的投票数
  const getDimensionVoteCount = useCallback((dimensionId: string) => {
    return userVotes[dimensionId] || 0;
  }, [userVotes]);

  // 给维度添加投票
  const addVoteToDimension = useCallback((dimensionId: string) => {
    if (getRemainingVotes() <= 0) return false;
    
    setUserVotes(prev => ({
      ...prev,
      [dimensionId]: (prev[dimensionId] || 0) + 1,
    }));
    return true;
  }, [getRemainingVotes]);

  // 给维度减少投票
  const removeVoteFromDimension = useCallback((dimensionId: string) => {
    setUserVotes(prev => {
      const current = prev[dimensionId] || 0;
      if (current <= 1) {
        const { [dimensionId]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [dimensionId]: current - 1,
      };
    });
  }, []);

  // 提交投票
  const submitVotesCallback = useCallback(async () => {
    if (getUserTotalVotes() === 0) return false;
    if (!voterName.trim()) {
      setError('请输入您的姓名');
      return false;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await submitToSupabase(userVotes, voterId, voterName.trim());
      
      if (result.success) {
        setHasVoted(true);
        // 保存用户的投票记录到本地
        localStorage.setItem(`bupd-dimension-votes-${voterId}`, JSON.stringify(userVotes));
        
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
  }, [userVotes, voterId, voterName, getUserTotalVotes]);

  // 重置投票（仅用于测试）
  const resetVotes = useCallback(() => {
    setUserVotes({});
    setHasVoted(false);
    localStorage.removeItem(`bupd-dimension-votes-${voterId}`);
  }, [voterId]);

  // 获取维度的总票数
  const getTotalVotesForDimension = useCallback((dimensionId: string) => {
    return totalData.votes[dimensionId] || 0;
  }, [totalData.votes]);

  // 获取热门维度排行
  const getTopDimensions = useCallback((limit: number = 10) => {
    return Object.entries(totalData.votes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }, [totalData.votes]);

  return {
    voterName,
    isNameSet,
    setVoterName: setVoterNameAndSave,
    userVotes,
    totalData,
    hasVoted,
    isSubmitting,
    isLoading,
    error,
    maxVotes: MAX_VOTES,
    userTotalVotes: getUserTotalVotes(),
    remainingVotes: getRemainingVotes(),
    getDimensionVoteCount,
    addVoteToDimension,
    removeVoteFromDimension,
    submitVotes: submitVotesCallback,
    resetVotes,
    getTotalVotesForDimension,
    getTopDimensions,
  };
}

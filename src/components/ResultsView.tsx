import { useMemo } from 'react';
import { Trophy, Users, BarChart3, RotateCcw } from 'lucide-react';
import { dimensions } from '@/data/issues';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ResultsViewProps {
  totalVotes: Record<string, number>;
  totalVoteCount: number;
  voterCount: number;
  userVotes: Record<string, number>;
  onReset: () => void;
}

export function ResultsView({ 
  totalVotes, 
  totalVoteCount, 
  voterCount,
  userVotes,
  onReset 
}: ResultsViewProps) {
  // Get top 10 issues
  const topIssues = useMemo(() => {
    return Object.entries(totalVotes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [totalVotes]);

  // Get dimension stats
  const dimensionStats = useMemo(() => {
    return dimensions.map(dim => {
      const issueVotes = dim.issues.map(issue => ({
        issue,
        votes: totalVotes[issue.id] || 0,
      }));
      const totalDimensionVotes = issueVotes.reduce((sum, { votes }) => sum + votes, 0);
      return {
        dimension: dim,
        totalVotes: totalDimensionVotes,
        issueVotes: issueVotes.sort((a, b) => b.votes - a.votes),
      };
    }).sort((a, b) => b.totalVotes - a.totalVotes);
  }, [totalVotes]);

  const maxDimensionVotes = Math.max(...dimensionStats.map(d => d.totalVotes), 1);

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-indigo-200" />
            <span className="text-indigo-100 text-sm">参与人数</span>
          </div>
          <p className="text-3xl font-bold">{voterCount}</p>
          <p className="text-indigo-200 text-sm mt-1">人已投票</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-emerald-200" />
            <span className="text-emerald-100 text-sm">累计票数</span>
          </div>
          <p className="text-3xl font-bold">{totalVoteCount}</p>
          <p className="text-emerald-200 text-sm mt-1">总投票数</p>
        </div>
      </div>

      {/* Top 10 Issues */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center gap-3 mb-5">
          <Trophy className="w-6 h-6 text-amber-500" />
          <h3 className="text-xl font-bold text-slate-800">热门议题 TOP 10</h3>
        </div>
        
        <div className="space-y-3">
          {topIssues.map(([issueId, votes], index) => {
            const issue = dimensions.flatMap(d => d.issues).find(i => i.id === issueId);
            if (!issue) return null;
            
            const isTop3 = index < 3;
            const isUserVoted = userVotes[issueId] > 0;
            
            return (
              <div
                key={issueId}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-all duration-200",
                  isTop3 
                    ? "bg-amber-50 border-2 border-amber-200" 
                    : "bg-slate-50 border border-slate-100",
                  isUserVoted && "ring-2 ring-indigo-300"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0",
                  index === 0 && "bg-amber-400 text-amber-900",
                  index === 1 && "bg-slate-300 text-slate-700",
                  index === 2 && "bg-amber-600 text-amber-100",
                  index > 2 && "bg-slate-200 text-slate-600"
                )}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 leading-relaxed">{issue.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full",
                      issue.type === 'positive' 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-rose-100 text-rose-700"
                    )}>
                      {issue.type === 'positive' ? '优势' : '挑战'}
                    </span>
                    {isUserVoted && (
                      <span className="text-xs text-indigo-600 font-medium">
                        你投了 {userVotes[issueId]} 票
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xl font-bold text-slate-800">{votes}</span>
                  <span className="text-xs text-slate-500">票</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dimension Stats */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <h3 className="text-xl font-bold text-slate-800 mb-5">各维度投票分布</h3>
        
        <div className="space-y-4">
          {dimensionStats.map(({ dimension, totalVotes: dimVotes }) => (
            <div key={dimension.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">{dimension.title}</span>
                <span className="text-sm font-bold text-slate-800">{dimVotes} 票</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${(dimVotes / maxDimensionVotes) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="flex justify-center pt-4">
        <Button
          variant="outline"
          onClick={onReset}
          className="flex items-center gap-2 text-slate-600"
        >
          <RotateCcw className="w-4 h-4" />
          重新投票（测试用）
        </Button>
      </div>
    </div>
  );
}

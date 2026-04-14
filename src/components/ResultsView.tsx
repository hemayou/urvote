import { useMemo } from 'react';
import { Trophy, Users, BarChart3, RotateCcw } from 'lucide-react';
import { dimensions, swotConfig } from '@/data/issues';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { SwotType } from '@/data/issues';

interface ResultsViewProps {
  totalVotes: Record<string, number>;
  totalVoteCount: number;
  voterCount: number;
  userVotes: Record<string, number>;
  voterName: string;
  onReset: () => void;
}

// SWOT 标签组件
function SwotBadge({ type, count }: { type: SwotType; count: number }) {
  const config = swotConfig[type];
  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium",
      config.bgColor,
      config.textColor
    )}>
      <span className={cn("w-1.5 h-1.5 rounded-full", config.color)} />
      <span>{config.labelEn}</span>
      <span className="font-bold">{count}</span>
    </div>
  );
}

export function ResultsView({ 
  totalVotes, 
  totalVoteCount, 
  voterCount,
  userVotes,
  voterName,
  onReset 
}: ResultsViewProps) {
  // 获取维度排行
  const dimensionRankings = useMemo(() => {
    return dimensions.map(dim => {
      const swotCounts = {
        strength: dim.points.filter(p => p.type === 'strength').length,
        weakness: dim.points.filter(p => p.type === 'weakness').length,
        opportunity: dim.points.filter(p => p.type === 'opportunity').length,
        threat: dim.points.filter(p => p.type === 'threat').length,
      };
      return {
        dimension: dim,
        votes: totalVotes[dim.id] || 0,
        userVotes: userVotes[dim.id] || 0,
        swotCounts,
      };
    }).sort((a, b) => b.votes - a.votes);
  }, [totalVotes, userVotes]);

  const maxVotes = Math.max(...dimensionRankings.map(d => d.votes), 1);

  return (
    <div className="space-y-6">
      {/* 欢迎语 */}
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white">
        <p className="text-lg">
          感谢您的参与，<span className="font-bold">{voterName}</span>！
        </p>
        <p className="text-indigo-100 text-sm mt-1">
          以下是实时投票结果
        </p>
      </div>

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

      {/* Dimension Rankings */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
        <div className="flex items-center gap-3 mb-5">
          <Trophy className="w-6 h-6 text-amber-500" />
          <h3 className="text-xl font-bold text-slate-800">议题投票排行</h3>
        </div>
        
        <div className="space-y-4">
          {dimensionRankings.map(({ dimension, votes, userVotes: myVotes, swotCounts }, index) => {
            const isTop3 = index < 3;
            const hasMyVote = myVotes > 0;
            const percentage = (votes / maxVotes) * 100;
            
            return (
              <div
                key={dimension.id}
                className={cn(
                  "p-4 rounded-xl transition-all duration-200",
                  isTop3 
                    ? "bg-amber-50 border-2 border-amber-200" 
                    : "bg-slate-50 border border-slate-100",
                  hasMyVote && "ring-2 ring-indigo-300"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Rank */}
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0",
                    index === 0 && "bg-amber-400 text-amber-900",
                    index === 1 && "bg-slate-300 text-slate-700",
                    index === 2 && "bg-amber-600 text-amber-100",
                    index > 2 && "bg-slate-200 text-slate-600"
                  )}>
                    {index + 1}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-bold text-slate-800">{dimension.title}</h4>
                      {hasMyVote && (
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                          您投了 {myVotes} 票
                        </span>
                      )}
                    </div>
                    
                    {/* SWOT badges */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {swotCounts.strength > 0 && <SwotBadge type="strength" count={swotCounts.strength} />}
                      {swotCounts.weakness > 0 && <SwotBadge type="weakness" count={swotCounts.weakness} />}
                      {swotCounts.opportunity > 0 && <SwotBadge type="opportunity" count={swotCounts.opportunity} />}
                      {swotCounts.threat > 0 && <SwotBadge type="threat" count={swotCounts.threat} />}
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Vote count */}
                  <div className="text-right flex-shrink-0">
                    <span className="text-2xl font-bold text-slate-800">{votes}</span>
                    <span className="text-xs text-slate-500 ml-1">票</span>
                  </div>
                </div>
              </div>
            );
          })}
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

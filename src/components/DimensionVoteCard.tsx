import { Plus, Minus, Check } from 'lucide-react';
import type { DimensionWithSwot, SwotType } from '@/data/issues';
import { swotConfig } from '@/data/issues';
import { cn } from '@/lib/utils';

interface DimensionVoteCardProps {
  dimension: DimensionWithSwot;
  voteCount: number;
  onAdd: () => void;
  onRemove: () => void;
  disabled: boolean;
  hasVoted: boolean;
  totalVotes: number;
}

// SWOT 标签组件
function SwotBadge({ type, count }: { type: SwotType; count: number }) {
  const config = swotConfig[type];
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
      config.bgColor,
      config.textColor
    )}>
      <span className={cn("w-2 h-2 rounded-full", config.color)} />
      <span>{config.labelEn}</span>
      <span className="font-bold">{count}</span>
    </div>
  );
}

export function DimensionVoteCard({
  dimension,
  voteCount,
  onAdd,
  onRemove,
  disabled,
  hasVoted,
  totalVotes,
}: DimensionVoteCardProps) {
  // 统计各SWOT类型的要点数量
  const swotCounts = {
    strength: dimension.points.filter(p => p.type === 'strength').length,
    weakness: dimension.points.filter(p => p.type === 'weakness').length,
    opportunity: dimension.points.filter(p => p.type === 'opportunity').length,
    threat: dimension.points.filter(p => p.type === 'threat').length,
  };

  if (hasVoted) {
    // 结果视图
    return (
      <div className={cn(
        "relative p-5 rounded-xl border-2 transition-all duration-300",
        voteCount > 0
          ? "bg-indigo-50 border-indigo-300"
          : "bg-white border-slate-100"
      )}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {dimension.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {swotCounts.strength > 0 && <SwotBadge type="strength" count={swotCounts.strength} />}
              {swotCounts.weakness > 0 && <SwotBadge type="weakness" count={swotCounts.weakness} />}
              {swotCounts.opportunity > 0 && <SwotBadge type="opportunity" count={swotCounts.opportunity} />}
              {swotCounts.threat > 0 && <SwotBadge type="threat" count={swotCounts.threat} />}
            </div>
            <p className="text-sm text-slate-500">
              共 {dimension.points.length} 个要点
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-slate-800">{totalVotes}</div>
            <div className="text-xs text-slate-500">票</div>
            {voteCount > 0 && (
              <div className="mt-2 text-sm font-medium text-indigo-600">
                您投了 {voteCount} 票
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 投票视图
  return (
    <div className={cn(
      "relative p-5 rounded-xl border-2 transition-all duration-200",
      voteCount > 0
        ? "bg-indigo-50 border-indigo-300 shadow-md shadow-indigo-100"
        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            {dimension.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {swotCounts.strength > 0 && <SwotBadge type="strength" count={swotCounts.strength} />}
            {swotCounts.weakness > 0 && <SwotBadge type="weakness" count={swotCounts.weakness} />}
            {swotCounts.opportunity > 0 && <SwotBadge type="opportunity" count={swotCounts.opportunity} />}
            {swotCounts.threat > 0 && <SwotBadge type="threat" count={swotCounts.threat} />}
          </div>
          <p className="text-sm text-slate-500">
            共 {dimension.points.length} 个要点
          </p>
        </div>

        {/* 投票控制 */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRemove}
            disabled={voteCount === 0}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
              voteCount > 0
                ? "bg-slate-200 text-slate-700 hover:bg-slate-300 active:scale-95"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <Minus className="w-5 h-5" />
          </button>

          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-200",
            voteCount > 0
              ? "bg-indigo-500 text-white"
              : "bg-slate-100 text-slate-400"
          )}>
            {voteCount}
          </div>

          <button
            onClick={onAdd}
            disabled={disabled}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200",
              disabled
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95"
            )}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {voteCount > 0 && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Plus, Minus, Check, ChevronDown, ChevronUp } from 'lucide-react';
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

// SWOT 标签组件（统计用）
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
  const [isExpanded, setIsExpanded] = useState(false);
  
  // 统计各SWOT类型的要点数量
  const swotCounts = {
    strength: dimension.points.filter(p => p.type === 'strength').length,
    weakness: dimension.points.filter(p => p.type === 'weakness').length,
    opportunity: dimension.points.filter(p => p.type === 'opportunity').length,
    threat: dimension.points.filter(p => p.type === 'threat').length,
  };

  // 按SWOT类型分组显示要点
  const groupedPoints = {
    strength: dimension.points.filter(p => p.type === 'strength'),
    weakness: dimension.points.filter(p => p.type === 'weakness'),
    opportunity: dimension.points.filter(p => p.type === 'opportunity'),
    threat: dimension.points.filter(p => p.type === 'threat'),
  };

  if (hasVoted) {
    // 结果视图
    return (
      <div className={cn(
        "relative rounded-xl border-2 transition-all duration-300 overflow-hidden",
        voteCount > 0
          ? "bg-indigo-50 border-indigo-300"
          : "bg-white border-slate-100"
      )}>
        {/* 头部 - 可点击展开 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors"
        >
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {dimension.title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {swotCounts.strength > 0 && <SwotBadge type="strength" count={swotCounts.strength} />}
              {swotCounts.weakness > 0 && <SwotBadge type="weakness" count={swotCounts.weakness} />}
              {swotCounts.opportunity > 0 && <SwotBadge type="opportunity" count={swotCounts.opportunity} />}
              {swotCounts.threat > 0 && <SwotBadge type="threat" count={swotCounts.threat} />}
            </div>
            <p className="text-sm text-slate-500">
              共 {dimension.points.length} 个要点
              {isExpanded ? '（点击收起）' : '（点击展开详情）'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-3xl font-bold text-slate-800">{totalVotes}</div>
              <div className="text-xs text-slate-500">票</div>
              {voteCount > 0 && (
                <div className="mt-1 text-sm font-medium text-indigo-600">
                  您投了 {voteCount} 票
                </div>
              )}
            </div>
            <div className="text-slate-400">
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </div>
        </button>

        {/* 展开内容 - 显示所有SWOT要点 */}
        {isExpanded && (
          <div className="border-t border-slate-200 bg-slate-50/50 p-5">
            <div className="space-y-4">
              {/* 优势 */}
              {groupedPoints.strength.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-2">
                    <span className="w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center text-xs">S</span>
                    优势 ({groupedPoints.strength.length})
                  </h4>
                  <ul className="space-y-1.5 pl-7">
                    {groupedPoints.strength.map(point => (
                      <li key={point.id} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                        <span>{point.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 劣势 */}
              {groupedPoints.weakness.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-amber-700 mb-2">
                    <span className="w-5 h-5 rounded bg-amber-400 text-white flex items-center justify-center text-xs">W</span>
                    劣势 ({groupedPoints.weakness.length})
                  </h4>
                  <ul className="space-y-1.5 pl-7">
                    {groupedPoints.weakness.map(point => (
                      <li key={point.id} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        <span>{point.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 机遇 */}
              {groupedPoints.opportunity.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-sky-700 mb-2">
                    <span className="w-5 h-5 rounded bg-sky-400 text-white flex items-center justify-center text-xs">O</span>
                    机遇 ({groupedPoints.opportunity.length})
                  </h4>
                  <ul className="space-y-1.5 pl-7">
                    {groupedPoints.opportunity.map(point => (
                      <li key={point.id} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                        <span>{point.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 挑战 */}
              {groupedPoints.threat.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-rose-700 mb-2">
                    <span className="w-5 h-5 rounded bg-rose-500 text-white flex items-center justify-center text-xs">T</span>
                    挑战 ({groupedPoints.threat.length})
                  </h4>
                  <ul className="space-y-1.5 pl-7">
                    {groupedPoints.threat.map(point => (
                      <li key={point.id} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                        <span>{point.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 投票视图
  return (
    <div className={cn(
      "relative rounded-xl border-2 transition-all duration-200 overflow-hidden",
      voteCount > 0
        ? "bg-indigo-50 border-indigo-300 shadow-md shadow-indigo-100"
        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
    )}>
      {/* 头部 - 可点击展开 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 text-left flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            {dimension.title}
          </h3>
          <div className="flex flex-wrap gap-2 mb-2">
            {swotCounts.strength > 0 && <SwotBadge type="strength" count={swotCounts.strength} />}
            {swotCounts.weakness > 0 && <SwotBadge type="weakness" count={swotCounts.weakness} />}
            {swotCounts.opportunity > 0 && <SwotBadge type="opportunity" count={swotCounts.opportunity} />}
            {swotCounts.threat > 0 && <SwotBadge type="threat" count={swotCounts.threat} />}
          </div>
          <p className="text-sm text-slate-500">
            共 {dimension.points.length} 个要点
            {isExpanded ? '（点击收起）' : '（点击展开详情）'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* 投票控制 */}
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
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
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
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
          
          <div className="text-slate-400">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </button>

      {/* 展开内容 - 显示所有SWOT要点 */}
      {isExpanded && (
        <div className="border-t border-slate-200 bg-slate-50/50 p-5">
          <div className="space-y-4">
            {/* 优势 */}
            {groupedPoints.strength.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-emerald-700 mb-2">
                  <span className="w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center text-xs">S</span>
                  优势 ({groupedPoints.strength.length})
                </h4>
                <ul className="space-y-1.5 pl-7">
                  {groupedPoints.strength.map(point => (
                    <li key={point.id} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 劣势 */}
            {groupedPoints.weakness.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-amber-700 mb-2">
                  <span className="w-5 h-5 rounded bg-amber-400 text-white flex items-center justify-center text-xs">W</span>
                  劣势 ({groupedPoints.weakness.length})
                </h4>
                <ul className="space-y-1.5 pl-7">
                  {groupedPoints.weakness.map(point => (
                    <li key={point.id} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span>{point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 机遇 */}
            {groupedPoints.opportunity.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-sky-700 mb-2">
                  <span className="w-5 h-5 rounded bg-sky-400 text-white flex items-center justify-center text-xs">O</span>
                  机遇 ({groupedPoints.opportunity.length})
                </h4>
                <ul className="space-y-1.5 pl-7">
                  {groupedPoints.opportunity.map(point => (
                    <li key={point.id} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                      <span>{point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 挑战 */}
            {groupedPoints.threat.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-rose-700 mb-2">
                  <span className="w-5 h-5 rounded bg-rose-500 text-white flex items-center justify-center text-xs">T</span>
                  挑战 ({groupedPoints.threat.length})
                </h4>
                <ul className="space-y-1.5 pl-7">
                  {groupedPoints.threat.map(point => (
                    <li key={point.id} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                      <span>{point.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {voteCount > 0 && (
        <div className="absolute top-3 right-16 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}

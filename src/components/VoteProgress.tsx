import { cn } from '@/lib/utils';

interface VoteProgressProps {
  current: number;
  max: number;
}

export function VoteProgress({ current, max }: VoteProgressProps) {
  const percentage = (current / max) * 100;
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-600">
          投票进度
        </span>
        <span className={cn(
          "text-sm font-bold",
          current === max ? "text-emerald-600" : "text-indigo-600"
        )}>
          {current} / {max} 票
        </span>
      </div>
      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            current === max 
              ? "bg-gradient-to-r from-emerald-400 to-emerald-500" 
              : "bg-gradient-to-r from-indigo-400 to-indigo-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {current === max && (
        <p className="mt-2 text-sm text-emerald-600 font-medium text-center">
          已用完所有票数，可以提交投票了！
        </p>
      )}
      {current === 0 && (
        <p className="mt-2 text-sm text-slate-500 text-center">
          点击 + 按钮为议题投票，每人最多 {max} 票
        </p>
      )}
      {current > 0 && current < max && (
        <p className="mt-2 text-sm text-slate-500 text-center">
          还剩 {max - current} 票，可继续投票或提交
        </p>
      )}
    </div>
  );
}

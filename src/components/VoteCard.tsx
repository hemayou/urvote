import { Plus, Minus, Check } from 'lucide-react';
import type { Issue } from '@/types';
import { cn } from '@/lib/utils';

interface VoteCardProps {
  issue: Issue;
  voteCount: number;
  onAdd: () => void;
  onRemove: () => void;
  disabled: boolean;
  hasVoted: boolean;
  totalVotes: number;
}

export function VoteCard({ 
  issue, 
  voteCount, 
  onAdd, 
  onRemove, 
  disabled, 
  hasVoted,
  totalVotes 
}: VoteCardProps) {
  const isPositive = issue.type === 'positive';
  
  if (hasVoted) {
    // Results view
    return (
      <div className={cn(
        "relative p-4 rounded-xl border-2 transition-all duration-300",
        isPositive 
          ? "bg-emerald-50/50 border-emerald-100" 
          : "bg-rose-50/50 border-rose-100"
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            "flex-shrink-0 w-2 h-2 mt-2 rounded-full",
            isPositive ? "bg-emerald-500" : "bg-rose-500"
          )} />
          <p className="text-sm leading-relaxed text-slate-700 flex-1">{issue.text}</p>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            isPositive 
              ? "bg-emerald-100 text-emerald-700" 
              : "bg-rose-100 text-rose-700"
          )}>
            {isPositive ? '优势' : '挑战'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-800">{totalVotes}</span>
            <span className="text-xs text-slate-500">票</span>
          </div>
        </div>
      </div>
    );
  }

  // Voting view
  return (
    <div className={cn(
      "relative p-4 rounded-xl border-2 transition-all duration-200",
      voteCount > 0
        ? isPositive
          ? "bg-emerald-50 border-emerald-300 shadow-md shadow-emerald-100"
          : "bg-rose-50 border-rose-300 shadow-md shadow-rose-100"
        : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "flex-shrink-0 w-2 h-2 mt-2 rounded-full",
          isPositive ? "bg-emerald-500" : "bg-rose-500"
        )} />
        <p className="text-sm leading-relaxed text-slate-700 flex-1">{issue.text}</p>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded-full",
          isPositive 
            ? "bg-emerald-100 text-emerald-700" 
            : "bg-rose-100 text-rose-700"
        )}>
          {isPositive ? '优势' : '挑战'}
        </span>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onRemove}
            disabled={voteCount === 0}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
              voteCount > 0
                ? "bg-slate-200 text-slate-700 hover:bg-slate-300 active:scale-95"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-200",
            voteCount > 0
              ? isPositive
                ? "bg-emerald-500 text-white"
                : "bg-rose-500 text-white"
              : "bg-slate-100 text-slate-400"
          )}>
            {voteCount > 0 ? (
              <span className="flex items-center gap-0.5">
                {voteCount}
              </span>
            ) : (
              <span>0</span>
            )}
          </div>
          
          <button
            onClick={onAdd}
            disabled={disabled}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
              disabled
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : isPositive
                  ? "bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95"
                  : "bg-rose-500 text-white hover:bg-rose-600 active:scale-95"
            )}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {voteCount > 0 && (
        <div className={cn(
          "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center",
          isPositive ? "bg-emerald-500" : "bg-rose-500"
        )}>
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
      )}
    </div>
  );
}

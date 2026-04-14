import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Dimension } from '@/types';
import { VoteCard } from './VoteCard';
import { cn } from '@/lib/utils';

interface DimensionSectionProps {
  dimension: Dimension;
  userVotes: Record<string, number>;
  totalVotes: Record<string, number>;
  onAddVote: (issueId: string) => void;
  onRemoveVote: (issueId: string) => void;
  remainingVotes: number;
  hasVoted: boolean;
}

export function DimensionSection({
  dimension,
  userVotes,
  totalVotes,
  onAddVote,
  onRemoveVote,
  remainingVotes,
  hasVoted,
}: DimensionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const userVotesInSection = Object.entries(userVotes)
    .filter(([issueId]) => dimension.issues.some(i => i.id === issueId))
    .reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full px-5 py-4 flex items-center justify-between transition-colors duration-200",
          "hover:bg-slate-50 active:bg-slate-100"
        )}
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-slate-800">{dimension.title}</h3>
          <span className="text-sm text-slate-500">
            ({dimension.issues.length} 项议题)
          </span>
        </div>
        <div className="flex items-center gap-3">
          {!hasVoted && userVotesInSection > 0 && (
            <span className={cn(
              "text-sm font-medium px-3 py-1 rounded-full",
              "bg-indigo-100 text-indigo-700"
            )}>
              已投 {userVotesInSection} 票
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-5 pb-5">
          <div className="h-px bg-slate-100 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dimension.issues.map((issue) => (
              <VoteCard
                key={issue.id}
                issue={issue}
                voteCount={userVotes[issue.id] || 0}
                onAdd={() => onAddVote(issue.id)}
                onRemove={() => onRemoveVote(issue.id)}
                disabled={remainingVotes <= 0 && !userVotes[issue.id]}
                hasVoted={hasVoted}
                totalVotes={totalVotes[issue.id] || 0}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

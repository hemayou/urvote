import { useState, useEffect } from 'react';
import { VoteProgress } from '@/components/VoteProgress';
import { DimensionSection } from '@/components/DimensionSection';
import { ResultsView } from '@/components/ResultsView';
import { useVoting } from '@/hooks/useVoting';
import { dimensions, MAX_VOTES } from '@/data/issues';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Alert,
  AlertDescription,
  AlertTitle 
} from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Landmark, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function App() {
  const {
    userVotes,
    totalData,
    hasVoted,
    isSubmitting,
    isLoading,
    error,
    userTotalVotes,
    remainingVotes,
    addVote,
    removeVote,
    submitVotes,
    resetVotes,
  } = useVoting();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Check if user has already voted on mount
  useEffect(() => {
    if (hasVoted && !isLoading) {
      setShowSuccessDialog(true);
    }
  }, [hasVoted, isLoading]);

  const handleAddVote = (issueId: string) => {
    addVote(issueId);
  };

  const handleRemoveVote = (issueId: string) => {
    removeVote(issueId);
  };

  const handleSubmit = async () => {
    if (userTotalVotes === 0) return;
    setShowConfirmDialog(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmDialog(false);
    const success = await submitVotes();
    if (success) {
      setShowSuccessDialog(true);
    }
  };

  const handleReset = () => {
    resetVotes();
    setShowSuccessDialog(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 leading-tight">
                  北京城市更新
                </h1>
                <p className="text-xs text-slate-500">关键议题投票</p>
              </div>
            </div>
            {!hasVoted && (
              <div className="text-right">
                <p className="text-sm font-medium text-slate-600">
                  已投 <span className="text-indigo-600 font-bold">{userTotalVotes}</span> 票
                </p>
                <p className="text-xs text-slate-500">
                  剩余 {remainingVotes} 票
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!hasVoted ? (
          <>
            {/* Intro Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white mb-6">
              <h2 className="text-xl font-bold mb-3">
                北京城市更新关键议题投票
              </h2>
              <p className="text-indigo-100 text-sm leading-relaxed mb-4">
                欢迎参与北京市城市规划设计研究院与瑞典 SWECO 联合工作坊的关键议题投票。
                请从以下议题中选择您认为最重要的进行投票。
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-indigo-200">每人最多</span>
                  <span className="font-bold ml-1">{MAX_VOTES} 票</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-indigo-200">可</span>
                  <span className="font-bold ml-1">多票投同一议题</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-indigo-200">匿名</span>
                  <span className="font-bold ml-1">不记名投票</span>
                </div>
              </div>
            </div>

            {/* Vote Progress */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
              <VoteProgress current={userTotalVotes} max={MAX_VOTES} />
            </div>

            {/* Dimension Sections */}
            <div className="space-y-4">
              {dimensions.map((dimension) => (
                <DimensionSection
                  key={dimension.id}
                  dimension={dimension}
                  userVotes={userVotes}
                  totalVotes={totalData.votes}
                  onAddVote={handleAddVote}
                  onRemoveVote={handleRemoveVote}
                  remainingVotes={remainingVotes}
                  hasVoted={hasVoted}
                />
              ))}
            </div>

            {/* Submit Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40">
              <div className="max-w-4xl mx-auto">
                <Button
                  onClick={handleSubmit}
                  disabled={userTotalVotes === 0 || isSubmitting}
                  className={cn(
                    "w-full py-6 text-lg font-bold rounded-xl transition-all duration-300",
                    userTotalVotes > 0
                      ? "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-200"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      提交中...
                    </span>
                  ) : userTotalVotes === 0 ? (
                    '请至少选择一项议题'
                  ) : (
                    <span className="flex items-center gap-2">
                      提交投票
                      <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
                        {userTotalVotes}/{MAX_VOTES}
                      </span>
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Spacer for fixed button */}
            <div className="h-20" />
          </>
        ) : (
          <>
            {/* Success Banner */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">
                    投票成功！
                  </h2>
                  <p className="text-emerald-100 text-sm">
                    感谢您的参与，以下是实时投票结果
                  </p>
                </div>
              </div>
            </div>

            {/* Results */}
            <ResultsView
              totalVotes={totalData.votes}
              totalVoteCount={totalData.totalVotes}
              voterCount={totalData.voterCount}
              userVotes={userVotes}
              onReset={handleReset}
            />
          </>
        )}
      </main>

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              确认提交投票
            </DialogTitle>
            <DialogDescription>
              您已为 <span className="font-bold text-slate-800">{Object.keys(userVotes).length}</span> 项议题投了 
              <span className="font-bold text-slate-800"> {userTotalVotes} </span>票。
              提交后将无法修改，是否确认？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1"
            >
              再想想
            </Button>
            <Button
              onClick={confirmSubmit}
              className="flex-1 bg-indigo-500 hover:bg-indigo-600"
            >
              确认提交
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600">
              <CheckCircle className="w-6 h-6" />
              投票成功！
            </DialogTitle>
            <DialogDescription>
              感谢您的参与！您已成功提交投票，以下是实时统计结果。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full bg-emerald-500 hover:bg-emerald-600"
            >
              查看结果
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;

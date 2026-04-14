import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  PieChart, 
  LogOut, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Landmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { adminLogout, getAdminStats } from '@/lib/adminAuth';
import { dimensions, swotConfig } from '@/data/issues';
import { cn } from '@/lib/utils';
import type { SwotType } from '@/data/issues';

interface AdminDashboardProps {
  admin: { username: string; name: string };
  onLogout: () => void;
}

interface VoteStats {
  overall: {
    total_votes: number;
    total_voters: number;
    voted_dimensions: number;
  };
  dimensions: Array<{
    dimension_id: string;
    total_votes: number;
    voter_count: number;
    voter_names: string[];
  }>;
  details: Array<{
    id: number;
    dimension_id: string;
    dimension_title: string;
    vote_count: number;
    voter_name: string;
    created_at: string;
  }>;
}

// SWOT 标签
function SwotBadge({ type }: { type: SwotType }) {
  const config = swotConfig[type];
  return (
    <span className={cn(
      "inline-flex items-center justify-center w-5 h-5 rounded text-xs font-bold",
      config.color,
      "text-white"
    )}>
      {config.labelEn}
    </span>
  );
}

export function AdminDashboard({ admin, onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState<VoteStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDimension, setExpandedDimension] = useState<string | null>(null);

  const loadStats = async () => {
    setIsLoading(true);
    const data = await getAdminStats();
    if (data) {
      setStats(data as VoteStats);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadStats();
    // 每 10 秒自动刷新
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    adminLogout();
    onLogout();
  };

  // 获取维度标题
  const getDimensionTitle = (id: string) => {
    const dim = dimensions.find(d => d.id === id);
    return dim?.title || id;
  };

  // 获取维度的 SWOT 统计
  const getDimensionSwot = (id: string) => {
    const dim = dimensions.find(d => d.id === id);
    if (!dim) return { s: 0, w: 0, o: 0, t: 0 };
    return {
      s: dim.points.filter(p => p.type === 'strength').length,
      w: dim.points.filter(p => p.type === 'weakness').length,
      o: dim.points.filter(p => p.type === 'opportunity').length,
      t: dim.points.filter(p => p.type === 'threat').length,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 animate-spin text-indigo-500 mx-auto mb-4" />
          <p className="text-slate-600">加载统计数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 leading-tight">
                  北京城市更新
                </h1>
                <p className="text-xs text-slate-500">管理员后台</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">
                欢迎，<span className="font-medium">{admin.name}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                退出
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 总体统计卡片 */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-indigo-200" />
              <span className="text-indigo-100 text-sm">参与人数</span>
            </div>
            <p className="text-3xl font-bold">{stats?.overall.total_voters || 0}</p>
            <p className="text-indigo-200 text-sm mt-1">人</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-emerald-200" />
              <span className="text-emerald-100 text-sm">累计票数</span>
            </div>
            <p className="text-3xl font-bold">{stats?.overall.total_votes || 0}</p>
            <p className="text-emerald-200 text-sm mt-1">票</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white">
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="w-5 h-5 text-amber-200" />
              <span className="text-amber-100 text-sm">已投票维度</span>
            </div>
            <p className="text-3xl font-bold">{stats?.overall.voted_dimensions || 0}</p>
            <p className="text-amber-200 text-sm mt-1">/ 15</p>
          </div>
        </div>

        {/* 维度投票排行 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-slate-800">维度投票排行</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={loadStats}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              刷新
            </Button>
          </div>

          <div className="space-y-3">
            {stats?.dimensions
              .sort((a, b) => b.total_votes - a.total_votes)
              .map((dim, index) => {
                const isExpanded = expandedDimension === dim.dimension_id;
                const swot = getDimensionSwot(dim.dimension_id);
                const maxVotes = Math.max(...(stats?.dimensions.map(d => d.total_votes) || [1]));
                const percentage = (dim.total_votes / maxVotes) * 100;

                return (
                  <div
                    key={dim.dimension_id}
                    className="border border-slate-200 rounded-xl overflow-hidden"
                  >
                    {/* 头部 - 可点击展开 */}
                    <button
                      onClick={() => setExpandedDimension(isExpanded ? null : dim.dimension_id)}
                      className="w-full p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                    >
                      <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                        {index + 1}
                      </span>
                      
                      <div className="flex-1 text-left">
                        <h4 className="font-bold text-slate-800">
                          {getDimensionTitle(dim.dimension_id)}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          {swot.s > 0 && <SwotBadge type="strength" />}
                          {swot.w > 0 && <SwotBadge type="weakness" />}
                          {swot.o > 0 && <SwotBadge type="opportunity" />}
                          {swot.t > 0 && <SwotBadge type="threat" />}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-slate-800">{dim.total_votes}</p>
                        <p className="text-xs text-slate-500">票</p>
                      </div>

                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {/* 展开内容 */}
                    {isExpanded && (
                      <div className="border-t border-slate-200 bg-slate-50 p-4">
                        <div className="mb-3">
                          <p className="text-sm text-slate-600 mb-2">
                            投票人数: <span className="font-bold">{dim.voter_count}</span> 人
                          </p>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-2">投票人列表:</p>
                          <div className="flex flex-wrap gap-2">
                            {dim.voter_names.map((name, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-white border border-slate-200 rounded text-sm text-slate-600"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>

        {/* 最近投票记录 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <h3 className="text-xl font-bold text-slate-800 mb-5">最近投票记录</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">时间</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">投票人</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">议题</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">票数</th>
                </tr>
              </thead>
              <tbody>
                {stats?.details.slice(0, 20).map((record) => (
                  <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {new Date(record.created_at).toLocaleString('zh-CN')}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-slate-800">
                      {record.voter_name}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {record.dimension_title}
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-indigo-600 text-right">
                      {record.vote_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

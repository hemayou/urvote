import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Landmark, Shield, Loader2 } from 'lucide-react';
import { adminLogin } from '@/lib/adminAuth';
import { cn } from '@/lib/utils';

interface AdminLoginProps {
  onLogin: (admin: { username: string; name: string }) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await adminLogin(username.trim(), password);
    
    if (result.success && result.admin) {
      onLogin(result.admin);
    } else {
      setError(result.error || '登录失败');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <Landmark className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            北京城市更新
          </h1>
          <p className="text-slate-500">关键议题投票</p>
        </div>

        {/* Admin Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              管理员登录
            </h2>
            <p className="text-slate-500 text-sm">
              请输入管理员账号和密码
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-slate-700">
                  用户名
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-2 h-12"
                  autoFocus
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-700">
                  密码
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 h-12"
                />
              </div>

              {error && (
                <p className="text-rose-500 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full h-12 text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-200"
                )}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    登录中...
                  </span>
                ) : (
                  '登录'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="text-sm text-slate-400 hover:text-slate-600"
            >
              ← 返回投票页面
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Landmark, User } from 'lucide-react';

interface NameEntryProps {
  onSubmit: (name: string) => void;
}

export function NameEntry({ onSubmit }: NameEntryProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('请输入您的姓名');
      return;
    }
    if (trimmedName.length < 2) {
      setError('姓名至少需要2个字符');
      return;
    }
    setError('');
    onSubmit(trimmedName);
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

        {/* Name Entry Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              请输入您的姓名
            </h2>
            <p className="text-slate-500 text-sm">
              投票结果将记录您的姓名，请如实填写
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-700">
                  姓名
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="请输入您的姓名"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 h-12 text-lg"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-rose-500 text-sm">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full h-12 text-lg font-bold bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-200"
              >
                进入投票
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              北京市城市规划设计研究院 × 瑞典 SWECO 联合工作坊
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

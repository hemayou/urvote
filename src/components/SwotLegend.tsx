import { swotConfig } from '@/data/issues';
import { cn } from '@/lib/utils';

export function SwotLegend() {
  const items = [
    { key: 'strength', label: '优势 (S)' },
    { key: 'weakness', label: '劣势 (W)' },
    { key: 'opportunity', label: '机遇 (O)' },
    { key: 'threat', label: '挑战 (T)' },
  ] as const;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <h4 className="text-sm font-medium text-slate-600 mb-3">SWOT 图例</h4>
      <div className="flex flex-wrap gap-3">
        {items.map(({ key, label }) => {
          const config = swotConfig[key];
          return (
            <div
              key={key}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm",
                config.bgColor
              )}
            >
              <span className={cn("w-2.5 h-2.5 rounded-full", config.color)} />
              <span className={config.textColor}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

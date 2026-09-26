import { cn } from '../../lib/utils';
import type { SkillStatus } from '../../lib/utils';
import { StatusBadge } from './Badge';

export interface SkillIndicatorProps {
  name: string;
  current: number;
  required?: number;
  status?: SkillStatus;
  showBar?: boolean;
  className?: string;
}

export const SkillIndicator: React.FC<SkillIndicatorProps> = ({
  name,
  current,
  required = 75,
  status = 'Ready',
  showBar = true,
  className,
}) => {
  const percentage = Math.min(Math.max(current, 0), 100);
  const requiredPercentage = Math.min(Math.max(required, 0), 100);

  return (
    <div className={cn('p-3.5 rounded-lg border border-[#E2E8F0] bg-white hover:border-slate-300 transition-colors', className)}>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-[#0F172A]">{name}</span>
          <StatusBadge status={status} size="sm" />
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-[#0F172A]">{current}</span>
          <span className="text-xs text-[#94A3B8] font-normal"> / {required} req</span>
        </div>
      </div>

      {showBar && (
        <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              status === 'Ready'
                ? 'bg-[#16A34A]'
                : status === 'Developing'
                ? 'bg-[#D97706]'
                : 'bg-[#DC2626]'
            )}
            style={{ width: `${percentage}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-800/80 z-10"
            style={{ left: `${requiredPercentage}%` }}
            title={`Required: ${required}`}
          />
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressBarProps {
  value: number; // 0 to 100
  required?: number; // optional target threshold
  max?: number;
  height?: 'sm' | 'md' | 'lg';
  variant?: 'blue' | 'success' | 'warning' | 'error' | 'navy';
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  required,
  max = 100,
  height = 'md',
  variant = 'blue',
  showLabel = false,
  className,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const requiredPercentage = required ? Math.min(Math.max((required / max) * 100, 0), 100) : undefined;

  const heightStyles = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const fillColors = {
    blue: 'bg-[#2563EB]',
    navy: 'bg-[#14213D]',
    success: 'bg-[#16A34A]',
    warning: 'bg-[#D97706]',
    error: 'bg-[#DC2626]',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs text-[#475569] mb-1 font-medium">
          <span>{Math.round(percentage)}%</span>
          {requiredPercentage !== undefined && <span>Target: {required}%</span>}
        </div>
      )}
      <div className={cn('w-full bg-slate-100 rounded-full overflow-hidden relative', heightStyles[height])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', fillColors[variant])}
          style={{ width: `${percentage}%` }}
        />
        {requiredPercentage !== undefined && (
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-slate-800/70 z-10"
            style={{ left: `${requiredPercentage}%` }}
            title={`Required: ${required}%`}
          />
        )}
      </div>
    </div>
  );
};

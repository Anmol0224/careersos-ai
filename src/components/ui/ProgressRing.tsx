import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressRingProps {
  value: number; // 0 to 100
  size?: number; // diameter in px
  strokeWidth?: number;
  variant?: 'blue' | 'navy' | 'success' | 'warning';
  showValue?: boolean;
  label?: string;
  sublabel?: string;
  className?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  size = 120,
  strokeWidth = 10,
  variant = 'blue',
  showValue = true,
  label,
  sublabel,
  className,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

  const strokeColors = {
    blue: '#2563EB',
    navy: '#14213D',
    success: '#16A34A',
    warning: '#D97706',
  };

  return (
    <div className={cn('relative inline-flex flex-col items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColors[variant]}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold tracking-tight text-[#0F172A]">
            {Math.round(value)}
            <span className="text-sm font-medium text-[#94A3B8]">/100</span>
          </span>
          {label && <span className="text-[10px] font-semibold tracking-wider text-[#475569] uppercase mt-0.5">{label}</span>}
        </div>
      )}

      {sublabel && (
        <p className="mt-2 text-xs font-medium text-[#475569] text-center">
          {sublabel}
        </p>
      )}
    </div>
  );
};

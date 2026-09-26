import React from 'react';
import { cn } from '../../lib/utils';
import { Check, AlertCircle, AlertTriangle } from 'lucide-react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'outline' | 'navy' | 'blue';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 rounded-full font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    blue: 'bg-[#EFF6FF] text-[#2563EB] border border-blue-200',
    navy: 'bg-[#14213D] text-white',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
    outline: 'bg-white text-slate-700 border border-slate-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 leading-none select-none',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export interface StatusBadgeProps {
  status: 'Ready' | 'Developing' | 'Needs Work';
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className,
}) => {
  switch (status) {
    case 'Ready':
      return (
        <Badge variant="success" size={size} className={className}>
          <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
          <span>Ready</span>
        </Badge>
      );
    case 'Developing':
      return (
        <Badge variant="warning" size={size} className={className}>
          <AlertCircle className="w-3 h-3 text-amber-600 stroke-[2.5]" />
          <span>Developing</span>
        </Badge>
      );
    case 'Needs Work':
      return (
        <Badge variant="error" size={size} className={className}>
          <AlertTriangle className="w-3 h-3 text-red-600 stroke-[2.5]" />
          <span>Needs Work</span>
        </Badge>
      );
  }
};

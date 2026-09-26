import React from 'react';
import { cn } from '../../lib/utils';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading career intelligence...',
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-4', className)}>
      <div className="relative w-12 h-12 mb-4">
        <div className="w-12 h-12 rounded-full border-2 border-slate-200" />
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
      </div>
      <p className="text-sm font-medium text-[#475569]">{message}</p>
    </div>
  );
};

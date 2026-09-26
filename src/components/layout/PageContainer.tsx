import React from 'react';
import { cn } from '../../lib/utils';
import { HelpCircle } from 'lucide-react';

export interface PageContainerProps {
  title: string;
  subtitle?: string;
  questionBadge?: string; // e.g. "Where am I?", "What am I missing?"
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  questionBadge,
  actions,
  children,
  className,
}) => {
  return (
    <div className={cn('p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6', className)}>
      {/* Top Banner / Question indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-[#E2E8F0]/70">
        <div>
          {questionBadge && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EFF6FF] border border-blue-200 text-[#2563EB] text-xs font-semibold uppercase tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Core Question: {questionBadge}</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">{title}</h1>
          {subtitle && <p className="text-sm text-[#475569] mt-1">{subtitle}</p>}
        </div>

        {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
      </div>

      {/* Main Content */}
      <div className="space-y-6">{children}</div>
    </div>
  );
};

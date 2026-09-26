import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { ProgressRing } from '../ui/ProgressRing';
import { TrendingUp, Target, CheckCircle2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface ReadinessCardProps {
  score: number;
  monthlyGain: number;
  targetCareer: string;
  alignment: number;
  coreReady: number;
  coreTotal: number;
}

export const ReadinessCard: React.FC<ReadinessCardProps> = ({
  score,
  monthlyGain,
  targetCareer,
  alignment,
  coreReady,
  coreTotal,
}) => {
  return (
    <Card className="bg-white border-[#E2E8F0]">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Circular Indicator */}
          <div className="flex items-center gap-5 shrink-0">
            <ProgressRing
              value={score}
              size={124}
              strokeWidth={11}
              variant="blue"
              label="Readiness"
            />
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full w-fit mb-1 border border-emerald-200">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+{monthlyGain} this month</span>
              </div>
              <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Career Readiness</h2>
              <p className="text-xs text-[#475569] max-w-xs mt-1">
                Your skills and portfolio benchmarked against real employer requirements for entry-level roles.
              </p>
            </div>
          </div>

          <div className="h-px md:h-16 w-full md:w-px bg-[#E2E8F0]" />

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
            {/* Target Role */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-left">
              <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs font-medium mb-1">
                <Target className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Target Role</span>
              </div>
              <div className="font-bold text-sm text-[#0F172A] truncate">{targetCareer}</div>
              <span className="text-[11px] text-[#2563EB] font-medium">Primary Focus</span>
            </div>

            {/* Profile Alignment */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-left">
              <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs font-medium mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Alignment</span>
              </div>
              <div className="font-bold text-sm text-[#0F172A]">{alignment}%</div>
              <span className="text-[11px] text-emerald-600 font-medium">High Fit</span>
            </div>

            {/* Core Skills Ready */}
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-left">
              <div className="flex items-center gap-1.5 text-[#94A3B8] text-xs font-medium mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Core Skills</span>
              </div>
              <div className="font-bold text-sm text-[#0F172A]">
                {coreReady} <span className="text-xs text-[#94A3B8] font-normal">/ {coreTotal}</span>
              </div>
              <span className="text-[11px] text-[#475569] font-medium">Verified Ready</span>
            </div>
          </div>

          <div className="h-px md:h-16 w-full md:w-px bg-[#E2E8F0] hidden lg:block" />

          {/* CTA Link */}
          <div className="shrink-0 w-full md:w-auto text-right">
            <Link
              to="/career"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] bg-[#EFF6FF] hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-lg transition-colors w-full md:w-auto"
            >
              <span>View Gap Breakdown</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/Badge';
import { AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { PriorityGap } from '../../data/mockData';

export interface GapAnalysisCardProps {
  priorityGap: PriorityGap;
  otherGaps?: PriorityGap[];
}

export const GapAnalysisCard: React.FC<GapAnalysisCardProps> = ({
  priorityGap,
  otherGaps = [],
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Featured Biggest Gap Card */}
      <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="bg-red-500/10 border-b border-red-100 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-red-900 uppercase tracking-wider">
              Your Biggest Career Gap
            </span>
          </div>
          <StatusBadge status={priorityGap.status} size="sm" />
        </div>

        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-2xl font-bold text-[#0F172A]">{priorityGap.skill}</h3>
                <p className="text-sm text-[#475569] mt-1">
                  This skill gap represents the single largest bottleneck between your current readiness (82%) and landing offers for Data Analyst roles.
                </p>
              </div>

              {/* Numerical Gap Stats */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-[#E2E8F0] rounded-xl">
                <div>
                  <span className="text-xs text-[#94A3B8] font-medium block">Your Level</span>
                  <span className="text-2xl font-extrabold text-red-600">{priorityGap.current}</span>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] font-medium block">Required</span>
                  <span className="text-2xl font-extrabold text-[#0F172A]">{priorityGap.required}</span>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] font-medium block">Gap Delta</span>
                  <span className="text-2xl font-extrabold text-red-700">-{priorityGap.gap}</span>
                </div>
              </div>

              {/* Recommendation Box */}
              <div className="flex items-start gap-3 p-3.5 bg-blue-50/70 border border-blue-100 rounded-lg">
                <Zap className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div className="text-xs text-[#0F172A] leading-relaxed">
                  <strong>Recommendation:</strong> {priorityGap.recommendation}
                </div>
              </div>
            </div>

            {/* Action Card Button */}
            <div className="shrink-0 flex flex-col gap-3 justify-center items-start lg:items-end">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate(priorityGap.actionRoute)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-sm"
              >
                {priorityGap.actionText}
              </Button>
              <span className="text-[11px] text-[#94A3B8] text-center lg:text-right">
                Estimated ~45 mins hands-on proof
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Gaps */}
      {otherGaps.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base">Secondary Competency Gaps</CardTitle>
            <p className="text-xs text-[#475569]">Developing areas to address in subsequent roadmap iterations</p>
          </CardHeader>
          <CardContent className="divide-y divide-[#E2E8F0] pt-0">
            {otherGaps.map((gap) => (
              <div
                key={gap.skill}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0F172A]">{gap.skill}</span>
                    <StatusBadge status={gap.status} size="sm" />
                    <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Gap: {gap.gap} pts
                    </span>
                  </div>
                  <p className="text-xs text-[#475569]">{gap.recommendation}</p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(gap.actionRoute)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="shrink-0"
                >
                  {gap.actionText}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

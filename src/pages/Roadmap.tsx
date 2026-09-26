import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { RoadmapTimeline } from '../components/roadmap/RoadmapTimeline';
import { mockRoadmapSteps } from '../data/mockData';
import { Card, CardContent } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Roadmap: React.FC = () => {
  const navigate = useNavigate();
  const completeSteps = mockRoadmapSteps.filter((s) => s.status === 'Complete').length;
  const totalSteps = mockRoadmapSteps.length;
  const completionPct = Math.round((completeSteps / totalSteps) * 100);

  return (
    <PageContainer
      title="Your Roadmap"
      subtitle="A simple plan built around your highest-priority gaps."
      questionBadge="What should I do?"
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/challenge')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Next Challenge
        </Button>
      }
    >
      {/* Progress Header Card */}
      <Card className="bg-white border-[#E2E8F0]">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">
                Target Role: Data Analyst
              </span>
              <h3 className="text-xl font-bold text-[#0F172A]">
                {completeSteps} / {totalSteps} steps complete
              </h3>
              <p className="text-xs text-[#475569]">
                {completionPct}% overall progress toward certified full readiness.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#475569]">Completion</span>
                <span className="text-[#2563EB]">{completionPct}%</span>
              </div>
              <ProgressBar value={completionPct} height="md" variant="blue" />
            </div>
          </div>

          {/* Phase Sequence Guide */}
          <div className="mt-6 pt-5 border-t border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100 font-semibold text-blue-900">
              1. Learn (Theory)
            </div>
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100 font-semibold text-amber-900">
              2. Practice (Mini tasks)
            </div>
            <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-100 font-semibold text-indigo-900">
              3. Build (Portfolio)
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 font-semibold text-emerald-900">
              4. Prove (Scored Challenge)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div className="pt-2">
        <RoadmapTimeline steps={mockRoadmapSteps} />
      </div>
    </PageContainer>
  );
};

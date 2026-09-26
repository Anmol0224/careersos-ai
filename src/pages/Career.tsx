import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { SkillsTable } from '../components/skills/SkillsTable';
import { GapAnalysisCard } from '../components/skills/GapAnalysisCard';
import { mockSkills, mockPriorityGaps, mockUserProfile } from '../data/mockData';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Target, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Career: React.FC = () => {
  const navigate = useNavigate();
  const selectedTarget = mockUserProfile.targetCareer;

  const priorityGap = mockPriorityGaps[0]; // Power BI
  const secondaryGaps = mockPriorityGaps.slice(1);
  const readySkillsCount = mockSkills.filter((s) => s.status === 'Ready').length;
  const totalSkillsCount = mockSkills.length;

  return (
    <PageContainer
      title="Careers & Skill Gap Analysis"
      subtitle="Benchmark your verified skills against live market requirements for Data Analyst roles."
      questionBadge="What am I missing?"
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/challenge')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Work on Power BI
        </Button>
      }
    >
      {/* Target Career Banner */}
      <Card className="bg-white border-[#E2E8F0]">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#14213D] text-white flex items-center justify-center font-bold">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider block">
                  Your Career Target
                </span>
                <h2 className="text-2xl font-bold text-[#0F172A]">{selectedTarget}</h2>
                <div className="flex items-center gap-3 text-xs text-[#475569] mt-1">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {readySkillsCount} of {totalSkillsCount} core skills verified Ready
                  </span>
                  <span>·</span>
                  <span className="text-red-700 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    1 Critical Gap (Power BI)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/roadmap')}
              >
                View Target Roadmap
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Table: Skill | You | Required | Status */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">Core Competency Benchmarks</h3>
            <p className="text-xs text-[#475569]">
              Calibrated against hiring evaluations for entry-level analyst positions
            </p>
          </div>
          <span className="text-xs text-[#94A3B8]">
            Updated dynamically via challenge proof
          </span>
        </div>

        <SkillsTable skills={mockSkills} />
      </div>

      {/* Your Biggest Gaps */}
      <div className="pt-2">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-[#0F172A]">Your Biggest Gaps</h3>
          <p className="text-xs text-[#475569]">
            Targeting these specific skill deficits produces the highest lift in job match percentage
          </p>
        </div>

        <GapAnalysisCard
          priorityGap={priorityGap}
          otherGaps={secondaryGaps}
        />
      </div>
    </PageContainer>
  );
};

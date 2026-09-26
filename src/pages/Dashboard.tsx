import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ReadinessCard } from '../components/dashboard/ReadinessCard';
import { NextActionCard } from '../components/dashboard/NextActionCard';
import { SkillsOverviewCard } from '../components/dashboard/SkillsOverviewCard';
import { ProgressHistoryCard } from '../components/dashboard/ProgressHistoryCard';
import { OpportunitiesSnippet } from '../components/dashboard/OpportunitiesSnippet';
import { OpportunityModal } from '../components/opportunities/OpportunityModal';
import { mockUserProfile, mockProgressMetrics } from '../data/mockData';
import type { OpportunityItem } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Compass, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityItem | null>(null);

  return (
    <PageContainer
      title="Good morning, Rahul 👋"
      subtitle="Here is your current career readiness benchmark and next best high-impact action."
      questionBadge="Where am I?"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/roadmap')}
            leftIcon={<Compass className="w-3.5 h-3.5" />}
          >
            Roadmap
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/challenge')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Take Challenge
          </Button>
        </div>
      }
    >
      {/* 1. Primary Career Readiness Card */}
      <ReadinessCard
        score={mockUserProfile.readinessScore}
        monthlyGain={mockProgressMetrics[0].delta}
        targetCareer={mockUserProfile.targetCareer}
        alignment={mockUserProfile.alignmentRate}
        coreReady={mockUserProfile.coreSkillsReady}
        coreTotal={mockUserProfile.coreSkillsTotal}
      />

      {/* 2. Large Next Best Action Card */}
      <NextActionCard
        title="Complete the Power BI Sales Dashboard Challenge"
        duration="45 min"
        difficulty="Intermediate"
        impact="High Impact"
        description="Build an interactive retail KPI dashboard to bridge your highest priority gap (+34 Power BI improvement potential)."
        actionRoute="/challenge"
      />

      {/* 3. Strongest Skills vs Priority Gaps */}
      <SkillsOverviewCard />

      {/* 4. Progress Section: 74 -> 81 (+7 improvement) */}
      <ProgressHistoryCard />

      {/* 5. Opportunities Section (2-3 realistic cards) */}
      <OpportunitiesSnippet
        onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
      />

      {/* Detail Modal for Opportunity */}
      <OpportunityModal
        opportunity={selectedOpportunity}
        isOpen={Boolean(selectedOpportunity)}
        onClose={() => setSelectedOpportunity(null)}
      />
    </PageContainer>
  );
};

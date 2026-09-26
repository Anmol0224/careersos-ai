import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ChallengeWorkspace } from '../components/challenges/ChallengeWorkspace';
import { mockChallengeData } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Challenge: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer
      title="Practical Proof Challenge"
      subtitle="Complete this hands-on evaluation to verify competence and earn readiness score increases."
      questionBadge="Can I prove it?"
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/roadmap')}
          leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
        >
          Back to Roadmap
        </Button>
      }
    >
      <ChallengeWorkspace challenge={mockChallengeData} />
    </PageContainer>
  );
};

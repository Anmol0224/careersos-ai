import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { ChallengeWorkspace } from '../components/challenges/ChallengeWorkspace';
import { mockChallengeData } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { careerService } from '../services/careerService';
import { supabase } from '../lib/supabase';
import type { ChallengeData } from '../data/mockData';

export const Challenge: React.FC = () => {
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [submission, setSubmission] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadChallenge() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const dbChallenge = await careerService.getChallengeForUser(user.id);
        if (!dbChallenge) {
          setError('No suitable challenge found for your career path.');
          setIsLoading(false);
          return;
        }

        const sub = await careerService.getSubmission(user.id, dbChallenge.id as string);
        setSubmission(sub);

        // Map DB challenge to UI ChallengeData
        const rubricArray = [];
        if (dbChallenge.evaluation_criteria && typeof dbChallenge.evaluation_criteria === 'object') {
          for (const [key, val] of Object.entries(dbChallenge.evaluation_criteria)) {
            rubricArray.push({
              category: key,
              weight: val as number,
              description: `Evaluate based on ${key}`
            });
          }
        }

        const skillName = ((dbChallenge.skills as Record<string, unknown>)?.name as string) || '';
        // Only show the sales dataset sample for data-oriented challenges
        const datasetSkills = ['Power BI', 'SQL', 'Excel', 'Statistics', 'Data Visualization'];
        const showDataset = datasetSkills.some(s => skillName.toLowerCase() === s.toLowerCase());

        const uiChallenge: ChallengeData = {
          id: dbChallenge.id as string,
          title: (dbChallenge.title as string) || 'Practical Challenge',
          duration: `${dbChallenge.duration_minutes || 30} min`,
          difficulty: (dbChallenge.difficulty as "Beginner" | "Intermediate" | "Advanced") || 'Intermediate',
          impact: 'High Impact',
          skill: skillName || 'Skill',
          mission: (dbChallenge.mission as string) || (dbChallenge.description as string) || 'Complete the challenge to prove your skills.',
          rubric: rubricArray.length > 0 ? rubricArray : mockChallengeData.rubric,
          datasetSample: showDataset ? mockChallengeData.datasetSample : []
        };

        setChallenge(uiChallenge);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load challenge';
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    }

    loadChallenge();
  }, []);

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
      {isLoading ? (
        <div className="text-center text-slate-500 py-12">Loading challenge...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-12">{error}</div>
      ) : challenge ? (
        <ChallengeWorkspace challenge={challenge} existingSubmission={submission} />
      ) : null}
    </PageContainer>
  );
};

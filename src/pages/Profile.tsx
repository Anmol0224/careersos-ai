import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Modal } from '../components/ui/Modal';
import {
  ShieldCheck,
  Share2,
  Award,
  Briefcase,
  Copy,
  Check,
  MapPin,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { getStatusColor } from '../lib/utils';
import type { SkillStatus } from '../lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type ProfileRow = {
  full_name: string | null;
  city: string | null;
  degree: string | null;
  institution: string | null;
  career_goal: string | null;
};

type ReadinessRow = {
  score: number;
};

type UserSkillWithName = {
  skill_id: string;
  current_score: number;
  evidence_status: string;
  skills: {
    name: string;
  } | null;
};

type ProfileData = {
  fullName: string;
  city: string;
  degree: string;
  institution: string;
  careerGoal: string;
  readinessScore: number | null;
  skills: {
    id: string;
    name: string;
    score: number;
    evidenceStatus: string;
    displayStatus: SkillStatus;
  }[];
};

// ─── Status derivation ────────────────────────────────────────────────────────

/**
 * Map the stored evidence_status to the shared SkillStatus union used by
 * getStatusColor. A score of 0 / needs_work is honest "Needs Work".
 */
function toDisplayStatus(evidenceStatus: string, score: number): SkillStatus {
  if (evidenceStatus === 'Ready' || score >= 80) return 'Ready';
  if (evidenceStatus === 'Developing' || score >= 40) return 'Developing';
  return 'Needs Work';
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!user) {
        if (active) {
          setData(null);
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError('');

      try {
        const [
          { data: profileRow, error: profileError },
          { data: readinessRows, error: readinessError },
          { data: userSkillRows, error: skillsError },
        ] = await Promise.all([
          supabase
            .from('profiles')
            .select('full_name, city, degree, institution, career_goal')
            .eq('id', user.id)
            .maybeSingle<ProfileRow>(),

          supabase
            .from('readiness_scores')
            .select('score')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .returns<ReadinessRow[]>(),

          supabase
            .from('user_skills')
            .select('skill_id, current_score, evidence_status, skills(name)')
            .eq('user_id', user.id)
            .returns<UserSkillWithName[]>(),
        ]);

        if (profileError) throw new Error(`Profile load failed: ${profileError.message}`);
        if (readinessError) throw new Error(`Readiness load failed: ${readinessError.message}`);
        if (skillsError) throw new Error(`Skills load failed: ${skillsError.message}`);

        const skills = (userSkillRows ?? [])
          .filter((s) => s.skills?.name)
          .map((s) => ({
            id: s.skill_id,
            name: s.skills!.name,
            score: Number(s.current_score),
            evidenceStatus: s.evidence_status,
            displayStatus: toDisplayStatus(s.evidence_status, Number(s.current_score)),
          }))
          .sort((a, b) => b.score - a.score);

        if (active) {
          setData({
            fullName: profileRow?.full_name?.trim() || 'Student',
            city: profileRow?.city?.trim() || '',
            degree: profileRow?.degree?.trim() || '',
            institution: profileRow?.institution?.trim() || '',
            careerGoal: profileRow?.career_goal?.trim() || '',
            readinessScore: readinessRows?.[0]?.score ?? null,
            skills,
          });
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : 'Unable to load profile data.',
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [user]);

  const handleCopyLink = () => {
    const url = `https://careersos.ai/passport/${user?.id ?? ''}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <PageContainer
        title="My Career Profile"
        subtitle="A consolidated view of your profile, skills and career evidence."
        questionBadge="What can I show?"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">Loading your profile…</p>
        </div>
      </PageContainer>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !data) {
    return (
      <PageContainer
        title="My Career Profile"
        subtitle="A consolidated view of your profile, skills and career evidence."
        questionBadge="What can I show?"
      >
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700">
            {error || 'Profile data is unavailable.'}
          </p>
          <Button
            className="mt-4"
            variant="primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </PageContainer>
    );
  }

  const ringValue = data.readinessScore ?? 0;
  const locationParts = [data.degree, data.institution].filter(Boolean);
  const cityDisplay = data.city || '';

  return (
    <PageContainer
      title="My Career Profile"
      subtitle="A consolidated view of your profile, skills and career evidence."
      questionBadge="What can I show?"
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShareModalOpen(true)}
          leftIcon={<Share2 className="w-3.5 h-3.5" />}
        >
          Share Career Passport
        </Button>
      }
    >
      {/* 1. Header Card: Profile Identity & Readiness Ring */}
      <Card className="bg-white border-[#E2E8F0]">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <Avatar name={data.fullName} size="xl" className="border-4 border-slate-100 shadow-md" />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-bold text-[#0F172A]">{data.fullName}</h2>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#475569] pt-1">
                  {locationParts.length > 0 && (
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[#94A3B8]" />
                      {locationParts.join(' · ')}
                    </span>
                  )}
                  {cityDisplay && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                      {cityDisplay}
                    </span>
                  )}
                </div>
                {data.careerGoal && (
                  <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs text-[#94A3B8] font-medium">Target Focus:</span>
                    <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-blue-200">
                      {data.careerGoal}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Circular Readiness Indicator */}
            <div className="flex items-center gap-4 bg-slate-50/80 border border-[#E2E8F0] p-4 rounded-2xl shrink-0">
              {data.readinessScore !== null ? (
                <>
                  <ProgressRing
                    value={ringValue}
                    size={100}
                    strokeWidth={9}
                    variant="blue"
                    label="Score"
                  />
                  <div className="text-left">
                    <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider block">
                      Readiness
                    </span>
                    <span className="text-2xl font-black text-[#0F172A]">
                      {data.readinessScore}{' '}
                      <span className="text-xs text-[#94A3B8] font-normal">/ 100</span>
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <ProgressRing
                    value={0}
                    size={100}
                    strokeWidth={9}
                    variant="blue"
                    label="Score"
                    showValue={false}
                  />
                  <div className="text-left">
                    <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider block">
                      Readiness
                    </span>
                    <span className="text-lg font-black text-[#94A3B8]">
                      Not assessed
                    </span>
                    <p className="text-[11px] text-[#94A3B8] font-medium mt-0.5">
                      Complete a challenge to earn a score.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Three Pillars: Skills, Projects, Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Career Skills */}
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              <span>Career Skills</span>
            </CardTitle>
            <p className="text-xs text-[#475569]">
              Skills initialized for your target career
            </p>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-2">
            {data.skills.length === 0 ? (
              <p className="text-xs text-[#94A3B8] py-4 text-center">
                No skills loaded yet. Visit the Dashboard to initialize your career skills.
              </p>
            ) : (
              data.skills.map((skill) => {
                const colors = getStatusColor(skill.displayStatus);
                return (
                  <div
                    key={skill.id}
                    className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl flex items-center justify-between"
                  >
                    <span className="font-bold text-sm text-[#0F172A]">{skill.name}</span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${colors.badge}`}
                    >
                      {skill.displayStatus}
                    </span>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Portfolio Projects */}
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#2563EB]" />
              <span>Portfolio Projects</span>
            </CardTitle>
            <p className="text-xs text-[#475569]">
              Practical implementations demonstrating skill depth
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
              <BookOpen className="w-8 h-8 text-[#CBD5E1]" />
              <p className="text-xs text-[#94A3B8]">
                No projects added yet.
              </p>
              <p className="text-[11px] text-[#CBD5E1]">
                Project portfolio submission is coming soon.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Achievements</span>
            </CardTitle>
            <p className="text-xs text-[#475569]">
              Milestone badges earned on platform
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex flex-col items-center justify-center py-6 text-center gap-2">
              <Award className="w-8 h-8 text-[#CBD5E1]" />
              <p className="text-xs text-[#94A3B8]">
                No achievements yet.
              </p>
              <p className="text-[11px] text-[#CBD5E1]">
                Complete challenges to earn your first badge.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Share Career Passport Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Your Career Passport"
        description="Share a link to your CareerOS profile with recruiters and employers."
        maxWidth="md"
      >
        <div className="space-y-5">
          {/* Card Preview */}
          <div className="p-4 bg-gradient-to-br from-[#14213D] to-[#1E3A8A] text-white rounded-2xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">
                  Career Passport
                </span>
                <h4 className="text-lg font-bold">{data.fullName}</h4>
                <p className="text-xs text-slate-300">
                  {[data.careerGoal, data.degree].filter(Boolean).join(' · ')}
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm">
                {data.readinessScore !== null ? data.readinessScore : '—'}
              </div>
            </div>

            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
              <span>
                {data.skills.length > 0
                  ? `${data.skills.length} career skill${data.skills.length !== 1 ? 's' : ''} tracked`
                  : 'No skills tracked yet'}
              </span>
              <span className="text-blue-300 font-semibold">CareerOS AI</span>
            </div>
          </div>

          {/* Copy Link Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Profile URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={`https://careersos.ai/passport/${user?.id ?? ''}`}
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-mono text-[#0F172A]"
              />
              <Button
                variant={copied ? 'secondary' : 'primary'}
                size="sm"
                onClick={handleCopyLink}
                leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setShareModalOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

import React from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import {
  Trophy,
  ArrowRight,
  Sparkles,
  BarChart3,
  ThumbsUp,
  Target,
  ArrowUpRight,
} from 'lucide-react';
import { mockChallengeResult } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const res = mockChallengeResult;

  return (
    <PageContainer
      title="Challenge Evaluation & Progress Report"
      subtitle="Objective automated scoring verified against employer benchmark criteria."
      questionBadge="Did I improve?"
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/roadmap')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Continue Roadmap
        </Button>
      }
    >
      {/* 1. MAIN WOW SECTION: Immediate Score Lift Celebration */}
      <div className="bg-gradient-to-r from-[#14213D] via-[#1E3A8A] to-[#1E293B] text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                  Challenge Passed & Verified
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Score: {res.score} / 100
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-lg text-slate-200">
                Verified Skill: {res.skill}
              </span>
            </div>
          </div>

          {/* THE WOW SCORE LIFT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {/* Overall Career Readiness Lift */}
            <div className="p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15 space-y-1">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Career Readiness
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-300">{res.impact.careerReadiness.from}</span>
                <span className="text-sm font-semibold text-slate-400">→</span>
                <span className="text-3xl font-extrabold text-white">{res.impact.careerReadiness.to}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{res.impact.careerReadiness.delta} improvement
              </span>
            </div>

            {/* Target Skill Lift: Power BI */}
            <div className="p-4 bg-emerald-500/20 rounded-xl border border-emerald-400/30 space-y-1">
              <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider block">
                {res.impact.skillScore.skill} Competency
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-300">{res.impact.skillScore.from}</span>
                <span className="text-sm font-semibold text-slate-400">→</span>
                <span className="text-3xl font-extrabold text-emerald-300">{res.impact.skillScore.to}</span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-500/30 px-2 py-0.5 rounded">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +{res.impact.skillScore.delta} improvement
              </span>
            </div>

            {/* Secondary: Portfolio */}
            <div className="p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15 space-y-1">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Portfolio Proof
              </span>
              <div className="text-2xl font-extrabold text-white">
                55 → 68
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +13 improvement
              </span>
            </div>

            {/* Secondary: Communication */}
            <div className="p-4 bg-white/10 backdrop-blur-xs rounded-xl border border-white/15 space-y-1">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                Communication
              </span>
              <div className="text-2xl font-extrabold text-white">
                56 → 64
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                <ArrowUpRight className="w-3.5 h-3.5" />
                +8 improvement
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RUBRIC BREAKDOWN & FEEDBACK */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rubric Breakdown */}
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#2563EB]" />
              <span>Scoring Rubric Breakdown</span>
            </CardTitle>
            <p className="text-xs text-[#475569]">
              Detailed performance metrics evaluated against submission criteria
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {res.breakdown.map((item) => (
              <div key={item.criterion} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-[#0F172A]">{item.criterion}</span>
                  <span className="font-bold text-[#0F172A]">{item.score} / 100</span>
                </div>
                <ProgressBar
                  value={item.score}
                  height="sm"
                  variant={item.score >= 80 ? 'success' : item.score >= 70 ? 'blue' : 'warning'}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Feedback: What you did well & Improve next */}
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Evaluator Feedback</span>
            </CardTitle>
            <p className="text-xs text-[#475569]">
              Actionable guidance for continuous improvement
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {/* What you did well */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                <ThumbsUp className="w-4 h-4 text-emerald-600" />
                <span>What you did well</span>
              </div>
              <p className="text-sm text-emerald-950 font-medium">
                {res.feedback.positive}
              </p>
              <p className="text-xs text-emerald-800">
                Your star schema setup and KPI aggregations matched expected enterprise reporting patterns.
              </p>
            </div>

            {/* Improve next */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <Target className="w-4 h-4 text-amber-600" />
                <span>Improve next</span>
              </div>
              <p className="text-sm text-amber-950 font-medium">
                {res.feedback.improvement}
              </p>
              <p className="text-xs text-amber-800">
                Include explicit cost-benefit calculations for executive stakeholders rather than just raw volume percentages.
              </p>
            </div>

            {/* Continue CTA */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/roadmap')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full"
              >
                Continue Roadmap
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

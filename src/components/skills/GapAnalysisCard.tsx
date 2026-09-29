import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { StatusBadge } from '../ui/Badge'
import { AlertTriangle, ArrowRight, Zap, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { CareerSkillGap } from '../../services/careerService'

export interface GapAnalysisCardProps {
  priorityGap: CareerSkillGap
  otherGaps?: CareerSkillGap[]
}

export const GapAnalysisCard: React.FC<GapAnalysisCardProps> = ({
  priorityGap,
  otherGaps = [],
}) => {
  const navigate = useNavigate()

  const isUnassessed = priorityGap.isUnassessed

  const recommendation = isUnassessed
    ? `Establish your baseline proficiency for ${priorityGap.name} by taking a scored challenge or submitting evidence. CareerOS cannot measure your true gap until an assessment is completed.`
    : `${priorityGap.name} represents your current highest-priority skill gap. Build practical evidence through a focused challenge to improve your career readiness score.`

  const actionText = isUnassessed ? 'Start Assessment' : 'Work on this Skill'

  return (
    <div className="space-y-6">
      {/* Featured Biggest Gap Card */}
      <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
        <div
          className={`border-b px-6 py-3 flex items-center justify-between ${
            isUnassessed
              ? 'bg-slate-100/70 border-slate-200'
              : 'bg-red-500/10 border-red-100'
          }`}
        >
          <div className="flex items-center gap-2">
            {isUnassessed ? (
              <HelpCircle className="w-4 h-4 text-slate-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isUnassessed ? 'text-slate-600' : 'text-red-900'
              }`}
            >
              {isUnassessed ? 'Assessment Needed' : 'Your Biggest Career Gap'}
            </span>
          </div>
          <StatusBadge status={priorityGap.status} size="sm" />
        </div>

        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-xl">
              <div>
                <h3 className="text-2xl font-bold text-[#0F172A]">
                  {priorityGap.name}
                </h3>
                <p className="text-sm text-[#475569] mt-1">
                  {isUnassessed
                    ? `Required level: ${priorityGap.requiredScore}. Your current proficiency has not been assessed yet.`
                    : `This skill gap represents the single largest bottleneck between your current proficiency and the ${priorityGap.requiredScore}-point employer benchmark.`}
                </p>
              </div>

              {/* Numerical Gap Stats */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-[#E2E8F0] rounded-xl">
                <div>
                  <span className="text-xs text-[#94A3B8] font-medium block">
                    Your Level
                  </span>
                  {isUnassessed ? (
                    <span className="text-2xl font-extrabold text-slate-400">
                      —
                    </span>
                  ) : (
                    <span className="text-2xl font-extrabold text-red-600">
                      {priorityGap.currentScore}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] font-medium block">
                    Required
                  </span>
                  <span className="text-2xl font-extrabold text-[#0F172A]">
                    {priorityGap.requiredScore}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-[#94A3B8] font-medium block">
                    Gap Delta
                  </span>
                  {isUnassessed ? (
                    <span className="text-2xl font-extrabold text-slate-400">
                      ?
                    </span>
                  ) : (
                    <span className="text-2xl font-extrabold text-red-700">
                      -{priorityGap.gap}
                    </span>
                  )}
                </div>
              </div>

              {/* Recommendation Box */}
              <div className="flex items-start gap-3 p-3.5 bg-blue-50/70 border border-blue-100 rounded-lg">
                <Zap className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div className="text-xs text-[#0F172A] leading-relaxed">
                  <strong>Recommendation:</strong> {recommendation}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="shrink-0 flex flex-col gap-3 justify-center items-start lg:items-end">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/challenge')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full sm:w-auto shadow-sm"
              >
                {actionText}
              </Button>
              <span className="text-[11px] text-[#94A3B8] text-center lg:text-right">
                {isUnassessed
                  ? 'Estimated ~45 min challenge'
                  : 'Estimated ~45 mins hands-on proof'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Gaps */}
      {otherGaps.length > 0 && (
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base">
              Secondary Competency Gaps
            </CardTitle>
            <p className="text-xs text-[#475569]">
              Additional areas to develop in subsequent roadmap iterations
            </p>
          </CardHeader>
          <CardContent className="divide-y divide-[#E2E8F0] pt-0">
            {otherGaps.map((gap) => (
              <div
                key={gap.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0F172A]">
                      {gap.name}
                    </span>
                    <StatusBadge status={gap.status} size="sm" />
                    {!gap.isUnassessed && (
                      <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        Gap: {gap.gap} pts
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#475569]">
                    {gap.isUnassessed
                      ? `Required: ${gap.requiredScore}. Assessment needed to measure your proficiency.`
                      : `Current: ${gap.currentScore} / Required: ${gap.requiredScore}`}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/challenge')}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  className="shrink-0"
                >
                  {gap.isUnassessed ? 'Start Assessment' : 'Practice'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

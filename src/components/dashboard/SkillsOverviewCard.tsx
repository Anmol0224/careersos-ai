import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { StatusBadge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import {
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DashboardSkill } from '../../services/dashboardService'

type SkillsOverviewCardProps = {
  topSkills: DashboardSkill[]
  priorityGaps: DashboardSkill[]
}

export const SkillsOverviewCard: React.FC<
  SkillsOverviewCardProps
> = ({
  topSkills,
  priorityGaps,
}) => {
  const strongestStatus =
    topSkills.length > 0 &&
    topSkills.every(
      (skill) => skill.currentScore >= skill.requiredScore,
    )
      ? 'Ready'
      : topSkills.some(
            (skill) =>
              skill.currentScore >=
              skill.requiredScore * 0.8,
          )
        ? 'Developing'
        : 'Needs Work'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Strongest Skills */}
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>

            <div>
              <CardTitle className="text-base">
                Strongest Skills
              </CardTitle>

              <p className="text-xs text-[#475569]">
                Your highest current skill scores for this target role
              </p>
            </div>
          </div>

          {topSkills.length > 0 && (
            <StatusBadge
              status={strongestStatus}
              size="sm"
            />
          )}
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {topSkills.length === 0 ? (
            <div className="rounded-lg border border-[#E2E8F0] bg-slate-50 p-4">
              <p className="text-sm text-[#475569]">
                Your skills have not been assessed yet.
              </p>
            </div>
          ) : (
            topSkills.map((skill) => (
              <div
                key={skill.id}
                className="space-y-1.5"
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-[#0F172A]">
                    {skill.name}
                  </span>

                  <span className="font-bold text-[#16A34A]">
                    {skill.currentScore} / 100
                  </span>
                </div>

                <ProgressBar
                  value={skill.currentScore}
                  height="sm"
                  variant="success"
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Priority Gaps */}
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>

            <div>
              <CardTitle className="text-base">
                Priority Gaps
              </CardTitle>

              <p className="text-xs text-[#475569]">
                Key areas holding back your target-role readiness
              </p>
            </div>
          </div>

          <Link
            to="/career"
            className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1"
          >
            <span>All Gaps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </CardHeader>

        <CardContent className="space-y-3.5 pt-4">
          {priorityGaps.length === 0 ? (
            <div className="rounded-lg border border-[#E2E8F0] bg-slate-50 p-4">
              <p className="text-sm text-[#475569]">
                No current skill gaps were found for your target role.
              </p>
            </div>
          ) : (
            priorityGaps.map((gap) => {
              const actionRoute =
                gap.gap >= 20
                  ? '/challenge'
                  : '/roadmap'

              const recommendation =
                gap.gap >= 20
                  ? `Build practical ${gap.name} skills through a focused challenge.`
                  : `Strengthen ${gap.name} through targeted roadmap practice.`

              return (
                <div
                  key={gap.id}
                  className="p-3 rounded-lg border border-[#E2E8F0] bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#0F172A]">
                        {gap.name}
                      </span>

                      <StatusBadge
                        status={gap.status}
                        size="sm"
                      />
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#0F172A]">
                        {gap.currentScore}
                      </span>

                      <span className="text-xs text-[#94A3B8]">
                        {' '}
                        / {gap.requiredScore} target
                      </span>
                    </div>
                  </div>

                  <ProgressBar
                    value={gap.currentScore}
                    required={gap.requiredScore}
                    height="sm"
                    variant={
                      gap.status === 'Needs Work'
                        ? 'error'
                        : 'warning'
                    }
                  />

                  <div className="flex items-center justify-between mt-2 pt-1 text-[11px] text-[#475569]">
                    <span className="truncate max-w-[200px] sm:max-w-xs">
                      {recommendation}
                    </span>

                    <Link
                      to={actionRoute}
                      className="font-semibold text-[#2563EB] hover:underline shrink-0 ml-2"
                    >
                      {actionRoute === '/challenge'
                        ? 'Take Challenge'
                        : 'View Roadmap'}{' '}
                      →
                    </Link>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
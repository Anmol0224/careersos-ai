import React, { useEffect, useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { SkillsTable } from '../components/skills/SkillsTable'
import { GapAnalysisCard } from '../components/skills/GapAnalysisCard'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Target, ArrowRight, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  careerService,
  type CareerGapData,
} from '../services/careerService'

export const Career: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [gapData, setGapData] = useState<CareerGapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      if (!user) {
        if (active) {
          setGapData(null)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError('')

      try {
        const data = await careerService.getCareerGapData(user.id)
        if (active) setGapData(data)
      } catch (err) {
        if (active)
          setError(
            err instanceof Error ? err.message : 'Unable to load career data.',
          )
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [user])

  if (loading) {
    return (
      <PageContainer
        title="Careers & Skill Gap Analysis"
        subtitle="Benchmark your verified skills against career requirements."
        questionBadge="What am I missing?"
      >
        <Card>
          <CardContent className="p-6 text-sm text-[#475569]">
            Loading your career skill gap data...
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  if (error || !gapData) {
    return (
      <PageContainer
        title="Careers & Skill Gap Analysis"
        subtitle="Benchmark your verified skills against career requirements."
        questionBadge="What am I missing?"
      >
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-red-700">
              {error || 'Unable to load career data.'}
            </p>
            <Button
              className="mt-4"
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  const { career, skills, priorityGaps, readyCount, totalCount, hasAssessedSkills } = gapData

  const topGap = priorityGaps[0]
  const secondaryGaps = priorityGaps.slice(1)

  const assessedGapCount = skills.filter(
    (s) => !s.isUnassessed && s.gap > 0,
  ).length

  const unassessedCount = skills.filter((s) => s.isUnassessed).length

  return (
    <PageContainer
      title="Careers & Skill Gap Analysis"
      subtitle="Benchmark your verified skills against career requirements."
      questionBadge="What am I missing?"
      actions={
        topGap ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/challenge')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            {topGap.isUnassessed
              ? `Assess ${topGap.name}`
              : `Work on ${topGap.name}`}
          </Button>
        ) : undefined
      }
    >
      {/* Target Career Card */}
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

                <h2 className="text-2xl font-bold text-[#0F172A]">
                  {career.title}
                </h2>

                <div className="flex items-center gap-3 text-xs text-[#475569] mt-1">
                  {hasAssessedSkills ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {readyCount} of {totalCount} core skills ready
                    </span>
                  ) : (
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      {totalCount} skills loaded — assessment pending
                    </span>
                  )}

                  {assessedGapCount > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-red-700 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {assessedGapCount} measured gap
                        {assessedGapCount !== 1 ? 's' : ''}
                      </span>
                    </>
                  )}

                  {unassessedCount > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-slate-500 font-semibold">
                        {unassessedCount} not yet assessed
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/roadmap')}
            >
              View Target Roadmap
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Core Skills Benchmarks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A]">
              Core Competency Benchmarks
            </h3>
            <p className="text-xs text-[#475569]">
              Career requirements loaded from the CareerOS database.
            </p>
          </div>
          <span className="text-xs text-[#94A3B8]">Supabase connected</span>
        </div>

        {skills.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-[#475569]">
              No skills are configured for {career.title} yet.
            </CardContent>
          </Card>
        ) : (
          <SkillsTable skills={skills} />
        )}
      </div>

      {/* Priority Gap Analysis */}
      {priorityGaps.length > 0 && topGap && (
        <div className="pt-2">
          <div className="mb-3">
            <h3 className="text-lg font-bold text-[#0F172A]">
              Your Biggest Gaps
            </h3>
            <p className="text-xs text-[#475569]">
              Focus on the skills that can produce the biggest readiness
              improvement.
            </p>
          </div>

          <GapAnalysisCard
            priorityGap={topGap}
            otherGaps={secondaryGaps}
          />
        </div>
      )}

      {priorityGaps.length === 0 && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-6 text-sm text-emerald-800 font-medium">
            ✓ No skill gaps detected for {career.title}. Your assessed skills
            meet or exceed all requirements.
          </CardContent>
        </Card>
      )}
    </PageContainer>
  )
}
import React, { useEffect, useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { SkillsTable } from '../components/skills/SkillsTable'
import { GapAnalysisCard } from '../components/skills/GapAnalysisCard'
import { mockPriorityGaps, mockUserProfile } from '../data/mockData'
import type { SkillItem } from '../data/mockData'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Target, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { careerService } from '../services/career'

export const Career: React.FC = () => {
  const navigate = useNavigate()

  const [skills, setSkills] = useState<SkillItem[]>([])
  const [loading, setLoading] = useState(true)

  const selectedTarget = mockUserProfile.targetCareer

  useEffect(() => {
    const loadSkills = async () => {
      setLoading(true)
      const data = await careerService.getSkills('data-analyst')
      setSkills(data)
      setLoading(false)
    }

    void loadSkills()
  }, [])

  const priorityGap = mockPriorityGaps[0]
  const secondaryGaps = mockPriorityGaps.slice(1)

  const readySkillsCount = skills.filter(
    (skill) => skill.status === 'Ready'
  ).length

  const totalSkillsCount = skills.length

  return (
    <PageContainer
      title="Careers & Skill Gap Analysis"
      subtitle="Benchmark your verified skills against career requirements."
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
                  {selectedTarget}
                </h2>

                <div className="flex items-center gap-3 text-xs text-[#475569] mt-1">
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {readySkillsCount} of {totalSkillsCount} core skills ready
                  </span>

                  <span>·</span>

                  <span className="text-red-700 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    1 Critical Gap (Power BI)
                  </span>
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

          <span className="text-xs text-[#94A3B8]">
            Supabase connected
          </span>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-6 text-sm text-[#475569]">
              Loading career skills...
            </CardContent>
          </Card>
        ) : (
          <SkillsTable skills={skills} />
        )}
      </div>

      <div className="pt-2">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-[#0F172A]">
            Your Biggest Gaps
          </h3>

          <p className="text-xs text-[#475569]">
            Focus on the skills that can produce the biggest readiness improvement.
          </p>
        </div>

        <GapAnalysisCard
          priorityGap={priorityGap}
          otherGaps={secondaryGaps}
        />
      </div>
    </PageContainer>
  )
}
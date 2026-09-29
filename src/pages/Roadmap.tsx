import React, { useEffect, useState, useCallback } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { RoadmapTimeline } from '../components/roadmap/RoadmapTimeline'
import { Card, CardContent } from '../components/ui/Card'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Button } from '../components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  careerService,
  type RoadmapData,
} from '../services/careerService'

export const Roadmap: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completingStepId, setCompletingStepId] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function load() {
      if (!user) {
        if (active) {
          setRoadmap(null)
          setLoading(false)
        }
        return
      }

      if (active) {
        setLoading(true)
        setError('')
      }

      try {
        const data = await careerService.getOrCreateRoadmap(user.id)
        if (active) setRoadmap(data)
      } catch (err) {
        if (active)
          setError(
            err instanceof Error ? err.message : 'Unable to load roadmap.',
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

  const handleCompleteStep = useCallback(
    async (stepId: string) => {
      if (!user) return
      setCompletingStepId(stepId)
      try {
        await careerService.completeStep(stepId)
        // Optimistically update local state without full refetch
        setRoadmap((prev) => {
          if (!prev) return prev
          const updatedSteps = prev.steps.map((s) =>
            s.id === stepId ? { ...s, status: 'complete' as const } : s,
          )
          const completedCount = updatedSteps.filter(
            (s) => s.status === 'complete',
          ).length
          return { ...prev, steps: updatedSteps, completedCount }
        })
      } catch (err) {
        console.error('Failed to complete step:', err)
      } finally {
        setCompletingStepId(null)
      }
    },
    [user],
  )

  if (loading) {
    return (
      <PageContainer
        title="Your Roadmap"
        subtitle="A simple plan built around your highest-priority gaps."
        questionBadge="What should I do?"
      >
        <Card>
          <CardContent className="p-6 text-sm text-[#475569]">
            Loading your personalized roadmap...
          </CardContent>
        </Card>
      </PageContainer>
    )
  }

  if (error || !roadmap) {
    return (
      <PageContainer
        title="Your Roadmap"
        subtitle="A simple plan built around your highest-priority gaps."
        questionBadge="What should I do?"
      >
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-red-700">
              {error || 'Roadmap data is unavailable.'}
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

  const { steps, completedCount, totalCount } = roadmap
  const completionPct =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <PageContainer
      title="Your Roadmap"
      subtitle="A simple plan built around your highest-priority gaps."
      questionBadge="What should I do?"
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/challenge')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Next Challenge
        </Button>
      }
    >
      {/* Progress Header Card */}
      <Card className="bg-white border-[#E2E8F0]">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block">
                {roadmap.title}
              </span>
              <h3 className="text-xl font-bold text-[#0F172A]">
                {completedCount} / {totalCount} steps complete
              </h3>
              <p className="text-xs text-[#475569]">
                {completionPct}% overall progress toward certified full
                readiness.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[#475569]">Completion</span>
                <span className="text-[#2563EB]">{completionPct}%</span>
              </div>
              <ProgressBar value={completionPct} height="md" variant="blue" />
            </div>
          </div>

          {/* Phase Sequence Guide */}
          <div className="mt-6 pt-5 border-t border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-2.5 bg-blue-50 rounded-lg border border-blue-100 font-semibold text-blue-900">
              1. Learn (Theory)
            </div>
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100 font-semibold text-amber-900">
              2. Practice (Mini tasks)
            </div>
            <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-100 font-semibold text-indigo-900">
              3. Build (Portfolio)
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100 font-semibold text-emerald-900">
              4. Prove (Scored Challenge)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      {steps.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-[#475569]">
            Your roadmap is being prepared. Please check back shortly or start a challenge.
          </CardContent>
        </Card>
      ) : (
        <div className="pt-2">
          <RoadmapTimeline
            steps={steps}
            onCompleteStep={handleCompleteStep}
            completingStepId={completingStepId}
          />
        </div>
      )}
    </PageContainer>
  )
}

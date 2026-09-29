import React, { useEffect, useState } from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { ReadinessCard } from '../components/dashboard/ReadinessCard'
import { NextActionCard } from '../components/dashboard/NextActionCard'
import { SkillsOverviewCard } from '../components/dashboard/SkillsOverviewCard'
import { ProgressHistoryCard } from '../components/dashboard/ProgressHistoryCard'
import { OpportunitiesSnippet } from '../components/dashboard/OpportunitiesSnippet'
import { OpportunityModal } from '../components/opportunities/OpportunityModal'
import type { OpportunityItem } from '../data/mockData'
import { Button } from '../components/ui/Button'
import {
  Compass,
  ArrowRight,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  dashboardService,
  type DashboardData,
} from '../services/dashboardService'

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null)

  const [
    selectedOpportunity,
    setSelectedOpportunity,
  ] = useState<OpportunityItem | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  useEffect(() => {
    let active = true

    const loadDashboard = async () => {
      if (!user) {
        if (active) {
          setDashboardData(null)
          setLoading(false)
        }
        return
      }

      setLoading(true)
      setError('')

      try {
        const data =
          await dashboardService.getDashboardData(
            user.id,
          )

        if (active) {
          setDashboardData(data)
        }
      } catch (dashboardError) {
        console.error(
          'Dashboard loading error:',
          dashboardError,
        )

        if (active) {
          setError(
            dashboardError instanceof Error
              ? dashboardError.message
              : 'Unable to load dashboard data.',
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadDashboard()

    return () => {
      active = false
    }
  }, [user])

  if (loading) {
    return (
      <PageContainer
        title="Loading your dashboard..."
        subtitle="CareerOS is preparing your latest readiness snapshot."
        questionBadge="Where am I?"
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-slate-500">
            Loading your career readiness data...
          </p>
        </div>
      </PageContainer>
    )
  }

  if (error || !dashboardData) {
    return (
      <PageContainer
        title="We could not load your dashboard"
        subtitle="Please check your profile and CareerOS data."
        questionBadge="Where am I?"
      >
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700">
            {error ||
              'Dashboard data is unavailable.'}
          </p>

          <Button
            className="mt-4"
            variant="primary"
            onClick={() =>
              window.location.reload()
            }
          >
            Retry
          </Button>
        </div>
      </PageContainer>
    )
  }

  const firstName =
    dashboardData.profile.fullName
      .split(' ')[0] || 'Student'

  const topGap =
    dashboardData.priorityGaps[0]

  return (
    <PageContainer
      title={`Good morning, ${firstName} 👋`}
      subtitle="Here is your current career readiness benchmark and next best high-impact action."
      questionBadge="Where am I?"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate('/roadmap')
            }
            leftIcon={
              <Compass className="w-3.5 h-3.5" />
            }
          >
            Roadmap
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              navigate('/challenge')
            }
            rightIcon={
              <ArrowRight className="w-3.5 h-3.5" />
            }
          >
            Take Challenge
          </Button>
        </div>
      }
    >
      <ReadinessCard
        score={
          dashboardData.readiness.currentScore
        }
        monthlyGain={
          dashboardData.readiness.delta
        }
        targetCareer={
          dashboardData.career.title
        }
        alignment={
          dashboardData.career.alignment
        }
        coreReady={
          dashboardData.career.coreReady
        }
        coreTotal={
          dashboardData.career.coreTotal
        }
      />

      <NextActionCard
        title={
          topGap
            ? `Improve your ${topGap.name} skill`
            : `Continue your ${dashboardData.career.title} roadmap`
        }
        duration="45 min"
        difficulty="Intermediate"
        impact="High Impact"
        description={
          topGap
            ? `${topGap.name} is currently your highest-priority skill gap for the ${dashboardData.career.title} role.`
            : 'Continue building practical evidence for your target career.'
        }
        actionRoute="/challenge"
      />

      <SkillsOverviewCard
        topSkills={dashboardData.topSkills}
        priorityGaps={dashboardData.priorityGaps}
      />

      <ProgressHistoryCard />

      <OpportunitiesSnippet
        onSelectOpportunity={(opp) =>
          setSelectedOpportunity(opp)
        }
      />

      <OpportunityModal
        opportunity={
          selectedOpportunity
        }
        isOpen={Boolean(
          selectedOpportunity,
        )}
        onClose={() =>
          setSelectedOpportunity(null)
        }
      />
    </PageContainer>
  )
}
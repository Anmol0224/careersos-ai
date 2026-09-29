import React from 'react'
import { Card, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  ArrowRight,
  BookOpen,
  Code2,
  Hammer,
  ShieldCheck,
  Star,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { RoadmapStepRow } from '../../services/careerService'

export interface RoadmapTimelineProps {
  steps: RoadmapStepRow[]
  onCompleteStep?: (stepId: string) => void
  completingStepId?: string | null
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({
  steps,
  onCompleteStep,
  completingStepId,
}) => {
  const navigate = useNavigate()

  const getPhaseIcon = (stage: RoadmapStepRow['stage']) => {
    switch (stage) {
      case 'Learn':
        return <BookOpen className="w-3.5 h-3.5" />
      case 'Practice':
        return <Code2 className="w-3.5 h-3.5" />
      case 'Build':
        return <Hammer className="w-3.5 h-3.5" />
      case 'Prove':
        return <ShieldCheck className="w-3.5 h-3.5" />
    }
  }

  const getPhaseBadgeColor = (stage: RoadmapStepRow['stage']) => {
    switch (stage) {
      case 'Learn':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Practice':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Build':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      case 'Prove':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  }

  return (
    <div className="relative space-y-4">
      {/* Visual Timeline bar */}
      <div className="absolute left-[29px] top-6 bottom-6 w-0.5 bg-slate-200 hidden sm:block" />

      {steps.map((step, idx) => {
        const isComplete = step.status === 'complete'
        const isInProgress = step.status === 'in_progress'
        const isStartHere = idx === 0 && !isComplete
        const isCompleting = completingStepId === step.id

        return (
          <div
            key={step.id}
            className={`relative flex items-start gap-4 transition-all duration-200 ${
              isInProgress ? 'scale-[1.01]' : ''
            }`}
          >
            {/* Step marker */}
            <div className="relative z-10 shrink-0 mt-3 hidden sm:flex">
              {isComplete ? (
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : isInProgress ? (
                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md ring-4 ring-blue-100 animate-pulse">
                  <PlayCircle className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-300 text-[#94A3B8] flex items-center justify-center font-bold text-xs">
                  <span>{idx + 1}</span>
                </div>
              )}
            </div>

            {/* Step Card */}
            <Card
              className={`flex-1 border transition-all ${
                isInProgress
                  ? 'border-[#2563EB] ring-2 ring-blue-100 shadow-md bg-white'
                  : isComplete
                  ? 'border-[#E2E8F0] bg-slate-50/50'
                  : 'border-[#E2E8F0] bg-white opacity-85'
              }`}
            >
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    {/* Phase, Duration, badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getPhaseBadgeColor(step.stage)}`}
                      >
                        {getPhaseIcon(step.stage)}
                        <span>{step.stage}</span>
                      </span>

                      {step.duration_minutes && (
                        <span className="flex items-center gap-1 text-xs text-[#475569] bg-slate-100 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3 text-[#94A3B8]" />
                          <span>{step.duration_minutes} min</span>
                        </span>
                      )}

                      {isStartHere && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          <Star className="w-3 h-3" />
                          Start Here
                        </span>
                      )}

                      {isComplete && (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ Complete
                        </span>
                      )}

                      {isInProgress && !isStartHere && (
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          ● Actionable Now
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-[#0F172A]">
                      {step.title}
                    </h4>

                    {step.description && (
                      <p className="text-xs text-[#475569] leading-relaxed max-w-2xl">
                        {step.description}
                      </p>
                    )}
                  </div>

                  {/* Action */}
                  <div className="shrink-0 flex flex-col items-end gap-2 pt-2 sm:pt-0">
                    {isComplete ? (
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed
                      </span>
                    ) : (
                      <>
                        <Button
                          variant={isInProgress ? 'primary' : 'outline'}
                          size="sm"
                          onClick={() => navigate('/challenge')}
                          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        >
                          {step.stage === 'Prove' ? 'Take Challenge' : 'Start'}
                        </Button>

                        {onCompleteStep && (
                          <button
                            onClick={() => onCompleteStep(step.id)}
                            disabled={isCompleting}
                            className="text-[11px] text-[#94A3B8] hover:text-emerald-600 underline underline-offset-2 transition-colors disabled:opacity-50"
                          >
                            {isCompleting ? 'Saving...' : 'Mark complete'}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      })}
    </div>
  )
}

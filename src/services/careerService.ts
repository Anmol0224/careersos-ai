import { supabase } from '../lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

export type SkillGapStatus =
  | 'Ready'
  | 'Developing'
  | 'Needs Work'
  | 'Not Assessed'

export type CareerSkillGap = {
  id: string
  name: string
  category: string
  description: string | null
  currentScore: number
  requiredScore: number
  gap: number
  normalizedGap: number
  /** priority = normalizedGap × 1 (importance weight; extend when career_skills.importance available) */
  priority: number
  status: SkillGapStatus
  isUnassessed: boolean
  evidenceStatus: string | null
  source: string | null
  lastAssessedAt: string | null
  evidenceNotes: string | null
}

export type CareerGapData = {
  career: {
    id: string
    title: string
    slug: string
  }
  skills: CareerSkillGap[]
  /** Top 3 by priority (assessed only if any exist; otherwise unassessed ranked by requiredScore desc) */
  priorityGaps: CareerSkillGap[]
  readyCount: number
  totalCount: number
  hasAssessedSkills: boolean
}

export type RoadmapStepRow = {
  id: string
  roadmap_id: string
  title: string
  stage: 'Learn' | 'Practice' | 'Build' | 'Prove'
  status: 'upcoming' | 'in_progress' | 'complete'
  step_number: number
  description: string | null
  skill_id: string | null
  duration_minutes: number | null
}

export type RoadmapData = {
  id: string
  career_id: string
  title: string
  status: string
  steps: RoadmapStepRow[]
  completedCount: number
  totalCount: number
}

// ─── Private helpers ──────────────────────────────────────────────────────────

/**
 * Deterministic unassessed-skill rule — must mirror readinessService and dashboardService.
 * A skill is unassessed when it was auto-created at onboarding and has no actual evidence.
 */
function isSkillUnassessed(
  source: string | null,
  currentScore: number,
  lastAssessedAt: string | null,
  evidenceNotes: string | null,
): boolean {
  return (
    source === 'onboarding' &&
    currentScore === 0 &&
    !lastAssessedAt &&
    !evidenceNotes
  )
}

function deriveStatus(
  currentScore: number,
  requiredScore: number,
  unassessed: boolean,
): SkillGapStatus {
  if (unassessed) return 'Not Assessed'
  if (currentScore >= requiredScore) return 'Ready'
  if (currentScore >= requiredScore * 0.8) return 'Developing'
  return 'Needs Work'
}

/**
 * Priority score for gap ranking.
 *
 * priority = normalizedGap
 *   where normalizedGap = max(required - current, 0) / max(required, 1)
 *
 * For unassessed skills we set normalizedGap = 1.0 so they surface at the
 * top as candidates needing baseline assessment. This is honest: we don't
 * know their actual gap yet.
 */
function computePriority(normalizedGap: number): number {
  // Weight is 1.0 per skill (importance weighting reserved for when
  // career_skills.importance column is available)
  return parseFloat(normalizedGap.toFixed(4))
}

// ─── Roadmap step generator ───────────────────────────────────────────────────

/**
 * Generates a deterministic set of roadmap steps for the highest-priority gap.
 * Follows LEARN → PRACTICE → BUILD → PROVE.
 * Intentionally small: 4 steps per skill to keep the roadmap actionable.
 */
function generateStepsForSkill(
  skillName: string,
  skillId: string,
  roadmapId: string,
): Omit<RoadmapStepRow, 'id'>[] {
  return [
    {
      roadmap_id: roadmapId,
      title: `${skillName}: Core Concepts & Fundamentals`,
      stage: 'Learn' as const,
      status: 'in_progress' as const,
      step_number: 1,
      description: `Study the core theory, tools, and techniques required for ${skillName}. Focus on understanding key principles that employers evaluate.`,
      skill_id: skillId,
      duration_minutes: 30,
    },
    {
      roadmap_id: roadmapId,
      title: `${skillName}: Guided Practice Tasks`,
      stage: 'Practice' as const,
      status: 'upcoming' as const,
      step_number: 2,
      description: `Complete structured mini-exercises applying ${skillName} concepts to realistic data or scenarios. Reinforce patterns through repetition.`,
      skill_id: skillId,
      duration_minutes: 30,
    },
    {
      roadmap_id: roadmapId,
      title: `${skillName}: Build a Portfolio Project`,
      stage: 'Build' as const,
      status: 'upcoming' as const,
      step_number: 3,
      description: `Construct a self-directed project that showcases ${skillName} applied to a real-world problem. This becomes tangible evidence for employers.`,
      skill_id: skillId,
      duration_minutes: 45,
    },
    {
      roadmap_id: roadmapId,
      title: `${skillName}: Prove Proficiency via Challenge`,
      stage: 'Prove' as const,
      status: 'upcoming' as const,
      step_number: 4,
      description: `Take the scored CareerOS challenge for ${skillName}. Your performance is evaluated against role benchmarks and updates your skill evidence.`,
      skill_id: skillId,
      duration_minutes: 45,
    },
  ]
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const careerService = {
  /**
   * Loads the authenticated user's career gap analysis from real Supabase data.
   * Uses: profiles → career_goal → careers → career_skills → skills → user_skills
   */
  async getCareerGapData(userId: string): Promise<CareerGapData> {
    // 1. Load user profile to get career_goal
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('career_goal')
      .eq('id', userId)
      .maybeSingle()

    if (profileError) {
      throw new Error(`Failed to load profile: ${profileError.message}`)
    }

    const careerGoal = profile?.career_goal?.trim() || ''
    if (!careerGoal) {
      throw new Error(
        'No target career selected. Please complete your profile onboarding.',
      )
    }

    const careerSlug = careerGoal
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    // 2. Resolve career record
    const { data: career, error: careerError } = await supabase
      .from('careers')
      .select('id, name, slug')
      .eq('slug', careerSlug)
      .maybeSingle()

    if (careerError) {
      throw new Error(`Failed to load career: ${careerError.message}`)
    }
    if (!career) {
      throw new Error(
        `Career "${careerGoal}" was not found in CareerOS. Contact support if this is unexpected.`,
      )
    }

    // 3. Load career skill requirements
    const { data: careerSkillsData, error: careerSkillsError } = await supabase
      .from('career_skills')
      .select('skill_id, required_score')
      .eq('career_id', career.id)

    if (careerSkillsError) {
      throw new Error(
        `Failed to load career requirements: ${careerSkillsError.message}`,
      )
    }

    const careerSkills = careerSkillsData ?? []
    if (careerSkills.length === 0) {
      throw new Error(`No skills are configured for ${career.name}.`)
    }

    const skillIds = careerSkills.map((cs) => cs.skill_id)

    // 4. Load skill metadata + user skill state in parallel
    const [
      { data: skillsData, error: skillsError },
      { data: userSkillsData, error: userSkillsError },
    ] = await Promise.all([
      supabase
        .from('skills')
        .select('id, name, category, description')
        .in('id', skillIds),
      supabase
        .from('user_skills')
        .select(
          'skill_id, current_score, source, evidence_notes, last_assessed_at, evidence_status',
        )
        .eq('user_id', userId)
        .in('skill_id', skillIds),
    ])

    if (skillsError) {
      throw new Error(`Failed to load skills: ${skillsError.message}`)
    }
    if (userSkillsError) {
      throw new Error(
        `Failed to load your skill records: ${userSkillsError.message}`,
      )
    }

    const skillMap = new Map(
      (skillsData ?? []).map((s) => [s.id, s]),
    )

    const userSkillMap = new Map(
      (userSkillsData ?? []).map((us) => [us.skill_id, us]),
    )

    // 5. Build gap objects
    const skills: CareerSkillGap[] = careerSkills
      .map((cs) => {
        const skillMeta = skillMap.get(cs.skill_id)
        if (!skillMeta) return null

        const us = userSkillMap.get(cs.skill_id)
        const currentScore = us ? Number(us.current_score) : 0
        const requiredScore = Number(cs.required_score)
        const gap = Math.max(requiredScore - currentScore, 0)
        const normalizedGap =
          gap / Math.max(requiredScore, 1)

        const unassessed = isSkillUnassessed(
          us?.source ?? null,
          currentScore,
          us?.last_assessed_at ?? null,
          us?.evidence_notes ?? null,
        )

        // Unassessed skills get normalizedGap = 1.0 for priority purposes:
        // we don't know the real gap, but they need to be assessed.
        const priorityNormalized = unassessed ? 1.0 : normalizedGap

        return {
          id: cs.skill_id,
          name: skillMeta.name,
          category: skillMeta.category ?? 'Technical',
          description: skillMeta.description ?? null,
          currentScore,
          requiredScore,
          gap,
          normalizedGap,
          priority: computePriority(priorityNormalized),
          status: deriveStatus(currentScore, requiredScore, unassessed),
          isUnassessed: unassessed,
          evidenceStatus: us?.evidence_status ?? null,
          source: us?.source ?? null,
          lastAssessedAt: us?.last_assessed_at ?? null,
          evidenceNotes: us?.evidence_notes ?? null,
        } satisfies CareerSkillGap
      })
      .filter((s): s is CareerSkillGap => s !== null)

    // 6. Derive sorted priority gaps
    const priorityGaps = [...skills]
      .filter((s) => s.gap > 0 || s.isUnassessed)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3)

    const readyCount = skills.filter((s) => s.status === 'Ready').length
    const hasAssessedSkills = skills.some((s) => !s.isUnassessed)

    return {
      career: {
        id: career.id,
        title: career.name,
        slug: career.slug,
      },
      skills,
      priorityGaps,
      readyCount,
      totalCount: skills.length,
      hasAssessedSkills,
    }
  },

  /**
   * Loads or idempotently creates a roadmap for the authenticated user's career.
   *
   * Idempotency strategy:
   *   - Check for an existing roadmap WHERE user_id = userId AND career_id = careerId.
   *   - If found, load its steps and return.
   *   - If not found, generate a 4-step deterministic roadmap for the highest-priority gap.
   *   - Steps are inserted only when a new roadmap is created.
   *   - Refreshing the page will NEVER create duplicate roadmaps.
   */
  async getOrCreateRoadmap(userId: string): Promise<RoadmapData> {
    // 1. Resolve career
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('career_goal')
      .eq('id', userId)
      .maybeSingle()

    if (profileError) {
      throw new Error(`Failed to load profile: ${profileError.message}`)
    }

    const careerGoal = profile?.career_goal?.trim() || ''
    if (!careerGoal) {
      throw new Error('No target career found. Please complete your profile.')
    }

    const careerSlug = careerGoal
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const { data: career, error: careerError } = await supabase
      .from('careers')
      .select('id, name, slug')
      .eq('slug', careerSlug)
      .maybeSingle()

    if (careerError) throw new Error(`Career lookup failed: ${careerError.message}`)
    if (!career) throw new Error(`Career "${careerGoal}" not found.`)

    // 2. Check for existing roadmap (idempotent)
    const { data: existing, error: existingError } = await supabase
      .from('roadmaps')
      .select('id, career_id, title, status')
      .eq('user_id', userId)
      .eq('career_id', career.id)
      .maybeSingle()

    if (existingError) {
      throw new Error(`Failed to check roadmap: ${existingError.message}`)
    }

    let roadmapId: string

    if (existing) {
      roadmapId = existing.id
    } else {
      // 3. No roadmap yet — find highest-priority gap to seed it
      const careerGap = await this.getCareerGapData(userId)

      // Pick top priority gap (prefer unassessed to nudge toward assessment)
      const topGap =
        careerGap.priorityGaps[0] ?? careerGap.skills[0] ?? null

      const roadmapTitle = topGap
        ? `${career.name} — ${topGap.name} Path`
        : `${career.name} Readiness Roadmap`

      // 4. Insert roadmap
      const { data: newRoadmap, error: insertError } = await supabase
        .from('roadmaps')
        .insert({
          user_id: userId,
          career_id: career.id,
          title: roadmapTitle,
          status: 'active',
          description: `Personalized readiness roadmap for ${career.name}`,
        })
        .select('id')
        .single()

      if (insertError || !newRoadmap) {
        throw new Error(
          `Failed to create roadmap: ${insertError?.message ?? 'unknown'}`,
        )
      }

      roadmapId = newRoadmap.id

      // 5. Insert deterministic steps for top gap
      if (topGap) {
        const stepsToInsert = generateStepsForSkill(
          topGap.name,
          topGap.id,
          roadmapId,
        )

        const { error: stepsError } = await supabase
          .from('roadmap_steps')
          .insert(stepsToInsert)

        if (stepsError) {
          console.error('Failed to insert roadmap steps:', stepsError.message)
          // Non-fatal: roadmap exists, steps can be regenerated
        }
      }
    }

    // 6. Load steps (always fresh, preserving completion state)
    const { data: stepsData, error: stepsError } = await supabase
      .from('roadmap_steps')
      .select(
        'id, roadmap_id, title, stage, status, step_number, description, skill_id, duration_minutes',
      )
      .eq('roadmap_id', roadmapId)
      .order('step_number', { ascending: true })

    if (stepsError) {
      throw new Error(`Failed to load roadmap steps: ${stepsError.message}`)
    }

    const steps = (stepsData ?? []) as RoadmapStepRow[]
    const completedCount = steps.filter((s) => s.status === 'complete').length

    return {
      id: roadmapId,
      career_id: career.id,
      title: existing?.title ?? `${career.name} Readiness Roadmap`,
      status: existing?.status ?? 'active',
      steps,
      completedCount,
      totalCount: steps.length,
    }
  },

  /**
   * Marks a single roadmap step as complete.
   * Idempotent: calling it twice on the same step is safe.
   * Does NOT modify user_skills or readiness — only roadmap state.
   */
  async completeStep(stepId: string): Promise<void> {
    const { error } = await supabase
      .from('roadmap_steps')
      .update({ status: 'complete' })
      .eq('id', stepId)

    if (error) {
      throw new Error(`Failed to mark step complete: ${error.message}`)
    }
  },
}

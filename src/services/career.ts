import { supabase } from '../lib/supabase'
import {
  mockUserProfile,
  mockSkills,
  mockPriorityGaps,
  mockRoadmapSteps,
  mockOpportunities,
  mockChallengeData,
  mockChallengeResult,
} from '../data/mockData'

import type {
  UserProfile,
  SkillItem,
  PriorityGap,
  RoadmapStep,
  OpportunityItem,
  ChallengeData,
  ChallengeResultData,
} from '../data/mockData'

type CareerRecord = {
  id: string
  name: string
  slug: string
}

type CareerSkillRecord = {
  skill_id: string
  required_score: number
}

type SkillRecord = {
  id: string
  name: string
  slug: string
  category: string | null
  description: string | null
}

const mapSkillCategory = (
  category: string | null
): SkillItem['category'] => {
  switch (category?.toLowerCase()) {
    case 'analytical':
      return 'Analytical'
    case 'soft skills':
      return 'Soft Skills'
    default:
      return 'Technical'
  }
}

export const careerService = {
  async getUserProfile(): Promise<UserProfile> {
    return { ...mockUserProfile }
  },

  async getSkills(careerSlug = 'data-analyst'): Promise<SkillItem[]> {
    try {
      // 1. Find the career
      const { data: careerData, error: careerError } = await supabase
        .from('careers')
        .select('id, name, slug')
        .eq('slug', careerSlug)
        .single<CareerRecord>()

      if (careerError || !careerData) {
        console.error('Failed to fetch career:', careerError)
        return [...mockSkills]
      }

      // 2. Fetch career skill requirements
      const { data: careerSkillsData, error: careerSkillsError } =
        await supabase
          .from('career_skills')
          .select('skill_id, required_score')
          .eq('career_id', careerData.id)

      if (careerSkillsError) {
        console.error(
          'Failed to fetch career skill requirements:',
          careerSkillsError
        )
        return [...mockSkills]
      }

      const careerSkills = (careerSkillsData ?? []) as CareerSkillRecord[]

      if (careerSkills.length === 0) {
        return [...mockSkills]
      }

      // 3. Fetch the actual skill records
      const skillIds = careerSkills.map((item) => item.skill_id)

      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('id, name, slug, category, description')
        .in('id', skillIds)

      if (skillsError) {
        console.error('Failed to fetch skills:', skillsError)
        return [...mockSkills]
      }

      const skills = (skillsData ?? []) as SkillRecord[]

      // 4. Convert Supabase records into the SkillItem structure
      return careerSkills.flatMap((careerSkill): SkillItem[] => {
  const skill = skills.find(
    (item) => item.id === careerSkill.skill_id
  )

  if (!skill) {
    return []
  }

  const mockSkill = mockSkills.find(
    (item) =>
      item.id === skill.slug ||
      item.name.toLowerCase() === skill.name.toLowerCase()
  )

  const current = mockSkill?.current ?? 0
  const required = Number(careerSkill.required_score)

  let status: SkillItem['status'] = 'Needs Work'

  if (current >= required) {
    status = 'Ready'
  } else if (current >= required * 0.75) {
    status = 'Developing'
  }

  return [
    {
      id: skill.slug,
      name: skill.name,
      current,
      required,
      status,
      category: mapSkillCategory(skill.category),
      description: skill.description ?? undefined,
    },
  ]
})
    } catch (error) {
      console.error('Unexpected error loading career skills:', error)
      return [...mockSkills]
    }
  },

  async getPriorityGaps(): Promise<PriorityGap[]> {
    return [...mockPriorityGaps]
  },

  async getRoadmap(): Promise<RoadmapStep[]> {
    return [...mockRoadmapSteps]
  },

  async getOpportunities(filters?: {
    role?: string
    location?: string
    type?: string
    remoteOnly?: boolean
  }): Promise<OpportunityItem[]> {
    let list = [...mockOpportunities]

    if (!filters) {
      return list
    }

    if (filters.remoteOnly) {
      list = list.filter(
        (item) => item.workplaceType === 'Remote'
      )
    }

    if (
      filters.location &&
      filters.location !== 'All Locations'
    ) {
      list = list.filter(
        (item) =>
          item.location.toLowerCase() ===
          filters.location!.toLowerCase()
      )
    }

    if (
      filters.type &&
      filters.type !== 'All Types'
    ) {
      list = list.filter(
        (item) =>
          item.employmentType.toLowerCase() ===
          filters.type!.toLowerCase()
      )
    }

    return list
  },

  async getChallenge(
    challengeId: string
  ): Promise<ChallengeData> {
    void challengeId
    return { ...mockChallengeData }
  },

  async submitChallenge(
    challengeId: string,
    submission: {
      responseText: string
      fileName?: string
    }
  ): Promise<ChallengeResultData> {
    void challengeId
    void submission

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...mockChallengeResult })
      }, 800)
    })
  },
}
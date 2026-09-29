import { supabase } from '../lib/supabase'

export type SaveProfileInput = {
  fullName: string
  city: string
  degree: string
  institution: string
  graduationYear: number | null
  gpa: string
  careerGoal: string
  interests: string[]
}

export const profileService = {
  async saveProfile(input: SaveProfileInput) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      throw userError
    }

    if (!user) {
      throw new Error('You must be logged in to save your profile.')
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          full_name: input.fullName,
          city: input.city,
          degree: input.degree,
          institution: input.institution,
          graduation_year: input.graduationYear,
          gpa: input.gpa,
          career_goal: input.careerGoal,
          interests: input.interests,
          preferred_language: 'English',
          onboarding_completed: true,
        },
        {
          onConflict: 'id',
        }
      )
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  },
}
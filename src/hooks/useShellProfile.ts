import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export type ShellProfile = {
    fullName: string
    email: string
    institution: string
    careerGoal: string
    readinessScore: number | null
}

type ShellProfileState = {
    profile: ShellProfile | null
    loading: boolean
    error: string
}

type ProfileRow = {
    full_name: string | null
    institution: string | null
    career_goal: string | null
}

type ReadinessRow = {
    score: number
}

export const useShellProfile = (): ShellProfileState => {
    const { user } = useAuth()

    const [profile, setProfile] = useState<ShellProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        const load = async () => {
            if (!user) {
                if (active) {
                    setProfile(null)
                    setLoading(false)
                }
                return
            }

            setLoading(true)
            setError('')

            try {
                const [
                    { data: profileRow, error: profileError },
                    { data: readinessRows, error: readinessError },
                ] = await Promise.all([
                    supabase
                        .from('profiles')
                        .select('full_name, institution, career_goal')
                        .eq('id', user.id)
                        .maybeSingle<ProfileRow>(),

                    supabase
                        .from('readiness_scores')
                        .select('score')
                        .eq('user_id', user.id)
                        .order('created_at', { ascending: false })
                        .limit(1)
                        .returns<ReadinessRow[]>(),
                ])

                if (profileError) {
                    throw new Error(
                        `Failed to load shell profile: ${profileError.message}`,
                    )
                }

                if (readinessError) {
                    throw new Error(
                        `Failed to load readiness: ${readinessError.message}`,
                    )
                }

                if (active) {
                    setProfile({
                        fullName:
                            profileRow?.full_name?.trim() || 'Student',
                        email: user.email ?? '',
                        institution:
                            profileRow?.institution?.trim() || '',
                        careerGoal:
                            profileRow?.career_goal?.trim() || '',
                        readinessScore:
                            readinessRows?.[0]?.score ?? null,
                    })
                }
            } catch (err) {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : 'Unable to load profile.',
                    )
                }
            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        void load()

        return () => {
            active = false
        }
    }, [user])

    return { profile, loading, error }
}

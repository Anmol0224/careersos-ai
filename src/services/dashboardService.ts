import { supabase } from '../lib/supabase'

export type DashboardSkill = {
    id: string
    name: string
    currentScore: number
    requiredScore: number
    gap: number
    status: 'Ready' | 'Developing' | 'Needs Work'
}

export type DashboardData = {
    profile: {
        fullName: string
        careerGoal: string
        city: string
        institution: string
        degree: string
        gpa: string
    }

    readiness: {
        currentScore: number
        previousScore: number | null
        delta: number
    }

    career: {
        title: string
        alignment: number
        coreReady: number
        coreTotal: number
    }

    skills: DashboardSkill[]

    topSkills: DashboardSkill[]

    priorityGaps: DashboardSkill[]
}

type ProfileRow = {
    full_name: string | null
    career_goal: string | null
    city: string | null
    institution: string | null
    degree: string | null
    gpa: string | null
}

type CareerRow = {
    id: string
    slug: string
    name: string
}

type CareerSkillRow = {
    skill_id: string
    required_score: number
}

type SkillRow = {
    id: string
    name: string
}

type UserSkillRow = {
    skill_id: string
    current_score: number | string
}

type ReadinessRow = {
    score: number
    created_at: string
}

const getSkillStatus = (
    currentScore: number,
    requiredScore: number,
): DashboardSkill['status'] => {
    if (currentScore >= requiredScore) {
        return 'Ready'
    }

    if (currentScore >= requiredScore * 0.8) {
        return 'Developing'
    }

    return 'Needs Work'
}

export const dashboardService = {
    async getDashboardData(userId: string): Promise<DashboardData> {
        const [
            { data: profile, error: profileError },
            { data: readinessRows, error: readinessError },
        ] = await Promise.all([
            supabase
                .from('profiles')
                .select(
                    'full_name, career_goal, city, institution, degree, gpa'
                )
                .eq('id', userId)
                .maybeSingle<ProfileRow>(),

            supabase
                .from('readiness_scores')
                .select('score, created_at')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(2)
                .returns<ReadinessRow[]>(),
        ])

        if (profileError) {
            throw new Error(
                `Failed to load profile: ${profileError.message}`,
            )
        }

        if (readinessError) {
            throw new Error(
                `Failed to load readiness history: ${readinessError.message}`,
            )
        }

        const careerGoal = profile?.career_goal?.trim() || 'Data Analyst'

        const careerSlug = careerGoal
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

        const { data: career, error: careerError } = await supabase
            .from('careers')
            .select('id, slug, name')
            .eq('slug', careerSlug)
            .maybeSingle<CareerRow>()

        if (careerError) {
            throw new Error(
                `Failed to load career: ${careerError.message}`,
            )
        }

        if (!career) {
            throw new Error(
                `Career "${careerGoal}" was not found in CareerOS.`,
            )
        }

        const {
            data: careerSkills,
            error: careerSkillsError,
        } = await supabase
            .from('career_skills')
            .select('skill_id, required_score')
            .eq('career_id', career.id)
            .returns<CareerSkillRow[]>()

        if (careerSkillsError) {
            throw new Error(
                `Failed to load career requirements: ${careerSkillsError.message}`,
            )
        }

        const skillIds = careerSkills?.map(
            (careerSkill) => careerSkill.skill_id,
        ) ?? []

        if (skillIds.length === 0) {
            throw new Error(
                `No skills are configured for ${career.name}.`,
            )
        }

        const [
            { data: skills, error: skillsError },
            { data: userSkills, error: userSkillsError },
        ] = await Promise.all([
            supabase
                .from('skills')
                .select('id, name')
                .in('id', skillIds)
                .returns<SkillRow[]>(),

            supabase
                .from('user_skills')
                .select('skill_id, current_score')
                .eq('user_id', userId)
                .in('skill_id', skillIds)
                .returns<UserSkillRow[]>(),
        ])

        if (skillsError) {
            throw new Error(
                `Failed to load skills: ${skillsError.message}`,
            )
        }

        if (userSkillsError) {
            throw new Error(
                `Failed to load your skills: ${userSkillsError.message}`,
            )
        }

        const skillNameMap = new Map(
            (skills ?? []).map((skill) => [
                skill.id,
                skill.name,
            ]),
        )

        const userScoreMap = new Map(
            (userSkills ?? []).map((skill) => [
                skill.skill_id,
                Number(skill.current_score),
            ]),
        )

        const dashboardSkills: DashboardSkill[] = (careerSkills ?? [])
            .map((careerSkill) => {
                const skillName = skillNameMap.get(
                    careerSkill.skill_id,
                )

                if (!skillName) {
                    return null
                }

                const currentScore =
                    userScoreMap.get(careerSkill.skill_id) ?? 0

                const requiredScore = Number(
                    careerSkill.required_score,
                )

                const gap = Math.max(
                    requiredScore - currentScore,
                    0,
                )

                return {
                    id: careerSkill.skill_id,
                    name: skillName,
                    currentScore,
                    requiredScore,
                    gap,
                    status: getSkillStatus(
                        currentScore,
                        requiredScore,
                    ),
                }
            })
            .filter(
                (skill): skill is DashboardSkill =>
                    skill !== null,
            )

        const coreReady = dashboardSkills.filter(
            (skill) =>
                skill.currentScore >= skill.requiredScore,
        ).length

        const coreTotal = dashboardSkills.length

        const alignment =
            coreTotal > 0
                ? Math.round(
                    (dashboardSkills.reduce(
                        (total, skill) =>
                            total +
                            Math.min(
                                skill.currentScore /
                                Math.max(skill.requiredScore, 1),
                                1,
                            ),
                        0,
                    ) /
                        coreTotal) *
                    100,
                )
                : 0

        const currentReadiness =
            readinessRows?.[0]?.score ?? alignment

        const previousReadiness =
            readinessRows?.[1]?.score ?? null

        const delta =
            previousReadiness !== null
                ? currentReadiness - previousReadiness
                : 0

        const topSkills = [...dashboardSkills]
            .sort(
                (a, b) =>
                    b.currentScore - a.currentScore,
            )
            .slice(0, 3)

        const priorityGaps = [...dashboardSkills]
            .filter((skill) => skill.gap > 0)
            .sort(
                (a, b) => b.gap - a.gap,
            )
            .slice(0, 3)

        return {
            profile: {
                fullName:
                    profile?.full_name?.trim() ||
                    'Student',
                careerGoal: career.name,
                city:
                    profile?.city?.trim() || '',
                institution:
                    profile?.institution?.trim() || '',
                degree:
                    profile?.degree?.trim() || '',
                gpa:
                    profile?.gpa?.trim() || '',
            },

            readiness: {
                currentScore: currentReadiness,
                previousScore: previousReadiness,
                delta,
            },

            career: {
                title: career.name,
                alignment,
                coreReady,
                coreTotal,
            },

            skills: dashboardSkills,
            topSkills,
            priorityGaps,
        }
    },
}
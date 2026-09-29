import { supabase } from '../lib/supabase'
import { readinessService } from './readinessService'

export type DashboardSkill = {
    id: string
    name: string
    currentScore: number
    requiredScore: number
    gap: number
    status: 'Ready' | 'Developing' | 'Needs Work' | 'Not Assessed'
    isUnassessed: boolean
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
        hasAssessedSkills: boolean
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
    source: string | null
    evidence_notes: string | null
    last_assessed_at: string | null
    evidence_status: string
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
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, career_goal, city, institution, degree, gpa')
            .eq('id', userId)
            .maybeSingle<ProfileRow>()

        if (profileError) {
            throw new Error(
                `Failed to load profile: ${profileError.message}`,
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
        const { data: existingUserSkills, error: existingUserSkillsError } =
            await supabase
                .from('user_skills')
                .select('skill_id')
                .eq('user_id', userId)
                .in('skill_id', skillIds)

        if (existingUserSkillsError) {
            throw new Error(
                `Failed to check your skill records: ${existingUserSkillsError.message}`,
            )
        }

        const existingSkillIds = new Set(
            (existingUserSkills ?? []).map((skill) => skill.skill_id),
        )

        const missingSkillIds = skillIds.filter(
            (skillId) => !existingSkillIds.has(skillId),
        )

        if (missingSkillIds.length > 0) {
            const newSkillRecords = missingSkillIds.map((skillId) => ({
                user_id: userId,
                skill_id: skillId,
                current_score: 0,
                evidence_status: 'needs_work',
                source: 'onboarding',
            }))

            const { error: insertSkillsError } = await supabase
                .from('user_skills')
                .insert(newSkillRecords)

            if (insertSkillsError) {
                throw new Error(
                    `Failed to initialize your skill records: ${insertSkillsError.message}`,
                )
            }
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
                .select('skill_id, current_score, source, evidence_notes, last_assessed_at, evidence_status')
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

        const userSkillMap = new Map(
            (userSkills ?? []).map((skill) => [
                skill.skill_id,
                skill,
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

                const userSkill = userSkillMap.get(careerSkill.skill_id)
                const isUnassessed = !userSkill || (
                    userSkill.source === 'onboarding' &&
                    Number(userSkill.current_score) === 0 &&
                    !userSkill.last_assessed_at &&
                    !userSkill.evidence_notes
                )

                const currentScore = userSkill ? Number(userSkill.current_score) : 0
                const requiredScore = Number(careerSkill.required_score)
                const gap = Math.max(requiredScore - currentScore, 0)

                const status = isUnassessed ? 'Not Assessed' : getSkillStatus(currentScore, requiredScore)

                return {
                    id: careerSkill.skill_id,
                    name: skillName,
                    currentScore,
                    requiredScore,
                    gap,
                    status,
                    isUnassessed
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

        const readinessResult = await readinessService.calculateAndSaveReadiness(userId)

        const alignment = readinessResult.components.roleSkills.score !== null
            ? Math.round(readinessResult.components.roleSkills.score)
            : 0



        const topSkills = [...dashboardSkills]
            .filter((skill) => !skill.isUnassessed)
            .sort((a, b) => b.currentScore - a.currentScore)
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
                currentScore: readinessResult.score,
                previousScore: readinessResult.previousScore,
                delta: readinessResult.delta,
                hasAssessedSkills: dashboardSkills.some(s => !s.isUnassessed)
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
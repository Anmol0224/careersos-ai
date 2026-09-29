import { supabase } from '../lib/supabase';

// ─── Interfaces ─────────────────────────────────────────────────────────────

type UserSkillRow = {
  skill_id: string;
  current_score: number | string;
  evidence_status: string;
  source?: string | null;
  evidence_notes?: string | null;
  last_assessed_at?: string | null;
};

type CareerSkillRow = {
  skill_id: string;
  required_score: number;
};

export type ReadinessComponent = {
  score: number | null;
  weight: number;
  available: boolean;
};

export type ReadinessResult = {
  score: number;
  previousScore: number | null;
  delta: number;
  confidence: number;
  components: {
    roleSkills: ReadinessComponent;
    practicalEvidence: ReadinessComponent;
    assessment: ReadinessComponent;
    communication: ReadinessComponent;
    portfolio: ReadinessComponent;
    interview: ReadinessComponent;
  };
  missingComponents: string[];
  explanation: string;
};

// ─── Service ────────────────────────────────────────────────────────────────

export const readinessService = {
  /**
   * PURE FUNCTION: Deterministically calculates overall readiness.
   * No side-effects, fully reproducible.
   */
  calculateReadiness(
    _targetCareer: string,
    userSkills: UserSkillRow[],
    careerSkills: CareerSkillRow[]
  ): ReadinessResult {
    // 1. Role Skills Calculation
    const roleSkillsWeight = 0.35;
    
    let totalAchievementRatio = 0;
    let assessedSkillsCount = 0;
    const requiredSkillsCount = careerSkills.length;
    
    if (requiredSkillsCount > 0) {
      careerSkills.forEach((cs) => {
        const userSkill = userSkills.find((s) => s.skill_id === cs.skill_id);
        
        // UNASSESSED RULE: Source is onboarding, score is 0, and no actual assessment/evidence exists.
        const isUnassessed = !userSkill || (
          userSkill.source === 'onboarding' &&
          Number(userSkill.current_score) === 0 &&
          !userSkill.last_assessed_at &&
          !userSkill.evidence_notes
        );

        if (!isUnassessed) {
          const currentScore = Number(userSkill.current_score);
          const requiredScore = Number(cs.required_score);
          const achievementRatio = Math.min(currentScore / Math.max(requiredScore, 1), 1);
          totalAchievementRatio += achievementRatio;
          assessedSkillsCount++;
        }
      });
    }
    
    const roleSkillsAvailable = assessedSkillsCount > 0;
    const roleSkillsScore = roleSkillsAvailable 
      ? (totalAchievementRatio / assessedSkillsCount) * 100 
      : null;
    
    // Define component statuses (currently only Role Skills has real evidence initialized)
    const components = {
      roleSkills: {
        score: roleSkillsScore,
        weight: roleSkillsWeight,
        available: roleSkillsAvailable
      },
      practicalEvidence: { score: null, weight: 0.20, available: false },
      assessment: { score: null, weight: 0.15, available: false },
      communication: { score: null, weight: 0.10, available: false },
      portfolio: { score: null, weight: 0.10, available: false },
      interview: { score: null, weight: 0.10, available: false }
    };
    
    const missingComponents = [
      'practicalEvidence', 
      'assessment', 
      'communication', 
      'portfolio', 
      'interview'
    ];
    
    // 2. Overall Readiness Calculation
    // For now, if Role Skills is the only available component, its score drives the overall score.
    const overallScore = roleSkillsAvailable ? Math.round(roleSkillsScore!) : 0;
    
    // 3. Confidence Calculation
    // Confidence reflects data/evidence coverage.
    // We only calculate confidence for the portions actually assessed.
    const roleSkillsCoverage = requiredSkillsCount > 0 
      ? assessedSkillsCount / requiredSkillsCount 
      : 0;
      
    const confidence = Math.round(roleSkillsWeight * roleSkillsCoverage * 100);
    
    let explanation = "Readiness is currently based primarily on role-skill alignment because assessment, challenge, portfolio and interview evidence are not yet available.";
    if (!roleSkillsAvailable) {
      explanation = "Readiness is 0 because no actual assessment data or evidence is available yet.";
    } else if (roleSkillsCoverage < 1) {
      explanation = `Readiness is based on partial role-skill evidence (${assessedSkillsCount} of ${requiredSkillsCount} required skills assessed). Other components are not yet available.`;
    }

    return {
      score: overallScore,
      confidence,
      components,
      missingComponents,
      explanation,
      previousScore: null,
      delta: 0
    };
  },

  /**
   * Orchestrates fetching data, calculating readiness, and persisting history.
   * Prevents uncontrolled duplicate snapshots via equality check.
   */
  async calculateAndSaveReadiness(userId: string): Promise<ReadinessResult> {
    // 1. Fetch user's target career
    const { data: profile } = await supabase
      .from('profiles')
      .select('career_goal')
      .eq('id', userId)
      .single();
      
    const careerGoal = profile?.career_goal?.trim() || 'Data Analyst';
    const careerSlug = careerGoal.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    
    const { data: career } = await supabase
      .from('careers')
      .select('id')
      .eq('slug', careerSlug)
      .single();
      
    if (!career) {
       throw new Error(`Career configuration not found for: ${careerGoal}`);
    }
    
    const careerId = career.id;

    // 2. Fetch career requirements and user skills
    const [
      { data: careerSkills },
      { data: userSkills }
    ] = await Promise.all([
      supabase.from('career_skills').select('skill_id, required_score').eq('career_id', careerId),
      supabase.from('user_skills').select('skill_id, current_score, evidence_status, source, evidence_notes, last_assessed_at').eq('user_id', userId)
    ]);
    
    // 3. Perform Pure Calculation
    const result = this.calculateReadiness(
      careerGoal, 
      userSkills || [], 
      careerSkills || []
    );

    // 4. Fetch the latest persisted readiness row
    const { data: latestRows } = await supabase
      .from('readiness_scores')
      .select('score, calculation_details')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
      
    const latestRow = latestRows?.[0] || null;

    // 5. Compare state to prevent duplicate identical snapshots using deterministic signature
    const currentSignatureObj = {
      formulaVersion: "1.1",
      targetCareer: careerGoal,
      confidence: result.confidence,
      components: result.components,
      missingComponents: result.missingComponents
    };
    const currentSignature = JSON.stringify(currentSignatureObj);

    let isStateChanged = true;
    if (latestRow && latestRow.score === result.score) {
      const prevDetails = latestRow.calculation_details;
      if (prevDetails) {
        const prevSignatureObj = {
          formulaVersion: prevDetails.formulaVersion || "1.0",
          targetCareer: prevDetails.targetCareer,
          confidence: prevDetails.confidence,
          components: prevDetails.components,
          missingComponents: prevDetails.missingComponents
        };
        if (JSON.stringify(prevSignatureObj) === currentSignature) {
          isStateChanged = false;
        }
      }
    }

    const previousScore = latestRow ? latestRow.score : null;
    const scoreChange = latestRow ? result.score - latestRow.score : null; 

    if (isStateChanged) {
      const insertData = {
        user_id: userId,
        career_id: careerId,
        score: result.score,
        previous_score: previousScore,
        score_change: scoreChange,
        reason: result.explanation,
        calculation_details: {
          ...currentSignatureObj,
          timestamp: new Date().toISOString()
        }
      };

      const { error: insertError } = await supabase
        .from('readiness_scores')
        .insert([insertData]);
        
      if (insertError) {
        console.error("Failed to persist readiness score:", insertError.message);
      }
    }
    
    return {
      ...result,
      previousScore,
      delta: scoreChange || 0
    };
  }
};

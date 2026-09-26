/**
 * AI Service: Clean abstraction for AI career advisor & resume intelligence.
 * Ready for easy future integration with Google Gemini API.
 */

export interface AIAnalysisResult {
  readinessScore: number;
  extractedSkills: string[];
  summary: string;
  recommendedCareer: string;
  immediateAction: string;
}

export interface AIChatResponse {
  answer: string;
  suggestedAction?: {
    label: string;
    route: string;
  };
}

export const aiService = {
  /**
   * Analyzes an uploaded resume mock, returning structured feedback
   */
  analyzeResumeMock: async (file?: File | { name: string; size: number }): Promise<AIAnalysisResult> => {
    void file;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          readinessScore: 82,
          extractedSkills: ['SQL', 'Python', 'Excel', 'Problem Solving', 'Data Modeling'],
          summary: 'Solid analytical foundation with strong querying and scripting background. Main growth leverage point is business intelligence dashboarding and executive stakeholder communication.',
          recommendedCareer: 'Data Analyst',
          immediateAction: 'Complete Power BI Sales Dashboard Challenge',
        });
      }, 1200);
    });
  },

  /**
   * Quick advice and recommendations from CareerOS AI
   */
  askCareerOS: async (question: string): Promise<AIChatResponse> => {
    const q = question.toLowerCase();

    return new Promise((resolve) => {
      setTimeout(() => {
        if (q.includes('power bi') || q.includes('gap')) {
          resolve({
            answer: 'Your largest career delta is in Power BI (41/100 vs. 75 target). Completing the Sales Dashboard challenge will boost your practical DAX modeling skills and increase your readiness by ~7 points.',
            suggestedAction: {
              label: 'Open Power BI Challenge',
              route: '/challenge',
            },
          });
        } else if (q.includes('job') || q.includes('opportunity') || q.includes('apply')) {
          resolve({
            answer: 'You currently have an 87% match with the Junior Data Analyst Intern role at Apex Data Labs in Indore. Closing the Power BI gap will make you a top-tier 94% match candidate.',
            suggestedAction: {
              label: 'View Matched Opportunities',
              route: '/opportunities',
            },
          });
        } else if (q.includes('roadmap') || q.includes('next')) {
          resolve({
            answer: 'Your next best action is Step 3 of your Roadmap: "Sales Dashboard Prototyping" followed by the proof challenge.',
            suggestedAction: {
              label: 'Go to Roadmap',
              route: '/roadmap',
            },
          });
        } else {
          resolve({
            answer: 'Based on your current profile, you are in the top 15% for SQL and Python among entry-level data analyst candidates. Focus on tangible proof projects to showcase end-to-end data pipelines.',
            suggestedAction: {
              label: 'View Skill Breakdown',
              route: '/career',
            },
          });
        }
      }, 600);
    });
  },
};

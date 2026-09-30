import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Missing authorization token' });
  }

  const { submissionId, challengeData } = req.body;
  if (!submissionId || !challengeData) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  // Initialize Supabase admin or user client
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).json({ success: false, error: 'Server misconfiguration: Supabase' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

  try {
    // 1. Verify user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // 2. Fetch submission to verify ownership and get text
    const { data: submission, error: subError } = await supabase
      .from('challenge_submissions')
      .select('*')
      .eq('id', submissionId)
      .eq('user_id', user.id)
      .single();

    if (subError || !submission) {
      return res.status(404).json({ success: false, error: 'Submission not found' });
    }

    // 3. Update status to evaluating
    await supabase
      .from('challenge_submissions')
      .update({ status: 'evaluating' })
      .eq('id', submissionId);

    // 4. Initialize Gemini
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      throw new Error('Missing GEMINI_API_KEY');
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey });

    // 5. Construct prompt and schema
    const rubricText = challengeData.rubric.map((r: Record<string, unknown>) => `- ${r.category} (Weight: ${r.weight}%): ${r.description}`).join('\n');
    
    const prompt = `You are an expert career evaluator. Evaluate the student's submission against the challenge mission and rubric.

Challenge Title: ${challengeData.title}
Target Skill: ${challengeData.skill}
Mission: ${challengeData.mission}

Rubric:
${rubricText}

Student Submission:
${submission.text_response}

Instructions:
1. Evaluate the submission ONLY against the rubric criteria.
2. Do not invent facts or criteria.
3. Be objective. Distinguish missing evidence from poor execution.
4. Give concise, actionable feedback.
5. Score each criterion between 0 and 100.
6. The criteria names in your response MUST match the names provided in the rubric.
`;

    // 6. Call Gemini structured output
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            criteria: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  name: { type: 'STRING' },
                  score: { type: 'NUMBER' },
                  weight: { type: 'NUMBER' },
                  feedback: { type: 'STRING' }
                },
                required: ['name', 'score', 'weight', 'feedback']
              }
            },
            strengths: { type: 'ARRAY', items: { type: 'STRING' } },
            improvements: { type: 'ARRAY', items: { type: 'STRING' } },
            summary: { type: 'STRING' }
          },
          required: ['criteria', 'strengths', 'improvements', 'summary']
        }
      }
    });

    const resultText = response.text || '{}';
    let evaluationData;
    try {
      evaluationData = JSON.parse(resultText);
    } catch (e) {
      const parseError = new Error('Failed to parse Gemini JSON output');
      parseError.cause = e;
      throw parseError;
    }

    // 7. Validate and calculate overall score deterministically
    let overallScore = 0;
    const validatedCriteria = [];
    
    for (const item of challengeData.rubric) {
      const evalCriterion = evaluationData.criteria?.find((c: Record<string, unknown>) => c.name === item.category);
      let score = 0;
      let feedback = 'Criterion not addressed.';
      
      if (evalCriterion) {
        score = Math.min(100, Math.max(0, Number(evalCriterion.score) || 0));
        feedback = evalCriterion.feedback;
      }
      
      const weight = item.weight || 0;
      overallScore += (score / 100) * weight;
      
      validatedCriteria.push({
        name: item.category,
        score,
        weight,
        feedback
      });
    }

    const finalOverallScore = Math.min(100, Math.max(0, Math.round(overallScore)));

    const finalEvaluation = {
      overallScore: finalOverallScore,
      criteria: validatedCriteria,
      strengths: evaluationData.strengths || [],
      improvements: evaluationData.improvements || [],
      summary: evaluationData.summary || 'Evaluation complete.'
    };

    // 8. Update DB
    await supabase
      .from('challenge_submissions')
      .update({
        status: 'evaluated',
        ai_score: finalOverallScore,
        evaluation: finalEvaluation, // Stored as JSONB
        feedback: finalEvaluation.summary,
        evaluated_at: new Date().toISOString()
      })
      .eq('id', submissionId);

    return res.status(200).json({ success: true, evaluation: finalEvaluation });

  } catch (err: unknown) {
    console.error('Evaluation Error:', err);
    // Mark as failed if possible
    await supabase
      .from('challenge_submissions')
      .update({ status: 'evaluation_failed' })
      .eq('id', submissionId);
      
    const errorMessage = err instanceof Error ? err.message : 'Evaluation failed';
    return res.status(500).json({ success: false, error: errorMessage });
  }
}

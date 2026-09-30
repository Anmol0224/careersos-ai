import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  Clock,
  BarChart3,
  Zap,
  UploadCloud,
  FileCheck,
  Table,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import type { ChallengeData } from '../../data/mockData';
import { useNavigate } from 'react-router-dom';
import { careerService } from '../../services/careerService';
import { supabase } from '../../lib/supabase';

export interface ChallengeWorkspaceProps {
  challenge: ChallengeData;
  existingSubmission?: Record<string, unknown> | null;
}

export const ChallengeWorkspace: React.FC<ChallengeWorkspaceProps> = ({ challenge, existingSubmission }) => {
  const navigate = useNavigate();
  const isSubmitted = !!existingSubmission;
  const status = (existingSubmission?.status as string) || 'unsubmitted';
  const evaluation = existingSubmission?.evaluation as Record<string, unknown> | undefined;
  const aiScore = existingSubmission?.ai_score as number;

  const [responseText, setResponseText] = useState(
    (existingSubmission?.text_response as string) || ''
  );
  const [uploadedFile, setUploadedFile] = useState<string | null>(
    (existingSubmission?.file_name as string) || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      await careerService.submitChallenge(user.id, challenge.id, responseText, uploadedFile || undefined);
      // Reload to show submitted state
      window.location.reload();
    } catch (err) {
      console.error('Failed to submit:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isEvaluating, setIsEvaluating] = useState(status === 'evaluating');
  const [evalError, setEvalError] = useState<string | null>(null);

  const handleEvaluate = async () => {
    if (!existingSubmission?.id) return;
    setIsEvaluating(true);
    setEvalError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await fetch('/api/evaluate-challenge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          submissionId: existingSubmission.id,
          challengeData: challenge
        })
      });

      let responseText = '';
      try {
        responseText = await res.text();
      } catch {
        // ignore
      }

      let data: Record<string, unknown> | null = null;
      try {
        if (responseText) data = JSON.parse(responseText);
      } catch {
        // ignore
      }

      if (!res.ok || (data && data.success === false)) {
        throw new Error((data?.error as string) || `Server error (${res.status})`);
      }

      window.location.reload();
    } catch (err) {
      console.error('Failed to evaluate:', err);
      const errorMessage = err instanceof Error ? err.message : 'Evaluation failed. Please try again.';
      setEvalError(errorMessage);
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Challenge Hero Header */}
      <Card className="bg-gradient-to-r from-[#14213D] to-[#1E3A8A] text-white border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Target Skill: {challenge.skill}
                </span>
                <span className="text-xs font-medium text-slate-300 flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded">
                  <Clock className="w-3.5 h-3.5 text-blue-300" />
                  {challenge.duration}
                </span>
                <span className="text-xs font-medium text-slate-300 flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded">
                  <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
                  {challenge.difficulty}
                </span>
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 rounded">
                  <Zap className="w-3.5 h-3.5" />
                  {challenge.impact}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {challenge.title}
              </h2>
              <p className="text-sm text-slate-200 max-w-2xl">
                Demonstrate real-world proficiency in {challenge.skill} to prove your competency to employers.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Mission, Dataset & Submission Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mission Card */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span>Challenge Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-xl text-sm text-[#0F172A] font-medium leading-relaxed">
                {challenge.mission}
              </div>

              {/* Dataset Sample Preview — only show when challenge uses a tabular dataset */}
              {challenge.datasetSample && challenge.datasetSample.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#475569] uppercase tracking-wider flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5 text-[#2563EB]" />
                      Sample Dataset
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-50 text-[#475569] border-b border-[#E2E8F0]">
                        <tr>
                          <th className="py-2 px-3">Order ID</th>
                          <th className="py-2 px-3">Product</th>
                          <th className="py-2 px-3">Region</th>
                          <th className="py-2 px-3 text-right">Sales</th>
                          <th className="py-2 px-3 text-right">Profit</th>
                          <th className="py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
                        {challenge.datasetSample.map((row) => (
                          <tr key={row.orderId} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-mono font-medium">{row.orderId}</td>
                            <td className="py-2 px-3">{row.product}</td>
                            <td className="py-2 px-3">{row.region}</td>
                            <td className="py-2 px-3 text-right font-medium">${row.sales.toLocaleString()}</td>
                            <td className={`py-2 px-3 text-right font-medium ${row.profit < 0 ? 'text-red-600' : 'text-emerald-700'}`}>
                              ${row.profit.toLocaleString()}
                            </td>
                            <td className="py-2 px-3">
                              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] text-slate-700">
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="bg-white relative overflow-hidden">
              {isSubmitted && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-[2px] z-10 flex flex-col p-6 overflow-y-auto">
                  {status === 'evaluated' && evaluation ? (
                    <div className="max-w-2xl mx-auto w-full space-y-6 pb-8">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">Evaluation Complete</h3>
                            <p className="text-sm text-slate-500">Your submission has been reviewed.</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black text-blue-600">{aiScore}/100</div>
                          <div className="text-xs font-bold uppercase text-slate-400">Overall Score</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                          <h4 className="font-bold text-slate-800 mb-2">Summary</h4>
                          <p className="text-sm text-slate-600 leading-relaxed">{String(evaluation.summary || '')}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                            <h4 className="font-bold text-emerald-800 mb-2">Strengths</h4>
                            <ul className="list-disc list-inside text-sm text-emerald-700 space-y-1">
                              {Array.isArray(evaluation.strengths) && evaluation.strengths.map((s: unknown, i: number) => <li key={i}>{String(s)}</li>)}
                            </ul>
                          </div>
                          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                            <h4 className="font-bold text-amber-800 mb-2">Areas for Improvement</h4>
                            <ul className="list-disc list-inside text-sm text-amber-700 space-y-1">
                              {Array.isArray(evaluation.improvements) && evaluation.improvements.map((s: unknown, i: number) => <li key={i}>{String(s)}</li>)}
                            </ul>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-slate-800 mb-3">Rubric Breakdown</h4>
                          <div className="space-y-3">
                            {Array.isArray(evaluation.criteria) && evaluation.criteria.map((c: Record<string, unknown>, i: number) => (
                              <div key={i} className="bg-white p-3 border border-slate-200 rounded-lg flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-semibold text-sm text-slate-800">{String(c.name || '')}</div>
                                  <div className="text-xs text-slate-500 mt-1">{String(c.feedback || '')}</div>
                                </div>
                                <div className="text-right sm:text-center min-w-[60px]">
                                  <div className="font-bold text-slate-700">{Number(c.score || 0)}/100</div>
                                  <div className="text-[10px] text-slate-400 font-medium uppercase">Score</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button variant="outline" onClick={() => navigate('/roadmap')} className="w-full">
                        Return to Roadmap
                      </Button>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        {isEvaluating ? <Sparkles className="w-6 h-6 animate-pulse" /> : <FileCheck className="w-6 h-6" />}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {isEvaluating ? 'Evaluating Submission...' : 'Submission Received'}
                      </h3>
                      <p className="text-sm text-slate-500 mb-6">
                        {isEvaluating
                          ? 'CareerOS AI is currently reviewing your work against the rubric. This usually takes about 10 seconds.'
                          : 'Your proof submission has been recorded. Run the AI evaluation to receive your score and feedback.'}
                      </p>
                      {evalError && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-3 mb-4 w-full">
                          {evalError}
                        </div>
                      )}
                      {!isEvaluating && status !== 'evaluated' && (
                        <Button variant="primary" onClick={handleEvaluate} className="w-full mb-3" leftIcon={<Sparkles className="w-4 h-4"/>}>
                          Evaluate with CareerOS AI
                        </Button>
                      )}
                      
                      <Button variant="outline" onClick={() => navigate('/roadmap')} className="w-full" disabled={isEvaluating}>
                        Return to Roadmap
                      </Button>
                    </div>
                  )}
                </div>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Your Proof Submission</CardTitle>
                <p className="text-xs text-[#475569]">
                  Input your response to the challenge mission
                </p>
              </CardHeader>
              <CardContent className="space-y-5 pt-2">
                {/* Text Response Area */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                    Your Response
                  </label>
                  <textarea
                    rows={6}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    required
                    disabled={isSubmitted}
                    placeholder="Describe your approach, key decisions, and findings..."
                    className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-3.5 text-sm text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] leading-relaxed disabled:opacity-75"
                  />
                </div>

                {/* Upload Area */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                    Supporting File (optional — .pdf, .py, .ipynb, .pbix, screenshot)
                  </label>
                  <div
                    onClick={() => !isSubmitted && setUploadedFile('sales_analyst_dashboard_submission_v2.pbix')}
                    className={`border-2 border-dashed border-[#E2E8F0] rounded-xl p-6 text-center transition-all ${!isSubmitted ? 'hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 cursor-pointer' : 'bg-slate-50 opacity-75'}`}
                  >
                    <UploadCloud className={`w-8 h-8 mx-auto mb-2 ${isSubmitted ? 'text-slate-400' : 'text-[#2563EB]'}`} />
                    <p className="text-sm font-semibold text-[#0F172A]">
                      {uploadedFile ? uploadedFile : 'Drag and drop your file here, or click to browse'}
                    </p>
                    <p className="text-xs text-[#94A3B8] mt-1">
                      Power BI (.pbix), Tableau workbook, Excel, or PDF report (Max 25MB)
                    </p>
                    {uploadedFile && (
                      <div className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mock file attached: 3.4 MB</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                {!isSubmitted && (
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-[#94A3B8]">
                      Evaluates against objective rubric criteria
                    </span>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isSubmitting}
                      leftIcon={<FileCheck className="w-4 h-4" />}
                    >
                      Submit Challenge
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Right 1 Col: Evaluation Rubric Card */}
        <div className="space-y-6">
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-4 h-4 text-[#2563EB]" />
                <span>Evaluation Rubric</span>
              </CardTitle>
              <p className="text-xs text-[#475569]">How your proof submission is objectively scored</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {challenge.rubric.map((item) => (
                <div key={item.category} className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F172A]">{item.category}</span>
                    <span className="text-xs font-extrabold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {item.weight}%
                    </span>
                  </div>
                  <p className="text-[11px] text-[#475569] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tips Box */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Pro Tip for High Score</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Don't just describe numbers. Explain the business "so what" — what decision should a CEO or Sales VP make based on your findings?
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

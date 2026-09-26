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
import { careerService } from '../../services/career';

export interface ChallengeWorkspaceProps {
  challenge: ChallengeData;
}

export const ChallengeWorkspace: React.FC<ChallengeWorkspaceProps> = ({ challenge }) => {
  const navigate = useNavigate();
  const [responseText, setResponseText] = useState(
    `1. APAC Regional Margin Compression: While APAC sales reached $1,250, profit was constrained to 32% due to freight and tier-2 vendor surcharges.\n2. Cloud ERP License Growth: Enterprise Analytics and Cloud ERP licenses account for 74% of total profit with a 47% net margin.\n3. Latin America Support Loss: Latin America support contracts show negative margins (-$120) due to unbudgeted SLA refunds.`
  );
  const [uploadedFile, setUploadedFile] = useState<string | null>('retail_sales_executive_dashboard.pbix');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim()) return;

    setIsSubmitting(true);
    await careerService.submitChallenge(challenge.id, {
      responseText,
      fileName: uploadedFile || undefined,
    });
    setIsSubmitting(false);
    navigate('/result');
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
                Demonstrate real-world dashboarding proficiency to prove your Power BI competency to employers.
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
                "{challenge.mission}"
              </div>

              {/* Dataset Sample Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#475569] uppercase tracking-wider flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-[#2563EB]" />
                    Dataset Preview (sales_data_q1.csv)
                  </span>
                  <span className="text-xs text-[#2563EB] font-semibold cursor-pointer hover:underline">
                    Download Raw CSV
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
            </CardContent>
          </Card>

          {/* Submission Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Your Proof Submission</CardTitle>
                <p className="text-xs text-[#475569]">
                  Input your extracted business insights and upload your dashboard file
                </p>
              </CardHeader>
              <CardContent className="space-y-5 pt-2">
                {/* Text Response Area */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                    Executive Insights & Methodology (3 required)
                  </label>
                  <textarea
                    rows={6}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    required
                    placeholder="1. Key finding regarding profit margins across regions...&#10;2. Product line concentration...&#10;3. Recommended business action..."
                    className="w-full bg-slate-50 border border-[#E2E8F0] rounded-xl p-3.5 text-sm text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] leading-relaxed"
                  />
                </div>

                {/* Upload Area */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-2">
                    Dashboard File or Export (.pbix, .pdf, or screenshot)
                  </label>
                  <div
                    onClick={() => setUploadedFile('sales_analyst_dashboard_submission_v2.pbix')}
                    className="border-2 border-dashed border-[#E2E8F0] hover:border-blue-400 rounded-xl p-6 text-center bg-slate-50/50 hover:bg-blue-50/20 transition-all cursor-pointer"
                  >
                    <UploadCloud className="w-8 h-8 mx-auto text-[#2563EB] mb-2" />
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
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-[#94A3B8]">
                    Evaluates against 5 objective rubric criteria
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

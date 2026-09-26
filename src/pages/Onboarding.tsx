import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  User,
  Heart,
  FileText,
} from 'lucide-react';
import { aiService } from '../services/ai';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Form State
  const [aboutData, setAboutData] = useState({
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    location: 'Indore, MP',
  });

  const [educationData, setEducationData] = useState({
    degree: 'B.Tech in Computer Science',
    institution: 'Medicaps University',
    gradYear: '2026',
    gpa: '8.4 / 10',
  });

  const [careerGoal, setCareerGoal] = useState('Data Analyst');

  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'SQL Databases',
    'Python & Pandas',
    'Business Dashboards',
  ]);

  const [resumeUploaded, setResumeUploaded] = useState(false);
  const resumeFileName = 'Rahul_Sharma_Resume.pdf';

  const careerOptions = [
    { title: 'Data Analyst', desc: 'Transform complex business datasets into actionable decisions.' },
    { title: 'Software Engineer', desc: 'Architect resilient backend services and frontends.' },
    { title: 'Product Manager', desc: 'Define product telemetry, roadmaps, and feature execution.' },
    { title: 'Machine Learning Engineer', desc: 'Deploy neural models and data pipelines.' },
  ];

  const interestOptions = [
    'SQL Databases',
    'Python & Pandas',
    'Business Dashboards',
    'Statistics & Probability',
    'Cloud Computing',
    'Data Warehousing',
    'Data Storytelling',
    'Predictive Modeling',
  ];

  const toggleInterest = (item: string) => {
    if (selectedInterests.includes(item)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== item));
    } else {
      setSelectedInterests([...selectedInterests, item]);
    }
  };

  const handleAnalyzeResume = async () => {
    setIsAnalyzing(true);
    await aiService.analyzeResumeMock({ name: resumeFileName, size: 240000 });
    setIsAnalyzing(false);
    navigate('/dashboard');
  };

  const stepTitles = [
    { number: 1, label: 'About You', icon: User },
    { number: 2, label: 'Education', icon: GraduationCap },
    { number: 3, label: 'Career Goal', icon: Briefcase },
    { number: 4, label: 'Interests', icon: Heart },
    { number: 5, label: 'Resume', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full pt-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#14213D] text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-bold text-base text-[#14213D]">CareerOS AI Setup</span>
          </div>
          <span className="text-xs font-semibold text-[#475569]">
            Step {step} of 5
          </span>
        </div>

        {/* Step Progress Pills */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {stepTitles.map((s) => {
            const isDone = s.number < step;
            const isCurrent = s.number === step;
            return (
              <div
                key={s.number}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-[#16A34A]'
                    : isCurrent
                    ? 'bg-[#2563EB]'
                    : 'bg-slate-200'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Main Step Card Form */}
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* STEP 1: About You */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">About You</h2>
                  <p className="text-sm text-[#475569] mt-1">
                    Let's personalize your career readiness baseline.
                  </p>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={aboutData.fullName}
                    onChange={(e) => setAboutData({ ...aboutData, fullName: e.target.value })}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={aboutData.email}
                    onChange={(e) => setAboutData({ ...aboutData, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Current City / Location"
                    value={aboutData.location}
                    onChange={(e) => setAboutData({ ...aboutData, location: e.target.value })}
                    placeholder="e.g. Indore, Madhya Pradesh"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Education */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">Education Background</h2>
                  <p className="text-sm text-[#475569] mt-1">
                    Your academic foundation helps calibrate target entry-level criteria.
                  </p>
                </div>
                <div className="space-y-4">
                  <Input
                    label="Current Degree / Field of Study"
                    value={educationData.degree}
                    onChange={(e) => setEducationData({ ...educationData, degree: e.target.value })}
                    required
                  />
                  <Input
                    label="College / University"
                    value={educationData.institution}
                    onChange={(e) => setEducationData({ ...educationData, institution: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Graduation Year"
                      value={educationData.gradYear}
                      onChange={(e) => setEducationData({ ...educationData, gradYear: e.target.value })}
                    />
                    <Input
                      label="GPA / Percentage"
                      value={educationData.gpa}
                      onChange={(e) => setEducationData({ ...educationData, gpa: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Career Goal */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">Select Target Career</h2>
                  <p className="text-sm text-[#475569] mt-1">
                    Choose the role you want to benchmark and prepare for.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {careerOptions.map((opt) => (
                    <div
                      key={opt.title}
                      onClick={() => setCareerGoal(opt.title)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        careerGoal === opt.title
                          ? 'border-[#2563EB] bg-[#EFF6FF]'
                          : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-[#0F172A]">{opt.title}</span>
                        {careerGoal === opt.title && (
                          <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                        )}
                      </div>
                      <p className="text-xs text-[#475569]">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: Interests */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">Core Areas of Interest</h2>
                  <p className="text-sm text-[#475569] mt-1">
                    Select competencies you currently possess or want to prioritize in your roadmap.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {interestOptions.map((item) => {
                    const isSelected = selectedInterests.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#14213D] text-white border-[#14213D]'
                            : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-slate-300'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: Resume */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">Upload & Analyze Resume</h2>
                  <p className="text-sm text-[#475569] mt-1">
                    CareerOS AI automatically extracts your initial evidence to compute your baseline readiness score.
                  </p>
                </div>

                {/* Upload Box */}
                <div
                  onClick={() => setResumeUploaded(true)}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    resumeUploaded
                      ? 'border-emerald-400 bg-emerald-50/40'
                      : 'border-[#E2E8F0] hover:border-blue-400 bg-slate-50/50'
                  }`}
                >
                  {resumeUploaded ? (
                    <div className="space-y-2">
                      <FileCheck className="w-10 h-10 mx-auto text-emerald-600" />
                      <div className="font-bold text-sm text-[#0F172A]">{resumeFileName}</div>
                      <p className="text-xs text-emerald-700">
                        Resume uploaded successfully (240 KB). Ready for AI analysis.
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeUploaded(false);
                        }}
                        className="text-xs text-[#DC2626] hover:underline"
                      >
                        Remove and re-upload
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <UploadCloud className="w-10 h-10 mx-auto text-[#2563EB]" />
                      <div className="font-bold text-sm text-[#0F172A]">
                        Click to upload your resume
                      </div>
                      <p className="text-xs text-[#94A3B8]">
                        PDF or DOCX up to 10MB (Click here to simulate upload)
                      </p>
                    </div>
                  )}
                </div>

                {/* Information Box */}
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#0F172A] leading-relaxed">
                    Our AI readiness engine will cross-reference your coursework and technical projects with live hiring demand for <strong>{careerGoal}</strong> roles.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => setStep(step - 1)}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
              ) : (
                <div />
              )}

              {step < 5 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => setStep(step + 1)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="navy"
                  size="lg"
                  disabled={!resumeUploaded}
                  isLoading={isAnalyzing}
                  onClick={handleAnalyzeResume}
                  rightIcon={<Sparkles className="w-4 h-4" />}
                >
                  Analyze Resume & Launch
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-[#94A3B8]">
        CareerOS AI · Hackathon Prototype Setup
      </div>
    </div>
  );
};

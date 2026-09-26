import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';
import { ProgressRing } from '../components/ui/ProgressRing';
import {
  Sparkles,
  ArrowRight,
  Target,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Compass,
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  const coreLoop = [
    { step: '1', name: 'Profile', desc: 'Map your courses, projects, and target role.' },
    { step: '2', name: 'Assess', desc: 'Baseline evaluation against verified employer criteria.' },
    { step: '3', name: 'Find Gaps', desc: 'Isolate exact skill deltas holding you back.' },
    { step: '4', name: 'Build', desc: 'Guided hands-on projects designed to close gaps.' },
    { step: '5', name: 'Prove', desc: 'Objective challenge rubrics that verify competence.' },
    { step: '6', name: 'Improve', desc: 'Measurable readiness score lift and employer passport.' },
  ];

  const threeQuestions = [
    {
      q: 'WHERE AM I?',
      title: 'Current Readiness Score',
      desc: 'Benchmark your exact proficiency against live hiring expectations instead of guessing.',
      icon: Target,
      tag: 'Objective Baseline',
    },
    {
      q: 'WHAT AM I MISSING?',
      title: 'Actionable Skill Gaps',
      desc: 'See which exact competencies separate you from job-ready candidates with numerical gap metrics.',
      icon: AlertTriangle,
      tag: 'Priority Deltas',
    },
    {
      q: 'WHAT SHOULD I DO NEXT?',
      title: 'Step-by-Step Proof Roadmap',
      desc: 'Follow a calibrated sequence of Learn, Practice, Build, and Prove challenges that raise your score.',
      icon: Compass,
      tag: 'Proof Engine',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#14213D] text-white flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <span className="font-bold text-lg text-[#14213D] tracking-tight">CareerOS AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#475569]">
            <a href="#questions" className="hover:text-[#0F172A] transition-colors">How It Works</a>
            <a href="#loop" className="hover:text-[#0F172A] transition-colors">The Product Loop</a>
            <Link to="/career" className="hover:text-[#0F172A] transition-colors">Explore Careers</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/onboarding">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-blue-200 text-[#2563EB] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-POWERED CAREER READINESS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.1]">
              Know where you stand.<br />
              <span className="text-[#2563EB]">Know what to do next.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#475569] max-w-xl leading-relaxed">
              CareerOS AI helps students measure their current skills, identify career gaps, follow a personalized roadmap, and track their progress toward their target career.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/onboarding')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-md shadow-blue-500/20"
              >
                Check My Readiness
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/career')}
              >
                Explore Careers
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center gap-6 text-xs text-[#475569]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Evidence-backed scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero guesswork roadmaps</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verifiable Career Passport</span>
              </div>
            </div>
          </div>

          {/* Right Column: Polished Dashboard-Style Visual */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl p-6 space-y-5 relative">
              {/* Target Role & Readiness Ring */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                    Target Career
                  </span>
                  <h3 className="text-lg font-bold text-[#0F172A]">Data Analyst</h3>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +5 readiness this month
                  </span>
                </div>
                <ProgressRing
                  value={82}
                  size={90}
                  strokeWidth={8}
                  variant="blue"
                  label="Ready"
                />
              </div>

              {/* Top Skills Preview */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  <span>Top Verified Skills</span>
                  <span className="text-[#2563EB] text-[11px]">88% Alignment</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                    <span className="font-semibold">SQL</span>
                    <span className="font-bold text-emerald-600">91/80 ✓</span>
                  </div>
                  <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                    <span className="font-semibold">Python</span>
                    <span className="font-bold text-emerald-600">82/75 ✓</span>
                  </div>
                </div>
              </div>

              {/* Priority Gap Callout */}
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-red-900 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    Priority Gap: Power BI
                  </span>
                  <StatusBadge status="Needs Work" size="sm" />
                </div>
                <div className="flex items-baseline justify-between text-xs text-red-800">
                  <span>Level: 41 / 75 target</span>
                  <span className="font-bold">-34 pt delta</span>
                </div>
              </div>

              {/* Next Best Action Card */}
              <div className="p-4 bg-[#14213D] text-white rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                    Next Best Action
                  </span>
                  <span className="text-[10px] bg-blue-500/20 text-blue-200 border border-blue-400/30 px-2 py-0.5 rounded">
                    High Impact
                  </span>
                </div>
                <h4 className="text-sm font-bold leading-tight">
                  Complete the Power BI Sales Dashboard Challenge
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                  <span>45 min · Intermediate</span>
                  <Link
                    to="/challenge"
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    Start →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Three Questions Section */}
      <section id="questions" className="py-16 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
              Systematic Clarity
            </span>
            <h2 className="text-3xl font-extrabold text-[#0F172A]">
              Every Step Answers One Decisive Question
            </h2>
            <p className="text-sm text-[#475569]">
              Never guess what to study next. CareerOS turns ambiguity into high-signal action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {threeQuestions.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.q}
                  className="p-6 rounded-2xl border border-[#E2E8F0] bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-4"
                >
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#EFF6FF] border border-blue-100 text-[#2563EB] text-xs font-bold tracking-wider">
                    <span>{item.q}</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#14213D] text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A]">{item.title}</h3>
                  <p className="text-sm text-[#475569] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* The Core Product Loop */}
      <section id="loop" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">
            Evidence-Driven Progress
          </span>
          <h2 className="text-3xl font-extrabold text-[#0F172A]">
            The CareerOS Core Product Loop
          </h2>
          <p className="text-sm text-[#475569]">
            Profile → Assess → Find Gaps → Build → Prove → Improve
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {coreLoop.map((step) => (
            <div
              key={step.step}
              className="p-4 bg-white border border-[#E2E8F0] rounded-xl text-center space-y-2 shadow-2xs hover:border-blue-300 transition-colors"
            >
              <div className="w-8 h-8 mx-auto rounded-full bg-[#14213D] text-white flex items-center justify-center font-bold text-xs">
                {step.step}
              </div>
              <h4 className="font-bold text-sm text-[#0F172A]">{step.name}</h4>
              <p className="text-[11px] text-[#475569] leading-tight">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="bg-gradient-to-r from-[#14213D] to-[#1E3A8A] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to verify your career readiness?
            </h2>
            <p className="text-slate-200 text-sm sm:text-base">
              Take the 3-minute baseline assessment and discover your personalized proof roadmap today.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/onboarding')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="bg-blue-600 hover:bg-blue-500 shadow-lg text-white"
              >
                Check My Readiness Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="bg-transparent text-white border-white/30 hover:bg-white/10"
              >
                View Live Demo Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-[#E2E8F0] bg-white text-xs text-[#94A3B8] text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#14213D]">CareerOS AI</span>
            <span>—</span>
            <span>Know where you stand. Know what to do next.</span>
          </div>
          <div>Built for Viksit Bharat Hackathon MVP</div>
        </div>
      </footer>
    </div>
  );
};

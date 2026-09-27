import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Sparkles, ArrowRight, ShieldCheck, Target } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Login: React.FC = () => {
  const navigate = useNavigate();
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();

  setIsLoading(true);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  setIsLoading(false);

  if (error) {
    alert(error.message);
    return;
  }

  navigate('/dashboard', { replace: true });
};

const handleDemoAccount = async () => {
  setIsLoading(true);

  const { error } = await supabase.auth.signInWithPassword({
    email: 'demo@careeros.ai',
    password: 'CareerOS@2026!',
  });

  setIsLoading(false);

  if (error) {
    alert(
      'Demo login failed. Please check the demo account in Supabase.'
    );
    return;
  }

  navigate('/dashboard', { replace: true });
};

  return (
    <div className="min-h-screen flex bg-white text-[#0F172A]">
      {/* Left Column: Branding & Value Proposition (Split Screen) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#14213D] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-xl tracking-tight text-white block">CareerOS AI</span>
            <span className="text-[11px] text-blue-300 font-semibold uppercase tracking-wider block">
              Readiness Engine
            </span>
          </div>
        </div>

        {/* Center Pitch & Visual Element */}
        <div className="space-y-6 z-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider">
            <span>Student Career Readiness</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
            "Know where you stand. Know what to do next."
          </h1>

          <p className="text-slate-300 text-base leading-relaxed">
            Stop wondering if you're qualified for your dream role. CareerOS measures your skills, isolates high-priority gaps, and validates your competence with proof projects.
          </p>

          {/* Value cards */}
          <div className="space-y-3 pt-4">
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-200 font-medium">
                Benchmark directly against verified entry-level Data Analyst criteria
              </span>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xs text-slate-200 font-medium">
                Generate a shareable, cryptographically verifiable Career Passport
              </span>
            </div>
          </div>
        </div>

        {/* Bottom footer tag */}
        <div className="text-xs text-slate-400 z-10">
          © 2026 CareerOS AI · Designed for Next-Generation Career Readiness
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#F8FAFC]">
        <div className="w-full max-w-md space-y-6 bg-white p-8 sm:p-10 rounded-2xl border border-[#E2E8F0] shadow-sm">
          {/* Header */}
          <div className="space-y-1.5 text-left">
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#14213D] text-white flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-bold text-lg text-[#14213D]">CareerOS AI</span>
            </div>
            <h2 className="text-2xl font-bold text-[#0F172A]">Welcome back</h2>
            <p className="text-sm text-[#475569]">
              Enter your credentials to access your career readiness dashboard
            </p>
          </div>

          {/* Quick Demo Account Button */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
            <div className="text-xs">
              <span className="font-bold text-[#2563EB] block">Hackathon Evaluator?</span>
              <span className="text-[#475569]">1-click instant login with demo data</span>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleDemoAccount}
              isLoading={isLoading}
              className="shrink-0"
            >
              Try Demo Account
            </Button>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@university.edu"
            />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-[#2563EB] hover:underline">
                  Forgot Password?
                </a>
              </div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="navy"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In
            </Button>
          </form>

          {/* Create Account link */}
          <div className="text-center pt-2 text-xs text-[#475569]">
            Don't have an account yet?{' '}
            <Link to="/onboarding" className="font-bold text-[#2563EB] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

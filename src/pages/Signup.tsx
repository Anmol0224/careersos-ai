import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { supabase } from '../lib/supabase'

export const Signup: React.FC = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault()

    setErrorMessage('')
    setSuccessMessage('')

    const normalizedEmail = email.trim()

    if (!normalizedEmail) {
      setErrorMessage('Please enter your email address.')
      return
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
      })

      if (error) {
        setErrorMessage(error.message)
        return
      }

      // If email confirmation is enabled in Supabase,
      // there will be no active session yet.
      if (!data.session) {
        setSuccessMessage(
          'Account created successfully. Please verify your email, then sign in to continue.'
        )
        return
      }

      navigate('/onboarding', { replace: true })
    } catch (error) {
      console.error('Signup failed:', error)

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to create your account. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white text-[#0F172A]">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#14213D] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>

          <div>
            <span className="font-bold text-xl tracking-tight block">
              CareerOS AI
            </span>

            <span className="text-[11px] text-blue-300 font-semibold uppercase tracking-wider block">
              Readiness Engine
            </span>
          </div>
        </div>

        <div className="z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase tracking-wider">
            Student Career Readiness
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Build your career path with evidence, not guesswork.
          </h1>

          <p className="text-slate-300 text-base leading-relaxed">
            Create your CareerOS profile, identify your skill gaps, follow a
            personalized roadmap, and prove your progress.
          </p>

          <div className="space-y-3 pt-4">
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>

              <span className="text-xs text-slate-200 font-medium">
                Personalized career readiness journey
              </span>
            </div>

            <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>

              <span className="text-xs text-slate-200 font-medium">
                Your profile stays connected to your account
              </span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 z-10">
          © 2026 CareerOS AI · Career Readiness Platform
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#F8FAFC]">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-[#E2E8F0] shadow-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-[#14213D] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>

            <div>
              <div className="font-bold text-lg text-[#14213D]">
                CareerOS AI
              </div>

              <div className="text-[10px] uppercase tracking-wider font-semibold text-[#94A3B8]">
                Career Readiness Engine
              </div>
            </div>
          </div>

          <div className="space-y-1.5 mb-7">
            <h2 className="text-2xl font-bold text-[#0F172A]">
              Create your account
            </h2>

            <p className="text-sm text-[#475569]">
              Start your personalized career readiness journey.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              placeholder="Enter your password again"
              required
            />

            {errorMessage && (
              <div
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                role="status"
              >
                {successMessage}
              </div>
            )}

            <Button
              type="submit"
              variant="navy"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          <div className="text-center mt-6 text-xs text-[#475569]">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-[#2563EB] hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
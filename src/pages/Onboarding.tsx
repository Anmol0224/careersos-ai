import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
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
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { profileService } from '../services/profile'

export const Onboarding: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [step, setStep] = useState(1)

  const [aboutData, setAboutData] = useState({
    fullName: '',
    location: '',
  })

  const [educationData, setEducationData] = useState({
    degree: '',
    institution: '',
    gradYear: '',
    gpa: '',
  })

  const [careerGoal, setCareerGoal] = useState('Data Analyst')

  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'SQL Databases',
    'Python & Pandas',
    'Business Dashboards',
  ])

  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [resumeFileName, setResumeFileName] = useState('')

  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')


  const careerOptions = [
    {
      title: 'Data Analyst',
      desc: 'Transform data into actionable business insights.',
    },
    {
      title: 'Software Developer',
      desc: 'Build reliable and scalable software applications.',
    },
    {
      title: 'AI/ML Engineer',
      desc: 'Build intelligent systems using machine learning.',
    },
    {
      title: 'Cybersecurity Analyst',
      desc: 'Protect systems, networks, and digital assets.',
    },
    {
      title: 'Cloud Engineer',
      desc: 'Design and maintain scalable cloud infrastructure.',
    },
    {
      title: 'Business Analyst',
      desc: 'Translate business needs into actionable solutions.',
    },
    {
      title: 'UI/UX Designer',
      desc: 'Design intuitive and user-centered digital experiences.',
    },
    {
      title: 'Digital Marketing Specialist',
      desc: 'Grow digital audiences through content and campaigns.',
    },
  ]

  const interestOptions = [
    'SQL Databases',
    'Python & Pandas',
    'Business Dashboards',
    'Statistics & Probability',
    'Cloud Computing',
    'Data Warehousing',
    'Data Storytelling',
    'Predictive Modeling',
  ]

  const toggleInterest = (item: string) => {
    setSelectedInterests((current) =>
      current.includes(item)
        ? current.filter((interest) => interest !== item)
        : [...current, item],
    )
  }

  const validateCurrentStep = () => {
    setSaveError('')

    if (step === 1) {
      if (!aboutData.fullName.trim()) {
        setSaveError('Please enter your full name.')
        return false
      }

      if (!aboutData.location.trim()) {
        setSaveError('Please enter your current city or location.')
        return false
      }
    }

    if (step === 2) {
      if (!educationData.degree.trim()) {
        setSaveError('Please enter your degree or field of study.')
        return false
      }

      if (!educationData.institution.trim()) {
        setSaveError('Please enter your college or university.')
        return false
      }
    }

    if (step === 3 && !careerGoal) {
      setSaveError('Please select a target career.')
      return false
    }

    if (step === 5 && !resumeUploaded) {
      setSaveError('Please upload your resume before continuing.')
      return false
    }

    return true
  }

  const handleContinue = () => {
    if (!validateCurrentStep()) {
      return
    }

    setStep((current) => Math.min(current + 1, 5))
  }

  const handleBack = () => {
    setSaveError('')
    setStep((current) => Math.max(current - 1, 1))
  }

  const handleSimulatedResumeUpload = () => {
    setResumeUploaded(true)
    setResumeFileName('CareerOS_Demo_Resume.pdf')
    setSaveError('')
  }

  const handleRemoveResume = () => {
    setResumeUploaded(false)
    setResumeFileName('')
  }

  const handleSaveProfile = async () => {
    setSaveError('')

    if (!validateCurrentStep()) {
      return
    }

    if (!user) {
      setSaveError(
        'Your login session has expired. Please sign in again.',
      )
      return
    }

    setIsSaving(true)

    try {
      await profileService.saveProfile({
        fullName: aboutData.fullName.trim(),
        city: aboutData.location.trim(),
        degree: educationData.degree.trim(),
        institution: educationData.institution.trim(),
        graduationYear: educationData.gradYear
          ? Number(educationData.gradYear)
          : null,
        gpa: educationData.gpa.trim(),
        careerGoal,
        interests: selectedInterests,
      })

      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.error('Failed to save profile:', error)

      setSaveError(
        error instanceof Error
          ? error.message
          : 'Unable to save your profile. Please try again.',
      )
    } finally {
      setIsSaving(false)
    }
  }

  const stepTitles = [
    { number: 1, label: 'About You', icon: User },
    { number: 2, label: 'Education', icon: GraduationCap },
    { number: 3, label: 'Career Goal', icon: Briefcase },
    { number: 4, label: 'Interests', icon: Heart },
    { number: 5, label: 'Resume', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full pt-4 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#14213D] text-white flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>

            <span className="font-bold text-base text-[#14213D]">
              CareerOS AI Setup
            </span>
          </div>

          <span className="text-xs font-semibold text-[#475569]">
            Step {step} of 5
          </span>
        </div>

        {/* Step Progress Pills */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {stepTitles.map((item) => {
            const isDone = item.number < step
            const isCurrent = item.number === step

            return (
              <div
                key={item.number}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isDone
                    ? 'bg-[#16A34A]'
                    : isCurrent
                      ? 'bg-[#2563EB]'
                      : 'bg-slate-200'
                }`}
              />
            )
          })}
        </div>
      </div>

      {/* Main Step Card */}
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center">
        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardContent className="p-6 sm:p-8 space-y-6">
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">
                    About You
                  </h2>

                  <p className="text-sm text-[#475569] mt-1">
                    Let&apos;s personalize your career readiness baseline.
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={aboutData.fullName}
                    onChange={(e) =>
                      setAboutData((current) => ({
                        ...current,
                        fullName: e.target.value,
                      }))
                    }
                    required
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    value={user?.email ?? ''}
                    readOnly
                    required
                  />

                  <Input
                    label="Current City / Location"
                    value={aboutData.location}
                    onChange={(e) =>
                      setAboutData((current) => ({
                        ...current,
                        location: e.target.value,
                      }))
                    }
                    placeholder="e.g. Indore, Madhya Pradesh"
                    required
                  />
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">
                    Education Background
                  </h2>

                  <p className="text-sm text-[#475569] mt-1">
                    Your academic foundation helps calibrate target
                    entry-level criteria.
                  </p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Current Degree / Field of Study"
                    value={educationData.degree}
                    onChange={(e) =>
                      setEducationData((current) => ({
                        ...current,
                        degree: e.target.value,
                      }))
                    }
                    placeholder="e.g. B.Tech Computer Science"
                    required
                  />

                  <Input
                    label="College / University"
                    value={educationData.institution}
                    onChange={(e) =>
                      setEducationData((current) => ({
                        ...current,
                        institution: e.target.value,
                      }))
                    }
                    placeholder="e.g. MITS Gwalior"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Graduation Year"
                      type="number"
                      value={educationData.gradYear}
                      onChange={(e) =>
                        setEducationData((current) => ({
                          ...current,
                          gradYear: e.target.value,
                        }))
                      }
                      placeholder="e.g. 2028"
                    />

                    <Input
                      label="GPA / Percentage"
                      value={educationData.gpa}
                      onChange={(e) =>
                        setEducationData((current) => ({
                          ...current,
                          gpa: e.target.value,
                        }))
                      }
                      placeholder="e.g. 8.4 / 10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">
                    Select Target Career
                  </h2>

                  <p className="text-sm text-[#475569] mt-1">
                    Choose the role you want to benchmark and prepare for.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {careerOptions.map((option) => {
                    const selected = careerGoal === option.title

                    return (
                      <button
                        key={option.title}
                        type="button"
                        onClick={() => {
                          setCareerGoal(option.title)
                          setSaveError('')
                        }}
                        className={`text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          selected
                            ? 'border-[#2563EB] bg-[#EFF6FF]'
                            : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                        }`}
                        aria-pressed={selected}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-[#0F172A]">
                            {option.title}
                          </span>

                          {selected && (
                            <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                          )}
                        </div>

                        <p className="text-xs text-[#475569]">
                          {option.desc}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">
                    Core Areas of Interest
                  </h2>

                  <p className="text-sm text-[#475569] mt-1">
                    Select competencies you currently possess or want to
                    prioritize in your roadmap.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {interestOptions.map((item) => {
                    const selected = selectedInterests.includes(item)

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          selected
                            ? 'bg-[#14213D] text-white border-[#14213D]'
                            : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-slate-300'
                        }`}
                        aria-pressed={selected}
                      >
                        {selected ? '✓ ' : '+ '}
                        {item}
                      </button>
                    )
                  })}
                </div>

                <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-4 py-3">
                  <p className="text-xs text-[#475569]">
                    {selectedInterests.length} area
                    {selectedInterests.length === 1 ? '' : 's'} selected
                  </p>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">
                    Upload & Analyze Resume
                  </h2>

                  <p className="text-sm text-[#475569] mt-1">
                    CareerOS AI will use your resume as evidence for your
                    initial career-readiness profile.
                  </p>
                </div>

                {/* Resume Upload */}
                <button
                  type="button"
                  onClick={handleSimulatedResumeUpload}
                  className={`w-full border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                    resumeUploaded
                      ? 'border-emerald-400 bg-emerald-50/40'
                      : 'border-[#E2E8F0] hover:border-blue-400 bg-slate-50/50'
                  }`}
                >
                  {resumeUploaded ? (
                    <div className="space-y-3">
                      <FileCheck className="w-10 h-10 mx-auto text-emerald-600" />

                      <div className="font-bold text-sm text-[#0F172A]">
                        {resumeFileName}
                      </div>

                      <p className="text-xs text-emerald-700">
                        Demo resume selected successfully. Ready for the
                        next CareerOS step.
                      </p>

                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(event) => {
                          event.stopPropagation()
                          handleRemoveResume()
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault()
                            event.stopPropagation()
                            handleRemoveResume()
                          }
                        }}
                        className="inline-block text-xs text-[#DC2626] hover:underline"
                      >
                        Remove and select again
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <UploadCloud className="w-10 h-10 mx-auto text-[#2563EB]" />

                      <div className="font-bold text-sm text-[#0F172A]">
                        Click to select your resume
                      </div>

                      <p className="text-xs text-[#94A3B8]">
                        PDF or DOCX up to 10MB
                      </p>

                      <p className="text-[11px] text-[#94A3B8]">
                        File processing will be connected in the next phase.
                      </p>
                    </div>
                  )}
                </button>

                {/* Information Box */}
                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />

                  <p className="text-xs text-[#0F172A] leading-relaxed">
                    CareerOS will use your target career, interests, education,
                    and later your resume evidence to personalize your
                    readiness journey for{' '}
                    <strong>{careerGoal}</strong>.
                  </p>
                </div>

                {/* Current status */}
                <div className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-[#475569]">
                        Profile completion
                      </p>
                      <p className="text-sm font-bold text-[#0F172A]">
                        Almost ready
                      </p>
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        resumeUploaded
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {resumeUploaded
                        ? 'Resume selected'
                        : 'Resume required'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {saveError && (
              <div
                className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {saveError}
              </div>
            )}

            {/* Navigation */}
            <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleBack}
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
                  onClick={handleContinue}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="navy"
                  size="lg"
                  disabled={!resumeUploaded || isSaving}
                  isLoading={isSaving}
                  onClick={handleSaveProfile}
                  rightIcon={<Sparkles className="w-4 h-4" />}
                >
                  Save Profile & Launch
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
  )
}
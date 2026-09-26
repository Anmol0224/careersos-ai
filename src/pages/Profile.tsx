import React, { useState } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { ProgressRing } from '../components/ui/ProgressRing';
import { Modal } from '../components/ui/Modal';
import {
  ShieldCheck,
  Share2,
  Award,
  CheckCircle2,
  Copy,
  Check,
  MapPin,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { mockUserProfile } from '../data/mockData';

export const Profile: React.FC = () => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const u = mockUserProfile;
  const passportUrl = `https://careersos.ai/passport/rahul-sharma-da82`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(passportUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageContainer
      title="My Career Profile"
      subtitle="Your verified Career Passport — cryptographic proof of job readiness."
      questionBadge="What can I show?"
      actions={
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShareModalOpen(true)}
          leftIcon={<Share2 className="w-3.5 h-3.5" />}
        >
          Share Career Passport
        </Button>
      }
    >
      {/* 1. Header Card: Profile Identity & Big Readiness Ring */}
      <Card className="bg-white border-[#E2E8F0]">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Identity */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
              <Avatar name={u.name} size="xl" className="border-4 border-slate-100 shadow-md" />
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-2xl font-bold text-[#0F172A]">{u.name}</h2>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Passport Active
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#475569] pt-1">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[#94A3B8]" />
                    {u.degree} · {u.institution}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                    {u.location}
                  </span>
                </div>
                <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                  <span className="text-xs text-[#94A3B8] font-medium">Target Focus:</span>
                  <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-blue-200">
                    {u.targetCareer}
                  </span>
                </div>
              </div>
            </div>

            {/* Circular Readiness Indicator */}
            <div className="flex items-center gap-4 bg-slate-50/80 border border-[#E2E8F0] p-4 rounded-2xl shrink-0">
              <ProgressRing
                value={u.readinessScore}
                size={100}
                strokeWidth={9}
                variant="blue"
                label="Score"
              />
              <div className="text-left">
                <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider block">
                  Readiness
                </span>
                <span className="text-2xl font-black text-[#0F172A]">
                  {u.readinessScore} <span className="text-xs text-[#94A3B8] font-normal">/ 100</span>
                </span>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
                  Top 15% Entry-Level Cohort
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Three Pillars: Verified Skills, Projects, Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Verified Skills */}
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Skills</span>
            </CardTitle>
            <p className="text-xs text-[#475569]">
              Backed by hands-on challenge assessments
            </p>
          </CardHeader>
          <CardContent className="space-y-2.5 pt-2">
            {u.verifiedSkills.map((skill) => (
              <div
                key={skill}
                className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-xl flex items-center justify-between"
              >
                <span className="font-bold text-sm text-[#0F172A]">{skill}</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Projects */}
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#2563EB]" />
              <span>Portfolio Projects</span>
            </CardTitle>
            <p className="text-xs text-[#475569]">
              Practical implementations demonstrating skill depth
            </p>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {u.projects.map((proj) => (
              <div
                key={proj.title}
                className="p-3.5 bg-slate-50 border border-[#E2E8F0] rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#0F172A]">{proj.title}</h4>
                  <span className="text-[10px] text-[#94A3B8] font-medium">{proj.date}</span>
                </div>
                <p className="text-xs text-[#475569] leading-relaxed">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {proj.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-semibold bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Achievements</span>
            </CardTitle>
            <p className="text-xs text-[#475569]">
              Verified milestone badges earned on platform
            </p>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {u.achievements.map((ach) => (
              <div
                key={ach.title}
                className="p-3.5 bg-slate-50 border border-[#E2E8F0] rounded-xl flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-lg shrink-0">
                  {ach.count}
                </div>
                <div>
                  <div className="font-bold text-sm text-[#0F172A]">{ach.title}</div>
                  <p className="text-xs text-[#475569]">{ach.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Share Career Passport Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Your Career Passport"
        description="Provide recruiters and employers with tamper-proof evidence of your skills."
        maxWidth="md"
      >
        <div className="space-y-5">
          {/* Card Preview */}
          <div className="p-4 bg-gradient-to-br from-[#14213D] to-[#1E3A8A] text-white rounded-2xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider block">
                  Official Career Passport
                </span>
                <h4 className="text-lg font-bold">{u.name}</h4>
                <p className="text-xs text-slate-300">{u.targetCareer} · {u.degree}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                82
              </div>
            </div>

            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs text-slate-300">
              <span>Verified: SQL, Excel, Python, Power BI</span>
              <span className="text-emerald-300 font-semibold">Active ✓</span>
            </div>
          </div>

          {/* Copy Link Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#0F172A] uppercase tracking-wider">
              Public Verification URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={passportUrl}
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs font-mono text-[#0F172A]"
              />
              <Button
                variant={copied ? 'secondary' : 'primary'}
                size="sm"
                onClick={handleCopyLink}
                leftIcon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setShareModalOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

import React from 'react'
import { StatusBadge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import type { CareerSkillGap } from '../../services/careerService'

export interface SkillsTableProps {
  skills: CareerSkillGap[]
  onSelectSkill?: (skill: CareerSkillGap) => void
}

export const SkillsTable: React.FC<SkillsTableProps> = ({
  skills,
  onSelectSkill,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-[#E2E8F0] text-[11px] font-semibold text-[#475569] uppercase tracking-wider">
              <th className="py-3 px-6">Skill</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4 text-center">You</th>
              <th className="py-3 px-4 text-center">Required</th>
              <th className="py-3 px-6">Proficiency vs Target</th>
              <th className="py-3 px-6 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#0F172A]">
            {skills.map((skill) => {
              const isUnassessed = skill.isUnassessed
              return (
                <tr
                  key={skill.id}
                  onClick={() => onSelectSkill && onSelectSkill(skill)}
                  className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6 font-semibold text-[#0F172A]">
                    <div>{skill.name}</div>
                    {skill.description && (
                      <div className="text-xs text-[#475569] font-normal truncate max-w-xs mt-0.5">
                        {skill.description}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4 text-xs text-[#475569]">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                      {skill.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-base">
                    {isUnassessed ? (
                      <span className="text-slate-400 text-sm font-medium">—</span>
                    ) : (
                      <span
                        className={
                          skill.status === 'Ready'
                            ? 'text-emerald-700'
                            : skill.status === 'Developing'
                            ? 'text-amber-700'
                            : 'text-red-700'
                        }
                      >
                        {skill.currentScore}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-center text-sm font-semibold text-[#475569]">
                    {skill.requiredScore}
                  </td>
                  <td className="py-4 px-6 min-w-[160px]">
                    {isUnassessed ? (
                      <div className="text-xs text-slate-500 italic">
                        Not yet assessed — take a challenge or provide evidence.
                      </div>
                    ) : (
                      <>
                        <ProgressBar
                          value={skill.currentScore}
                          required={skill.requiredScore}
                          height="sm"
                          variant={
                            skill.status === 'Ready'
                              ? 'success'
                              : skill.status === 'Developing'
                              ? 'warning'
                              : 'error'
                          }
                        />
                        <div className="flex justify-between text-[11px] text-[#94A3B8] mt-1 font-medium">
                          <span>Current: {skill.currentScore}</span>
                          <span>Target: {skill.requiredScore}</span>
                        </div>
                      </>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <StatusBadge status={skill.status} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block sm:hidden divide-y divide-[#E2E8F0]">
        {skills.map((skill) => {
          const isUnassessed = skill.isUnassessed
          return (
            <div
              key={skill.id}
              onClick={() => onSelectSkill && onSelectSkill(skill)}
              className="p-4 space-y-3 cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-[#0F172A]">
                    {skill.name}
                  </span>
                  <span className="text-xs text-[#475569] block">
                    {skill.category}
                  </span>
                </div>
                <StatusBadge status={skill.status} size="sm" />
              </div>

              {isUnassessed ? (
                <p className="text-xs text-slate-500 italic">
                  Not assessed — take a challenge to establish your baseline.
                </p>
              ) : (
                <>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-[#475569]">
                      Your Score vs Target:
                    </span>
                    <span className="font-bold text-sm text-[#0F172A]">
                      {skill.currentScore}{' '}
                      <span className="text-[#94A3B8] font-normal">
                        / {skill.requiredScore}
                      </span>
                    </span>
                  </div>

                  <ProgressBar
                    value={skill.currentScore}
                    required={skill.requiredScore}
                    height="sm"
                    variant={
                      skill.status === 'Ready'
                        ? 'success'
                        : skill.status === 'Developing'
                        ? 'warning'
                        : 'error'
                    }
                  />
                </>
              )}

              {skill.description && (
                <p className="text-xs text-[#475569] pt-1">
                  {skill.description}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

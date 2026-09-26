import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Briefcase, MapPin, Building, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockOpportunities } from '../../data/mockData';
import type { OpportunityItem } from '../../data/mockData';

export interface OpportunitiesSnippetProps {
  onSelectOpportunity?: (opp: OpportunityItem) => void;
}

export const OpportunitiesSnippet: React.FC<OpportunitiesSnippetProps> = ({
  onSelectOpportunity,
}) => {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <CardTitle className="text-base">Top Matching Opportunities</CardTitle>
            <p className="text-xs text-[#475569]">Roles actively hiring that match your verified skill set</p>
          </div>
        </div>
        <Link
          to="/opportunities"
          className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1"
        >
          <span>View All 17</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockOpportunities.slice(0, 3).map((opp) => (
            <div
              key={opp.id}
              className="p-4 rounded-xl border border-[#E2E8F0] hover:border-blue-300 hover:shadow-sm transition-all duration-200 bg-white flex flex-col justify-between"
            >
              <div>
                {/* Alignment Pill */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{opp.alignment}% Match</span>
                  </span>
                  <span className="text-[11px] text-[#94A3B8] font-medium">
                    {opp.employmentType}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-[#0F172A] line-clamp-1 group-hover:text-[#2563EB]">
                  {opp.title}
                </h4>

                <div className="flex items-center gap-3 text-xs text-[#475569] mt-1.5 mb-3">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span className="truncate max-w-[100px]">{opp.company}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                    <span>{opp.location}</span>
                  </span>
                </div>

                {/* Skills tags */}
                <div className="space-y-1 mb-3">
                  <div className="flex flex-wrap gap-1">
                    {opp.skillsMatched.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-medium bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
                      >
                        ✓ {s}
                      </span>
                    ))}
                    {opp.missingSkills.length > 0 && (
                      <span className="text-[10px] font-medium bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded">
                        Missing: {opp.missingSkills[0]}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0F172A]">
                  {opp.stipendOrSalary.split('–')[0]}
                </span>
                {onSelectOpportunity ? (
                  <button
                    onClick={() => onSelectOpportunity(opp)}
                    className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1 cursor-pointer"
                  >
                    View Details
                  </button>
                ) : (
                  <Link
                    to="/opportunities"
                    className="text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1"
                  >
                    View Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

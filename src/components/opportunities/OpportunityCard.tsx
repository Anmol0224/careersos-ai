import type { OpportunityItem } from '../../data/mockData';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Building, MapPin, Check, ArrowRight } from 'lucide-react';

export interface OpportunityCardProps {
  opportunity: OpportunityItem;
  onView: (opportunity: OpportunityItem) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onView,
}) => {
  return (
    <Card className="bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Header row: Match pill & Type */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              <span>{opportunity.alignment}% Alignment</span>
            </span>
            <span className="text-xs text-[#475569] bg-slate-100 px-2 py-0.5 rounded font-medium">
              {opportunity.employmentType}
            </span>
          </div>

          {/* Title and Company */}
          <h3 className="font-bold text-base text-[#0F172A] hover:text-[#2563EB] transition-colors leading-snug">
            {opportunity.title}
          </h3>

          <div className="flex items-center gap-3 text-xs text-[#475569] mt-2">
            <span className="flex items-center gap-1 font-medium">
              <Building className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>{opportunity.company}</span>
            </span>
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>{opportunity.location} · {opportunity.workplaceType}</span>
            </span>
          </div>

          <p className="text-xs text-[#475569] mt-3 line-clamp-2 leading-relaxed">
            {opportunity.description}
          </p>

          {/* Skills Breakdown */}
          <div className="mt-4 pt-3 border-t border-[#E2E8F0] space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[#94A3B8] mr-1">Matches:</span>
              {opportunity.skillsMatched.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>

            {opportunity.missingSkills.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#94A3B8] mr-1">Missing:</span>
                {opportunity.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded"
                  >
                    ⚠ {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer row: Stipend & View Button */}
        <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-[#0F172A]">
            {opportunity.stipendOrSalary}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(opportunity)}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View Opportunity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

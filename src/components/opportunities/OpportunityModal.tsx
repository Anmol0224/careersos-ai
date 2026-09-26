import type { OpportunityItem } from '../../data/mockData';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import {
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export interface OpportunityModalProps {
  opportunity: OpportunityItem | null;
  isOpen: boolean;
  onClose: () => void;
  onApplyPassport?: (opp: OpportunityItem) => void;
}

export const OpportunityModal: React.FC<OpportunityModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onApplyPassport,
}) => {
  if (!opportunity) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={opportunity.title}
      description={`${opportunity.company} · ${opportunity.location} (${opportunity.workplaceType})`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Alignment Banner */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              {opportunity.alignment}%
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Profile Alignment Score
              </div>
              <p className="text-xs text-emerald-700">
                Strong fit. You match {opportunity.skillsMatched.length} out of {opportunity.skillsMatched.length + opportunity.missingSkills.length} required skills.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-full shadow-2xs border border-emerald-200">
            Top 15% Match
          </span>
        </div>

        {/* Quick Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg">
            <span className="text-[#94A3B8] font-medium block">Compensation</span>
            <span className="font-bold text-[#0F172A] mt-0.5 block truncate">
              {opportunity.stipendOrSalary}
            </span>
          </div>
          <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg">
            <span className="text-[#94A3B8] font-medium block">Type</span>
            <span className="font-bold text-[#0F172A] mt-0.5 block">
              {opportunity.employmentType}
            </span>
          </div>
          <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg">
            <span className="text-[#94A3B8] font-medium block">Location</span>
            <span className="font-bold text-[#0F172A] mt-0.5 block">
              {opportunity.location} ({opportunity.workplaceType})
            </span>
          </div>
          <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg">
            <span className="text-[#94A3B8] font-medium block">Posted</span>
            <span className="font-bold text-[#0F172A] mt-0.5 block">
              {opportunity.postedDaysAgo} days ago
            </span>
          </div>
        </div>

        {/* Skills Matched vs Missing */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Skills Fit Analysis
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Matched */}
            <div className="p-3.5 bg-slate-50 border border-[#E2E8F0] rounded-lg space-y-2">
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified in Your Passport ({opportunity.skillsMatched.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.skillsMatched.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded"
                  >
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div className="p-3.5 bg-slate-50 border border-[#E2E8F0] rounded-lg space-y-2">
              <span className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Missing Competency ({opportunity.missingSkills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.missingSkills.map((s) => (
                  <span
                    key={s}
                    className="text-xs font-medium bg-red-50 text-red-800 border border-red-200 px-2 py-0.5 rounded"
                  >
                    ⚠ {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Role Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            About the Role
          </h4>
          <p className="text-sm text-[#475569] leading-relaxed">
            {opportunity.description}
          </p>
        </div>

        {/* Key Responsibilities */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
            Key Responsibilities
          </h4>
          <ul className="space-y-1.5 text-xs text-[#475569]">
            {opportunity.responsibilities.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-[#2563EB] font-bold mt-0.5">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-[#94A3B8]">
            Applying attaches your verified Career Passport credentials
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="md" onClick={onClose} className="flex-1 sm:flex-none">
              Close
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (onApplyPassport) onApplyPassport(opportunity);
                alert(`Applied with Career Passport to ${opportunity.company}!`);
                onClose();
              }}
              className="flex-1 sm:flex-none"
            >
              Apply with Career Passport
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

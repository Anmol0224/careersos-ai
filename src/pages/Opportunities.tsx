import React, { useState, useMemo } from 'react';
import { PageContainer } from '../components/layout/PageContainer';
import { OpportunityCard } from '../components/opportunities/OpportunityCard';
import { OpportunityModal } from '../components/opportunities/OpportunityModal';
import { mockOpportunities } from '../data/mockData';
import type { OpportunityItem } from '../data/mockData';
import { Card, CardContent } from '../components/ui/Card';
import { Search } from 'lucide-react';

export const Opportunities: React.FC = () => {
  const [selectedOpportunity, setSelectedOpportunity] = useState<OpportunityItem | null>(null);
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Expand mock opportunities to realistic 17 count
  const allOpportunities = useMemo(() => {
    const list: OpportunityItem[] = [
      ...mockOpportunities,
      {
        id: 'opp-5',
        title: 'Junior Analytics Consultant',
        company: 'Deloitte Digital Labs',
        location: 'Indore',
        workplaceType: 'Hybrid',
        employmentType: 'Full-time',
        stipendOrSalary: '₹6.5 – ₹8.5 LPA',
        alignment: 86,
        skillsMatched: ['SQL', 'Excel', 'Problem Solving'],
        missingSkills: ['Power BI'],
        description: 'Design and deploy analytics workflows for mid-market clients transitioning from manual spreadsheets to automated databases.',
        responsibilities: ['Client data pipeline integration', 'SQL transformation audits', 'Executive decks'],
        postedDaysAgo: 3,
      },
      {
        id: 'opp-6',
        title: 'Data Analyst Graduate Trainee',
        company: 'Infosys BPM',
        location: 'Pune',
        workplaceType: 'In-office',
        employmentType: 'Full-time',
        stipendOrSalary: '₹4.5 – ₹5.8 LPA',
        alignment: 91,
        skillsMatched: ['SQL', 'Python', 'Excel'],
        missingSkills: [],
        description: 'Join the Global Analytics Delivery Center assisting Fortune 500 supply chain operations.',
        responsibilities: ['Daily KPI tracking', 'Data hygiene checks', 'Python report scripting'],
        postedDaysAgo: 4,
      },
      {
        id: 'opp-7',
        title: 'Growth Analytics Intern',
        company: 'Razorpay Labs',
        location: 'Bengaluru',
        workplaceType: 'Hybrid',
        employmentType: 'Internship',
        stipendOrSalary: '₹35,000 / month',
        alignment: 85,
        skillsMatched: ['SQL', 'Python'],
        missingSkills: ['Statistics'],
        description: 'Examine payment gateway funnels, checkout drop-offs, and merchant transaction velocity.',
        responsibilities: ['Funnel drop-off queries', 'A/B test evaluation', 'Cohort tables'],
        postedDaysAgo: 1,
      },
      {
        id: 'opp-8',
        title: 'Remote Business Analyst Intern',
        company: 'CloudHealth Inc',
        location: 'Remote',
        workplaceType: 'Remote',
        employmentType: 'Internship',
        stipendOrSalary: '₹28,000 / month',
        alignment: 83,
        skillsMatched: ['Excel', 'SQL'],
        missingSkills: ['Power BI'],
        description: 'Analyze telemetry usage for clinical SaaS software tools across North American clinics.',
        responsibilities: ['Weekly usage summaries', 'SLA metrics', 'User survey cross-tabs'],
        postedDaysAgo: 2,
      },
    ];
    return list;
  }, []);

  const filteredOpportunities = useMemo(() => {
    return allOpportunities.filter((opp) => {
      if (remoteOnly && opp.workplaceType !== 'Remote') return false;
      if (locationFilter !== 'All Locations' && opp.location !== locationFilter) return false;
      if (typeFilter !== 'All Types' && opp.employmentType !== typeFilter) return false;
      if (roleFilter !== 'All Roles' && !opp.title.toLowerCase().includes(roleFilter.toLowerCase())) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = opp.title.toLowerCase().includes(query);
        const matchesCompany = opp.company.toLowerCase().includes(query);
        const matchesSkills = opp.skillsMatched.some((s) => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
      }
      return true;
    });
  }, [allOpportunities, remoteOnly, locationFilter, typeFilter, roleFilter, searchTerm]);

  return (
    <PageContainer
      title="Opportunities for You"
      subtitle={`${filteredOpportunities.length} opportunities found matching your verified skill readiness profile.`}
      questionBadge="Where can I apply?"
      actions={
        <div className="text-xs font-semibold text-[#2563EB] bg-[#EFF6FF] px-3 py-1.5 rounded-lg border border-blue-200">
          Career Passport Verified
        </div>
      }
    >
      {/* Search & Filter Controls Bar */}
      <Card className="bg-white border-[#E2E8F0]">
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-center">
            {/* Search Box */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search title, company, or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-lg pl-9 pr-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
              />
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
              >
                <option value="All Roles">All Roles</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Intelligence">BI / Intelligence</option>
                <option value="Consultant">Consultant</option>
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
              >
                <option value="All Locations">All Locations</option>
                <option value="Indore">Indore</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Pune">Pune</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-slate-50 border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-[#0F172A] focus:bg-white focus:outline-none"
              >
                <option value="All Types">All Types</option>
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
              </select>
            </div>

            {/* Remote Checkbox Toggle */}
            <div className="flex items-center justify-between sm:justify-start gap-2 px-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-[#0F172A]">
                <input
                  type="checkbox"
                  checked={remoteOnly}
                  onChange={(e) => setRemoteOnly(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]"
                />
                <span>Remote Only</span>
              </label>

              {(searchTerm || roleFilter !== 'All Roles' || locationFilter !== 'All Locations' || typeFilter !== 'All Types' || remoteOnly) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setRoleFilter('All Roles');
                    setLocationFilter('All Locations');
                    setTypeFilter('All Types');
                    setRemoteOnly(false);
                  }}
                  className="text-xs text-[#2563EB] hover:underline ml-auto"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid of Opportunity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOpportunities.map((opp) => (
          <OpportunityCard
            key={opp.id}
            opportunity={opp}
            onView={(item) => setSelectedOpportunity(item)}
          />
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-16 bg-white border border-[#E2E8F0] rounded-xl">
          <p className="text-sm font-semibold text-[#0F172A]">No opportunities match your filter.</p>
          <p className="text-xs text-[#94A3B8] mt-1">Try resetting filters to view all {allOpportunities.length} opportunities.</p>
        </div>
      )}

      {/* Drawer / Detail Modal */}
      <OpportunityModal
        opportunity={selectedOpportunity}
        isOpen={Boolean(selectedOpportunity)}
        onClose={() => setSelectedOpportunity(null)}
      />
    </PageContainer>
  );
};

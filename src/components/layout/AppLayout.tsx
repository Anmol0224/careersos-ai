import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AskCareerOSModal } from '../dashboard/AskCareerOSModal';
import { Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useShellProfile } from '../../hooks/useShellProfile';

export const AppLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [askCareerOSOpen, setAskCareerOSOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { profile } = useShellProfile();

  const settingsOpen = location.hash === '#settings';
  const helpOpen = location.hash === '#help';

  const handleCloseHashModal = () => {
    navigate(location.pathname, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex text-[#0F172A]">
      {/* Sidebar */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        shellProfile={profile}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Sticky Header */}
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenAskCareerOS={() => setAskCareerOSOpen(true)}
          shellProfile={profile}
        />

        {/* Page Content */}
        <main className="flex-1 pb-16">
          <Outlet />
        </main>
      </div>

      {/* Floating "Ask CareerOS" button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setAskCareerOSOpen(true)}
          className="group inline-flex items-center gap-2.5 px-4 py-3 bg-[#14213D] hover:bg-[#0E172B] text-white rounded-full shadow-lg shadow-navy-950/20 hover:shadow-xl transition-all duration-200 cursor-pointer border border-slate-700/50"
          aria-label="Ask CareerOS AI"
        >
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold tracking-wide">Ask CareerOS</span>
        </button>
      </div>

      {/* CareerOS AI Dialog Modal */}
      <AskCareerOSModal
        isOpen={askCareerOSOpen}
        onClose={() => setAskCareerOSOpen(false)}
      />

      {/* Settings Modal */}
      <Modal
        isOpen={settingsOpen}
        onClose={handleCloseHashModal}
        title="Settings & Preferences"
        description="Manage your CareerOS AI benchmark preferences"
      >
        <div className="space-y-4 text-sm text-[#475569]">
          <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg">
            <div className="font-semibold text-[#0F172A] mb-1">Target Role Focus</div>
            <p className="text-xs">{profile?.careerGoal || 'Target Role'} (Industry benchmarks calibrated against top entry-level roles)</p>
          </div>
          <div className="p-3 bg-slate-50 border border-[#E2E8F0] rounded-lg">
            <div className="font-semibold text-[#0F172A] mb-1">Notification Cadence</div>
            <p className="text-xs">Weekly readiness summary and priority challenge reminders enabled.</p>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={handleCloseHashModal}>
              Save & Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Help Modal */}
      <Modal
        isOpen={helpOpen}
        onClose={handleCloseHashModal}
        title="CareerOS AI Help & Methodology"
        description="Understanding your readiness scores and product loop"
      >
        <div className="space-y-4 text-sm text-[#475569]">
          <div className="space-y-2">
            <h4 className="font-semibold text-[#0F172A]">The 5-Stage Career Readiness Loop</h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-950 font-medium">
                1. <strong>Evidence</strong>: Past coursework, projects, or resume skills
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-lg text-amber-950 font-medium">
                2. <strong>Gap</strong>: Exact delta between your current level and employer targets
              </div>
              <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-950 font-medium">
                3. <strong>Action</strong>: Curated targeted learning step in your roadmap
              </div>
              <div className="p-2.5 bg-purple-50 border border-purple-100 rounded-lg text-purple-950 font-medium">
                4. <strong>Proof</strong>: Objective hands-on challenge with rubric scoring
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-emerald-950 font-medium">
                5. <strong>Progress</strong>: Measured quantitative score improvement
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={handleCloseHashModal}>
              Got it
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

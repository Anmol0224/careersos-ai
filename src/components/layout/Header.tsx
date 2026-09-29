import React from 'react';
import { Menu, Search, Bell, Sparkles, Compass } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Link, useNavigate } from 'react-router-dom';
import type { ShellProfile } from '../../hooks/useShellProfile';

export interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenAskCareerOS?: () => void;
  shellProfile: ShellProfile | null;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  onOpenAskCareerOS,
  shellProfile,
}) => {
  const navigate = useNavigate();

  const displayName = shellProfile?.fullName ?? '…';
  const displayCareer = shellProfile?.careerGoal || '';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile trigger & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search skills, challenges, roadmap..."
            className="w-full bg-slate-50 border border-[#E2E8F0] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
          />
        </div>
      </div>

      {/* Right: Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Career Tracker Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-[#E2E8F0] rounded-full text-xs text-[#475569]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Status:</span>
          <span className="font-semibold text-[#0F172A]">Assessment Active</span>
        </div>

        {/* Ask CareerOS Quick AI Button */}
        {onOpenAskCareerOS && (
          <button
            onClick={onOpenAskCareerOS}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF6FF] text-[#2563EB] hover:bg-blue-100 text-xs font-semibold rounded-lg border border-blue-200 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask CareerOS</span>
          </button>
        )}

        {/* Roadmap Quick Link */}
        <button
          onClick={() => navigate('/roadmap')}
          className="p-2 text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer relative"
          title="Your Roadmap"
          aria-label="View Roadmap"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button
          className="p-2 text-[#475569] hover:text-[#0F172A] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#2563EB] rounded-full" />
        </button>

        <div className="h-6 w-px bg-[#E2E8F0] mx-1" />

        {/* User Profile */}
        <Link to="/profile" className="flex items-center gap-2 group">
          <Avatar name={displayName} size="sm" />
          <div className="hidden md:block text-left">
            <span className="text-xs font-bold text-[#0F172A] block leading-tight group-hover:text-[#2563EB] transition-colors">
              {displayName}
            </span>
            <span className="text-[10px] text-[#94A3B8] font-medium block">
              {displayCareer}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
};

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Compass,
  Trophy,
  Briefcase,
  TrendingUp,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  X,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import type { ShellProfile } from '../../hooks/useShellProfile';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  shellProfile: ShellProfile | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, className, shellProfile }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const mainNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Careers & Skills', path: '/career', icon: Target },
    { label: 'Roadmap', path: '/roadmap', icon: Compass },
    { label: 'Challenges', path: '/challenge', icon: Trophy },
    { label: 'Opportunities', path: '/opportunities', icon: Briefcase },
    { label: 'Progress', path: '/result', icon: TrendingUp },
  ];

  const secondaryNav = [
    { label: 'Profile', path: '/profile', icon: User },
    { label: 'Settings', path: '#settings', icon: Settings, isModal: true },
    { label: 'Help', path: '#help', icon: HelpCircle, isModal: true },
  ];

const handleLogout = async () => {
  await signOut();
  navigate('/login', { replace: true });
};

  const displayName = shellProfile?.fullName ?? '…';
  const displayCareer = shellProfile?.careerGoal || '—';
  const displayInstitution = shellProfile?.institution || '';
  const displayReadiness = shellProfile?.readinessScore;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#E2E8F0] flex flex-col transition-transform duration-200 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#E2E8F0]">
          <NavLink to="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="w-8 h-8 rounded-lg bg-[#14213D] text-white flex items-center justify-center font-bold text-sm shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <span className="font-bold text-base text-[#14213D] tracking-tight block">CareerOS AI</span>
              <span className="text-[10px] text-[#2563EB] font-semibold uppercase tracking-wider block -mt-1">Readiness Engine</span>
            </div>
          </NavLink>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 text-[#94A3B8] hover:text-[#0F172A] rounded-lg cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Target Career Quick Pill */}
        <div className="px-4 pt-4">
          <div className="p-3 bg-[#EFF6FF] border border-blue-100 rounded-lg">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2563EB] block">Target Career</span>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs font-bold text-[#14213D]">{displayCareer}</span>
              <span className="text-xs font-semibold text-[#2563EB] bg-white px-1.5 py-0.5 rounded shadow-2xs">
                {displayReadiness !== null && displayReadiness !== undefined
                  ? `${displayReadiness}% Ready`
                  : 'Not assessed'}
              </span>
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-1.5 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Main Menu
          </div>
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors group',
                    isActive
                      ? 'bg-[#14213D] text-white shadow-2xs'
                      : 'text-[#475569] hover:bg-slate-100 hover:text-[#0F172A]'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Separator */}
          <div className="pt-4 pb-2">
            <div className="h-px bg-[#E2E8F0] mx-3" />
          </div>

          <div className="px-3 pb-1.5 text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Account & Support
          </div>
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors group',
                    isActive && !item.isModal
                      ? 'bg-[#14213D] text-white shadow-2xs'
                      : 'text-[#475569] hover:bg-slate-100 hover:text-[#0F172A]'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-[#DC2626] hover:bg-red-50 transition-colors cursor-pointer mt-2"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </nav>

        {/* User Mini Bar */}
        <div className="p-3 border-t border-[#E2E8F0] bg-slate-50/70">
          <NavLink
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition-colors"
          >
            <Avatar name={displayName} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#0F172A] truncate">{displayName}</p>
              <p className="text-[11px] text-[#475569] truncate">{displayInstitution}</p>
            </div>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

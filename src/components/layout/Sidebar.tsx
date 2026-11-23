import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Cpu,
  CalendarDays,
  FolderKanban,
  Sparkles,
  ClipboardCheck,
  BarChart3,
  Settings,
  X,
  ShieldCheck,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { LabLinkIcon } from '../brand/LabLinkIcon';
import { useApp } from '../../context/AppContext';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  badge?: string | number;
  roles: ('student' | 'faculty' | 'admin')[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentRole, approvals, conflicts, bookings } = useApp();

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const activeConflictsCount = conflicts.filter((c) => !c.resolved).length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;

  const navItems: NavItem[] = [
    {
      name: 'Overview',
      path: '/',
      icon: <LayoutDashboard className="w-4 h-4" />,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      name: 'Explore Equipment',
      path: '/explore',
      icon: <Cpu className="w-4 h-4" />,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      name: 'My Bookings',
      path: '/bookings',
      icon: <CalendarDays className="w-4 h-4" />,
      badge: pendingBookingsCount > 0 ? pendingBookingsCount : undefined,
      roles: ['student', 'faculty', 'admin'],
    },
    {
      name: 'Project Requests',
      path: '/projects',
      icon: <FolderKanban className="w-4 h-4" />,
      roles: ['student', 'admin'],
    },
    {
      name: 'Smart Allocation',
      path: '/allocation',
      icon: <Sparkles className="w-4 h-4 text-[#f0c45a]" />,
      badge: activeConflictsCount > 0 ? `${activeConflictsCount} conflict` : undefined,
      roles: ['faculty', 'admin'],
    },
    {
      name: 'Faculty Approvals',
      path: '/approvals',
      icon: <ClipboardCheck className="w-4 h-4" />,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      roles: ['faculty', 'admin'],
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: <BarChart3 className="w-4 h-4" />,
      roles: ['faculty', 'admin'],
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: <Settings className="w-4 h-4" />,
      roles: ['student', 'faculty', 'admin'],
    },
  ];

  const filteredNavItems = navItems.filter((item) => item.roles.includes(currentRole));

  const roleMeta = {
    student: { label: 'Student Mode', icon: <GraduationCap className="w-3.5 h-3.5 text-[#f0c45a]" /> },
    faculty: { label: 'Faculty Reviewer', icon: <Briefcase className="w-3.5 h-3.5 text-[#f0c45a]" /> },
    admin: { label: 'Lab Administrator', icon: <ShieldCheck className="w-3.5 h-3.5 text-[#f0c45a]" /> },
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#121311] border-r border-[#232321]
          flex flex-col transition-transform duration-200 ease-in-out
          lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#232321] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[2px] bg-[#181916] border border-[#232321] flex items-center justify-center text-[#f0c45a]">
              <LabLinkIcon size={18} className="text-[#f0c45a]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-semibold tracking-tight text-[#faf8f9]">
                  LabLink
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f0c45a]" />
              </div>
              <p className="text-[11px] text-[#8e8e8c] tracking-tight">Campus Lab Grid</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-[2px] text-[#8e8e8c] hover:text-[#faf8f9] hover:bg-[#181916] cursor-pointer"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Demo Role Indicator */}
        <div className="px-4 py-3 bg-[#0e0f0d] border-b border-[#232321]">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] text-[#8e8e8c] uppercase tracking-wider">Active Role</span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] bg-[#181916] border border-[#232321] text-xs font-normal text-[#faf8f9]">
              {roleMeta[currentRole].icon}
              <span className="text-[11px]">{roleMeta[currentRole].label}</span>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 px-3 py-4 overflow-y-auto space-y-1">
          <div className="px-3 pb-2 text-[10px] font-medium text-[#676865] uppercase tracking-wider">
            Navigation
          </div>

          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-2 text-xs transition-colors group cursor-pointer
                ${
                  isActive
                    ? 'bg-[#181916] text-[#faf8f9] font-medium border-l-2 border-[#f0c45a] pl-2.5 rounded-none'
                    : 'text-[#8e8e8c] hover:text-[#faf8f9] hover:bg-[#181916] rounded-[2px]'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`shrink-0 transition-colors ${
                        isActive ? 'text-[#f0c45a]' : 'text-[#676865] group-hover:text-[#8e8e8c]'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] shrink-0 border ${
                        item.path === '/allocation'
                          ? 'bg-[#221b0c] text-[#f0c45a] border-[#3d3015]'
                          : 'bg-[#181916] text-[#8e8e8c] border-[#232321]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#232321] bg-[#0e0f0d]">
          <div className="p-2.5 rounded-[2px] border border-[#232321] bg-[#121311]">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span className="text-[11px] font-medium text-[#faf8f9]">
                Allocation Engine Online
              </span>
            </div>
            <p className="text-[10px] text-[#8e8e8c] leading-tight">
              Deterministic priority & fairness matrix active.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

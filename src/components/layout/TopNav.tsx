import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  ChevronDown,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Role } from '../../types';
import { NotificationPanel } from '../notifications/NotificationPanel';

export interface TopNavProps {
  onToggleSidebar: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { currentRole, setCurrentRole, currentUser, notifications, globalSearch, setGlobalSearch } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Determine page title based on pathname
  const getPageTitle = (path: string) => {
    switch (path) {
      case '/':
        return 'Overview';
      case '/explore':
        return 'Explore Equipment';
      case '/bookings':
        return 'My Bookings';
      case '/projects':
        return 'Project Requests';
      case '/allocation':
        return 'Smart Allocation';
      case '/approvals':
        return 'Faculty Approvals';
      case '/analytics':
        return 'Analytics';
      case '/settings':
        return 'Settings';
      default:
        return 'LabLink';
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roles: { id: Role; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'student',
      label: 'Student',
      desc: 'Browse labs, book slots & request projects',
      icon: <GraduationCap className="w-4 h-4 text-[#f0c45a]" />,
    },
    {
      id: 'faculty',
      label: 'Faculty',
      desc: 'Approve requests, manage labs & review',
      icon: <Briefcase className="w-4 h-4 text-[#f0c45a]" />,
    },
    {
      id: 'admin',
      label: 'Lab Administrator',
      desc: 'Full campus access & conflict arbitration',
      icon: <ShieldCheck className="w-4 h-4 text-[#f0c45a]" />,
    },
  ];

  return (
    <header className="h-16 bg-[#0a0a09] border-b border-[#232321] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left section: Hamburger + Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-[2px] text-[#8e8e8c] hover:text-[#faf8f9] hover:bg-[#181916] lg:hidden cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-medium text-[#faf8f9] tracking-tight leading-tight">
            {getPageTitle(location.pathname)}
          </h1>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#676865]">
            <span className="flex items-center gap-1 text-[#8e8e8c]">
              <Building2 className="w-3 h-3 text-[#676865]" />
              Central Campus Facility
            </span>
            <span>/</span>
            <span>6 Departments Connected</span>
          </div>
        </div>
      </div>

      {/* Center/Right: Search, Role Switcher, Notification, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search bar */}
        <div className="hidden md:block w-48 lg:w-60">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#676865] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              placeholder="Search instruments..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#0e0f0d] border border-[#232321] rounded-[2px] text-[#faf8f9] placeholder-[#676865] focus:bg-[#121311] focus:outline-none focus:ring-1 focus:ring-[#f0c45a] focus:border-[#f0c45a] transition-colors"
            />
          </div>
        </div>

        {/* Demo Role Selector (CRITICAL REQUIREMENT) */}
        <div className="relative" ref={roleDropdownRef}>
          <button
            type="button"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-[2px] border border-[#232321] bg-[#121311] hover:bg-[#181916] text-[#faf8f9] text-xs font-normal cursor-pointer transition-colors"
            aria-expanded={isRoleDropdownOpen}
          >
            <span className="text-[10px] uppercase text-[#676865] hidden sm:inline">Role:</span>
            <span className="capitalize text-[#f0c45a] font-medium">
              {currentRole === 'admin' ? 'Administrator' : currentRole}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#8e8e8c]" />
          </button>

          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-64 bg-[#121311] rounded-[2px] shadow-2xl border border-[#232321] py-1 z-50 overflow-hidden">
              <div className="px-3.5 py-2 bg-[#0e0f0d] border-b border-[#232321]">
                <p className="text-[10px] font-medium uppercase tracking-wider text-[#676865]">
                  Select Demo Role
                </p>
                <p className="text-[11px] text-[#8e8e8c]">
                  Switch perspectives instantly without authentication.
                </p>
              </div>

              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setCurrentRole(r.id);
                    setIsRoleDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 hover:bg-[#181916] transition-colors cursor-pointer ${
                    currentRole === r.id ? 'bg-[#181916] text-[#faf8f9]' : 'text-[#8e8e8c]'
                  }`}
                >
                  <div className="mt-0.5 p-1 rounded-[2px] bg-[#0e0f0d] border border-[#232321] shrink-0">
                    {r.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[#faf8f9]">{r.label}</span>
                      {currentRole === r.id && (
                        <span className="text-[10px] text-[#f0c45a] font-mono">Active</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8e8e8c] line-clamp-1">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-[2px] text-[#8e8e8c] hover:text-[#faf8f9] hover:bg-[#181916] transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f0c45a]" />
            )}
          </button>

          <NotificationPanel
            isOpen={isNotifOpen}
            onClose={() => setIsNotifOpen(false)}
          />
        </div>

        {/* User Profile Indicator */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#232321]">
          <div className="w-7.5 h-7.5 rounded-[2px] bg-[#181916] border border-[#232321] text-[#faf8f9] flex items-center justify-center text-xs font-mono">
            {currentUser.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-medium text-[#faf8f9] leading-tight">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-[#676865] leading-tight">
              {'department' in currentUser ? `${currentUser.department} Department` : 'Central Admin'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;

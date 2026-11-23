import React, { useState } from 'react';
import {
  User, Bell, Info, Monitor, ChevronRight,
  Mail, Building, GraduationCap, Briefcase, Check, Database,
  BookOpen, Cpu, LayoutDashboard,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useApp } from '../context/AppContext';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
  label: string;
  description: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, id, label, description }) => (
  <div className="flex items-start justify-between gap-4 py-3.5 border-b border-[#232321] last:border-0">
    <label htmlFor={id} className="cursor-pointer flex-1">
      <p className="text-xs font-medium text-[#faf8f9]">{label}</p>
      <p className="text-[11px] text-[#8e8e8c] mt-0.5">{description}</p>
    </label>
    <button
      id={id}
      role="switch"
      type="button"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-none border border-[#232321] transition-colors duration-150 ease-in-out focus:outline-none ${
        checked ? 'bg-[#f0c45a]' : 'bg-[#181916]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-none ${
          checked ? 'bg-[#040404] translate-x-3.5' : 'bg-[#676865] translate-x-0'
        } transition duration-150 ease-in-out`}
      />
    </button>
  </div>
);

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon, title, description,
}) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="w-8 h-8 rounded-[2px] bg-[#181916] border border-[#232321] flex items-center justify-center text-[#f0c45a]">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-medium text-[#faf8f9]">{title}</h3>
      <p className="text-xs text-[#8e8e8c]">{description}</p>
    </div>
  </div>
);

export const SettingsPage: React.FC = () => {
  const { currentUser, currentRole, setCurrentRole } = useApp();

  const [notifPrefs, setNotifPrefs] = useState({
    bookingApproved: true,
    bookingRejected: true,
    newRequest: true,
    conflictAlert: true,
    upcomingReminder: false,
    weeklyDigest: false,
  });

  const [displayPrefs, setDisplayPrefs] = useState({
    compactCards: false,
    showDepartmentColors: true,
    animationsEnabled: true,
  });

  const toggle = (key: keyof typeof notifPrefs) =>
    setNotifPrefs((p) => ({ ...p, [key]: !p[key] }));

  const toggleDisplay = (key: keyof typeof displayPrefs) =>
    setDisplayPrefs((p) => ({ ...p, [key]: !p[key] }));

  const isStudent = currentRole === 'student';
  const isFaculty = currentRole === 'faculty';
  const isAdmin = currentRole === 'admin';

  const roleBadge = {
    student: { label: 'Student', color: 'bg-[#181916] text-[#faf8f9] border-[#232321]' },
    faculty: { label: 'Faculty', color: 'bg-[#181916] text-[#faf8f9] border-[#232321]' },
    admin: { label: 'Lab Administrator', color: 'bg-[#221b0c] text-[#f0c45a] border-[#3d3015]' },
  }[currentRole];

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-medium text-[#faf8f9] tracking-tight">Platform Settings</h2>
        <p className="text-xs text-[#8e8e8c] mt-0.5">Manage session identity, telemetry alerts and demonstration configurations</p>
      </div>

      {/* Profile Card */}
      <Card>
        <SectionHeader
          icon={<User size={16} />}
          title="Active Session Identity"
          description="Current credentials and authority scope"
        />
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-[2px] bg-[#181916] border border-[#232321] flex items-center justify-center text-[#faf8f9] text-base font-mono shrink-0">
            {initials}
          </div>
          <div className="flex-1 space-y-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-medium text-[#faf8f9]">{currentUser.name}</h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-[1px] text-[10px] font-mono border ${roleBadge.color}`}>
                {roleBadge.label}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#8e8e8c]">
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-[#676865]" />
                <span className="font-mono">{currentUser.email}</span>
              </div>
              {isStudent && 'department' in currentUser && (
                <>
                  <div className="flex items-center gap-2">
                    <Building size={13} className="text-[#676865]" />
                    <span>{currentUser.department} Department</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap size={13} className="text-[#676865]" />
                    <span>Year {(currentUser as any).year} Candidate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen size={13} className="text-[#676865]" />
                    <span className="font-mono">ID: {(currentUser as any).rollNumber}</span>
                  </div>
                </>
              )}
              {isFaculty && 'designation' in currentUser && (
                <>
                  <div className="flex items-center gap-2">
                    <Building size={13} className="text-[#676865]" />
                    <span>{(currentUser as any).department} Department</span>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <Briefcase size={13} className="text-[#676865]" />
                    <span>{(currentUser as any).designation}</span>
                  </div>
                </>
              )}
              {isAdmin && 'designation' in currentUser && (
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Briefcase size={13} className="text-[#676865]" />
                  <span>{(currentUser as any).designation}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Demo Mode Card */}
      <Card>
        <SectionHeader
          icon={<LayoutDashboard size={16} />}
          title="Demo Role Switcher"
          description="Switch operational perspective instantly without authentication barriers"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['student', 'faculty', 'admin'] as const).map((role) => {
            const icons = { student: GraduationCap, faculty: Briefcase, admin: Cpu };
            const labels = { student: 'Student', faculty: 'Faculty', admin: 'Lab Admin' };
            const descriptions = {
              student: 'Discover & book lab assets',
              faculty: 'Review and approve requests',
              admin: 'Arbitrate & manage fleet',
            };
            const Icon = icons[role];
            const isActive = currentRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setCurrentRole(role)}
                className={`relative flex flex-col items-start gap-1 p-3.5 rounded-[2px] border text-left transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#f0c45a] bg-[#221b0c] text-[#faf8f9]'
                    : 'border-[#232321] bg-[#0e0f0d] hover:border-[#353632] text-[#8e8e8c]'
                }`}
              >
                {isActive && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-[#f0c45a] text-[#040404] rounded-none flex items-center justify-center">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
                <Icon size={16} className={isActive ? 'text-[#f0c45a]' : 'text-[#676865]'} />
                <span className="text-xs font-medium text-[#faf8f9] mt-1">{labels[role]}</span>
                <span className="text-[11px] text-[#8e8e8c]">{descriptions[role]}</span>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-[11px] text-[#676865] flex items-center gap-1.5 font-mono">
          <Info size={11} />
          Switching perspectives updates navigation, permissions, and available views immediately.
        </p>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <SectionHeader
          icon={<Bell size={16} />}
          title="Notification Subscriptions"
          description="Events triggering telemetry alerts in the navigation bar"
        />
        <div>
          <ToggleSwitch
            id="notif-approved"
            checked={notifPrefs.bookingApproved}
            onChange={() => toggle('bookingApproved')}
            label="Booking Confirmations"
            description="Notify when laboratory reservations are authorized"
          />
          <ToggleSwitch
            id="notif-rejected"
            checked={notifPrefs.bookingRejected}
            onChange={() => toggle('bookingRejected')}
            label="Schedule Cancellations"
            description="Notify when reservation windows are declined or released"
          />
          <ToggleSwitch
            id="notif-new"
            checked={notifPrefs.newRequest}
            onChange={() => toggle('newRequest')}
            label="Project Request Submissions"
            description="Alert faculty when students file equipment project demands"
          />
          <ToggleSwitch
            id="notif-conflict"
            checked={notifPrefs.conflictAlert}
            onChange={() => toggle('conflictAlert')}
            label="Contention Dispatches"
            description="Alert when automated priority arbitrates an active schedule collision"
          />
          <ToggleSwitch
            id="notif-upcoming"
            checked={notifPrefs.upcomingReminder}
            onChange={() => toggle('upcomingReminder')}
            label="Lock Code Reminders"
            description="Send electronic bench access codes 30 minutes before session start"
          />
        </div>
      </Card>

      {/* Display Preferences */}
      <Card>
        <SectionHeader
          icon={<Monitor size={16} />}
          title="Telemetry Display"
          description="Interface density and technical rendering flags"
        />
        <div>
          <ToggleSwitch
            id="disp-compact"
            checked={displayPrefs.compactCards}
            onChange={() => toggleDisplay('compactCards')}
            label="High-Density Grid Layout"
            description="Display denser instrumentation views with compact spacing"
          />
          <ToggleSwitch
            id="disp-dept-colors"
            checked={displayPrefs.showDepartmentColors}
            onChange={() => toggleDisplay('showDepartmentColors')}
            label="Department Identifier Badges"
            description="Show engineering department tags across all catalog assets"
          />
          <ToggleSwitch
            id="disp-anim"
            checked={displayPrefs.animationsEnabled}
            onChange={() => toggleDisplay('animationsEnabled')}
            label="Telemetry Transitions"
            description="Enable subtle hardware status transition animations"
          />
        </div>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <SectionHeader
          icon={<Database size={16} />}
          title="Session State Persistence"
          description="Manage client-side localStorage state"
        />
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-[2px] bg-[#0e0f0d] border border-[#232321]">
            <div>
              <p className="text-xs font-medium text-[#faf8f9]">Local Client Storage</p>
              <p className="text-[11px] text-[#8e8e8c] mt-0.5">Reservations, project requests, and approval actions saved across browser reloads</p>
            </div>
            <span className="text-[11px] font-mono text-[#4ade80] flex items-center gap-1">
              <Check size={12} />
              Synchronized
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all bookings, projects, approvals and arbitrations to system defaults?')) {
                localStorage.removeItem('lablink_bookings');
                localStorage.removeItem('lablink_notifications');
                localStorage.removeItem('lablink_approvals');
                localStorage.removeItem('lablink_projects');
                localStorage.removeItem('lablink_conflicts');
                window.location.reload();
              }
            }}
            className="w-full flex items-center justify-between p-3 rounded-[2px] border border-[#441a1d] bg-[#241113] text-[#f87171] text-xs hover:bg-[#321619] transition-colors cursor-pointer"
          >
            <span>Reset Demo State to Initial Seed Data</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </Card>

      {/* About */}
      <Card>
        <SectionHeader
          icon={<Info size={16} />}
          title="System Architecture"
          description="LabLink platform specifications"
        />
        <div className="space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              ['Platform', 'LabLink Core'],
              ['Tagline', 'Campus Lab Grid'],
              ['Stack', 'React + TypeScript + Vite'],
              ['Theme', 'Industrial Dark System'],
              ['Visuals', 'Recharts Telemetry'],
              ['Icons', 'Lucide React'],
              ['Routing', 'React Router v7'],
              ['Arbitration', 'Deterministic Priority Engine'],
            ].map(([k, v]) => (
              <div key={k} className="p-2.5 rounded-[2px] bg-[#0e0f0d] border border-[#232321]">
                <p className="text-[10px] text-[#8e8e8c] uppercase font-mono">{k}</p>
                <p className="text-xs text-[#faf8f9] mt-0.5">{v}</p>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-[#232321] text-xs text-[#8e8e8c] leading-relaxed">
            LabLink is a centralized campus laboratory resource-sharing platform. Students discover and reserve instruments, faculty review and authorize complex requests, and scheduling collisions are arbitrated through transparent multi-variable fairness scoring.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;

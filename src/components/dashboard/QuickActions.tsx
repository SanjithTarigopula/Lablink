import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, FolderPlus, Sparkles, BarChart2, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { currentRole } = useApp();

  return (
    <div className="bg-[#121311] rounded-[2px] border border-[#232321] p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-wider text-[#8e8e8c]">
            Quick Actions
          </h3>
          <p className="text-xs text-[#faf8f9] mt-0.5">
            Operations tailored for active role session
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-[#ece8df] text-[#040404] text-xs font-medium hover:bg-[#f5f2ea] cursor-pointer transition-colors"
          >
            <CalendarPlus className="w-3.5 h-3.5" />
            <span>Book Equipment</span>
          </button>

          {currentRole !== 'faculty' && (
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-[#181916] border border-[#232321] text-[#faf8f9] text-xs hover:border-[#353632] hover:bg-[#20211d] cursor-pointer transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[#f0c45a]" />
              <span>New Project Request</span>
            </button>
          )}

          {(currentRole === 'faculty' || currentRole === 'admin') && (
            <button
              type="button"
              onClick={() => navigate('/allocation')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-[#221b0c] border border-[#3d3015] text-[#f0c45a] text-xs hover:bg-[#2a220f] cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Allocation</span>
            </button>
          )}

          {currentRole === 'faculty' && (
            <button
              type="button"
              onClick={() => navigate('/approvals')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-[#181916] border border-[#232321] text-[#faf8f9] text-xs hover:border-[#353632] hover:bg-[#20211d] cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#4ade80]" />
              <span>Faculty Approvals</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/analytics')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[2px] bg-[#181916] border border-[#232321] text-[#faf8f9] text-xs hover:border-[#353632] hover:bg-[#20211d] cursor-pointer transition-colors"
          >
            <BarChart2 className="w-3.5 h-3.5 text-[#8e8e8c]" />
            <span>Usage Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;

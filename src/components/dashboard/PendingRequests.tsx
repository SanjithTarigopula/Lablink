import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, AlertCircle, Calendar } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/helpers';

export const PendingRequests: React.FC = () => {
  const { approvals, currentRole } = useApp();

  const pendingList = approvals.filter((a) => a.status === 'pending').slice(0, 4);

  return (
    <Card
      title="Pending Faculty Reviews"
      subtitle={
        currentRole === 'student'
          ? 'Project equipment requests awaiting professor authorization'
          : 'High-demand equipment authorizations awaiting review'
      }
      action={
        <Link
          to={currentRole === 'student' ? '/projects' : '/approvals'}
          className="text-xs text-[#8e8e8c] hover:text-[#f0c45a] flex items-center gap-1 group transition-colors"
        >
          {currentRole === 'student' ? 'My projects' : 'Review queue'}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      }
    >
      {pendingList.length === 0 ? (
        <div className="py-8 text-center text-xs text-[#676865]">
          No pending approvals at this time.
        </div>
      ) : (
        <div className="space-y-3">
          {pendingList.map((appr) => (
            <div
              key={appr.id}
              className="p-3.5 rounded-[2px] border border-[#232321] bg-[#0e0f0d] hover:border-[#353632] transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <h4 className="text-xs font-medium text-[#faf8f9] leading-snug">
                    {appr.projectTitle}
                  </h4>
                  <p className="text-[11px] text-[#8e8e8c] mt-0.5">
                    By <span className="text-[#e5e5e4]">{appr.studentName}</span> ({appr.department})
                  </p>
                </div>
                <Badge variant="pending" size="sm">
                  Pending Review
                </Badge>
              </div>

              <div className="bg-[#121311] p-2.5 rounded-[2px] border border-[#232321] text-[11px] text-[#e5e5e4] space-y-1 mb-2.5">
                <div className="text-[#faf8f9]">
                  Requested: {appr.equipmentRequests.map((r) => r.equipmentName).join(', ')}
                </div>
                <div className="flex items-center gap-2 text-[#8e8e8c]">
                  <Calendar className="w-3 h-3 text-[#676865]" />
                  <span>Deadline: <span className="font-mono text-[#faf8f9]">{formatDate(appr.projectDeadline)}</span></span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5 text-[#f0c45a]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Requires faculty sign-off</span>
                </div>
                <Link
                  to="/approvals"
                  className="text-xs text-[#ece8df] hover:text-[#f0c45a] transition-colors"
                >
                  Examine Request →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default PendingRequests;

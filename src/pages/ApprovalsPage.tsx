import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  AlertTriangle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CalendarClock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { FacultyApproval } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { EmptyState } from '../components/ui/EmptyState';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { formatDate } from '../utils/helpers';

interface ApprovalCardProps {
  approval: FacultyApproval;
}

const ApprovalCard: React.FC<ApprovalCardProps> = ({ approval }) => {
  const { updateApproval, currentRole } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [suggestionSlot, setSuggestionSlot] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  const deadlineDiff = Math.ceil(
    (new Date(approval.projectDeadline).getTime() - Date.now()) / 86400000
  );
  const isUrgent = deadlineDiff <= 7;

  const handleApprove = () => {
    updateApproval(approval.id, {
      status: 'approved',
      reviewerNote: 'Approved. Equipment slot confirmed and reserved.',
    });
    setIsApproveOpen(false);
  };

  const handleReject = () => {
    updateApproval(approval.id, {
      status: 'rejected',
      reviewerNote: rejectReason || 'Request rejected by faculty reviewer.',
    });
    setIsRejectOpen(false);
    setRejectReason('');
  };

  const canAct = (currentRole === 'faculty' || currentRole === 'admin') && approval.status === 'pending';

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-[#121311] rounded-[2px] border transition-colors overflow-hidden ${
          approval.status === 'pending'
            ? isUrgent
              ? 'border-[#f0c45a]/50'
              : 'border-[#232321]'
            : approval.status === 'approved'
            ? 'border-[#1b3b29]'
            : 'border-[#441a1d]'
        }`}
      >
        {/* Card Header */}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-[2px] bg-[#181916] border border-[#232321] text-[#faf8f9] flex items-center justify-center text-xs font-mono shrink-0">
                {approval.studentName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-[#faf8f9]">{approval.studentName}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#181916] text-[#8e8e8c] border border-[#232321] rounded-[1px]">
                    {approval.department}
                  </span>
                  {isUrgent && approval.status === 'pending' && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#221b0c] text-[#f0c45a] border border-[#3d3015] rounded-[1px] flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-[#f0c45a]" />
                      URGENT — {deadlineDiff}d left
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#8e8e8c] mt-0.5">{approval.projectTitle}</p>
              </div>
            </div>
            <Badge variant={approval.status} size="sm">{approval.status}</Badge>
          </div>

          {/* Equipment Requested */}
          <div className="bg-[#0e0f0d] rounded-[2px] p-3 border border-[#232321] space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c]">Requested Equipment</span>
            {approval.equipmentRequests.map((req, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-[#faf8f9]">{req.equipmentName}</span>
                <span className="text-[#8e8e8c] font-mono">{formatDate(req.startDate)} → {formatDate(req.endDate)}</span>
              </div>
            ))}
          </div>

          {/* Deadline row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-[#8e8e8c]">
              <CalendarClock className="w-3.5 h-3.5 text-[#f0c45a]" />
              <span>Project deadline: <strong className={isUrgent ? 'text-[#f0c45a] font-mono' : 'text-[#faf8f9] font-mono font-normal'}>{formatDate(approval.projectDeadline)}</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-[#8e8e8c] hover:text-[#faf8f9] flex items-center gap-1 cursor-pointer transition-colors"
            >
              {isExpanded ? (
                <><ChevronUp className="w-3.5 h-3.5" /><span>Less detail</span></>
              ) : (
                <><ChevronDown className="w-3.5 h-3.5" /><span>More detail</span></>
              )}
            </button>
          </div>

          {/* Expanded detail */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-3">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1">Student Justification</p>
                    <p className="text-xs text-[#e5e5e4] leading-relaxed bg-[#0e0f0d] p-3 rounded-[2px] border border-[#232321]">
                      {approval.justification}
                    </p>
                  </div>
                  {approval.reviewerNote && (
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1">Faculty Note</p>
                      <p className="text-xs text-[#e5e5e4] leading-relaxed bg-[#181916] p-3 rounded-[2px] border border-[#232321]">
                        {approval.reviewerNote}
                      </p>
                    </div>
                  )}
                  {approval.suggestedSlot && (
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1">Suggested Alternative Slot</p>
                      <p className="text-xs font-mono text-[#f0c45a] bg-[#221b0c] p-2.5 rounded-[2px] border border-[#3d3015]">
                        Slot: {approval.suggestedSlot}
                      </p>
                    </div>
                  )}

                  {/* Suggest alt slot form */}
                  {canAct && (
                    <div>
                      <button
                        type="button"
                        onClick={() => setIsSuggesting(!isSuggesting)}
                        className="text-xs text-[#ece8df] hover:text-[#f0c45a] cursor-pointer flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        {isSuggesting ? 'Cancel suggestion' : 'Suggest alternative slot'}
                      </button>
                      {isSuggesting && (
                        <div className="mt-2 flex gap-2">
                          <input
                            type="text"
                            value={suggestionSlot}
                            onChange={(e) => setSuggestionSlot(e.target.value)}
                            placeholder="e.g., Dec 02 (10:00 - 14:00)"
                            className="flex-1 text-xs bg-[#0e0f0d] border border-[#232321] rounded-[2px] px-2.5 py-1.5 text-[#faf8f9] placeholder-[#676865] focus:outline-none focus:border-[#f0c45a]"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (suggestionSlot) {
                                updateApproval(approval.id, {
                                  status: 'rejected',
                                  reviewerNote: 'Alternative slot suggested.',
                                  suggestedSlot: suggestionSlot,
                                });
                                setIsSuggesting(false);
                                setSuggestionSlot('');
                              }
                            }}
                            className="px-3 py-1.5 text-xs bg-[#ece8df] text-[#040404] hover:bg-[#f5f2ea] rounded-[2px] cursor-pointer font-medium"
                          >
                            Send
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Footer */}
        {canAct && (
          <div className="px-5 pb-4 flex items-center justify-end gap-2 border-t border-[#232321] pt-3">
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsRejectOpen(true)}
              icon={<XCircle className="w-3.5 h-3.5" />}
            >
              Reject Request
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsApproveOpen(true)}
              icon={<CheckCircle2 className="w-3.5 h-3.5" />}
            >
              Approve & Allocate
            </Button>
          </div>
        )}

        {/* Reviewed metadata */}
        {approval.reviewedAt && (
          <div className="px-5 pb-3 flex items-center gap-2 text-[11px] text-[#676865] font-mono">
            <Clock className="w-3 h-3" />
            <span>Reviewed: {formatDate(approval.reviewedAt)}</span>
          </div>
        )}
      </motion.div>

      {/* Approve Confirm */}
      <ConfirmDialog
        isOpen={isApproveOpen}
        onClose={() => setIsApproveOpen(false)}
        onConfirm={handleApprove}
        title="Approve Equipment Request"
        message={`Approve ${approval.studentName}'s request for equipment in project "${approval.projectTitle}"? The booking slot will be reserved immediately.`}
        confirmLabel="Approve & Allocate"
        variant="primary"
      />

      {/* Reject Modal */}
      {isRejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-xs" onClick={() => setIsRejectOpen(false)} />
          <div className="relative bg-[#121311] rounded-[2px] border border-[#232321] p-6 w-full max-w-md z-10 space-y-4">
            <div>
              <h3 className="text-base font-medium text-[#faf8f9] mb-1">Reject Request</h3>
              <p className="text-xs text-[#8e8e8c]">
                Declining {approval.studentName}'s equipment request for "{approval.projectTitle}".
              </p>
            </div>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (e.g., equipment reserved for scheduled testing, suggest alternative)..."
              className="w-full text-xs bg-[#0e0f0d] border border-[#232321] rounded-[2px] p-3 text-[#faf8f9] placeholder-[#676865] focus:outline-none focus:border-[#f0c45a]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="md" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
              <Button variant="danger" size="md" onClick={handleReject} icon={<XCircle className="w-4 h-4" />}>
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const ApprovalsPage: React.FC = () => {
  const { approvals, currentRole } = useApp();
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');

  const counts = {
    pending: approvals.filter((a) => a.status === 'pending').length,
    approved: approvals.filter((a) => a.status === 'approved').length,
    rejected: approvals.filter((a) => a.status === 'rejected').length,
  };

  const tabs = [
    { label: 'Pending Review', value: 'pending', count: counts.pending },
    { label: 'Approved', value: 'approved', count: counts.approved },
    { label: 'Rejected', value: 'rejected', count: counts.rejected },
  ];

  const filtered = useMemo(() => {
    return approvals
      .filter((a) => a.status === activeTab)
      .filter((a) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          a.studentName.toLowerCase().includes(q) ||
          a.projectTitle.toLowerCase().includes(q) ||
          a.department.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        if (activeTab === 'pending') {
          return new Date(a.projectDeadline).getTime() - new Date(b.projectDeadline).getTime();
        }
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      });
  }, [approvals, activeTab, search]);

  if (currentRole === 'student') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
        <EmptyState
          icon={<ClipboardCheck className="w-6 h-6" />}
          title="Faculty Approval Queue"
          description="This section is accessible to faculty and lab administrators only. Switch your demo role to Faculty or Admin to review and authorize student equipment requests."
        />
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium text-[#faf8f9] tracking-tight">Faculty Approval Queue</h2>
          <p className="text-xs text-[#8e8e8c] mt-0.5">
            Review and authorize student equipment allocation requests prioritized by project deadline urgency
          </p>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="bg-[#121311] rounded-[2px] border border-[#232321] p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="border-0" />
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-[#676865] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student, project..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#0e0f0d] border border-[#232321] rounded-[2px] text-[#faf8f9] placeholder-[#676865] focus:bg-[#121311] focus:outline-none focus:border-[#f0c45a]"
            />
          </div>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck className="w-6 h-6" />}
          title={`No ${activeTab} requests`}
          description="There are currently no equipment requests in this queue state."
        />
      ) : (
        <div className="space-y-3.5">
          {filtered.map((approval) => (
            <ApprovalCard key={approval.id} approval={approval} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default ApprovalsPage;

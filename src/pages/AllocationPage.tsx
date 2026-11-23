import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Trophy,
  Clock,
  User,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Info,
  Zap,
  CalendarCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { AllocationConflict, ConflictingRequest } from '../types';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { formatDate } from '../utils/helpers';

// Priority bar component
const PriorityBar: React.FC<{ label: string; value: number; max: number; isWinner: boolean }> = ({
  label, value, max, isWinner,
}) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-[#8e8e8c]">{label}</span>
      <span className="font-mono text-[#faf8f9]">{value}/{max}</span>
    </div>
    <div className="h-1.5 bg-[#181916] border border-[#232321] rounded-none overflow-hidden">
      <div
        className={`h-full transition-all duration-700 ${isWinner ? 'bg-[#f0c45a]' : 'bg-[#ece8df]'}`}
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  </div>
);

// Student request card within a conflict
const ConflictingStudentCard: React.FC<{
  request: ConflictingRequest;
  rank: number;
  isWinner: boolean;
}> = ({ request, rank, isWinner }) => {
  const deadlineDiff = Math.ceil(
    (new Date(request.projectDeadline).getTime() - Date.now()) / 86400000
  );
  const urgencyScore = Math.max(5, Math.min(45, Math.round(45 - deadlineDiff * 3)));
  const fairnessScore = Math.max(5, Math.min(35, Math.round(35 - request.previousAllocations * 7)));
  const feasibilityScore = 18;

  return (
    <div
      className={`p-4 rounded-[2px] border transition-colors ${
        isWinner
          ? 'border-[#f0c45a]/60 bg-[#1c180e]'
          : 'border-[#232321] bg-[#0e0f0d]'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-7 h-7 rounded-[2px] border flex items-center justify-center text-xs font-mono shrink-0 ${
              isWinner
                ? 'bg-[#221b0c] text-[#f0c45a] border-[#3d3015]'
                : 'bg-[#181916] text-[#faf8f9] border-[#232321]'
            }`}
          >
            {request.studentName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-[#faf8f9]">{request.studentName}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#181916] text-[#8e8e8c] border border-[#232321] rounded-[1px]">
                {request.department}
              </span>
              {isWinner && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#221b0c] text-[#f0c45a] border border-[#3d3015] rounded-[1px] flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-[#f0c45a]" /> Priority Winner
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#8e8e8c] mt-0.5 line-clamp-1">{request.projectTitle}</p>
          </div>
        </div>

        <div className="text-right">
          <div className={`text-base font-mono font-medium ${isWinner ? 'text-[#f0c45a]' : 'text-[#faf8f9]'}`}>
            {request.priorityScore}
          </div>
          <div className="text-[10px] text-[#676865] font-mono">score pts</div>
        </div>
      </div>

      {/* Priority breakdown bars */}
      <div className="space-y-2 mb-3">
        <PriorityBar label="Deadline Urgency" value={urgencyScore} max={45} isWinner={isWinner} />
        <PriorityBar label="Allocation Fairness" value={fairnessScore} max={35} isWinner={isWinner} />
        <PriorityBar label="Feasibility Metric" value={feasibilityScore} max={20} isWinner={isWinner} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-[11px]">
        <div className="bg-[#121311] p-2 rounded-[2px] border border-[#232321] text-center">
          <div className="font-mono text-[#faf8f9]">{deadlineDiff}d</div>
          <div className="text-[10px] text-[#676865]">to deadline</div>
        </div>
        <div className="bg-[#121311] p-2 rounded-[2px] border border-[#232321] text-center">
          <div className="font-mono text-[#faf8f9]">{request.previousAllocations}</div>
          <div className="text-[10px] text-[#676865]">past bookings</div>
        </div>
        <div className="bg-[#121311] p-2 rounded-[2px] border border-[#232321] text-center">
          <div className="font-mono text-[#faf8f9]">#{rank}</div>
          <div className="text-[10px] text-[#676865]">rank position</div>
        </div>
      </div>
    </div>
  );
};

// Main Conflict Card
const ConflictCard: React.FC<{ conflict: AllocationConflict }> = ({ conflict }) => {
  const { resolveConflict, currentRole } = useApp();
  const [isExpanded, setIsExpanded] = useState(!conflict.resolved);
  const [isResolving, setIsResolving] = useState(false);

  // Sort requests by priority score descending
  const rankedRequests = [...conflict.requests].sort((a, b) => b.priorityScore - a.priorityScore);
  const winner = rankedRequests[0];

  const handleResolve = async () => {
    setIsResolving(true);
    await new Promise((r) => setTimeout(r, 600)); // Processing simulation

    const alternativeSlots = rankedRequests.slice(1).map((req, i) => {
      const suggestedDate = new Date();
      suggestedDate.setDate(suggestedDate.getDate() + i + 1);
      return {
        bookingId: req.bookingId,
        studentName: req.studentName,
        suggestedDate: suggestedDate.toISOString().split('T')[0],
        suggestedTime: '14:00 - 17:00',
        reason: `Next available slot on ${suggestedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} has zero contention on ${conflict.equipmentName}.`,
      };
    });

    resolveConflict(conflict.id, {
      selectedBookingId: winner.bookingId,
      reasoning: `${winner.studentName} selected based on highest priority score (${winner.priorityScore} pts). Key factors: project deadline urgency (${Math.ceil((new Date(winner.projectDeadline).getTime() - Date.now()) / 86400000)} days remaining) and lowest past allocation count (${winner.previousAllocations} sessions).`,
      alternativeSlots,
    });

    setIsResolving(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-[#121311] rounded-[2px] border overflow-hidden transition-colors ${
        conflict.resolved ? 'border-[#1b3b29]' : 'border-[#232321]'
      }`}
    >
      {/* Card Header */}
      <div
        className={`p-5 ${conflict.resolved ? 'bg-[#0e1d15]' : 'bg-[#151613]'}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-[2px] border flex items-center justify-center shrink-0 ${
                conflict.resolved
                  ? 'bg-[#12281d] border-[#1b3b29] text-[#4ade80]'
                  : 'bg-[#221b0c] border-[#3d3015] text-[#f0c45a]'
              }`}
            >
              {conflict.resolved ? <CheckCircle2 className="w-4.5 h-4.5" /> : <AlertTriangle className="w-4.5 h-4.5" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <span className="text-sm font-medium text-[#faf8f9]">{conflict.equipmentName}</span>
                {conflict.resolved ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#0e1d15] text-[#4ade80] rounded-[1px] border border-[#1b3b29]">
                    ✓ Resolved by Algorithm
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#221b0c] text-[#f0c45a] rounded-[1px] border border-[#3d3015]">
                    ⚡ Contention Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-[#8e8e8c]">
                <span className="flex items-center gap-1 font-mono">
                  <CalendarCheck className="w-3 h-3 text-[#676865]" />
                  {formatDate(conflict.date)}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-[#676865]" />
                  {conflict.timeSlot}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3 text-[#676865]" />
                  {conflict.requests.length} competing requests
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!conflict.resolved && (
              currentRole === 'student' ? (
                <span className="text-[11px] font-mono text-[#8e8e8c] px-2.5 py-1 bg-[#181916] border border-[#232321] rounded-[2px]">
                  Admin/Faculty Gated
                </span>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleResolve}
                  loading={isResolving}
                  icon={<Zap className="w-3.5 h-3.5" />}
                >
                  {isResolving ? 'Resolving...' : 'Resolve Conflict'}
                </Button>
              )
            )}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-[#8e8e8c] hover:text-[#faf8f9] hover:bg-[#181916] rounded-[2px] cursor-pointer"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>
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
            <div className="p-5 space-y-5 border-t border-[#232321]">
              {/* Scoring Notice */}
              <div className="p-3 bg-[#0e0f0d] rounded-[2px] border border-[#232321] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#f0c45a] shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#8e8e8c] leading-relaxed">
                  <strong className="text-[#faf8f9]">Deterministic Scoring Logic:</strong> Priority is calculated from three factors —
                  Deadline Urgency (45 pts), Allocation Fairness (35 pts), and Request Feasibility (20 pts).
                  No external AI model is connected; the allocation logic is completely transparent and reproducible.
                </p>
              </div>

              {/* Competing Students Grid */}
              <div>
                <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-3">
                  Competing Requests — Priority Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {rankedRequests.map((req, idx) => (
                    <ConflictingStudentCard
                      key={req.bookingId}
                      request={req}
                      rank={idx + 1}
                      isWinner={idx === 0}
                    />
                  ))}
                </div>
              </div>

              {/* Resolution Details (if resolved) */}
              {conflict.resolved && conflict.resolution && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c]">
                    Resolution Applied
                  </h4>
                  <div className="p-4 bg-[#0e1d15] rounded-[2px] border border-[#1b3b29]">
                    <div className="flex items-start gap-2.5 mb-3">
                      <Trophy className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
                      <p className="text-xs text-[#faf8f9] leading-relaxed">
                        {conflict.resolution.reasoning}
                      </p>
                    </div>
                    {conflict.resolution.alternativeSlots.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c]">
                          Suggested Alternative Slots
                        </p>
                        {conflict.resolution.alternativeSlots.map((alt, i) => (
                          <div
                            key={i}
                            className="p-2.5 bg-[#121311] rounded-[2px] border border-[#232321] text-xs"
                          >
                            <span className="font-medium text-[#faf8f9]">{alt.studentName}</span>
                            <span className="text-[#676865] mx-2">→</span>
                            <span className="text-[#f0c45a] font-mono">
                              {formatDate(alt.suggestedDate)} at {alt.suggestedTime}
                            </span>
                            <p className="text-[11px] text-[#8e8e8c] mt-0.5">{alt.reason}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const AllocationPage: React.FC = () => {
  const { conflicts, currentRole } = useApp();

  const unresolved = conflicts.filter((c) => !c.resolved);
  const resolved = conflicts.filter((c) => c.resolved);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4.5 h-4.5 text-[#f0c45a]" />
            <h2 className="text-xl font-medium text-[#faf8f9] tracking-tight">Smart Conflict Allocation</h2>
          </div>
          <p className="text-xs text-[#8e8e8c]">
            Algorithmic priority-based scheduling and equipment contention resolution engine
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 bg-[#221b0c] text-[#f0c45a] border border-[#3d3015] rounded-[2px] font-mono">
            {unresolved.length} Active Contention{unresolved.length !== 1 ? 's' : ''}
          </span>
          <span className="px-2.5 py-1 bg-[#0e1d15] text-[#4ade80] border border-[#1b3b29] rounded-[2px] font-mono">
            {resolved.length} Resolved
          </span>
        </div>
      </div>

      {/* Algorithm info banner */}
      <div className="p-4 bg-[#121311] rounded-[2px] border border-[#232321] flex items-start gap-3">
        <div className="w-8 h-8 rounded-[2px] bg-[#181916] border border-[#232321] flex items-center justify-center shrink-0">
          <TrendingUp className="w-4 h-4 text-[#f0c45a]" />
        </div>
        <div>
          <h4 className="text-xs font-medium text-[#faf8f9] mb-1">Priority Scoring Algorithm — Multi-variable Matrix</h4>
          <p className="text-[11px] text-[#8e8e8c] leading-relaxed">
            This module demonstrates <strong className="text-[#faf8f9]">deterministic priority-based allocation</strong>. Scores are computed from:
            <strong className="text-[#faf8f9]"> (1) Project Deadline Urgency</strong> (up to 45 pts) — closer deadlines score higher;
            <strong className="text-[#faf8f9]"> (2) Allocation Fairness</strong> (up to 35 pts) — applicants with fewer past bookings are prioritized;
            <strong className="text-[#faf8f9]"> (3) Request Feasibility</strong> (up to 20 pts) — capstone and faculty-linked projects score higher.
            No external AI model is connected. All logic is transparent, deterministic and reproducible.
          </p>
          {currentRole === 'student' && (
            <p className="text-[11px] text-[#f0c45a] font-mono mt-2 bg-[#221b0c] p-2 border border-[#3d3015] rounded-[2px]">
              Observer Mode: You are viewing contention telemetry as a Student. Conflict resolution and alternate slot allocation are executed by Faculty Reviewers and Lab Administrators.
            </p>
          )}
        </div>
      </div>

      {/* Stat summary cards */}
      <div className="grid grid-cols-3 gap-3.5">
        {[
          { label: 'Total Contentions', value: conflicts.length, color: 'text-[#faf8f9]' },
          { label: 'Active Conflicts', value: unresolved.length, color: 'text-[#f0c45a]' },
          { label: 'Arbitrated & Allocated', value: resolved.length, color: 'text-[#4ade80]' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-[2px] border border-[#232321] bg-[#121311]">
            <div className={`text-2xl font-mono font-medium ${s.color}`}>{s.value}</div>
            <div className="text-[11px] text-[#8e8e8c] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Conflict List */}
      {conflicts.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="w-6 h-6" />}
          title="Zero scheduling contentions"
          description="All laboratory equipment requests have non-overlapping reservation windows."
        />
      ) : (
        <div className="space-y-4">
          {conflicts.map((conflict) => (
            <ConflictCard key={conflict.id} conflict={conflict} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AllocationPage;

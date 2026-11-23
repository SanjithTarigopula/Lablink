export function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function formatTime(timeStr: string): string {
  // Converts 14:00 to 2:00 PM
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch {
    return timeStr;
  }
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'available':
    case 'approved':
    case 'confirmed':
    case 'completed':
      return 'bg-[#0e1d15] text-[#4ade80] border-[#1b3b29]';
    case 'in-use':
    case 'pending':
    case 'in-progress':
      return 'bg-[#221b0c] text-[#f0c45a] border-[#3d3015]';
    case 'maintenance':
    case 'rejected':
      return 'bg-[#241113] text-[#f87171] border-[#441a1d]';
    case 'cancelled':
      return 'bg-[#181916] text-[#8e8e8c] border-[#282924]';
    case 'reserved':
      return 'bg-[#121a24] text-[#93c5fd] border-[#1e2e42]';
    default:
      return 'bg-[#181916] text-[#8e8e8c] border-[#232321]';
  }
}

export function getDepartmentColor(dept: string): { bg: string; text: string; border: string; hex: string } {
  switch (dept) {
    case 'CSE':
      return { bg: 'bg-[#181916]', text: 'text-[#ece8df]', border: 'border-[#232321]', hex: '#ece8df' };
    case 'ECE':
      return { bg: 'bg-[#221b0c]', text: 'text-[#f0c45a]', border: 'border-[#3d3015]', hex: '#f0c45a' };
    case 'EEE':
      return { bg: 'bg-[#1a170d]', text: 'text-[#f0c45a]', border: 'border-[#2e2612]', hex: '#f0c45a' };
    case 'Mechanical':
      return { bg: 'bg-[#121a24]', text: 'text-[#93c5fd]', border: 'border-[#1e2e42]', hex: '#93c5fd' };
    case 'Civil':
      return { bg: 'bg-[#0e1d15]', text: 'text-[#4ade80]', border: 'border-[#1b3b29]', hex: '#4ade80' };
    case 'Biotechnology':
      return { bg: 'bg-[#121d1b]', text: 'text-[#2dd4bf]', border: 'border-[#193530]', hex: '#2dd4bf' };
    default:
      return { bg: 'bg-[#181916]', text: 'text-[#8e8e8c]', border: 'border-[#232321]', hex: '#8e8e8c' };
  }
}

export function generateId(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function calculatePriorityScore(
  deadlineDaysRemaining: number,
  previousAllocations: number,
  isAcademicCapstone = true
): { score: number; breakdown: { urgency: number; fairness: number; feasibility: number } } {
  // Urgency (0-45 pts): closer deadline = higher score
  const urgency = Math.max(5, Math.min(45, Math.round(45 - deadlineDaysRemaining * 3)));
  // Fairness (0-35 pts): fewer previous allocations = higher score
  const fairness = Math.max(5, Math.min(35, Math.round(35 - previousAllocations * 7)));
  // Feasibility (0-20 pts)
  const feasibility = isAcademicCapstone ? 18 : 12;

  const total = Math.min(100, urgency + fairness + feasibility);
  return {
    score: total,
    breakdown: { urgency, fairness, feasibility },
  };
}

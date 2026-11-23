// LabLink — Core TypeScript types
// Organized for future Firebase integration

export type Role = 'student' | 'faculty' | 'admin';

export type Department =
  | 'CSE'
  | 'ECE'
  | 'EEE'
  | 'Mechanical'
  | 'Civil'
  | 'Biotechnology';

export type EquipmentCategory =
  | 'Development Kit'
  | 'Test & Measurement'
  | 'Manufacturing'
  | 'Computing'
  | 'Robotics'
  | 'Optics & Imaging'
  | 'FPGA & Digital'
  | '3D Printing';

export type AvailabilityStatus = 'available' | 'in-use' | 'maintenance' | 'reserved';

export type BookingStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'confirmed'
  | 'completed'
  | 'cancelled';

export type ProjectStatus = 'draft' | 'submitted' | 'approved' | 'in-progress' | 'completed';

export type NotificationType =
  | 'booking-approved'
  | 'booking-rejected'
  | 'new-request'
  | 'conflict'
  | 'upcoming'
  | 'info';

export interface Equipment {
  id: string;
  name: string;
  department: Department;
  category: EquipmentCategory;
  status: AvailabilityStatus;
  location: string;
  description: string;
  imageUrl: string;
  specifications: Record<string, string>;
  bookingCount: number;
  rating: number;
  maxBookingHours: number;
}

export interface TimeSlot {
  id: string;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  isAvailable: boolean;
  bookedBy?: string;
}

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  studentId: string;
  studentName: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:MM
  endTime: string;     // HH:MM
  status: BookingStatus;
  purpose: string;
  projectId?: string;
  department: Department;
  createdAt: string;   // ISO date
}

export interface Student {
  id: string;
  name: string;
  email: string;
  department: Department;
  year: number;
  avatarUrl: string;
  rollNumber: string;
}

export interface FacultyMember {
  id: string;
  name: string;
  email: string;
  department: Department;
  designation: string;
  avatarUrl: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  department: Department;
  studentId: string;
  studentName: string;
  deadline: string;         // YYYY-MM-DD
  status: ProjectStatus;
  equipmentRequests: EquipmentRequest[];
  createdAt: string;
}

export interface EquipmentRequest {
  equipmentId: string;
  equipmentName: string;
  justification: string;
  startDate: string;
  endDate: string;
  hoursPerDay: number;
}

export interface FacultyApproval {
  id: string;
  projectId: string;
  projectTitle: string;
  studentId: string;
  studentName: string;
  department: Department;
  equipmentRequests: EquipmentRequest[];
  projectDeadline: string;
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewerNote?: string;
  suggestedSlot?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AllocationConflict {
  id: string;
  equipmentId: string;
  equipmentName: string;
  date: string;
  timeSlot: string;
  requests: ConflictingRequest[];
  resolved: boolean;
  resolution?: AllocationResolution;
}

export interface ConflictingRequest {
  bookingId: string;
  studentId: string;
  studentName: string;
  projectTitle: string;
  projectDeadline: string;
  purpose: string;
  priorityScore: number;
  previousAllocations: number;
  department: Department;
}

export interface AllocationResolution {
  selectedBookingId: string;
  alternativeSlots: AlternativeSlot[];
  reasoning: string;
}

export interface AlternativeSlot {
  bookingId: string;
  studentName: string;
  suggestedDate: string;
  suggestedTime: string;
  reason: string;
}

export interface AnalyticsData {
  overallUtilization: number;
  departmentUtilization: { department: Department; utilization: number }[];
  mostBooked: { name: string; bookings: number }[];
  underutilized: { name: string; utilization: number }[];
  bookingTrends: { month: string; bookings: number }[];
  peakHours: { hour: string; bookings: number }[];
  categoryDistribution: { category: string; count: number }[];
}

export interface DashboardStats {
  totalEquipment: number;
  availableEquipment: number;
  activeBookings: number;
  pendingApprovals: number;
  utilizationPercentage: number;
}

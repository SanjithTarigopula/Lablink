import React, { createContext, useContext, useState } from 'react';
import type {
  Role,
  Booking,
  Notification,
  FacultyApproval,
  Project,
  AllocationConflict,
  AllocationResolution,
  Equipment,
  Student,
  FacultyMember,
} from '../types';
import { initialBookings } from '../data/bookings';
import { initialNotifications } from '../data/notifications';
import { initialApprovals } from '../data/approvals';
import { initialProjects } from '../data/projects';
import { initialConflicts } from '../data/conflicts';
import { equipmentData } from '../data/equipment';
import { students, faculty } from '../data/users';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/helpers';

interface AppContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  currentUser: Student | FacultyMember | { id: string; name: string; email: string; designation: string };
  equipment: Equipment[];
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => { success: boolean; message: string; booking?: Booking };
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp'>) => void;
  approvals: FacultyApproval[];
  updateApproval: (id: string, updates: Partial<FacultyApproval>) => void;
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Project;
  conflicts: AllocationConflict[];
  resolveConflict: (conflictId: string, resolution: AllocationResolution) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useLocalStorage<Role>('lablink_demo_role', 'student');
  const [bookings, setBookings] = useLocalStorage<Booking[]>('lablink_bookings', initialBookings);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('lablink_notifications', initialNotifications);
  const [approvals, setApprovals] = useLocalStorage<FacultyApproval[]>('lablink_approvals', initialApprovals);
  const [projects, setProjects] = useLocalStorage<Project[]>('lablink_projects', initialProjects);
  const [conflicts, setConflicts] = useLocalStorage<AllocationConflict[]>('lablink_conflicts', initialConflicts);
  const [globalSearch, setGlobalSearch] = useState('');

  // Current user based on active demo role
  const currentUser = React.useMemo(() => {
    if (currentRole === 'faculty') {
      return faculty[0];
    }
    if (currentRole === 'admin') {
      return {
        id: 'adm-001',
        name: 'Lab Facilities Directorate',
        email: 'directorate.labs@campus.edu',
        designation: 'Central Research Facilities Administration',
      };
    }
    return students[0];
  }, [currentRole]);

  // Prevent double booking in frontend demo
  const addBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
    // Check if equipment already booked on that date and overlapping slot
    const isOverlapping = bookings.some((b) => {
      if (b.equipmentId !== bookingData.equipmentId || b.date !== bookingData.date) {
        return false;
      }
      // Skip cancelled, rejected, and completed bookings — they don't block new reservations
      if (b.status === 'rejected' || b.status === 'cancelled' || b.status === 'completed') return false;

      // Check slot overlap:
      // Time format HH:MM
      const startA = b.startTime;
      const endA = b.endTime;
      const startB = bookingData.startTime;
      const endB = bookingData.endTime;

      return (startA < endB && endA > startB);
    });

    if (isOverlapping) {
      return {
        success: false,
        message: 'This time slot is already reserved for this equipment. Please select another slot.',
      };
    }

    const newBooking: Booking = {
      ...bookingData,
      id: generateId('bkg'),
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Automatically trigger notification
    const newNotif: Notification = {
      id: generateId('notif'),
      type: 'new-request',
      title: 'Booking Submitted',
      message: `Your booking for ${bookingData.equipmentName} on ${bookingData.date} (${bookingData.startTime} - ${bookingData.endTime}) is pending approval.`,
      timestamp: 'Just now',
      read: false,
      actionUrl: '/bookings',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return {
      success: true,
      message: 'Booking successfully submitted!',
      booking: newBooking,
    };
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const updated = { ...b, ...updates };

        // Send notification on status change
        if (updates.status && updates.status !== b.status) {
          const notifType = updates.status === 'approved' || updates.status === 'confirmed'
            ? 'booking-approved'
            : 'booking-rejected';
          const statusNotif: Notification = {
            id: generateId('notif'),
            type: notifType,
            title: `Booking ${updates.status === 'cancelled' ? 'CANCELLED' : updates.status.toUpperCase()}`,
            message: `Booking for ${b.equipmentName} on ${b.date} has been updated to "${updates.status}".`,
            timestamp: 'Just now',
            read: false,
            actionUrl: '/bookings',
          };
          setNotifications((np) => [statusNotif, ...np]);
        }

        return updated;
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotif: Notification = {
      ...notif,
      id: generateId('notif'),
      timestamp: 'Just now',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const updateApproval = (id: string, updates: Partial<FacultyApproval>) => {
    setApprovals((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const updated = { ...a, ...updates, reviewedAt: new Date().toISOString() };

        if (updates.status) {
          const notifTitle = updates.status === 'approved' ? 'Project Request Approved' : 'Project Request Rejected';
          const notif: Notification = {
            id: generateId('notif'),
            type: updates.status === 'approved' ? 'booking-approved' : 'booking-rejected',
            title: notifTitle,
            message: `Your project request for "${a.projectTitle}" has been ${updates.status}. ${updates.reviewerNote ? `Note: ${updates.reviewerNote}` : ''}`,
            timestamp: 'Just now',
            read: false,
            actionUrl: '/projects',
          };
          setNotifications((np) => [notif, ...np]);
        }

        return updated;
      })
    );
  };

  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: generateId('proj'),
      createdAt: new Date().toISOString(),
    };

    setProjects((prev) => [newProject, ...prev]);

    // Also add to faculty approval queue if submitted
    if (projectData.status === 'submitted') {
      const newApproval: FacultyApproval = {
        id: generateId('appr'),
        projectId: newProject.id,
        projectTitle: newProject.title,
        studentId: newProject.studentId,
        studentName: newProject.studentName,
        department: newProject.department,
        equipmentRequests: newProject.equipmentRequests,
        projectDeadline: newProject.deadline,
        justification: newProject.description,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      };
      setApprovals((prev) => [newApproval, ...prev]);
    }

    addNotification({
      type: 'new-request',
      title: 'Project Created',
      message: `Project "${projectData.title}" registered successfully with ${projectData.equipmentRequests.length} equipment item(s) requested.`,
      read: false,
      actionUrl: '/projects',
    });

    return newProject;
  };

  const resolveConflict = (conflictId: string, resolution: AllocationResolution) => {
    setConflicts((prev) =>
      prev.map((c) => {
        if (c.id !== conflictId) return c;
        return {
          ...c,
          resolved: true,
          resolution,
        };
      })
    );

    // Notify involved students
    const conflict = conflicts.find((c) => c.id === conflictId);
    if (conflict) {
      const winner = conflict.requests.find((r) => r.bookingId === resolution.selectedBookingId);
      addNotification({
        type: 'booking-approved',
        title: 'Conflict Resolved by Smart Allocation',
        message: `High-priority slot for ${conflict.equipmentName} allocated to ${winner?.studentName || 'selected applicant'} based on urgency score.`,
        read: false,
        actionUrl: '/allocation',
      });
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        equipment: equipmentData,
        bookings,
        addBooking,
        updateBooking,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        addNotification,
        approvals,
        updateApproval,
        projects,
        addProject,
        conflicts,
        resolveConflict,
        globalSearch,
        setGlobalSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;

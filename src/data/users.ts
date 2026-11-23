import type { Student, FacultyMember } from '../types';

export const students: Student[] = [
  {
    id: 'stu-001',
    name: 'Student Researcher',
    email: 'student.researcher@campus.edu',
    department: 'CSE',
    year: 4,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
    rollNumber: 'CS-084',
  },
  {
    id: 'stu-002',
    name: 'Graduate Researcher (ECE)',
    email: 'grad.ece@campus.edu',
    department: 'ECE',
    year: 3,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    rollNumber: 'EC-042',
  },
  {
    id: 'stu-003',
    name: 'Research Scholar (Mech)',
    email: 'scholar.me@campus.edu',
    department: 'Mechanical',
    year: 4,
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150',
    rollNumber: 'ME-105',
  },
  {
    id: 'stu-004',
    name: 'Biotech Lab Fellow',
    email: 'fellow.bt@campus.edu',
    department: 'Biotechnology',
    year: 4,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    rollNumber: 'BT-019',
  },
  {
    id: 'stu-005',
    name: 'Robotics Team Lead',
    email: 'robotics.lead@campus.edu',
    department: 'EEE',
    year: 3,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rollNumber: 'EE-061',
  },
];

export const faculty: FacultyMember[] = [
  {
    id: 'fac-001',
    name: 'Faculty Advisor (CSE)',
    email: 'faculty.cse@campus.edu',
    department: 'CSE',
    designation: 'Department Reviewer & Lab Coordinator',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  },
  {
    id: 'fac-002',
    name: 'Faculty Reviewer (ECE)',
    email: 'faculty.ece@campus.edu',
    department: 'ECE',
    designation: 'Associate Professor, VLSI Research',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  },
  {
    id: 'fac-003',
    name: 'Dean of Research Facilities',
    email: 'dean.research@campus.edu',
    department: 'Mechanical',
    designation: 'Central Lab Facilities Chair',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
];

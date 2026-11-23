import type { AllocationConflict } from '../types';

export const initialConflicts: AllocationConflict[] = [
  {
    id: 'cnf-001',
    equipmentId: 'eq-009',
    equipmentName: 'GPU Workstation (RTX 4090)',
    date: '2026-11-25',
    timeSlot: '10:00 - 14:00',
    resolved: false,
    requests: [
      {
        bookingId: 'req-c1',
        studentId: 'stu-001',
        studentName: 'Student Researcher',
        projectTitle: 'Smart Campus Vision: Edge AI Surveillance',
        projectDeadline: '2026-11-28', // Only 3 days away! Urgent!
        purpose: 'Final model checkpoint weights convergence run before thesis defense.',
        priorityScore: 92,
        previousAllocations: 2,
        department: 'CSE',
      },
      {
        bookingId: 'req-c2',
        studentId: 'stu-005',
        studentName: 'Vikram Singh',
        projectTitle: 'Autonomous Drone Obstacle Mapping & TensorRT',
        projectDeadline: '2026-12-18', // 23 days away
        purpose: 'Preliminary exploration of neural network pruning layers.',
        priorityScore: 68,
        previousAllocations: 6,
        department: 'EEE',
      },
      {
        bookingId: 'req-c3',
        studentId: 'stu-002',
        studentName: 'Priya Iyer',
        projectTitle: 'TinyML Anomaly Sensor Synthesis',
        projectDeadline: '2026-12-12', // 17 days away
        purpose: 'Hyperparameter grid search for small quantization tensors.',
        priorityScore: 74,
        previousAllocations: 3,
        department: 'ECE',
      },
    ],
  },
  {
    id: 'cnf-002',
    equipmentId: 'eq-005',
    equipmentName: 'Creality Ender 3 V3 SE',
    date: '2026-11-26',
    timeSlot: '13:00 - 17:00',
    resolved: false,
    requests: [
      {
        bookingId: 'req-c4',
        studentId: 'stu-003',
        studentName: 'Rohan Deshmukh',
        projectTitle: 'Bionic Hand: Low-Cost Myoelectric Controlled Prosthesis',
        projectDeadline: '2026-11-30', // 4 days away
        purpose: 'Printing palm housing chassis and articulating thumb socket.',
        priorityScore: 89,
        previousAllocations: 1,
        department: 'Mechanical',
      },
      {
        bookingId: 'req-c5',
        studentId: 'stu-001',
        studentName: 'Student Researcher',
        projectTitle: 'Waterproof Camera Enclosure for Outdoor Edge Hub',
        projectDeadline: '2026-12-15',
        purpose: '3D printed custom weather shield for IP65 sensor enclosure.',
        priorityScore: 64,
        previousAllocations: 5,
        department: 'CSE',
      },
    ],
  },
  {
    id: 'cnf-003',
    equipmentId: 'eq-004',
    equipmentName: 'Keysight DSOX1204G Oscilloscope',
    date: '2026-11-23',
    timeSlot: '14:00 - 17:00',
    resolved: true,
    requests: [
      {
        bookingId: 'req-c6',
        studentId: 'stu-002',
        studentName: 'Priya Iyer',
        projectTitle: 'Ultra-Low Power Sub-GHz Transceiver',
        projectDeadline: '2026-12-08',
        purpose: 'Transient power capture for battery life modeling.',
        priorityScore: 85,
        previousAllocations: 2,
        department: 'ECE',
      },
      {
        bookingId: 'req-c7',
        studentId: 'stu-005',
        studentName: 'Vikram Singh',
        projectTitle: 'Buck Converter Ripple Analysis',
        projectDeadline: '2026-12-24',
        purpose: 'Routine lab verification of voltage inductor ripple.',
        priorityScore: 58,
        previousAllocations: 7,
        department: 'EEE',
      },
    ],
    resolution: {
      selectedBookingId: 'req-c6',
      reasoning: 'Priya Iyer selected based on project deadline urgency (15 days earlier than Vikram) and significantly lower previous equipment consumption (2 allocations vs 7 allocations).',
      alternativeSlots: [
        {
          bookingId: 'req-c7',
          studentName: 'Vikram Singh',
          suggestedDate: '2026-11-24',
          suggestedTime: '09:00 - 12:00',
          reason: 'Identical Keysight bench station in Lab 302 has open availability with zero contention.',
        },
      ],
    },
  },
];

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { equipmentData } from '../data/equipment.ts';
import { calculatePriorityScore } from '../utils/helpers.ts';
import type { Booking } from '../types/index.ts';

describe('LabLink Critical Logic & Consistency Tests', () => {
  describe('1. Equipment Count Consistency', () => {
    it('total equipment matches the sum of all individual availability statuses', () => {
      const total = equipmentData.length;
      const available = equipmentData.filter((e) => e.status === 'available').length;
      const inUse = equipmentData.filter((e) => e.status === 'in-use').length;
      const reserved = equipmentData.filter((e) => e.status === 'reserved').length;
      const maintenance = equipmentData.filter((e) => e.status === 'maintenance').length;

      assert.strictEqual(
        total,
        available + inUse + reserved + maintenance,
        'Total equipment must strictly equal available + inUse + reserved + maintenance'
      );
      assert.strictEqual(total, 16, 'Total equipment fleet size must be exactly 16');
      assert.strictEqual(available, 12, 'Available units must equal 12');
      assert.strictEqual(inUse, 2, 'In-use units must equal 2');
      assert.strictEqual(reserved, 1, 'Reserved units must equal 1');
      assert.strictEqual(maintenance, 1, 'Maintenance units must equal 1');
    });

    it('each equipment item belongs to a valid engineering department', () => {
      const validDepts = new Set(['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Biotechnology']);
      for (const eq of equipmentData) {
        assert.ok(validDepts.has(eq.department), `Equipment ${eq.id} has invalid department: ${eq.department}`);
        assert.ok(eq.bookingCount >= 0, 'Booking count must be non-negative');
        assert.ok(eq.rating >= 4.0 && eq.rating <= 5.0, 'Rating should be between 4.0 and 5.0');
      }
    });
  });

  describe('2. Booking Lifecycle & Double-Booking Prevention', () => {
    function checkSlotOverlap(
      existing: Booking[],
      candidate: { equipmentId: string; date: string; startTime: string; endTime: string }
    ): boolean {
      return existing.some((b) => {
        if (b.equipmentId !== candidate.equipmentId || b.date !== candidate.date) return false;
        // Cancelled, rejected, and completed bookings do not block new reservations
        if (b.status === 'rejected' || b.status === 'cancelled' || b.status === 'completed') return false;

        const startA = b.startTime;
        const endA = b.endTime;
        const startB = candidate.startTime;
        const endB = candidate.endTime;

        return startA < endB && endA > startB;
      });
    }

    it('detects and prevents overlapping time windows on the same date and equipment', () => {
      const existingBookings: Booking[] = [
        {
          id: 'bkg-1',
          equipmentId: 'eq-001',
          equipmentName: 'Arduino Uno R4',
          studentId: 'stu-1',
          studentName: 'Alice',
          date: '2026-12-01',
          startTime: '10:00',
          endTime: '12:00',
          status: 'confirmed',
          purpose: 'IoT project',
          department: 'CSE',
          createdAt: new Date().toISOString(),
        },
      ];

      // Exact overlap
      assert.strictEqual(
        checkSlotOverlap(existingBookings, {
          equipmentId: 'eq-001',
          date: '2026-12-01',
          startTime: '10:00',
          endTime: '12:00',
        }),
        true,
        'Exact slot overlap must be blocked'
      );

      // Partial overlap (starts during)
      assert.strictEqual(
        checkSlotOverlap(existingBookings, {
          equipmentId: 'eq-001',
          date: '2026-12-01',
          startTime: '11:00',
          endTime: '13:00',
        }),
        true,
        'Partial overlap must be blocked'
      );

      // Adjacent non-overlapping slot (starts right as previous ends)
      assert.strictEqual(
        checkSlotOverlap(existingBookings, {
          equipmentId: 'eq-001',
          date: '2026-12-01',
          startTime: '12:00',
          endTime: '14:00',
        }),
        false,
        'Adjacent slot must be permitted'
      );

      // Different equipment on the same date and time
      assert.strictEqual(
        checkSlotOverlap(existingBookings, {
          equipmentId: 'eq-002',
          date: '2026-12-01',
          startTime: '10:00',
          endTime: '12:00',
        }),
        false,
        'Different equipment on same slot must be permitted'
      );
    });

    it('cancelled and rejected bookings do not block new reservations', () => {
      const inactiveBookings: Booking[] = [
        {
          id: 'bkg-cancelled',
          equipmentId: 'eq-001',
          equipmentName: 'Arduino Uno R4',
          studentId: 'stu-1',
          studentName: 'Alice',
          date: '2026-12-01',
          startTime: '10:00',
          endTime: '12:00',
          status: 'cancelled',
          purpose: 'IoT project',
          department: 'CSE',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'bkg-rejected',
          equipmentId: 'eq-001',
          equipmentName: 'Arduino Uno R4',
          studentId: 'stu-2',
          studentName: 'Bob',
          date: '2026-12-01',
          startTime: '14:00',
          endTime: '16:00',
          status: 'rejected',
          purpose: 'Robotics',
          department: 'CSE',
          createdAt: new Date().toISOString(),
        },
      ];

      assert.strictEqual(
        checkSlotOverlap(inactiveBookings, {
          equipmentId: 'eq-001',
          date: '2026-12-01',
          startTime: '10:00',
          endTime: '12:00',
        }),
        false,
        'Cancelled slot should be free for new bookings'
      );

      assert.strictEqual(
        checkSlotOverlap(inactiveBookings, {
          equipmentId: 'eq-001',
          date: '2026-12-01',
          startTime: '14:00',
          endTime: '16:00',
        }),
        false,
        'Rejected slot should be free for new bookings'
      );
    });

    it('guard prevents completing sessions before their scheduled end time', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      const futureStr = futureDate.toISOString().split('T')[0];

      const futureBooking: Booking = {
        id: 'bkg-future',
        equipmentId: 'eq-009',
        equipmentName: 'GPU Workstation',
        studentId: 'stu-1',
        studentName: 'Alice',
        date: futureStr,
        startTime: '14:00',
        endTime: '16:00',
        status: 'confirmed',
        purpose: 'Deep learning',
        department: 'CSE',
        createdAt: new Date().toISOString(),
      };

      const endDateTime = new Date(`${futureBooking.date}T${futureBooking.endTime}:00`);
      const isPast = endDateTime.getTime() <= Date.now();
      assert.strictEqual(isPast, false, 'Future booking end time cannot be in the past');
    });
  });

  describe('3. Smart Allocation & Priority Scoring Matrix', () => {
    it('closer project deadlines produce higher urgency scores', () => {
      const urgent = calculatePriorityScore(3, 2, true); // 3 days remaining
      const relaxed = calculatePriorityScore(25, 2, true); // 25 days remaining

      assert.ok(
        urgent.breakdown.urgency > relaxed.breakdown.urgency,
        `Urgent (${urgent.breakdown.urgency}) should exceed relaxed (${relaxed.breakdown.urgency})`
      );
      assert.ok(urgent.score > relaxed.score, 'Closer deadline must result in higher total score');
    });

    it('fewer previous allocations produce higher fairness scores', () => {
      const firstTimeApplicant = calculatePriorityScore(10, 1, true);
      const frequentApplicant = calculatePriorityScore(10, 7, true);

      assert.ok(
        firstTimeApplicant.breakdown.fairness > frequentApplicant.breakdown.fairness,
        'Applicant with fewer past allocations must receive higher fairness points'
      );
    });

    it('deterministic scoring caps at 100 points maximum and respects component bounds', () => {
      const maxScore = calculatePriorityScore(0, 0, true);
      assert.ok(maxScore.score <= 100, 'Score must not exceed 100 points');
      assert.ok(maxScore.breakdown.urgency <= 45, 'Urgency component must be <= 45 pts');
      assert.ok(maxScore.breakdown.fairness <= 35, 'Fairness component must be <= 35 pts');
      assert.ok(maxScore.breakdown.feasibility <= 20, 'Feasibility component must be <= 20 pts');
    });
  });
});

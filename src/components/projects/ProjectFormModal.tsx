import React, { useState } from 'react';
import {
  FolderPlus,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import type { Department, EquipmentRequest } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';

export interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (projectId: string) => void;
}

const DEPARTMENTS: Department[] = [
  'CSE',
  'ECE',
  'EEE',
  'Mechanical',
  'Civil',
  'Biotechnology',
];

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { equipment, currentUser, addProject } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<Department>('CSE');
  const [deadline, setDeadline] = useState('');
  const [equipmentRequests, setEquipmentRequests] = useState<EquipmentRequest[]>([
    {
      equipmentId: equipment[0]?.id || 'eq-001',
      equipmentName: equipment[0]?.name || 'Arduino Uno R4 WiFi Kit',
      justification: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      hoursPerDay: 4,
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddEquipmentSlot = () => {
    const firstEq = equipment[0];
    setEquipmentRequests((prev) => [
      ...prev,
      {
        equipmentId: firstEq.id,
        equipmentName: firstEq.name,
        justification: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        hoursPerDay: 3,
      },
    ]);
  };

  const handleRemoveEquipmentSlot = (index: number) => {
    if (equipmentRequests.length === 1) return;
    setEquipmentRequests((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateEquipment = (index: number, updates: Partial<EquipmentRequest>) => {
    setEquipmentRequests((prev) =>
      prev.map((req, i) => (i === index ? { ...req, ...updates } : req))
    );
  };

  const handleSubmit = (submitStatus: 'draft' | 'submitted') => {
    setError(null);

    if (title.trim().length < 5) {
      setError('Project title must be at least 5 characters.');
      return;
    }
    if (description.trim().length < 20) {
      setError('Please provide a descriptive project outline (min 20 characters).');
      return;
    }
    if (!deadline) {
      setError('Please set a project completion deadline.');
      return;
    }

    for (const req of equipmentRequests) {
      if (!req.justification.trim()) {
        setError(`Please provide technical justification for requesting "${req.equipmentName}".`);
        return;
      }
    }

    setIsSubmitting(true);

    const newProject = addProject({
      title: title.trim(),
      description: description.trim(),
      department,
      deadline,
      studentId: currentUser.id,
      studentName: currentUser.name,
      status: submitStatus,
      equipmentRequests,
    });

    setIsSubmitting(false);

    setTitle('');
    setDescription('');
    setDeadline('');
    onClose();
    onSuccess(newProject.id);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      title={
        <div className="flex items-center gap-2">
          <FolderPlus className="w-4.5 h-4.5 text-[#f0c45a]" />
          <span>New Project Equipment Request</span>
        </div>
      }
      subtitle="Submit research or capstone requirements for inter-departmental laboratory access"
      footer={
        <div className="w-full flex items-center justify-between">
          <div className="text-xs text-[#8e8e8c]">
            Applicant: <span className="text-[#faf8f9] font-medium">{currentUser.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
            >
              Save as Draft
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleSubmit('submitted')}
              loading={isSubmitting}
              icon={<CheckCircle2 className="w-4 h-4" />}
            >
              Submit for Faculty Review
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-[#241113] border border-[#441a1d] rounded-[2px] flex items-start gap-2.5 text-xs text-[#f87171]">
            <AlertTriangle className="w-4 h-4 shrink-0 text-[#f87171] mt-0.5" />
            <div>
              <p className="font-medium text-[#faf8f9]">Validation Incomplete</p>
              <p className="mt-0.5 text-[#8e8e8c]">{error}</p>
            </div>
          </div>
        )}

        {/* Project Title */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1">
            Project Title <span className="text-[#f87171]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError(null);
            }}
            placeholder="e.g., Edge-AI Quadcopter Autonomy System"
            className="w-full text-xs sm:text-sm bg-[#0e0f0d] border border-[#232321] rounded-[2px] p-2.5 text-[#faf8f9] placeholder-[#676865] focus:outline-none focus:border-[#f0c45a]"
            required
          />
        </div>

        {/* Department & Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1">
              Host Department <span className="text-[#f87171]">*</span>
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department)}
              className="w-full text-xs sm:text-sm bg-[#0e0f0d] border border-[#232321] rounded-[2px] p-2.5 text-[#faf8f9] focus:outline-none focus:border-[#f0c45a]"
            >
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="bg-[#121311] text-[#faf8f9]">
                  {dept} Department
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1">
              Project Deadline <span className="text-[#f87171]">*</span>
            </label>
            <input
              type="date"
              value={deadline}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setDeadline(e.target.value);
                setError(null);
              }}
              className="w-full text-xs sm:text-sm bg-[#0e0f0d] border border-[#232321] rounded-[2px] p-2.5 text-[#faf8f9] focus:outline-none focus:border-[#f0c45a] font-mono"
              required
            />
          </div>
        </div>

        {/* Outline / Description */}
        <div>
          <label className="block text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1">
            Research Scope & Methodology <span className="text-[#f87171]">*</span>
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setError(null);
            }}
            placeholder="Summarize the core objectives, research thesis, components to test, and experimental milestones..."
            className="w-full text-xs sm:text-sm bg-[#0e0f0d] border border-[#232321] rounded-[2px] p-2.5 text-[#faf8f9] placeholder-[#676865] focus:outline-none focus:border-[#f0c45a]"
            required
          />
        </div>

        {/* Equipment Allocation Requests List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c]">
                Required Instruments ({equipmentRequests.length})
              </h4>
              <p className="text-[11px] text-[#676865]">
                List every specific device or workbench required for this initiative.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddEquipmentSlot}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-[#181916] border border-[#232321] hover:border-[#353632] text-[#faf8f9] rounded-[2px] cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#f0c45a]" />
              <span>Add Resource</span>
            </button>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {equipmentRequests.map((req, index) => (
              <div
                key={index}
                className="p-3.5 rounded-[2px] bg-[#0e0f0d] border border-[#232321] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-[#f0c45a]">
                    Resource Item #{index + 1}
                  </span>
                  {equipmentRequests.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEquipmentSlot(index)}
                      className="text-[#f87171] hover:text-[#ef4444] text-xs flex items-center gap-1 cursor-pointer font-mono"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono uppercase text-[#8e8e8c] mb-1">
                      Choose Laboratory Resource
                    </label>
                    <select
                      value={req.equipmentId}
                      onChange={(e) => {
                        const eq = equipment.find((item) => item.id === e.target.value);
                        if (eq) {
                          handleUpdateEquipment(index, {
                            equipmentId: eq.id,
                            equipmentName: eq.name,
                          });
                        }
                      }}
                      className="w-full text-xs bg-[#121311] border border-[#232321] rounded-[2px] p-2 text-[#faf8f9] focus:outline-none focus:border-[#f0c45a]"
                    >
                      {equipment.map((eq) => (
                        <option key={eq.id} value={eq.id} className="bg-[#121311] text-[#faf8f9]">
                          {eq.name} ({eq.department} • {eq.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#8e8e8c] mb-1">
                      Hours / Day
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={req.hoursPerDay}
                      onChange={(e) =>
                        handleUpdateEquipment(index, { hoursPerDay: parseInt(e.target.value) || 2 })
                      }
                      className="w-full text-xs bg-[#121311] border border-[#232321] rounded-[2px] p-2 text-[#faf8f9] focus:outline-none focus:border-[#f0c45a] font-mono"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#8e8e8c] mb-1">
                      Required Start Date
                    </label>
                    <input
                      type="date"
                      value={req.startDate}
                      onChange={(e) => handleUpdateEquipment(index, { startDate: e.target.value })}
                      className="w-full text-xs bg-[#121311] border border-[#232321] rounded-[2px] p-2 text-[#faf8f9] focus:outline-none focus:border-[#f0c45a] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-[#8e8e8c] mb-1">
                      Required End Date
                    </label>
                    <input
                      type="date"
                      value={req.endDate}
                      onChange={(e) => handleUpdateEquipment(index, { endDate: e.target.value })}
                      className="w-full text-xs bg-[#121311] border border-[#232321] rounded-[2px] p-2 text-[#faf8f9] focus:outline-none focus:border-[#f0c45a] font-mono"
                    />
                  </div>
                </div>

                {/* Justification */}
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#8e8e8c] mb-1">
                    Technical Justification <span className="text-[#f87171]">*</span>
                  </label>
                  <input
                    type="text"
                    value={req.justification}
                    onChange={(e) =>
                      handleUpdateEquipment(index, { justification: e.target.value })
                    }
                    placeholder="Why is this instrument critical for your methodology?"
                    className="w-full text-xs bg-[#121311] border border-[#232321] rounded-[2px] p-2 text-[#faf8f9] placeholder-[#676865] focus:outline-none focus:border-[#f0c45a]"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectFormModal;

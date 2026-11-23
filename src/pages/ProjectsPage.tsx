import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FolderKanban, Plus, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Project } from '../types';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectFormModal } from '../components/projects/ProjectFormModal';
import { Tabs } from '../components/ui/Tabs';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { formatDate } from '../utils/helpers';

const ProjectDetailModal: React.FC<{
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ project, isOpen, onClose }) => {
  if (!project) return null;
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={project.title}
      subtitle={`${project.department} Department • Deadline: ${formatDate(project.deadline)}`}
    >
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={project.status}>{project.status}</Badge>
          <span className="text-xs text-[#8e8e8c]">by {project.studentName}</span>
        </div>

        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-1.5">Project Overview</h4>
          <p className="text-xs sm:text-sm text-[#e5e5e4] leading-relaxed bg-[#0e0f0d] p-3.5 rounded-[2px] border border-[#232321]">
            {project.description}
          </p>
        </div>

        <div>
          <h4 className="text-[10px] font-mono uppercase tracking-wider text-[#8e8e8c] mb-2">
            Equipment Requested ({project.equipmentRequests.length} items)
          </h4>
          <div className="space-y-2">
            {project.equipmentRequests.map((req, i) => (
              <div key={i} className="p-3 rounded-[2px] border border-[#232321] bg-[#0e0f0d]">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-[#faf8f9]">{req.equipmentName}</span>
                  <span className="text-[10px] font-mono text-[#8e8e8c]">
                    {req.hoursPerDay}h/day • {formatDate(req.startDate)} → {formatDate(req.endDate)}
                  </span>
                </div>
                <p className="text-xs text-[#8e8e8c]">{req.justification}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const ProjectsPage: React.FC = () => {
  const { projects, currentRole, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const displayedProjects = useMemo(() => {
    if (currentRole === 'student') {
      const mine = projects.filter((p) => p.studentId === currentUser.id);
      return mine.length > 0 ? mine : projects;
    }
    return projects;
  }, [projects, currentRole, currentUser]);

  const counts = {
    all: displayedProjects.length,
    draft: displayedProjects.filter((p) => p.status === 'draft').length,
    submitted: displayedProjects.filter((p) => p.status === 'submitted').length,
    approved: displayedProjects.filter((p) => p.status === 'approved').length,
    'in-progress': displayedProjects.filter((p) => p.status === 'in-progress').length,
    completed: displayedProjects.filter((p) => p.status === 'completed').length,
  };

  const tabs = [
    { label: 'All Projects', value: 'all', count: counts.all },
    { label: 'Draft', value: 'draft', count: counts.draft },
    { label: 'Submitted', value: 'submitted', count: counts.submitted },
    { label: 'Approved', value: 'approved', count: counts.approved },
    { label: 'In Progress', value: 'in-progress', count: counts['in-progress'] },
    { label: 'Completed', value: 'completed', count: counts.completed },
  ];

  const filtered = useMemo(() => {
    return displayedProjects.filter((p) => {
      if (activeTab !== 'all' && p.status !== activeTab) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.studentName.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [displayedProjects, activeTab, search]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18 }} className="space-y-6">
      {successMsg && (
        <div className="p-3.5 bg-[#0e1d15] border border-[#1b3b29] rounded-[2px] flex items-center justify-between text-xs text-[#4ade80]">
          <span>✓ {successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="text-[#8e8e8c] hover:text-[#faf8f9] font-mono ml-4 cursor-pointer">×</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-medium text-[#faf8f9] tracking-tight">Project Requests</h2>
          <p className="text-xs text-[#8e8e8c] mt-0.5">
            Multi-instrument resource allocations for academic capstone and research programs
          </p>
        </div>
        {currentRole !== 'faculty' && (
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#ece8df] hover:bg-[#f5f2ea] text-[#040404] rounded-[2px] text-xs font-medium cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project Request</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-[#121311] rounded-[2px] border border-[#232321] p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} className="border-0" />
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-[#676865] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#0e0f0d] border border-[#232321] rounded-[2px] text-[#faf8f9] placeholder-[#676865] focus:bg-[#121311] focus:outline-none focus:border-[#f0c45a]"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="w-6 h-6" />}
          title="No projects found"
          description={search ? 'No projects matched your search query.' : 'Register a project to request specialized laboratory equipment for your research.'}
          action={
            currentRole !== 'faculty' ? (
              <button
                onClick={() => setIsFormOpen(true)}
                className="text-xs px-3.5 py-2 bg-[#ece8df] text-[#040404] hover:bg-[#f5f2ea] rounded-[2px] cursor-pointer font-medium"
              >
                Create New Project
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} onViewDetails={setSelectedProject} />
          ))}
        </div>
      )}

      {/* Modals */}
      <ProjectFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSuccess={(id) => {
          setSuccessMsg(`Project registered successfully. Tracking ID: ${id}`);
          setTimeout(() => setSuccessMsg(null), 6000);
        }}
      />

      <ProjectDetailModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
      />
    </motion.div>
  );
};

export default ProjectsPage;

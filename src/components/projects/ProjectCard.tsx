import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Layers,
  ArrowRight,
  User,
} from 'lucide-react';
import type { Project } from '../../types';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../utils/helpers';

export interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onViewDetails }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-[#121311] rounded-[2px] border border-[#232321] p-5 hover:border-[#353632] transition-colors flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded-[1px] bg-[#181916] text-[#8e8e8c] border border-[#232321]">
                {project.department}
              </span>
              <span className="text-[11px] font-mono text-[#676865]">#{project.id}</span>
            </div>
            <h3 className="text-sm font-medium text-[#faf8f9] leading-snug line-clamp-1">
              {project.title}
            </h3>
          </div>

          <Badge variant={project.status} size="sm">
            {project.status}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-xs text-[#8e8e8c] line-clamp-2 leading-relaxed">
          {project.description}
        </p>

        {/* Equipment Requested badge row */}
        <div className="p-3 rounded-[2px] bg-[#0e0f0d] border border-[#232321] text-xs space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-[#8e8e8c]">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#f0c45a]" />
              <span>Allocations:</span>
            </span>
            <span className="font-mono text-[#faf8f9]">
              {project.equipmentRequests.length} requested
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {project.equipmentRequests.map((req, i) => (
              <span
                key={i}
                className="text-[10px] font-mono bg-[#181916] border border-[#232321] px-1.5 py-0.5 rounded-[1px] text-[#faf8f9] truncate max-w-[200px]"
              >
                {req.equipmentName}
              </span>
            ))}
          </div>
        </div>

        {/* Metadata row */}
        <div className="flex items-center justify-between text-[11px] text-[#8e8e8c] pt-1">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3 text-[#676865]" />
            <span className="text-[#e5e5e4]">{project.studentName}</span>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-[#f0c45a]" />
            <span>Target: <strong className="font-mono text-[#faf8f9] font-normal">{formatDate(project.deadline)}</strong></span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-4 border-t border-[#232321] flex items-center justify-between">
        <span className="text-[11px] font-mono text-[#676865]">
          Created {formatDate(project.createdAt)}
        </span>

        <button
          type="button"
          onClick={() => onViewDetails(project)}
          className="text-xs text-[#ece8df] hover:text-[#f0c45a] flex items-center gap-1 group cursor-pointer transition-colors"
        >
          <span>Examine Project</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectCard;

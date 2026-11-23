import React from 'react';

export interface LabLinkIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/**
 * LabLink Brand Icon — "Campus Lab Grid"
 * 
 * Distinctive proprietary mark representing stacked laboratory resource layers
 * unified by an interconnecting central access spine and core instrument node.
 * Refined from the geometric stacked-layer identity.
 */
export const LabLinkIcon: React.FC<LabLinkIconProps> = ({
  size = 18,
  className = '',
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="LabLink Logo"
      {...props}
    >
      {/* Top Workstation / Instrument Plate */}
      <path
        d="M16 4.5L27 10L16 15.5L5 10L16 4.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Central Resource Node (Active Lab Hub) */}
      <circle cx="16" cy="10" r="2" fill="currentColor" />

      {/* Middle Resource Grid Layer */}
      <path
        d="M5 16L16 21.5L27 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Base Infrastructure Layer */}
      <path
        d="M5 22L16 27.5L27 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Vertical Interconnecting Spine (Grid Linkage) */}
      <path
        d="M16 15.5V18.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 21.5V24.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LabLinkIcon;

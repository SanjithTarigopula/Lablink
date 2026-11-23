import React, { useRef, useState, useEffect, useCallback } from 'react';

export interface TabItem {
  label: string;
  value: string;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className = '' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 2);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    const ro = new ResizeObserver(checkScroll);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      ro.disconnect();
    };
  }, [checkScroll, tabs.length]);

  return (
    <div className={`relative ${className}`}>
      {/* Left fade hint */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#121311] to-transparent z-10 pointer-events-none" />
      )}

      <div
        ref={scrollRef}
        role="tablist"
        className="flex items-center gap-1 border-b border-[#232321] overflow-x-auto scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map((tab) => {
          const isActive = tab.value === activeTab;
          return (
            <button
              key={tab.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.value)}
              className={`
                relative pb-3 px-3 text-xs whitespace-nowrap transition-colors duration-150 cursor-pointer outline-none
                flex items-center gap-1.5
                ${isActive ? 'text-[#f0c45a] font-medium' : 'text-[#8e8e8c] hover:text-[#faf8f9]'}
              `}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-[2px] font-mono border ${
                    isActive
                      ? 'bg-[#221b0c] text-[#f0c45a] border-[#3d3015]'
                      : 'bg-[#181916] text-[#8e8e8c] border-[#232321]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f0c45a]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Right fade hint */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#121311] to-transparent z-10 pointer-events-none" />
      )}
    </div>
  );
};

export default Tabs;

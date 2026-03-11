'use client';

import { ReactNode } from 'react';
import { filters, useProjectsStore } from "@feature/lab-client"
import { cn } from '@feature/ui/lib/utils';

interface Props {
  data?: unknown;
  children?: ReactNode;
}

export function ProjectFilters(props: Props) {
  const activeFilter = useProjectsStore(state => state.filter)
  const setActiveFilter = useProjectsStore(state => state.setFilter)
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:flex-wrap scrollbar-hide animate-fade-in-up stagger-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={cn(
            "shrink-0 rounded-lg border px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-all duration-300 active:scale-[0.98]",
            activeFilter === filter
              ? "border-primary bg-primary/15 text-primary shadow-sm shadow-primary/20"
              : "border-border text-muted-foreground hover:border-foreground/50 hover:text-foreground hover:bg-secondary/50",
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default ProjectFilters;

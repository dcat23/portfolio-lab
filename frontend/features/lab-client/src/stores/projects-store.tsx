'use client';

import { create } from 'zustand';
import type { Project } from '../lib/types/';

export const filters = ["all", "shipped", "in-progress", "archived"] as const;

type Filter = typeof filters[number]

interface ProjectsState {
  projects: Project[];
  filter: Filter
  isLoading: boolean;
}

interface ProjectsActions {
  initializeProjects: (projects: Project[]) => void;
  setProjects: (projects: Project[]) => void;
  setFilter: (filter: Filter) => void;
  toggleLoading: () => void;
  reset: () => void;
}

export type ProjectsStore = ProjectsState & ProjectsActions;

const initialState: ProjectsState = {
  projects: [],
  filter: "all",
  isLoading: false,
};

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  ...initialState,

  initializeProjects: (projects: Project[]) => {
    set({
      projects,
    });
  },

  setProjects: (projects: Project[]) => {
    set({ projects });
  },

  setFilter: (filter: Filter) => {
    set({ filter });
  },

  toggleLoading: () => {
    set(({ isLoading }) => ({ isLoading: !isLoading }));
  },

  reset: () => {
    set(initialState);
  },
}));

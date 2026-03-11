'use client';

import { create } from 'zustand';

interface WorkbenchState {
  workbench: Workbench | null;
  isLoading: boolean;
}

interface WorkbenchActions {
  initializeWorkbench: (workbench: Workbench) => void;
  setWorkbench: (workbench: Workbench) => void;
  toggleLoading: () => void;
  reset: () => void;
}

export type WorkbenchStore = WorkbenchState & WorkbenchActions;

const initialState: WorkbenchState = {
  workbench: null,
  isLoading: false,
};

export const useWorkbenchStore = create<WorkbenchStore>((set, get) => ({
  ...initialState,

  initializeWorkbench: (workbench: Workbench) => {
    set({
      workbench,
    });
  },

  setWorkbench: (workbench: Workbench) => {
    set({ workbench });
  },

  toggleLoading: () => {
    set(({ isLoading }) => ({ isLoading: !isLoading }));
  },

  reset: () => {
    set(initialState);
  },
}));

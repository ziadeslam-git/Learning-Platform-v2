import { create } from 'zustand';

interface UiStore {
  lastOpenedAccordionId: string | null;
  setLastOpenedAccordionId: (id: string | null) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  lastOpenedAccordionId: null,
  setLastOpenedAccordionId: (id) => set({ lastOpenedAccordionId: id }),
}));

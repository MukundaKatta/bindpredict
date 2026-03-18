import { create } from "zustand";

export type TabMode = "viewer" | "energy" | "docking" | "screening" | "mutant";

interface BindStore {
  tab: TabMode;
  setTab: (t: TabMode) => void;
  selectedProtein: string;
  setSelectedProtein: (id: string) => void;
  selectedLigand: string;
  setSelectedLigand: (id: string) => void;
}

export const useBindStore = create<BindStore>((set) => ({
  tab: "viewer",
  setTab: (t) => set({ tab: t }),
  selectedProtein: "1hsg",
  setSelectedProtein: (id) => set({ selectedProtein: id }),
  selectedLigand: "aspirin",
  setSelectedLigand: (id) => set({ selectedLigand: id }),
}));

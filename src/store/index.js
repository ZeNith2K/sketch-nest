import { create } from 'zustand'

export const useStore = create((set) => ({
  selectedTool: null,
  setSelectedTool: (tool) => set({ selectedTool: tool }),
}))


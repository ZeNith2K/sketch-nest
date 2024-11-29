import { create } from 'zustand'

export const useStore = create((set) => ({
  stage: null,
  stageScale: 1,
  stageX: 0,
  stageY: 0,
  selectedTool: null,
  isMouseDown: false,
  isSpaceDown: false,
  lastDist : { x: 0, y: 0 },
  rects: [],
  newRect: [],
  setStage: (stage) => set({ stage }),
  setStageScale: (stageScale) => set({ stageScale }),
  setStageX: (stageX) => set({ stageX }),
  setStageY: (stageY) => set({ stageY }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setIsMouseDown: (isMouseDown) => set({ isMouseDown }),
  setIsSpaceDown: (isSpaceDown) => set({ isSpaceDown }),
  setLastDist: (lastDist) => set({ lastDist }),
  setRects: (rects) => set({ rects }),
  setNewRect: (newRect) => set({ newRect }),
}))


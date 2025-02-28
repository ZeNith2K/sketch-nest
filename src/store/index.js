import { create } from 'zustand'

export const useStore = create((set) => ({
  stage: null,
  stageScale: 1,
  stageX: 0,
  stageY: 0,
  selectedTool: null,
  isMouseDown: false,
  isSpaceDown: false,
  lines: [],
  ellipses: [],
  rects: [],
  history: [],
  images: [],
  historyIndex: -1,
  setStage: (stage) => set({ stage }),
  setStageScale: (stageScale) => set({ stageScale }),
  setStageX: (stageX) => set({ stageX }),
  setStageY: (stageY) => set({ stageY }),
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setIsMouseDown: (isMouseDown) => set({ isMouseDown }),
  setIsSpaceDown: (isSpaceDown) => set({ isSpaceDown }),
  setLines: (lines) => set({ lines }),
  setEllipses: (ellipses) => set({ ellipses }),
  setRects: (rects) => set({ rects }),
  setImages: (images) => set({ images }),
  addHistory: (newState) => set((state) => {
    const lastHistory = state.history[state.historyIndex];
    let tempHistory = [...state.history]
    let newHistory = {...lastHistory, ...newState}
    tempHistory.push(newHistory);
    return { history: tempHistory, historyIndex: state.historyIndex + 1, canvasState: newHistory };
  }),
  undo: () => set((state) => {
    if (state.historyIndex >= 0) {
      const newIndex = state.historyIndex - 1;
      const previousState = state.history[newIndex] || {};
      const stateToPush = {
        ...state,
        lines: previousState.lines || [],
        ellipses: previousState.ellipses || [],
        rects: previousState.rects || [],
        historyIndex: newIndex
      }
      return { ...stateToPush, historyIndex: newIndex };
    }
    return state;
  }),
  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      const nextState = state.history[newIndex] || {};
      const stateToPush = {
        ...state,
        lines: nextState.lines || [],
        ellipses: nextState.ellipses || [],
        rects: nextState.rects || [],
        historyIndex: newIndex
      }
      return { ...stateToPush, historyIndex: newIndex };
    }
    return state;
  }),
}))


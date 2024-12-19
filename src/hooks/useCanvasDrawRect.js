import { useState } from 'react';

import { useStore } from '../store';

export const useCanvasDrawRect = () => {
  const stage = useStore((state) => state.stage);
  const stageX = useStore((state) => state.stageX);
  const stageY = useStore((state) => state.stageY);
  const stageScale = useStore((state) => state.stageScale);
  const selectedTool = useStore((state) => state.selectedTool);
  const isSpaceDown = useStore((state) => state.isSpaceDown);
  const rects = useStore((state) => state.rects);
  const setRects = useStore((state) => state.setRects);
  const addHistory = useStore((state) => state.addHistory);

  const [newRect, setNewRect] = useState([]);

  const handleMouseDown = () => {
    if(selectedTool != 'square' || isSpaceDown) return
    if (newRect.length === 0) {
      const pos = stage.getPointerPosition();
      const transformedPos = {
        x: (pos.x - stageX) / stageScale,
        y: (pos.y - stageY) / stageScale,
      }
      const rect = { x: transformedPos.x, y: transformedPos.y, width: 0, height: 0, id: `rect-${rects.length + 1}` };
      setNewRect([rect]);
      setRects([...rects, rect]);
    }
  }

  const handleMouseMove = () => {
    if(selectedTool != 'square' || isSpaceDown) return
    if (newRect.length === 1) {
      const sx = newRect[0].x;
      const sy = newRect[0].y;
      const id = newRect[0].id;
      const pos = stage.getPointerPosition();
      const transformedPos = {
        x: (pos.x - stageX) / stageScale,
        y: (pos.y - stageY) / stageScale,
      };
      const updatedRect = { x: sx, y: sy, width: transformedPos.x - sx, height: transformedPos.y - sy, id };
      setNewRect([updatedRect]);
      setRects([...rects.slice(0, -1), updatedRect]);
    }
  }

  const handleMouseUp = () => {
    if(selectedTool != 'square' || isSpaceDown) return
    setNewRect([]);
    addHistory({ rects: rects.concat() });
  }

  return { handleMouseDown, handleMouseMove, handleMouseUp };
}
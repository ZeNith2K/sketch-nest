import { useState } from 'react';

import { useStore } from '../store';

export const useCanvasDrawRect = () => {
  const stage = useStore((state) => state.stage);
  const stageX = useStore((state) => state.stageX);
  const stageY = useStore((state) => state.stageY);
  const stageScale = useStore((state) => state.stageScale);
  const selectedTool = useStore((state) => state.selectedTool);
  const isSpaceDown = useStore((state) => state.isSpaceDown);

  const [rects, setRects ] = useState([]);
  const [newRect, setNewRect] = useState([]);

  const handleMouseDown = () => {
    if(selectedTool != 'square' || isSpaceDown) return
    if (newRect.length === 0) {
      const pos = stage.getPointerPosition();
      const transformedPos = {
        x: (pos.x - stageX) / stageScale,
        y: (pos.y - stageY) / stageScale,
      }
      setNewRect([{ x: transformedPos.x, y: transformedPos.y, width: 0, height: 0, key: "0" }]);
    }
  }

  const handleMouseMove = () => {
    if(selectedTool != 'square' || isSpaceDown) return
    if (newRect.length === 1) {
      const sx = newRect[0].x;
      const sy = newRect[0].y;
      const pos = stage.getPointerPosition();
      const transformedPos = {
        x: (pos.x - stageX) / stageScale,
        y: (pos.y - stageY) / stageScale,
      };
      setNewRect([{ x: sx, y: sy, width: transformedPos.x - sx, height: transformedPos.y - sy, key: "0" }]);
    }
  }

  const handleMouseUp = () => {
    if(selectedTool != 'square' || isSpaceDown) return
    if (newRect.length === 1) {
      const sx = newRect[0].x;
      const sy = newRect[0].y;
      const pos = stage.getPointerPosition();
      const transformedPos = {
        x: (pos.x - stageX) / stageScale,
        y: (pos.y - stageY) / stageScale,
      };
      const rectToAdd = {
        x: sx,
        y: sy,
        width: transformedPos.x - sx,
        height: transformedPos.y - sy,
        key: rects.length + 1
      };
      setNewRect([]);
      setRects([...rects, rectToAdd]);
    }
  }

  const getRectsToDraw = () => {
    return [...rects, ...newRect]
  }

  return { handleMouseDown, handleMouseMove, handleMouseUp, getRectsToDraw };
}
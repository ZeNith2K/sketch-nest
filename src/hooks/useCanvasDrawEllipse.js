import { useState } from 'react';
import { useStore } from '../store';

export const useCanvasDrawEllipse = () => {

  const stage = useStore((state) => state.stage);
  const stageX = useStore((state) => state.stageX);
  const stageY = useStore((state) => state.stageY);
  const stageScale = useStore((state) => state.stageScale);
  const selectedTool = useStore((state) => state.selectedTool);
  const isSpaceDown = useStore((state) => state.isSpaceDown);

  const [newEllipse, setNewEllipse] = useState([]);
  const [ellipses, setEllipses] = useState([]);

  const handleMouseDown = () => {
    if(selectedTool != 'ellipse' || isSpaceDown) return
    if (newEllipse.length === 0) {
      const pos = stage.getPointerPosition();
      const transformedPos = {
        x: (pos.x - stageX) / stageScale,
        y: (pos.y - stageY) / stageScale,
      }
      setNewEllipse([{ x: transformedPos.x, y: transformedPos.y, radiusX: 0, radiusY: 0, key: "0" }]);
    }
  }

  const handleMouseMove = () => {
    if(selectedTool != 'ellipse' || isSpaceDown) return
    if (newEllipse.length === 1) {
      const sx = newEllipse[0].x;
      const sy = newEllipse[0].y;
      const pos = stage.getPointerPosition();
      const transformedPos = {
        x: (pos.x - stageX) / stageScale,
        y: (pos.y - stageY) / stageScale,
      };
      setNewEllipse([
        {
          x: sx,
          y: sy,
          radiusX: transformedPos.x - sx,
          radiusY: transformedPos.y - sy,
          key: "0"
        }
      ]);
    }
  }

  const handleMouseUp = () => {
    if(selectedTool != 'ellipse' || isSpaceDown) return
    if (newEllipse.length === 1) {
      const sx = newEllipse[0].x;
      const sy = newEllipse[0].y;
      const pos = stage.getPointerPosition();
      const transformedPos = {
        x: (pos.x - stageX) / stageScale,
        y: (pos.y - stageY) / stageScale,
      };
      const ellipseToAdd = {
        x: sx,
        y: sy,
        radiusX: transformedPos.x - sx,
        radiusY: transformedPos.y - sy,
        key: ellipses.length + 1
      };
      ellipses.push(ellipseToAdd);
      setNewEllipse([]);
      setEllipses(ellipses);
    }
  }

  const getEllipsesToDraw = () => {
    return [...ellipses, ...newEllipse]
  }

  return { handleMouseDown, handleMouseMove, handleMouseUp, getEllipsesToDraw }
}
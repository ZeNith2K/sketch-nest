import { useState } from 'react';
import { useStore } from '../store';

export const useCanvasDrawEllipse = () => {

  const stage = useStore((state) => state.stage);
  const stageX = useStore((state) => state.stageX);
  const stageY = useStore((state) => state.stageY);
  const stageScale = useStore((state) => state.stageScale);
  const selectedTool = useStore((state) => state.selectedTool);
  const isSpaceDown = useStore((state) => state.isSpaceDown);
  const ellipses = useStore((state) => state.ellipses);
  const setEllipses = useStore((state) => state.setEllipses);
  const addHistory = useStore((state) => state.addHistory);

  const [newEllipse, setNewEllipse] = useState([]);

  const handleMouseDown = () => {
    if(selectedTool != 'ellipse' || isSpaceDown) return
    if (newEllipse.length === 0) {
      const pos = stage.getPointerPosition();
      const transformedPos = {
        x: (pos.x - stageX) / stageScale,
        y: (pos.y - stageY) / stageScale,
      }
      const ellipse = { x: transformedPos.x, y: transformedPos.y, radiusX: 0, radiusY: 0, id: `ellipse-${ellipses.length + 1}` };
      setNewEllipse([ellipse]);
      setEllipses([...ellipses, ellipse]);
    }
  }

  const handleMouseMove = () => {
    if(selectedTool != 'ellipse' || isSpaceDown) return
    if (newEllipse.length === 1) {
      const sx = newEllipse[0].x;
      const sy = newEllipse[0].y;
      const id = newEllipse[0].id;
      const pos = stage.getPointerPosition();
      const transformedPos = {
        x: (pos.x - stageX) / stageScale,
        y: (pos.y - stageY) / stageScale,
      };
      let updatedEllipse = { x: sx, y: sy, radiusX: Math.abs(transformedPos.x - sx), radiusY: Math.abs(transformedPos.y - sy), id };
      setNewEllipse([updatedEllipse]);
      setEllipses([...ellipses.slice(0, -1), updatedEllipse]);
    }
  }

  const handleMouseUp = () => {
    if(selectedTool != 'ellipse' || isSpaceDown) return
    setNewEllipse([]);
    addHistory({ ellipses: ellipses.concat() });
  }

  return { handleMouseDown, handleMouseMove, handleMouseUp }
}
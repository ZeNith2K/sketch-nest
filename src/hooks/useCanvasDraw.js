import { useState } from 'react';
import { useStore } from '../store';

export const useCanvasDraw = () => {

  const stage = useStore((state) => state.stage);
  const stageX = useStore((state) => state.stageX);
  const stageY = useStore((state) => state.stageY);
  const stageScale = useStore((state) => state.stageScale);
  const selectedTool = useStore((state) => state.selectedTool);
  const isMouseDown = useStore((state) => state.isMouseDown);
  const isSpaceDown = useStore((state) => state.isSpaceDown);

  const [lines, setLines] = useState([]);

  const handleMouseDown = () => {
    if (selectedTool != 'pencil' || isSpaceDown) return
    const pos = stage.getPointerPosition();
    const transformedPos = {
      x: (pos.x - stageX) / stageScale,
      y: (pos.y - stageY) / stageScale,
    };
    setLines([...lines, { points: [transformedPos.x, transformedPos.y] }]);
  };

  const handleMouseMove = () => {
    if (!isMouseDown || selectedTool != 'pencil' || isSpaceDown) return
    const point = stage.getPointerPosition();
    const transformedPoint = {
      x: (point.x - stageX) / stageScale,
      y: (point.y - stageY) / stageScale,
    };
    let lastLine = lines[lines.length - 1];
    lastLine.points = lastLine.points.concat([transformedPoint.x, transformedPoint.y]);

    lines.splice(lines.length - 1, 1, lastLine);
    setLines(lines.concat());
  };

  const getLinesToDraw = () => {
    return lines
  };

  return { handleMouseDown, handleMouseMove, getLinesToDraw };
};
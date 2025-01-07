import { useState } from 'react';
import { useStore } from '../store';

export const useCanvasSelect = () => {
  const stage = useStore((state) => state.stage);
  const stageX = useStore((state) => state.stageX);
  const stageY = useStore((state) => state.stageY);
  const stageScale = useStore((state) => state.stageScale);
  const lines = useStore((state) => state.lines);
  const rects = useStore((state) => state.rects);
  const ellipses = useStore((state) => state.ellipses);
  const setLines = useStore((state) => state.setLines);
  const setRects = useStore((state) => state.setRects);
  const setEllipses = useStore((state) => state.setEllipses);
  const selectedTool = useStore((state) => state.selectedTool);

  const [selectionRect, setSelectionRect] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleMouseDown = () => {
    if (selectedTool !== 'selection') return;
    const pos = stage.getPointerPosition();
    const transformedPos = {
      x: (pos.x - stageX) / stageScale,
      y: (pos.y - stageY) / stageScale,
    };
    setSelectionRect({ x: transformedPos.x, y: transformedPos.y, width: 0, height: 0 });
    setIsSelecting(true);
  };

  const handleMouseMove = () => {
    if (!isSelecting || selectedTool !== 'selection') return;
    const pos = stage.getPointerPosition();
    const transformedPos = {
      x: (pos.x - stageX) / stageScale,
      y: (pos.y - stageY) / stageScale,
    };
    setSelectionRect((prevRect) => ({
      ...prevRect,
      width: transformedPos.x - prevRect.x,
      height: transformedPos.y - prevRect.y,
    }));
  };

  const handleMouseUp = () => {
    if (!isSelecting || selectedTool !== 'selection') return;
    const selectedLines = lines.map(line => ({...line, selected: isElementInSelection(line)}));
    const selectedRects = rects.map(rect => ({...rect, selected: isElementInSelection(rect)}));
    const selectedEllipses = ellipses.map(ellipse => ({...ellipse, selected: isElementInSelection(ellipse)}));

    setLines(selectedLines);
    setRects(selectedRects);
    setEllipses(selectedEllipses);

    setIsSelecting(false);
    setSelectionRect(null);
  };

  const isElementInSelection = (element) => {
    const { x, y, width, height } = selectionRect;
    const elementX = element.x || element.points[0];
    const elementY = element.y || element.points[1];
    return (
      elementX >= x &&
      elementX <= x + width &&
      elementY >= y &&
      elementY <= y + height
    );
  };

  return { handleMouseDown, handleMouseMove, handleMouseUp, selectionRect };
};
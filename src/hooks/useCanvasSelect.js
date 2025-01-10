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

  const isInsideSelectedElement = (transformedPos) => {
    return lines.some(line => line.selected && isPointInElement(line, transformedPos)) ||
      rects.some(rect => rect.selected && isPointInElement(rect, transformedPos)) ||
      ellipses.some(ellipse => ellipse.selected && isPointInElement(ellipse, transformedPos));
  };

  const handleMouseDown = () => {
    if (selectedTool !== 'selection') return;
    const pos = stage.getPointerPosition();
    const transformedPos = {
      x: (pos.x - stageX) / stageScale,
      y: (pos.y - stageY) / stageScale,
    };

    // Check if the mouse is inside any of the selected elements
    if (isInsideSelectedElement(transformedPos)) return;

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
    const selectedLines = lines.map(line => ({ ...line, selected: isElementInSelection(line) }));
    const selectedRects = rects.map(rect => ({ ...rect, selected: isElementInSelection(rect) }));
    const selectedEllipses = ellipses.map(ellipse => ({ ...ellipse, selected: isElementInSelection(ellipse) }));

    setLines(selectedLines);
    setRects(selectedRects);
    setEllipses(selectedEllipses);

    setIsSelecting(false);
    setSelectionRect(null);
  };

  const isElementInSelection = (element, pos = null) => {
    const { x, y, width, height } = selectionRect;
    const elementX = element.x || element.points[0];
    const elementY = element.y || element.points[1];
    const checkX = pos ? pos.x : elementX;
    const checkY = pos ? pos.y : elementY;
    return (
      checkX >= x &&
      checkX <= x + width &&
      checkY >= y &&
      checkY <= y + height
    );
  };

  const isPointInElement = (element, point) => {
    const elementX = element.x || element.points[0];
    const elementY = element.y || element.points[1];
    const elementWidth = element.width || (element.points && element.points[2] - element.points[0]) || 0;
    const elementHeight = element.height || (element.points && element.points[3] - element.points[1]) || 0;
    return (
      point.x >= elementX &&
      point.x <= elementX + elementWidth &&
      point.y >= elementY &&
      point.y <= elementY + elementHeight
    );
  };

  return { handleMouseDown, handleMouseMove, handleMouseUp, selectionRect };
};
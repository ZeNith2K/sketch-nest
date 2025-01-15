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

    if (isInsideSelectedElement(transformedPos)) return;
    setSelectionRect((prevRect) => ({
      ...prevRect,
      width: transformedPos.x - prevRect.x,
      height: transformedPos.y - prevRect.y,
    }));
  };

  const handleMouseUp = () => {
    if (!isSelecting || selectedTool !== 'selection') return;
    const pos = stage.getPointerPosition();
    const transformedPos = {
      x: (pos.x - stageX) / stageScale,
      y: (pos.y - stageY) / stageScale,
    };
    if(isInsideSelectedElement(transformedPos)) return;

    const offset = 2;

    const selectedLines = lines.map(line => {
      const selected = isElementInSelection(line);
      const selectionRect = selected ? {
      x: Math.min(...line.points.filter((_, index) => index % 2 === 0)) - offset,
      y: Math.min(...line.points.filter((_, index) => index % 2 !== 0)) - offset,
      width: Math.max(...line.points.filter((_, index) => index % 2 === 0)) - Math.min(...line.points.filter((_, index) => index % 2 === 0)) + 2 * offset,
      height: Math.max(...line.points.filter((_, index) => index % 2 !== 0)) - Math.min(...line.points.filter((_, index) => index % 2 !== 0)) + 2 * offset,
      } : null;

      return { ...line, selected, selectionRect };
    });

    const selectedRects = rects.map(rect => {
      const selected = isElementInSelection(rect);
      const selectionRect = selected ? {
        x: rect.x - offset,
        y: rect.y - offset,
        width: rect.width + 2 * offset,
        height: rect.height + 2 * offset,
      } : null;
      return { ...rect, selected, selectionRect };
    });

    const selectedEllipses = ellipses.map(ellipse => {
      const selected = isElementInSelection(ellipse);
      const selectionRect = selected ? {
        x: ellipse.x - ellipse.radiusX - offset,
        y: ellipse.y - ellipse.radiusY - offset,
        width: ellipse.radiusX * 2 + 2 * offset,
        height: ellipse.radiusY * 2 + 2 * offset,
      } : null;

      return { ...ellipse, selected, selectionRect };
    });

    setLines(selectedLines);
    setRects(selectedRects);
    setEllipses(selectedEllipses);

    setIsSelecting(false);
    setSelectionRect(null);
  };

  const isElementInSelection = (element) => {
    if (!selectionRect) return false;
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

  const isPointInElement = (element, point) => {
    const offset = 8;
    const elementX = element.selectionRect?.x
    const elementY = element.selectionRect?.y
    const elementWidth = element.selectionRect?.width
    const elementHeight = element.selectionRect?.height
    return (
      point.x >= elementX - offset &&
      point.x <= elementX + elementWidth + offset &&
      point.y >= elementY - offset &&
      point.y <= elementY + elementHeight + offset
    );
  };

  return { handleMouseDown, handleMouseMove, handleMouseUp, selectionRect };
};
import { useState, useEffect } from 'react';
import { useStore } from '../store';

const useElementResize = (x, y, width, height, element) => {
  const stage = useStore((state) => state.stage);
  const lines = useStore((state) => state.lines);
  const rects = useStore((state) => state.rects);
  const ellipses = useStore((state) => state.ellipses);
  const setLines = useStore((state) => state.setLines);
  const setRects = useStore((state) => state.setRects);
  const setEllipses = useStore((state) => state.setEllipses);

  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [initialPos, setInitialPos] = useState({ x, y, width, height });

  const [isOnLeftEdge, setIsOnLeftEdge] = useState(false);
  const [isOnRightEdge, setIsOnRightEdge] = useState(false);
  const [isOnTopEdge, setIsOnTopEdge] = useState(false);
  const [isOnBottomEdge, setIsOnBottomEdge] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.target;
    const { x, y, width, height } = rect.attrs;
    const offset = 20;

    const pointerPos = stage.getPointerPosition();
    const stageTransform = stage.getAbsoluteTransform().copy().invert();
    const transformedPointerPos = stageTransform.point(pointerPos);

    setIsOnLeftEdge(transformedPointerPos.x >= x - offset && transformedPointerPos.x <= x + offset)
    setIsOnRightEdge(transformedPointerPos.x >= x + width - offset && transformedPointerPos.x <= x + width + offset)
    setIsOnTopEdge(transformedPointerPos.y >= y - offset && transformedPointerPos.y <= y + offset)
    setIsOnBottomEdge(transformedPointerPos.y >= y + height - offset && transformedPointerPos.y <= y + height + offset)

    if (isOnLeftEdge && isOnTopEdge) {
      stage.container().style.cursor = 'nw-resize';
      setIsResizing(true);
    } else if (isOnRightEdge && isOnTopEdge) {
      stage.container().style.cursor = 'ne-resize';
      setIsResizing(true);
    } else if (isOnLeftEdge && isOnBottomEdge) {
      stage.container().style.cursor = 'sw-resize';
      setIsResizing(true);
    } else if (isOnRightEdge && isOnBottomEdge) {
      stage.container().style.cursor = 'se-resize';
      setIsResizing(true);
    } else if (isOnLeftEdge || isOnRightEdge) {
      stage.container().style.cursor = 'ew-resize';
      setIsResizing(true);
    } else if (isOnTopEdge || isOnBottomEdge) {
      stage.container().style.cursor = 'ns-resize';
      setIsResizing(true);
    } else if (
      transformedPointerPos.x > x + offset &&
      transformedPointerPos.x < x + width - offset &&
      transformedPointerPos.y > y + offset &&
      transformedPointerPos.y < y + height - offset
    ) {
      stage.container().style.cursor = 'move';
      setIsDragging(true);
    } else {
      stage.container().style.cursor = 'default';
    }
  };

  const handleMouseLeave = () => {
    stage.container().style.cursor = 'default';
  };

  const handleDragStart = () => {
    setIsMouseDown(true);
    const pointerPos = stage.getPointerPosition();
    const stageTransform = stage.getAbsoluteTransform().copy().invert();
    const transformedPointerPos = stageTransform.point(pointerPos);
    setInitialPos({ x: transformedPointerPos.x, y: transformedPointerPos.y });
  };

  const handleDragMove = () => {
    if(!isMouseDown) return
    if (isDragging) {
      const pointerPos = stage.getPointerPosition();
      const stageTransform = stage.getAbsoluteTransform().copy().invert();
      const transformedPointerPos = stageTransform.point(pointerPos);

      const dx = transformedPointerPos.x - initialPos.x;
      const dy = transformedPointerPos.y - initialPos.y;

      element.x = element.x + dx;
      element.y = element.y + dy;
      element.selectionRect.x = element.selectionRect.x + dx;
      element.selectionRect.y = element.selectionRect.y + dy;

      setInitialPos({ x: transformedPointerPos.x, y: transformedPointerPos.y});

      if (element.id.includes('line')) {
        setLines(lines.map((line) => (line.id === element.id ? element : line)));
      } else if (element.id.includes('rect')) {
        setRects(rects.map((rect) => (rect.id === element.id ? element : rect)));
      } else if (element.id.includes('ellipse')) {
        setEllipses(ellipses.map((ellipse) => (ellipse.id === element.id ? element : ellipse)));
      }
    }
    if(isResizing){
      const pointerPos = stage.getPointerPosition();
      const stageTransform = stage.getAbsoluteTransform().copy().invert();
      const transformedPointerPos = stageTransform.point(pointerPos);

      if (isOnLeftEdge) {
        element.width = element.width + (element.x - transformedPointerPos.x);
        element.selectionRect.width = element.selectionRect.width + (element.selectionRect.x - transformedPointerPos.x);
        element.x = transformedPointerPos.x;
        element.selectionRect.x = transformedPointerPos.x;
      } else if (isOnRightEdge) {
        element.width = transformedPointerPos.x - element.x;
        element.selectionRect.width = transformedPointerPos.x - element.selectionRect.x;
      }

      if (isOnTopEdge) {
        element.height = element.height + (element.y - transformedPointerPos.y);
        element.selectionRect.height = element.selectionRect.height + (element.selectionRect.y - transformedPointerPos.y);
        element.y = transformedPointerPos.y;
        element.selectionRect.y = transformedPointerPos.y;
      } else if (isOnBottomEdge) {
        element.height = transformedPointerPos.y - element.y;
        element.selectionRect.height = transformedPointerPos.y - element.selectionRect.y;
      }

      setInitialPos({ x: transformedPointerPos.x, y: transformedPointerPos.y });

      if (element.id.includes('line')) {
        setLines(lines.map((line) => (line.id === element.id ? element : line)));
      } else if (element.id.includes('rect')) {
        setRects(rects.map((rect) => (rect.id === element.id ? element : rect)));
      } else if (element.id.includes('ellipse')) {
        setEllipses(ellipses.map((ellipse) => (ellipse.id === element.id ? element : ellipse)));
      }
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setIsMouseDown(false);
    setIsResizing(false);
  };

  useEffect(() => {
    if (isDragging && isMouseDown) {
      stage.container().style.cursor = 'grabbing';
    } else {
      stage.container().style.cursor = 'default';
    }
  }, [isMouseDown, stage, isDragging]);

  return {
    handleMouseMove,
    handleMouseLeave,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    isResizing
  };
};

export default useElementResize;
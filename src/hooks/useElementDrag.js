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

  const [isDragging, setIsDragging] = useState(false);
  const [initialPos, setInitialPos] = useState({ x, y, width, height });

  const handleMouseMove = (e) => {
    const rect = e.target;
    const { x, y, width, height } = rect.attrs;
    const offset = 8;

    const pointerPos = stage.getPointerPosition();
    const stageTransform = stage.getAbsoluteTransform().copy().invert();
    const transformedPointerPos = stageTransform.point(pointerPos);

    const isOnLeftEdge = transformedPointerPos.x >= x - offset && transformedPointerPos.x <= x + offset;
    const isOnRightEdge = transformedPointerPos.x >= x + width - offset && transformedPointerPos.x <= x + width + offset;
    const isOnTopEdge = transformedPointerPos.y >= y - offset && transformedPointerPos.y <= y + offset;
    const isOnBottomEdge = transformedPointerPos.y >= y + height - offset && transformedPointerPos.y <= y + height + offset;

    if (isOnLeftEdge && isOnTopEdge) {
      stage.container().style.cursor = 'nw-resize';
    } else if (isOnRightEdge && isOnTopEdge) {
      stage.container().style.cursor = 'ne-resize';
    } else if (isOnLeftEdge && isOnBottomEdge) {
      stage.container().style.cursor = 'sw-resize';
    } else if (isOnRightEdge && isOnBottomEdge) {
      stage.container().style.cursor = 'se-resize';
    } else if (isOnLeftEdge || isOnRightEdge) {
      stage.container().style.cursor = 'ew-resize';
    } else if (isOnTopEdge || isOnBottomEdge) {
      stage.container().style.cursor = 'ns-resize';
    } else if (
      transformedPointerPos.x > x + offset &&
      transformedPointerPos.x < x + width - offset &&
      transformedPointerPos.y > y + offset &&
      transformedPointerPos.y < y + height - offset
    ) {
      stage.container().style.cursor = 'move';
    } else {
      stage.container().style.cursor = 'default';
    }
  };

  const handleMouseLeave = () => {
    stage.container().style.cursor = 'default';
  };

  const handleDragStart = () => {
    setIsDragging(true);
    const pointerPos = stage.getPointerPosition();
    const stageTransform = stage.getAbsoluteTransform().copy().invert();
    const transformedPointerPos = stageTransform.point(pointerPos);
    setInitialPos({ x: transformedPointerPos.x, y: transformedPointerPos.y });
  };

  const handleDragMove = () => {
    if (isDragging) {
      const pointerPos = stage.getPointerPosition();
      const stageTransform = stage.getAbsoluteTransform().copy().invert();
      const transformedPointerPos = stageTransform.point(pointerPos);

      const dx = transformedPointerPos.x - initialPos.x;
      const dy = transformedPointerPos.y - initialPos.y;

      element.x = element.x + dx;
      element.y = element.y + dy;

      setInitialPos({ x: transformedPointerPos.x, y: transformedPointerPos.y});

      // Update the store
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
  };

  useEffect(() => {
    if (isDragging) {
      stage.container().style.cursor = 'grabbing';
    } else {
      stage.container().style.cursor = 'default';
    }
  }, [isDragging, stage]);

  return {
    handleMouseMove,
    handleMouseLeave,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  };
};

export default useElementResize;
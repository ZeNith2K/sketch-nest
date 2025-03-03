import { useState, useEffect } from 'react';
import { useStore } from '../store';

const useElementResize = (x, y, width, height, element) => {
  const stage = useStore((state) => state.stage);
  const lines = useStore((state) => state.lines);
  const rects = useStore((state) => state.rects);
  const ellipses = useStore((state) => state.ellipses);
  const images = useStore((state) => state.images);
  const setLines = useStore((state) => state.setLines);
  const setRects = useStore((state) => state.setRects);
  const setEllipses = useStore((state) => state.setEllipses);
  const setImages = useStore((state) => state.setImages);

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

      if (element.id.includes('line')) {
        if (element.points) {
          const newPoints = [...element.points];

          for (let i = 0; i < newPoints.length; i += 2) {
            newPoints[i] += dx;
            newPoints[i + 1] += dy;
          }
          element.points = newPoints;
        } else if (element.line && element.line.points) {
          const newPoints = [...element.line.points];
          for (let i = 0; i < newPoints.length; i += 2) {
            newPoints[i] += dx;
            newPoints[i + 1] += dy;
          }
          element.line.points = newPoints;
        } else if (element.points === undefined) {
          if (element.x1 !== undefined) {
            element.x1 += dx;
            element.y1 += dy;
            element.x2 += dx;
            element.y2 += dy;
          }
        }

        if (element.selectionRect) {
          element.selectionRect.x += dx;
          element.selectionRect.y += dy;
        }
      } else {
        element.x += dx;
        element.y += dy;

        if (element.selectionRect) {
          element.selectionRect.x += dx;
          element.selectionRect.y += dy;
        }
      }

      setInitialPos({ x: transformedPointerPos.x, y: transformedPointerPos.y });

      // Update the store
      if (element.id.includes('line')) {
        setLines(lines.map((line) => (line.id === element.id ? element : line)));
      } else if (element.id.includes('rect')) {
        setRects(rects.map((rect) => (rect.id === element.id ? element : rect)));
      } else if (element.id.includes('ellipse')) {
        setEllipses(ellipses.map((ellipse) => (ellipse.id === element.id ? element : ellipse)));
      } else if (element.id.includes('image')) {
        setImages(images.map((image) => (image.id === element.id ? element : image)));
      }
    }
    if(isResizing){
      const pointerPos = stage.getPointerPosition();
      const stageTransform = stage.getAbsoluteTransform().copy().invert();
      const transformedPointerPos = stageTransform.point(pointerPos);

      if (isOnLeftEdge) {
        const deltaX = element.selectionRect.x - transformedPointerPos.x;

        element.selectionRect.width += deltaX;
        element.selectionRect.x = transformedPointerPos.x;

        if(element.id.includes('rect')) {
          element.width += deltaX;
          element.x = transformedPointerPos.x;
        }
        else if(element.id.includes('ellipse')) {
          const selRectCenter = element.selectionRect.x + (element.selectionRect.width / 2);
          element.x = selRectCenter;
          element.radiusX = element.selectionRect.width / 2;
        }
        else if(element.id.includes('line')) {
          if (element.points && element.points.length >= 2) {
            const newWidth = element.selectionRect.width + deltaX;
            const widthChange = newWidth / (element.selectionRect.width - deltaX);
            let minX = element.points[0];
            for (let i = 0; i < element.points.length; i += 2) {
              if (element.points[i] < minX) {
                minX = element.points[i];
              }
            }
            const newPoints = [];


            for (let i = 0; i < element.points.length; i += 2) {
              const distanceFromLeft = element.points[i] - minX;
              newPoints.push(minX + (distanceFromLeft * widthChange));
              newPoints.push(element.points[i + 1]);
            }

            element.points = newPoints;
            const updatedElement = {
              ...element,
              points: [...newPoints]
            };
            setLines(lines.map((line) => (line.id === element.id ? updatedElement : line)));
          }
        }
      } else if (isOnRightEdge) {
        const newWidth = transformedPointerPos.x - element.selectionRect.x;
        const widthChange = newWidth / element.selectionRect.width;

        element.selectionRect.width = newWidth;

        if(element.id.includes('rect')) {
          element.width = transformedPointerPos.x - element.x;
        }
        else if(element.id.includes('ellipse')) {
          const selRectCenter = element.selectionRect.x + (newWidth / 2);
          element.x = selRectCenter;
          element.radiusX = newWidth / 2;
        }
        else if(element.id.includes('line')) {
          if (element.points && element.points.length >= 2) {
            // Find the leftmost x-coordinate in the points array to use as the fixed point
            let minX = element.points[0];
            for (let i = 0; i < element.points.length; i += 2) {
              if (element.points[i] < minX) {
                minX = element.points[i];
              }
            }

            for (let i = 0; i < element.points.length; i += 2) {
              const distanceFromLeft = element.points[i] - minX;
              element.points[i] = minX + (distanceFromLeft * widthChange);
            }
          }
        }
      }

      if (isOnTopEdge) {
        const deltaY = element.selectionRect.y - transformedPointerPos.y;

        element.selectionRect.height += deltaY;
        element.selectionRect.y = transformedPointerPos.y;

        if(element.id.includes('rect')) {
          element.height += deltaY;
          element.y = transformedPointerPos.y;
        }
        else if(element.id.includes('ellipse')) {
          const selRectCenter = element.selectionRect.y + (element.selectionRect.height / 2);
          element.y = selRectCenter;
          element.radiusY = element.selectionRect.height / 2;
        }
        else if(element.id.includes('line')) {
          if (element.points && element.points.length >= 2) {
            const scaleFactorY = element.selectionRect.height / (element.selectionRect.height - deltaY);

            let maxY = element.points[1];
            for (let i = 1; i < element.points.length; i += 2) {
              if (element.points[i] > maxY) {
                maxY = element.points[i];
              }
            }

            for (let i = 1; i < element.points.length; i += 2) {
              const distanceFromBottom = maxY - element.points[i];
              element.points[i] = maxY - (distanceFromBottom * scaleFactorY);
            }
          }
        }
      } else if (isOnBottomEdge) {
        const newHeight = transformedPointerPos.y - element.selectionRect.y;
        const heightChange = newHeight / element.selectionRect.height;

        element.selectionRect.height = newHeight;

        if(element.id.includes('rect')) {
          element.height = transformedPointerPos.y - element.y;
        }
        else if(element.id.includes('ellipse')) {
          const selRectCenter = element.selectionRect.y + (newHeight / 2);
          element.y = selRectCenter;
          element.radiusY = newHeight / 2;
        }
        else if(element.id.includes('line')) {
          if (element.points && element.points.length >= 2) {
            let minY = element.points[1];
            for (let i = 1; i < element.points.length; i += 2) {
              if (element.points[i] < minY) {
                minY = element.points[i];
              }
            }

            for (let i = 1; i < element.points.length; i += 2) {
              const distanceFromTop = element.points[i] - minY;
              element.points[i] = minY + (distanceFromTop * heightChange);
            }
          }
        }
      }

      setInitialPos({ x: transformedPointerPos.x, y: transformedPointerPos.y });

      if (element.id.includes('line')) {
        setLines(lines.map((line) => (line.id === element.id ? element : line)));
      } else if (element.id.includes('rect')) {
        setRects(rects.map((rect) => (rect.id === element.id ? element : rect)));
      } else if (element.id.includes('ellipse')) {
        setEllipses(ellipses.map((ellipse) => (ellipse.id === element.id ? element : ellipse)));
      } else if (element.id.includes('image')) {
        setImages(images.map((image) => (image.id === element.id ? element : image)));
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
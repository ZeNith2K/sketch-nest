import { useStore } from '../store';

export const useElementResize = () => {
  const rects = useStore((state) => state.rects);
  const ellipses = useStore((state) => state.ellipses);
  const lines = useStore((state) => state.lines);
  const setRects = useStore((state) => state.setRects);
  const setEllipses = useStore((state) => state.setEllipses);
  const setLines = useStore((state) => state.setLines);

  const handleResize = (newPos, direction) => {
    console.log('handleResize', newPos, direction);
    const selectedRects = rects.filter(rect => rect.selected);
    const selectedEllipses = ellipses.filter(ellipse => ellipse.selected);
    const selectedLines = lines.filter(line => line.selected);

    selectedRects.forEach(rect => {
      let newWidth = rect.width;
      let newHeight = rect.height;
      let newX = rect.x;
      let newY = rect.y;

      switch (direction) {
        case 'top-left':
          newWidth = rect.width + (rect.x - newPos.x);
          newHeight = rect.height + (rect.y - newPos.y);
          newX = newPos.x;
          newY = newPos.y;
          break;
        case 'top-right':
          newWidth = newPos.x - rect.x;
          newHeight = rect.height + (rect.y - newPos.y);
          newY = newPos.y;
          break;
        case 'bottom-left':
          newWidth = rect.width + (rect.x - newPos.x);
          newHeight = newPos.y - rect.y;
          newX = newPos.x;
          break;
        case 'bottom-right':
          newWidth = newPos.x - rect.x;
          newHeight = newPos.y - rect.y;
          break;
        default:
          break;
      }

      rect.width = newWidth;
      rect.height = newHeight;
      rect.x = newX;
      rect.y = newY;
    });

    selectedEllipses.forEach(ellipse => {
      let newRadiusX = ellipse.radiusX;
      let newRadiusY = ellipse.radiusY;
      let newX = ellipse.x;
      let newY = ellipse.y;

      switch (direction) {
        case 'top-left':
          newRadiusX = Math.abs(ellipse.x - newPos.x);
          newRadiusY = Math.abs(ellipse.y - newPos.y);
          newX = newPos.x;
          newY = newPos.y;
          break;
        case 'top-right':
          newRadiusX = Math.abs(newPos.x - ellipse.x);
          newRadiusY = Math.abs(ellipse.y - newPos.y);
          newY = newPos.y;
          break;
        case 'bottom-left':
          newRadiusX = Math.abs(ellipse.x - newPos.x);
          newRadiusY = Math.abs(newPos.y - ellipse.y);
          newX = newPos.x;
          break;
        case 'bottom-right':
          newRadiusX = Math.abs(newPos.x - ellipse.x);
          newRadiusY = Math.abs(newPos.y - ellipse.y);
          break;
        default:
          break;
      }

      ellipse.radiusX = newRadiusX;
      ellipse.radiusY = newRadiusY;
      ellipse.x = newX;
      ellipse.y = newY;
    });

    selectedLines.forEach(line => {
      let newX1 = line.x1;
      let newY1 = line.y1;
      let newX2 = line.x2;
      let newY2 = line.y2;

      switch (direction) {
        case 'start':
          newX1 = newPos.x;
          newY1 = newPos.y;
          break;
        case 'end':
          newX2 = newPos.x;
          newY2 = newPos.y;
          break;
        default:
          break;
      }

      line.x1 = newX1;
      line.y1 = newY1;
      line.x2 = newX2;
      line.y2 = newY2;
    });

    setRects([...rects]);
    setEllipses([...ellipses]);
    setLines([...lines]);
  };

  return { handleResize };
};
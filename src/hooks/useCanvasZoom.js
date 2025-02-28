import { useStore } from '../store';

export const useCanvasZoom = () => {
  const setStageScale = useStore((state) => state.setStageScale);
  const setStageX = useStore((state) => state.setStageX);
  const setStageY = useStore((state) => state.setStageY);
  const stage = useStore((state) => state.stage);

  let scaleBy = 1.1;

  const handleWheel = (e) => {
    e.evt.preventDefault();
    scaleBy = 1.05
    zoomCanvas(e.evt.deltaY > 0 ? scaleBy : 1 / scaleBy);
  };

  const zoomCanvas = (zoomFactor) => {
    if (!stage) return;
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = oldScale * zoomFactor;
    setStageScale(newScale);
    setStageX(-(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale);
    setStageY(-(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale);
  };

  const zoomIn = () => zoomCanvas(scaleBy);
  const zoomOut = () => zoomCanvas(1 / scaleBy);

  return { handleWheel, zoomIn, zoomOut, zoomLevel: (Math.round(stage?.scaleX() * 100)) || 100 };
};

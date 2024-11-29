import { useStore } from '../store';

export const useCanvasZoom = () => {
  const setStageScale = useStore((state) => state.setStageScale);
  const setStageX = useStore((state) => state.setStageX);
  const setStageY = useStore((state) => state.setStageY);
  const stage = useStore((state) => state.stage);


  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setStageScale(newScale);
    setStageX(-(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale);
    setStageY(-(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale);
  };

  return { handleWheel };
};
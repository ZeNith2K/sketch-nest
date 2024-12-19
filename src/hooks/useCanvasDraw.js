import { useStore } from '../store';

export const useCanvasDraw = () => {

  const stage = useStore((state) => state.stage);
  const stageX = useStore((state) => state.stageX);
  const stageY = useStore((state) => state.stageY);
  const stageScale = useStore((state) => state.stageScale);
  const selectedTool = useStore((state) => state.selectedTool);
  const isMouseDown = useStore((state) => state.isMouseDown);
  const isSpaceDown = useStore((state) => state.isSpaceDown);
  const lines = useStore((state) => state.lines);
  const setLines = useStore((state) => state.setLines);
  const addHistory = useStore((state) => state.addHistory);

  const handleMouseDown = () => {
    if (selectedTool != 'pencil' || isSpaceDown) return
    const pos = stage.getPointerPosition();
    const transformedPos = {
      x: (pos.x - stageX) / stageScale,
      y: (pos.y - stageY) / stageScale,
    };
    setLines([...lines, { points: [transformedPos.x, transformedPos.y], id: `line-${lines.length + 1}` }]);
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

  const handleMouseUp = () => {
    if(selectedTool != 'pencil' || isSpaceDown) return
    addHistory({ lines: lines.concat() });
  }


  return { handleMouseDown, handleMouseMove, handleMouseUp };
};
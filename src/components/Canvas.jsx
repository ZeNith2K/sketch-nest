import { useEffect, useState, useRef } from 'react';
import { Stage, Layer, Line, Circle, Rect } from 'react-konva';
import { useStore } from '../store';

import ControlPanel from './ControlPanel';

const App = () => {
  const [stageScale, setStageScale] = useState(1);
  const [stageX, setStageX] = useState(0);
  const [stageY, setStageY] = useState(0);
  const [lines, setLines] = useState([]);
  const stageRef = useRef(null);
  const isSpaceDown = useRef(false);
  const isMouseDown = useRef(false);
  const lastDist = useRef({ x: 0, y: 0 });

  const [annotations, setAnnotations] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState([]);

  const selectedTool = useStore((state) => state.selectedTool);

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = stageRef.current;
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

  const handleMouseDown = () => {
    if(!selectedTool && !isSpaceDown.current) return;
    isMouseDown.current = true;
    const stage = stageRef.current;
    if (isSpaceDown.current) {
      const pointerPosition = stage.getPointerPosition();
      lastDist.current = { x: pointerPosition.x - stage.x(), y: pointerPosition.y - stage.y() };
      return;
    }
    if (selectedTool == 'pencil'){
      const pos = stage.getPointerPosition();
      const transformedPos = {
        x: (pos.x - stageX) / stageScale,
        y: (pos.y - stageY) / stageScale,
      };
      setLines([...lines, { points: [transformedPos.x, transformedPos.y] }]);
    }
    if (selectedTool == 'square'){
      if (newAnnotation.length === 0) {
        const { x, y } = stage.getPointerPosition();
        setNewAnnotation([{ x, y, width: 0, height: 0, key: "0" }]);
      }
    }
  };

  const handleMouseMove = () => {
    if(!isMouseDown.current) return
    const stage = stageRef.current;
    if (isSpaceDown.current) {
      const pointerPosition = stage.getPointerPosition();
      setStageX(pointerPosition.x - lastDist.current.x);
      setStageY(pointerPosition.y - lastDist.current.y);
      return;
    }
    if (selectedTool == 'pencil'){
      const point = stage.getPointerPosition();
      const transformedPoint = {
        x: (point.x - stageX) / stageScale,
        y: (point.y - stageY) / stageScale,
      };
      let lastLine = lines[lines.length - 1];
      lastLine.points = lastLine.points.concat([transformedPoint.x, transformedPoint.y]);

      lines.splice(lines.length - 1, 1, lastLine);
      setLines(lines.concat());
    }

    if(selectedTool == 'square'){
      if (newAnnotation.length === 1) {
        const sx = newAnnotation[0].x;
        const sy = newAnnotation[0].y;
        const { x, y } = stage.getPointerPosition();
        setNewAnnotation([
          {
            x: sx,
            y: sy,
            width: x - sx,
            height: y - sy,
            key: "0"
          }
        ]);
      }
    }
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    const stage = stageRef.current
    if (selectedTool == 'square'){
      if (newAnnotation.length === 1) {
        const sx = newAnnotation[0].x;
        const sy = newAnnotation[0].y;
        const { x, y } = stage.getPointerPosition();
        const annotationToAdd = {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          key: annotations.length + 1
        };
        annotations.push(annotationToAdd);
        setNewAnnotation([]);
        setAnnotations(annotations);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.code === 'Space') {
      isSpaceDown.current = true;
      stageRef.current.container().style.cursor = 'grab';
    }
  };

  const handleKeyUp = (e) => {
    if (e.code === 'Space') {
      isSpaceDown.current = false;
      stageRef.current.container().style.cursor = 'default';
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const annotationsToDraw = [...annotations, ...newAnnotation];

  return (
    <div className='relative w-screen'>
      <ControlPanel />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        draggable={false}
        scaleX={stageScale}
        scaleY={stageScale}
        x={stageX}
        y={stageY}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        ref={stageRef}
      >
        <Layer>
          <Circle fill="red" x={400} y={400} radius={100} />
          {lines.map((line, i) => (
            <Line key={i} points={line.points} stroke="black" strokeWidth={2} tension={0.5} lineCap="round" />
          ))}
          {annotationsToDraw.map((value, index) => {
            return (
              <Rect
                key={index}
                x={value.x}
                y={value.y}
                width={value.width}
                height={value.height}
                fill="transparent"
                stroke="black"
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
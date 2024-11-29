import { useEffect, useRef } from 'react';
import { Stage, Layer, Line, Ellipse, Rect, Circle } from 'react-konva';
import { useStore } from '../store';
import { useCanvasZoom } from '../hooks/useCanvasZoom';
import { useCanvasPan } from '../hooks/useCanvasPan';
import { useCanvasDraw } from '../hooks/useCanvasDraw';
import { useCanvasDrawRect } from '../hooks/useCanvasDrawRect';
import { useCanvasDrawEllipse } from '../hooks/useCanvasDrawEllipse';

import ControlPanel from './ControlPanel';

const App = () => {
  const stageRef = useRef(null);
  const isMouseDown = useStore((state) => state.isMouseDown);
  const setIsMouseDown = useStore((state) => state.setIsMouseDown);

  const { handleWheel } = useCanvasZoom();
  const { handleMouseDown: handlePanMouseDown, handleMouseMove: handlePanMouseMove } = useCanvasPan();
  const { handleMouseDown: handleDrawMouseDown, handleMouseMove: handleDrawMouseMove, getLinesToDraw } = useCanvasDraw();
  const { handleMouseDown: handleDrawRectMouseDown, handleMouseMove: handleDrawRectMouseMove, handleMouseUp: handleDrawRectMouseUp, getRectsToDraw } = useCanvasDrawRect();
  const { handleMouseDown: handleDrawEllipseMouseDown, handleMouseMove: handleDrawEllipseMouseMove, handleMouseUp: handleDrawEllipseMouseUp, getEllipsesToDraw } = useCanvasDrawEllipse();

  const stageScale = useStore((state) => state.stageScale);
  const stageX = useStore((state) => state.stageX);
  const stageY = useStore((state) => state.stageY);
  const setStage = useStore((state) => state.setStage);

  useEffect(() => {
    setStage(stageRef.current);
  },[stageRef, setStage])

  const handleMouseDown = () => {
    setIsMouseDown(true);
    handlePanMouseDown();
    handleDrawMouseDown();
    handleDrawRectMouseDown();
    handleDrawEllipseMouseDown();
  };

  const handleMouseMove = () => {
    if(!isMouseDown) return
    handlePanMouseMove()
    handleDrawMouseMove()
    handleDrawRectMouseMove()
    handleDrawEllipseMouseMove()
  };

  const handleMouseUp = () => {
    setIsMouseDown(false)
    handleDrawRectMouseUp()
    handleDrawEllipseMouseUp()
  };

  const lines = getLinesToDraw();
  const rectsToDraw = getRectsToDraw();
  const ellipsesToDraw = getEllipsesToDraw();

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
          {rectsToDraw.map(value => {
            return (
              <Rect
                key={value.key}
                x={value.x}
                y={value.y}
                width={value.width}
                height={value.height}
                fill="transparent"
                stroke="black"
              />
            );
          })}
          {ellipsesToDraw.map(value => {
            return (
              <Ellipse
                key={value.key}
                x={value.x}
                y={value.y}
                radiusX={value.radiusX}
                radiusY={value.radiusY}
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
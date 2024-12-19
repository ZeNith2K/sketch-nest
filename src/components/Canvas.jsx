import { useEffect, useRef } from 'react';
import { Stage, Layer, Line, Ellipse, Rect, Circle } from 'react-konva';
import { useStore } from '../store';
import { useCanvasZoom } from '../hooks/useCanvasZoom';
import { useCustomCursor } from '../hooks/useCustomCursor';
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
  const { addCustomCursor, removeCustomCursor } = useCustomCursor();
  const { handleMouseDown: handlePanMouseDown, handleMouseMove: handlePanMouseMove } = useCanvasPan();
  const { handleMouseDown: handleDrawMouseDown, handleMouseMove: handleDrawMouseMove, handleMouseUp: handleDrawMouseUp } = useCanvasDraw();
  const { handleMouseDown: handleDrawRectMouseDown, handleMouseMove: handleDrawRectMouseMove, handleMouseUp: handleDrawRectMouseUp } = useCanvasDrawRect();
  const { handleMouseDown: handleDrawEllipseMouseDown, handleMouseMove: handleDrawEllipseMouseMove, handleMouseUp: handleDrawEllipseMouseUp } = useCanvasDrawEllipse();

  const stageScale = useStore((state) => state.stageScale);
  const stageX = useStore((state) => state.stageX);
  const stageY = useStore((state) => state.stageY);
  const setStage = useStore((state) => state.setStage);
  const lines = useStore((state) => state.lines);
  const rects = useStore((state) => state.rects);
  const ellipses = useStore((state) => state.ellipses);
  const setLines = useStore((state) => state.setLines);
  const setRects = useStore((state) => state.setRects);
  const setEllipses = useStore((state) => state.setEllipses);
  const selectedTool = useStore((state) => state.selectedTool);

  const removeElements = () => {
    if(selectedTool !== 'eraser') return
    const mousePos = stageRef.current.getPointerPosition();
    const e = stageRef.current.getIntersection(mousePos)
    if(!e) return
    let shapeId = e.attrs.id;
    var shape = stageRef.current.find(`#${shapeId}`)[0];

    if(!shape) return
    if (shape.className === 'Line') {
      const filteredLines = lines.filter(line => line.id !== shapeId);
      setLines(filteredLines);
    } else if (shape.className === 'Rect') {
      const filteredRects = rects.filter(rect => rect.id !== shapeId);
      setRects(filteredRects);
    } else if (shape.className === 'Ellipse') {
      const filteredEllipses = ellipses.filter(ellipse => ellipse.id !== shapeId);
      setEllipses(filteredEllipses);
    }
  }

  useEffect(() => {
    addCustomCursor();
    return () => removeCustomCursor()
  },[addCustomCursor, removeCustomCursor])

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
    removeElements()
    if(!isMouseDown) return
    handlePanMouseMove()
    handleDrawMouseMove()
    handleDrawRectMouseMove()
    handleDrawEllipseMouseMove()
  };

  const handleMouseUp = () => {
    setIsMouseDown(false)
    handleDrawMouseUp()
    handleDrawRectMouseUp()
    handleDrawEllipseMouseUp()
  };

  return (
    <div className="relative w-screen">
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
          {lines.map(line => (
            <Line key={line.id} id={line.id} points={line.points} stroke="black" strokeWidth={2} tension={0.5} lineCap="round" />
          ))}
          {rects.map(rect => {
            return (
              <Rect
                key={rect.id}
                id={rect.id}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                fill="transparent"
                stroke="black"
              />
            );
          })}
          {ellipses.map(ellipse => {
            return (
              <Ellipse
                key={ellipse.id}
                id={ellipse.id}
                x={ellipse.x}
                y={ellipse.y}
                radiusX={ellipse.radiusX}
                radiusY={ellipse.radiusY}
                fill="transparent"
                stroke="black"
              />
            );
          })}
        </Layer>
      </Stage>
      <div id="circle" className="box"></div>
    </div>
  );
};

export default App;
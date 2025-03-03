import { useEffect, useRef, Fragment } from 'react';
import { Stage, Layer, Line, Ellipse, Rect, Circle, Image } from 'react-konva';
import { useStore } from '../store';
import { useCanvasZoom } from '../hooks/useCanvasZoom';
import { useCustomCursor } from '../hooks/useCustomCursor';
import { useCanvasPan } from '../hooks/useCanvasPan';
import { useCanvasDraw } from '../hooks/useCanvasDraw';
import { useCanvasDrawRect } from '../hooks/useCanvasDrawRect';
import { useCanvasDrawEllipse } from '../hooks/useCanvasDrawEllipse';
import { useCanvasSelect } from '../hooks/useCanvasSelect';

import Toolbox from './Toolbox';
import CanvasControls from './CanvasControls';
import SelectionContainer from './SelectionContainer';

const App = () => {
  const stageRef = useRef(null);
  const isMouseDown = useStore((state) => state.isMouseDown);
  const setIsMouseDown = useStore((state) => state.setIsMouseDown);

  const { handleWheel } = useCanvasZoom();
  const { addCustomCursor, removeCustomCursor } = useCustomCursor();
  const { handleMouseDown: handlePanMouseDown, handleMouseUp: handlePanMouseUp, handleMouseMove: handlePanMouseMove } = useCanvasPan();
  const { handleMouseDown: handleDrawMouseDown, handleMouseMove: handleDrawMouseMove, handleMouseUp: handleDrawMouseUp } = useCanvasDraw();
  const { handleMouseDown: handleDrawRectMouseDown, handleMouseMove: handleDrawRectMouseMove, handleMouseUp: handleDrawRectMouseUp } = useCanvasDrawRect();
  const { handleMouseDown: handleDrawEllipseMouseDown, handleMouseMove: handleDrawEllipseMouseMove, handleMouseUp: handleDrawEllipseMouseUp } = useCanvasDrawEllipse();
  const { handleMouseDown: handleSelectMouseDown, handleMouseMove: handleSelectMouseMove, handleMouseUp: handleSelectMouseUp, selectionRect } = useCanvasSelect();

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
  const images = useStore((state) => state.images);

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

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    handlePanMouseDown(e);
    handleDrawMouseDown(e);
    handleDrawRectMouseDown(e);
    handleDrawEllipseMouseDown(e);
    handleSelectMouseDown(e);
  };

  const handleMouseMove = (e) => {
    removeElements()
    if(!isMouseDown) return
    handlePanMouseMove(e)
    handleDrawMouseMove(e)
    handleDrawRectMouseMove(e)
    handleDrawEllipseMouseMove(e)
    handleSelectMouseMove(e)
  };

  const handleMouseUp = (e) => {
    setIsMouseDown(false)
    handleDrawMouseUp(e)
    handleDrawRectMouseUp(e)
    handleDrawEllipseMouseUp(e)
    handleSelectMouseUp(e)
    handlePanMouseUp(e)
  };

  return (
    <div className="relative w-screen">
      <Toolbox />
      <CanvasControls />
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
            <Fragment key={`Fragment-${line.id}`}>
              <Line
                key={line.id}
                id={line.id}
                points={line.points}
                stroke="black"
                strokeWidth={2}
                tension={0.5}
                lineCap="round"
              />
              {line.selected && (
                <SelectionContainer
                  key={`outline-${line.id}`}
                  x={line.selectionRect.x}
                  y={line.selectionRect.y}
                  width={line.selectionRect.width}
                  height={line.selectionRect.height}
                  element={line}
                />
              )}
            </Fragment>
          ))}
          {rects.map(rect => (
            <Fragment key={`Fragment-${rect.id}`}>
              <Rect
                key={rect.id}
                id={rect.id}
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                stroke="black"
              />
              {rect.selected && (
                <SelectionContainer
                  key={`outline-${rect.id}`}
                  x={rect.selectionRect.x}
                  y={rect.selectionRect.y}
                  width={rect.selectionRect.width}
                  height={rect.selectionRect.height}
                  element={rect}
                />
              )}
            </Fragment>
          ))}
          {ellipses.map(ellipse => (
            <Fragment key={`Fragment-${ellipse.id}`}>
              <Ellipse
                key={ellipse.id}
                id={ellipse.id}
                x={ellipse.x}
                y={ellipse.y}
                radiusX={ellipse.radiusX}
                radiusY={ellipse.radiusY}
                stroke="black"
              />
              {ellipse.selected && (
                <SelectionContainer
                  key={`outline-${ellipse.id}`}
                  x={ellipse.selectionRect.x}
                  y={ellipse.selectionRect.y}
                  width={ellipse.selectionRect.width}
                  height={ellipse.selectionRect.height}
                  element={ellipse}
                />
              )}
            </Fragment>
          ))}
          {images.map(image => (
            <Fragment key={`Fragment-${image.id}`}>
              <Image
                key={image.id}
                id={image.id}
                image={image.src}
                x={image.x}
                y={image.y}
                width={image.width}
                height={image.height}
              />
              {image.selected && (
                <SelectionContainer
                  key={`outline-${image.id}`}
                  x={image.selectionRect.x}
                  y={image.selectionRect.y}
                  width={image.selectionRect.width}
                  height={image.selectionRect.height}
                  element={image}
                />
              )}
            </Fragment>

          ))}
          {selectionRect && (
            <Rect
              x={selectionRect.x}
              y={selectionRect.y}
              width={selectionRect.width}
              height={selectionRect.height}
              fill="rgba(0, 0, 255, 0.1)"
              stroke="rgba(0, 0, 255, 0.3)"
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default App;
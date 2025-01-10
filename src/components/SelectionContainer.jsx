import { Rect, Circle } from 'react-konva';
import { useStore } from '../store';

const SelectionContainer = ({ x, y, width, height, onResize }) => {

  const stage = useStore((state) => state.stage);

  const handleDragMove = (e, direction) => {
    const newPos = e.target.getStage().getPointerPosition();
    onResize(newPos, direction);
  };

  const resizeNodes = [
    { x: x - 8, y: y - 8, direction: 'top-left' },
    { x: x + width + 8, y: y - 8, direction: 'top-right' },
    { x: x - 8, y: y + height + 8, direction: 'bottom-left' },
    { x: x + width + 8, y: y + height + 8, direction: 'bottom-right' },
  ];

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

  return (
    <>
      <Rect
        x={x - 8}
        y={y - 8}
        width={width + 16}
        height={height + 16}
        stroke="rgba(0, 0, 255, 0.3)"
        strokeWidth={1}
        style={{ cursor: 'move' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {resizeNodes.map((node, index) => (
        <Circle
          key={index}
          x={node.x}
          y={node.y}
          radius={3}
          fill="white"
          stroke="rgba(0, 0, 255, 0.5)"
          strokeWidth={1}
          draggable
          onDragMove={(e) => handleDragMove(e, node.direction)}
        />
      ))}
    </>
  );
};

export default SelectionContainer;
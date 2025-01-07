import { Rect, Circle } from 'react-konva';
import { useStore } from '../store';

const SelectionContainer = ({ x, y, width, height, onResize }) => {

  const stage = useStore((state) => state.stage);
  const stageScale = useStore((state) => state.stageScale);

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
    const { x, y, width, height, strokeWidth } = rect.attrs;
    const padding = (strokeWidth || 0) + (4 * stageScale);

    const pointerPos = stage.getPointerPosition();
    const stageTransform = stage.getAbsoluteTransform().copy().invert();
    const transformedPointerPos = stageTransform.point(pointerPos);

    const isInHorizontalStroke =
      transformedPointerPos.x >= x - padding && transformedPointerPos.x <= x + width + padding;
    const isInVerticalStroke =
      transformedPointerPos.y >= y - padding && transformedPointerPos.y <= y + height + padding;
    const isOnStroke =
      (transformedPointerPos.x < x || transformedPointerPos.x > x + width) && isInVerticalStroke ||
      (transformedPointerPos.y < y || transformedPointerPos.y > y + height) && isInHorizontalStroke;

    if (isOnStroke) {
      stage.container().style.cursor = 'ns-resize';
    } else if (
      transformedPointerPos.x > x &&
      transformedPointerPos.x < x + width &&
      transformedPointerPos.y > y &&
      transformedPointerPos.y < y + height
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
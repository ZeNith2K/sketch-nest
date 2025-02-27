import { Rect } from 'react-konva';
import useElementResize from '../hooks/useElementDrag';

const SelectionContainer = ({ x, y, width, height, element }) => {
  const {
    handleMouseMove,
    handleMouseLeave,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    isResizing
  } = useElementResize(x, y, width, height, element);

  return (
    <>
      <Rect
        x={x - 8}
        y={y - 8}
        width={width + 16}
        height={height + 16}
        stroke="rgba(0, 0, 255, 0.3)"
        strokeWidth={1}
        draggable
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        dragBoundFunc={(pos) => {
          if (isResizing) return { x: x-8, y: y-8 }; // Prevent movement when resizing
          return pos; // Allow normal dragging
        }}
      />
    </>
  );
};

export default SelectionContainer;
import { useEffect, useCallback, useRef } from 'react';
import { useStore } from '../store';

export const useCanvasPan = () => {
  const isSpaceDown = useStore((state) => state.isSpaceDown);
  const setIsSpaceDown = useStore((state) => state.setIsSpaceDown);
  const selectedTool = useStore((state) => state.selectedTool);

  const stage = useStore((state) => state.stage);
  const setStageX = useStore((state) => state.setStageX);
  const setStageY = useStore((state) => state.setStageY);

  const lastDist = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if(!stage) return
    if(selectedTool == 'move' || isSpaceDown) stage.container().style.cursor = 'grab';
    else stage.container().style.cursor = 'default';
  }, [selectedTool , isSpaceDown, stage])

  const handleMouseDown = () => {
    if (isSpaceDown || selectedTool == 'move') {
      stage.container().style.cursor = 'grabbing';
      const pointerPosition = stage.getPointerPosition();
      lastDist.current = ({ x: pointerPosition.x - stage.x(), y: pointerPosition.y - stage.y() })
    }
  };

  const handleMouseMove = () => {
    if (isSpaceDown || selectedTool == 'move') {
      const pointerPosition = stage.getPointerPosition();
      setStageX(pointerPosition.x - lastDist.current.x);
      setStageY(pointerPosition.y - lastDist.current.y);
    }
  };

  const handleMouseUp = () => {
    if(selectedTool != 'move' && !isSpaceDown) stage.container().style.cursor = 'default';
    else stage.container().style.cursor = 'grab';
  }

  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space') {
      setIsSpaceDown(true);
      stage.container().style.cursor = 'hand';
    }
  }, [setIsSpaceDown, stage]);

  const handleKeyUp = useCallback((e) => {
    if (e.code === 'Space') {
      setIsSpaceDown(false);
      stage.container().style.cursor = 'default';
    }
  }, [setIsSpaceDown, stage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { handleMouseDown, handleMouseMove, handleMouseUp, handleKeyDown, handleKeyUp };
};
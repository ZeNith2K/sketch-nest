import { useStore } from '../store';

export const useCustomCursor = () => {
  const selectedTool = useStore((state) => state.selectedTool);

  const circle = document.getElementById('circle');
  const circleStyle = circle?.style;

  const handleMouseMove = (e) => {
    if(!circleStyle) return
    window.requestAnimationFrame(() => {
      circleStyle.top = `${e.clientY - circle.offsetHeight / 2}px`;
      circleStyle.left = `${e.clientX - circle.offsetWidth / 2}px`;
    });
  };

  const addCustomCursor = () => {
    if(!circleStyle) return
    if (selectedTool === 'eraser') {
      circleStyle.display = 'block';
      document.addEventListener('mousemove', handleMouseMove);
    } else {
      circleStyle.display = 'none';
      document.removeEventListener('mousemove', handleMouseMove);
    }
  }

  const removeCustomCursor = () => {
      document.removeEventListener('mousemove', handleMouseMove);
  }

  return { addCustomCursor, removeCustomCursor };
};
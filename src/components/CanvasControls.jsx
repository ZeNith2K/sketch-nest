import { ArrowArcLeft, ArrowArcRight, Minus, Plus } from '@phosphor-icons/react';
import { useCanvasZoom } from '../hooks/useCanvasZoom';


import { useStore } from '../store';

const CanvasControls = () => {
  const undo = useStore((state) => state.undo)
  const redo = useStore((state) => state.redo)

  const { zoomIn, zoomOut, zoomLevel } = useCanvasZoom();

  return (
    <div className="absolute bottom-10 left-10 z-10 flex items-center">
      <div className="white shadow border flex items-center justify-center rounded-md mr-4">
        <button onClick={zoomOut} className="py-3 px-4 hover:bg-slate-100 active:bg-slate-200"><Minus size={16}/></button>
        <div className="text-xs px-3 py-3">{zoomLevel}%</div>
        <button onClick={zoomIn} className="py-3 px-4 hover:bg-slate-100 active:bg-slate-200"><Plus size={16}/></button>
      </div>
      <div className="white shadow border flex items-center justify-center rounded-md overflow-hidden">
        <button onClick={undo} className="py-3 px-4 hover:bg-slate-100 active:bg-slate-200"><ArrowArcLeft size={16}/></button>
        <button onClick={redo} className="py-3 px-4 hover:bg-slate-100 active:bg-slate-200"><ArrowArcRight size={16}/></button>
      </div>
    </div>
  );
}

export default CanvasControls
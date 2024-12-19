import { Square, Circle, PencilSimple, Eraser } from '@phosphor-icons/react'
import { useStore } from '../store'

const ControlPanel = () => {
  const selectedTool = useStore((state) => state.selectedTool)
  const setSelectedTool = useStore((state) => state.setSelectedTool)
  const undo = useStore((state) => state.undo)
  const redo = useStore((state) => state.redo)

  const checkSelectedTool = (tool) => {
    return selectedTool == tool
  }

  return (
    <div className="border shadow rounded-md py-2 px-5 absolute top-10 left-0 right-0 m-auto w-[60vw] z-10 bg-white flex items-center justify-start gap-5">
      <div className={`p-2 rounded hover:bg-slate-100 cursor-pointer ${checkSelectedTool('square') && 'bg-slate-200'}`}>
        <Square size={22} onClick={() => setSelectedTool('square')} weight={ selectedTool == 'square' ? 'fill' : 'light'} className='text-slate-800'/>
      </div>
      <div className={`p-2 rounded hover:bg-slate-100 cursor-pointer ${checkSelectedTool('ellipse') && 'bg-slate-200'}`}>
        <Circle size={22} onClick={() => setSelectedTool('ellipse')} weight={ selectedTool == 'ellipse' ? 'fill' : 'light'} className='text-slate-800'/>
      </div>
      <div className={`p-2 rounded hover:bg-slate-100 cursor-pointer ${checkSelectedTool('pencil') && 'bg-slate-200'}`}>
        <PencilSimple size={22} onClick={() => setSelectedTool('pencil')} weight={ selectedTool == 'pencil' ? 'fill' : 'light'} className='text-slate-800'/>
      </div>
      <div className={`p-2 rounded hover:bg-slate-100 cursor-pointer ${checkSelectedTool('eraser') && 'bg-slate-200'}`}>
        <Eraser size={22} onClick={() => setSelectedTool('eraser')} weight={ selectedTool == 'eraser' ? 'fill' : 'light'} className='text-slate-800'/>
      </div>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
    </div>
  );
}

export default ControlPanel
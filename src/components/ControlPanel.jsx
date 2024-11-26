import { Square, Circle, PencilSimple } from '@phosphor-icons/react'
import { useStore } from '../store'

const ControlPanel = () => {
  const selectedTool = useStore((state) => state.selectedTool)
  const setSelectedTool = useStore((state) => state.setSelectedTool)

  return (
    <div className="border shadow rounded-md py-2 px-5 absolute top-10 left-0 right-0 m-auto w-[60vw] z-10 bg-white flex items-center justify-start gap-5">
      <div className='p-1 rounded hover:bg-slate-100'>
        <Square size={22} onClick={() => setSelectedTool('square')} weight={ selectedTool == 'square' ? 'fill' : 'light'} className='text-slate-800 cursor-pointer'/>
      </div>
      <div className='p-1 rounded hover:bg-slate-100'>
        <Circle size={22} onClick={() => setSelectedTool('circle')} weight={ selectedTool == 'circle' ? 'fill' : 'light'} className='text-slate-800 cursor-pointer'/>
      </div>
      <div className='p-1 rounded hover:bg-slate-100'>
        <PencilSimple size={22} onClick={() => setSelectedTool('pencil')} weight={ selectedTool == 'pencil' ? 'fill' : 'light'} className='text-slate-800 cursor-pointer'/>
      </div>
    </div>
  );
}

export default ControlPanel
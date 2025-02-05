import { Minus, Plus } from 'lucide-react'

const CanvasControls = () => {

  return (
    <div className="absolute bottom-10 left-10 z-10">
      <div className="white shadow border flex items-center justify-center rounded-md">
        <button className="border-e py-2 px-4"><Minus size={16}/></button>
        <div className="text-sm px-4 py-3">100%</div>
        <button className="border-s py-2 px-4"><Plus size={16}/></button>
      </div>
    </div>
  );
}

export default CanvasControls
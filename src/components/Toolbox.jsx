import { Square, Circle, PencilSimple, Eraser, HandPalm, Selection, Image } from '@phosphor-icons/react';
import { useStore } from '../store';
import { useRef } from 'react';

import { useImageUpload } from '../hooks/useImageUpload';

const Toolbox = () => {
  const selectedTool = useStore((state) => state.selectedTool);
  const setSelectedTool = useStore((state) => state.setSelectedTool);
  const { handleImageUpload } = useImageUpload();

  const fileInputRef = useRef(null);

  const checkSelectedTool = (tool) => selectedTool === tool;

  const handleImageIconClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('file is being uploaded');
      handleImageUpload(file);
    }
  };

  return (
    <div className="border shadow rounded-md py-2 px-5 absolute top-10 left-0 right-0 m-auto w-min z-10 bg-white flex items-center justify-start gap-5">
      <div className={`p-2 rounded hover:bg-slate-100 cursor-pointer ${checkSelectedTool('move') && 'bg-slate-200'}`}>
        <HandPalm size={22} onClick={() => setSelectedTool('move')} weight={selectedTool === 'move' ? 'fill' : 'light'} className='text-slate-800' />
      </div>
      <div className={`p-2 rounded hover:bg-slate-100 cursor-pointer ${checkSelectedTool('square') && 'bg-slate-200'}`}>
        <Square size={22} onClick={() => setSelectedTool('square')} weight={selectedTool === 'square' ? 'fill' : 'light'} className='text-slate-800' />
      </div>
      <div className={`p-2 rounded hover:bg-slate-100 cursor-pointer ${checkSelectedTool('ellipse') && 'bg-slate-200'}`}>
        <Circle size={22} onClick={() => setSelectedTool('ellipse')} weight={selectedTool === 'ellipse' ? 'fill' : 'light'} className='text-slate-800' />
      </div>
      <div className={`p-2 rounded hover:bg-slate-100 cursor-pointer ${checkSelectedTool('pencil') && 'bg-slate-200'}`}>
        <PencilSimple size={22} onClick={() => setSelectedTool('pencil')} weight={selectedTool === 'pencil' ? 'fill' : 'light'} className='text-slate-800' />
      </div>
      <div className={`p-2 rounded hover:bg-slate-100 cursor-pointer ${checkSelectedTool('eraser') && 'bg-slate-200'}`}>
        <Eraser size={22} onClick={() => setSelectedTool('eraser')} weight={selectedTool === 'eraser' ? 'fill' : 'light'} className='text-slate-800' />
      </div>
      <div className={`p-2 rounded hover:bg-slate-100 cursor-pointer ${checkSelectedTool('selection') && 'bg-slate-200'}`}>
        <Selection size={22} onClick={() => setSelectedTool('selection')} weight={selectedTool === 'selection' ? 'fill' : 'light'} className='text-slate-800' />
      </div>
      <div className={`p-2 rounded hover:bg-slate-100 cursor-pointer`}>
        <Image onClick={handleImageIconClick} size={22} weight="light" className='text-slate-800' />
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Toolbox;
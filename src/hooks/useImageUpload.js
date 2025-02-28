import { useStore } from '../store';

export const useImageUpload = () => {
  const setImages = useStore((state) => state.setImages);
  const images = useStore((state) => state.images);

  const handleImageUpload = (file) => {
    console.log('file', file)
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new window.Image();
      image.src = event.target.result;
      image.onload = () => {
        const newImage = {
          id: `image-${Date.now()}`,
          src: image,
          x: 50,
          y: 50,
          width: image.width/2,
          height: image.height/2,
        };
        setImages([...images, newImage]);
      };
    };
    reader.readAsDataURL(file);
  };

  return { handleImageUpload };
};
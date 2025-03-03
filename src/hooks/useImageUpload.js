import { useStore } from '../store';

export const useImageUpload = () => {
  const setImages = useStore((state) => state.setImages);
  const images = useStore((state) => state.images);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new window.Image();
      image.src = event.target.result;
      image.onload = () => {
        const fixedWidth = 400;
        const aspectRatio = image.width / image.height;
        const calculatedHeight = fixedWidth / aspectRatio; // Maintain aspect ratio
        const newImage = {
          id: `image-${Date.now()}`,
          src: image,
          x: 50,
          y: 50,
          width: fixedWidth,
          height: calculatedHeight,
        };
        setImages([...images, newImage]);
      };
    };
    reader.readAsDataURL(file);
  };

  return { handleImageUpload };
};
import { useState, useEffect } from "react";

export function useMediaLibrary() {
  const [images, setImages] = useState<string[]>([]);

  // Load images on mount
  useEffect(() => {
    const saved = localStorage.getItem("media-library");
    if (saved) setImages(JSON.parse(saved));
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("media-library", JSON.stringify(images));
  }, [images]);

  const addImage = (base64: string) => {
    setImages((prev) => [base64, ...prev]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return { images, addImage, removeImage };
}
import * as THREE from 'three';
export const createTextTexture = (text: string) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 64;
  if (!context) {
    throw new Error('Failed to get canvas context');
  }
  context.fillStyle = '#333333';
  context.font = 'bold 1.5rem Roboto Slab';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillText(text, canvas.width / 2, 40);
  return new THREE.CanvasTexture(canvas);
};

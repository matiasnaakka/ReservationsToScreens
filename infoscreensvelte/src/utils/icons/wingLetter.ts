import * as THREE from 'three';

export const createWingLetter = (
  letter: string,
  position: {x: number; y: number}
) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 256;

  if (!context) {
    return null;
  }

  context.fillStyle = '#333333';
  context.font = 'bold 12rem Roboto Slab';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(letter, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.8,
    alphaTest: 0.1,
    side: THREE.DoubleSide
  });

  const letterMesh = new THREE.Mesh(geometry, material);
  const group = new THREE.Group();
  group.add(letterMesh);
  group.position.set(position.x, position.y, 0.05);

  // Add animation properties to the group
  (group as any).animationPhase = Math.random() * Math.PI * 2;

  return group;
};

import * as THREE from 'three';

export const createDirectionalArrow = (
  direction: 'left' | 'right' | 'top' | 'bottom',
  arrowLength = 1
) => {
  const arrowGroup = new THREE.Group();

  // Create texture loader and load arrow image
  const loader = new THREE.TextureLoader();
  const texture = loader.load(
    'https://krugou.github.io/infoScreenProject/arrow.png'
  );

  // Create plane with arrow texture
  const arrowGeometry = new THREE.PlaneGeometry(arrowLength, 1);
  const arrowMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    color: 0xff5000,
    side: THREE.DoubleSide,
    // Add these properties to better respect transparency
    alphaTest: 0.1, // Discard pixels with alpha < 0.5
    depthWrite: false // Prevent transparency sorting issues
  });
  const arrowMesh = new THREE.Mesh(arrowGeometry, arrowMaterial);

  // Position and rotate arrow based on direction
  switch (direction) {
    case 'left':
      arrowMesh.position.set(-1.5, 0, 0.02);
      arrowMesh.rotation.z = Math.PI;
      break;
    case 'right':
      arrowMesh.position.set(1.5, 0, 0.02);
      break;
    case 'top':
      arrowMesh.position.set(0, 1.3, 0.02);
      arrowMesh.rotation.z = Math.PI / 2;
      break;
    case 'bottom':
      arrowMesh.position.set(0, -1.3, 0.02);
      arrowMesh.rotation.z = -Math.PI / 2;
      break;
  }

  arrowGroup.add(arrowMesh);
  return arrowGroup;
};

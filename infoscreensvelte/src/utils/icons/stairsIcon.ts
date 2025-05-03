import * as THREE from 'three';

export const createStairsIcon = (isEmergencyExit?: boolean) => {
  const group = new THREE.Group();

  // Glow effect
  const glowGeometry = new THREE.PlaneGeometry(1, 1);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: isEmergencyExit ? 0xe60000 : 0x3ba88f,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.z = -0.01;

  // Base square
  const squareGeometry = new THREE.PlaneGeometry(0.8, 0.8);
  const squareMaterial = new THREE.MeshBasicMaterial({
    color: isEmergencyExit ? 0xe60000 : 0x3ba88f,
    side: THREE.DoubleSide
  });
  const square = new THREE.Mesh(squareGeometry, squareMaterial);

  // Create a canvas to render the SVG
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Create white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw SVG on canvas
    const img = new Image();
    // SVG data URL - stairs icon
    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
        <path d="M384 64c0-17.7 14.3-32 32-32l128 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-96 0 0 96c0 17.7-14.3 32-32 32l-96 0 0 96c0 17.7-14.3 32-32 32l-96 0 0 96c0 17.7-14.3 32-32 32L32 480c-17.7 0-32-14.3-32-32s14.3-32 32-32l96 0 0-96c0-17.7 14.3-32 32-32l96 0 0-96c0-17.7 14.3-32 32-32l96 0 0-96z"/>
      </svg>
    `;
    const blob = new Blob([svgData], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);

    // Create a placeholder while the image loads
    const iconGeometry = new THREE.PlaneGeometry(0.6, 0.6);
    const iconMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      side: THREE.DoubleSide
    });
    const iconMesh = new THREE.Mesh(iconGeometry, iconMaterial);
    iconMesh.position.z = 0.01;

    // Add the mesh to the group immediately, texture will be updated when loaded
    group.add(glow);
    group.add(square);
    group.add(iconMesh);

    // Load the SVG
    img.onload = () => {
      // Clear the canvas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the SVG centered with a black fill
      ctx.fillStyle = '#000000';
      const padding = 40; // Padding around the image
      const size = Math.min(canvas.width, canvas.height) - padding * 2;
      ctx.drawImage(img, padding, padding, size, size);

      // Create texture from canvas
      const texture = new THREE.CanvasTexture(canvas);
      iconMaterial.map = texture;
      iconMaterial.needsUpdate = true;

      // Clean up the object URL
      URL.revokeObjectURL(url);
    };

    // Set image source to load the SVG
    img.src = url;

    // Handle load errors
    img.onerror = () => {
      console.error('Error loading stairs SVG');
      // Fall back to a simple text representation
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 48px Roboto Slab';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        isEmergencyExit ? 'EXIT' : 'STAIRS',
        canvas.width / 2,
        canvas.height / 2
      );

      const texture = new THREE.CanvasTexture(canvas);
      iconMaterial.map = texture;
      iconMaterial.needsUpdate = true;

      // Clean up the object URL
      URL.revokeObjectURL(url);
    };
  } else {
    // If context creation fails, add meshes without texture
    const iconMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 0.6),
      new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide})
    );
    iconMesh.position.z = 0.01;

    group.add(glow);
    group.add(square);
    group.add(iconMesh);
  }

  // Add animation properties to the group
  (group as any).animationPhase = Math.random() * Math.PI * 2;
  (group as any).glowMesh = glow;

  return group;
};

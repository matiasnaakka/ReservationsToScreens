import * as THREE from 'three';

export const createElevatorIcon = () => {
  const group = new THREE.Group();

  // Outer glow
  const glowGeometry = new THREE.PlaneGeometry(1, 1);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xff7f50,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.z = -0.01;

  // Base square with gradient
  const squareGeometry = new THREE.PlaneGeometry(0.8, 0.8);
  const squareMaterial = new THREE.MeshBasicMaterial({
    color: 0xff5000,
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
    // SVG data URL
    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M132.7 4.7l-64 64c-4.6 4.6-5.9 11.5-3.5 17.4s8.3 9.9 14.8 9.9l128 0c6.5 0 12.3-3.9 14.8-9.9s1.1-12.9-3.5-17.4l-64-64c-6.2-6.2-16.4-6.2-22.6 0zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 128zm96 96a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM80 400c0-26.5 21.5-48 48-48l64 0c26.5 0 48 21.5 48 48l0 16c0 17.7-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32l0-16zm192 0c0-26.5 21.5-48 48-48l64 0c26.5 0 48 21.5 48 48l0 16c0 17.7-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32l0-16zm32-128a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM356.7 91.3c6.2 6.2 16.4 6.2 22.6 0l64-64c4.6-4.6 5.9-11.5 3.5-17.4S438.5 0 432 0L304 0c-6.5 0-12.3 3.9-14.8 9.9s-1.1 12.9 3.5 17.4l64 64z"/>
      </svg>
    `;
    const blob = new Blob([svgData], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);

    // Create a placeholder while the image loads
    const arrowsGeometry = new THREE.PlaneGeometry(0.6, 0.6);
    const arrowsMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      side: THREE.DoubleSide
    });
    const arrowsMesh = new THREE.Mesh(arrowsGeometry, arrowsMaterial);
    arrowsMesh.position.z = 0.01;

    // Add the mesh to the group immediately, texture will be updated when loaded
    group.add(glow);
    group.add(square);
    group.add(arrowsMesh);

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
      arrowsMaterial.map = texture;
      arrowsMaterial.needsUpdate = true;

      // Clean up the object URL
      URL.revokeObjectURL(url);
    };

    // Set image source to load the SVG
    img.src = url;

    // Handle load errors
    img.onerror = () => {
      console.error('Error loading elevator SVG');
      // Fall back to a simple text representation
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 48px Roboto Slab';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ELEVATOR', canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      arrowsMaterial.map = texture;
      arrowsMaterial.needsUpdate = true;

      // Clean up the object URL
      URL.revokeObjectURL(url);
    };
  } else {
    // If context creation fails, add meshes without texture
    const arrowsMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.6, 0.6),
      new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide})
    );
    arrowsMesh.position.z = 0.01;

    group.add(glow);
    group.add(square);
    group.add(arrowsMesh);
  }

  // Add animation properties to the group
  (group as any).animationPhase = Math.random() * Math.PI * 2;
  (group as any).glowMesh = glow;

  return group;
};

import * as THREE from 'three';

export const createPantryIcon = () => {
  const group = new THREE.Group();

  // Glow effect
  const glowGeometry = new THREE.PlaneGeometry(0.5, 0.5);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xd4af37, // Gold color for pantry
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.z = -0.01;

  // Border
  const borderGeometry = new THREE.PlaneGeometry(0.42, 0.42);
  const borderMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide
  });
  const border = new THREE.Mesh(borderGeometry, borderMaterial);
  border.position.z = 0;

  // Base shape
  const baseGeometry = new THREE.PlaneGeometry(0.4, 0.4);
  const baseMaterial = new THREE.MeshBasicMaterial({
    color: 0xd4af37,
    side: THREE.DoubleSide
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.z = 0.001;

  // Icon
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 128;
  canvas.height = 128;

  if (context) {
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, '#f0f0f0');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Set up for drawing the SVG path
    context.save();
    context.translate(10, 10);
    context.scale(0.2, 0.2); // Scale the SVG to fit the canvas

    // Draw the SVG path
    context.fillStyle = '#000000';
    context.beginPath();
    // Font Awesome bathroom/restroom icon path
    context.moveTo(240, 144);
    context.arc(144, 144, 96, 0, Math.PI * 2);
    context.moveTo(284.4, 176);
    context.bezierCurveTo(269.9, 240.1, 212.5, 288, 144, 288);
    context.bezierCurveTo(64.5, 288, 0, 223.5, 0, 144);
    context.bezierCurveTo(0, 64.5, 64.5, 0, 144, 0);
    context.bezierCurveTo(212.5, 0, 269.9, 47.9, 284.4, 112);
    context.lineTo(356.2, 112);
    context.bezierCurveTo(365, 102.2, 377.8, 96, 392, 96);
    context.lineTo(496, 96);
    context.bezierCurveTo(522.5, 96, 544, 117.5, 544, 144);
    context.bezierCurveTo(544, 170.5, 522.5, 192, 496, 192);
    context.lineTo(392, 192);
    context.bezierCurveTo(377.8, 192, 365, 185.8, 356.2, 176);
    context.lineTo(284.4, 176);
    context.closePath();

    context.moveTo(144, 80);
    context.arc(144, 144, 64, 0, Math.PI * 2, true); // Draw in reverse for inner circle
    context.closePath();

    context.moveTo(400, 240);
    context.bezierCurveTo(413.3, 240, 424, 250.7, 424, 264);
    context.lineTo(424, 272);
    context.lineTo(520, 272);
    context.bezierCurveTo(533.3, 272, 544, 282.7, 544, 296);
    context.bezierCurveTo(544, 309.3, 533.3, 320, 520, 320);
    context.lineTo(280, 320);
    context.bezierCurveTo(266.7, 320, 256, 309.3, 256, 296);
    context.bezierCurveTo(256, 282.7, 266.7, 272, 280, 272);
    context.lineTo(376, 272);
    context.lineTo(376, 264);
    context.bezierCurveTo(376, 250.7, 386.7, 240, 400, 240);
    context.closePath();

    context.moveTo(288, 464);
    context.lineTo(288, 352);
    context.lineTo(512, 352);
    context.lineTo(512, 464);
    context.bezierCurveTo(512, 490.5, 490.5, 512, 464, 512);
    context.lineTo(336, 512);
    context.bezierCurveTo(309.5, 512, 288, 490.5, 288, 464);
    context.closePath();

    context.moveTo(48, 320);
    context.lineTo(128, 320);
    context.lineTo(144, 320);
    context.lineTo(176, 320);
    context.bezierCurveTo(202.5, 320, 224, 341.5, 224, 368);
    context.bezierCurveTo(224, 394.5, 202.5, 416, 176, 416);
    context.lineTo(160, 416);
    context.bezierCurveTo(160, 433.7, 145.7, 448, 128, 448);
    context.lineTo(64, 448);
    context.bezierCurveTo(46.3, 448, 32, 433.7, 32, 416);
    context.lineTo(32, 336);
    context.bezierCurveTo(32, 327.2, 39.2, 320, 48, 320);
    context.closePath();

    context.moveTo(176, 384);
    context.bezierCurveTo(184.8, 384, 192, 376.8, 192, 368);
    context.bezierCurveTo(192, 359.2, 184.8, 352, 176, 352);
    context.lineTo(160, 352);
    context.lineTo(160, 384);
    context.lineTo(176, 384);
    context.closePath();

    context.moveTo(24, 464);
    context.lineTo(200, 464);
    context.bezierCurveTo(213.3, 464, 224, 474.7, 224, 488);
    context.bezierCurveTo(224, 501.3, 213.3, 512, 200, 512);
    context.lineTo(24, 512);
    context.bezierCurveTo(10.7, 512, 0, 501.3, 0, 488);
    context.bezierCurveTo(0, 474.7, 10.7, 464, 24, 464);
    context.closePath();

    context.fill();
    context.restore();
  }

  const textTexture = new THREE.CanvasTexture(canvas);
  const textGeometry = new THREE.PlaneGeometry(0.6, 0.6);
  const textMaterial = new THREE.MeshBasicMaterial({
    map: textTexture,
    transparent: true,
    side: THREE.DoubleSide
  });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.z = 0.01;

  group.add(glow);
  group.add(border);
  group.add(base);
  group.add(textMesh);

  (group as any).animationPhase = Math.random() * Math.PI * 2;
  (group as any).glowMesh = glow;

  return group;
};

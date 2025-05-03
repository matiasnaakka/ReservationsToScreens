import * as THREE from 'three';

export const createToiletIcon = (
  type: 'M' | 'F' | 'U',
  isHandicapAccessible?: boolean
) => {
  const group = new THREE.Group();

  // Glow effect circle
  const glowGeometry = new THREE.CircleGeometry(0.5, 32);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x6666ff,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.z = -0.01;

  // Base circle with gradient
  const circleGeometry = new THREE.CircleGeometry(0.4, 32);
  // if type is F use pink color, if type is M use blue color, if type is U use purple color
  let circleColor;
  switch (type) {
    case 'F':
      circleColor = 0xcb2228; // pink
      break;
    case 'M':
      circleColor = 0x5db1e4; // blue
      break;
    case 'U':
      circleColor = 0x800080; // purple
      break;
  }
  const circleMaterial = new THREE.MeshBasicMaterial({
    color: circleColor,
    side: THREE.DoubleSide
  });
  const circle = new THREE.Mesh(circleGeometry, circleMaterial);

  // Icon text with enhanced styling
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 256;

  if (context) {
    // Clear canvas with white background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw SVG icon
    context.fillStyle = '#000000';
    context.beginPath();

    // Scale and center the path
    const scale = 0.35;
    const offsetX = canvas.width / 2 - (448 * scale) / 2;
    const offsetY = canvas.height / 2 - (512 * scale) / 2;

    if (isHandicapAccessible) {
      // Handicap toilet SVG path
      // First part - the circle with person
      context.moveTo(offsetX + 423.9 * scale, offsetY + 255.8 * scale);
      context.lineTo(offsetX + 411 * scale, offsetY + 413.1 * scale);
      context.bezierCurveTo(
        offsetX + 407.7 * scale,
        offsetY + 453.8 * scale,
        offsetX + 347.1 * scale,
        offsetY + 448.2 * scale,
        offsetX + 350.4 * scale,
        offsetY + 408.2 * scale
      );
      context.lineTo(offsetX + 360.4 * scale, offsetY + 285.7 * scale);
      context.lineTo(offsetX + 319.3 * scale, offsetY + 288 * scale);
      context.bezierCurveTo(
        offsetX + 329.4 * scale,
        offsetY + 308.7 * scale,
        offsetX + 335.1 * scale,
        offsetY + 331.9 * scale,
        offsetX + 335.1 * scale,
        offsetY + 356.5 * scale
      );
      context.bezierCurveTo(
        offsetX + 335.1 * scale,
        offsetY + 397.7 * scale,
        offsetX + 319 * scale,
        offsetY + 435.2 * scale,
        offsetX + 292.8 * scale,
        offsetY + 463 * scale
      );
      context.lineTo(offsetX + 253.5 * scale, offsetY + 423.7 * scale);
      context.bezierCurveTo(
        offsetX + 311.4 * scale,
        offsetY + 360 * scale,
        offsetX + 266.6 * scale,
        offsetY + 256.5 * scale,
        offsetX + 179.5 * scale,
        offsetY + 256.5 * scale
      );
      context.bezierCurveTo(
        offsetX + 153.6 * scale,
        offsetY + 256.5 * scale,
        offsetX + 130 * scale,
        offsetY + 266.4 * scale,
        offsetX + 112.3 * scale,
        offsetY + 282.5 * scale
      );
      context.lineTo(offsetX + 73 * scale, offsetY + 243.2 * scale);
      context.bezierCurveTo(
        offsetX + 95 * scale,
        offsetY + 222.5 * scale,
        offsetX + 123.1 * scale,
        offsetY + 208.1 * scale,
        offsetX + 154.4 * scale,
        offsetY + 203 * scale
      );
      context.lineTo(offsetX + 229.7 * scale, offsetY + 117.3 * scale);
      context.lineTo(offsetX + 187.1 * scale, offsetY + 92.5 * scale);
      context.lineTo(offsetX + 135.5 * scale, offsetY + 138.5 * scale);
      context.bezierCurveTo(
        offsetX + 105.5 * scale,
        offsetY + 165.3 * scale,
        offsetX + 64.9 * scale,
        offsetY + 120 * scale,
        offsetX + 95 * scale,
        offsetY + 93.1 * scale
      );
      context.lineTo(offsetX + 163 * scale, offsetY + 32.4 * scale);
      context.bezierCurveTo(
        offsetX + 172.8 * scale,
        offsetY + 23.6 * scale,
        offsetX + 187.1 * scale,
        offsetY + 22.2 * scale,
        offsetX + 198.5 * scale,
        offsetY + 28.8 * scale
      );
      context.bezierCurveTo(
        offsetX + 198.5 * scale,
        offsetY + 28.8 * scale,
        offsetX + 337.8 * scale,
        offsetY + 109.7 * scale,
        offsetX + 338 * scale,
        offsetY + 109.9 * scale
      );
      context.bezierCurveTo(
        offsetX + 354.2 * scale,
        offsetY + 120 * scale,
        offsetX + 358.7 * scale,
        offsetY + 145.9 * scale,
        offsetX + 344.1 * scale,
        offsetY + 162.5 * scale
      );
      context.lineTo(offsetX + 285.7 * scale, offsetY + 229 * scale);
      context.lineTo(offsetX + 391.8 * scale, offsetY + 223.1 * scale);
      context.bezierCurveTo(
        offsetX + 410.3 * scale,
        offsetY + 222 * scale,
        offsetX + 425.4 * scale,
        offsetY + 237.5 * scale,
        offsetX + 423.9 * scale,
        offsetY + 255.8 * scale
      );
      context.closePath();

      // Second part - the circle at top
      context.moveTo(offsetX + 359 * scale, offsetY + 101.8 * scale);
      context.bezierCurveTo(
        offsetX + 387.1 * scale,
        offsetY + 101.8 * scale,
        offsetX + 409.9 * scale,
        offsetY + 79 * scale,
        offsetX + 409.9 * scale,
        offsetY + 50.9 * scale
      );
      context.bezierCurveTo(
        offsetX + 409.9 * scale,
        offsetY + 22.8 * scale,
        offsetX + 387.1 * scale,
        offsetY + 0 * scale,
        offsetX + 359 * scale,
        offsetY + 0 * scale
      );
      context.bezierCurveTo(
        offsetX + 330.9 * scale,
        offsetY + 0 * scale,
        offsetX + 308.1 * scale,
        offsetY + 22.8 * scale,
        offsetX + 308.1 * scale,
        offsetY + 50.9 * scale
      );
      context.bezierCurveTo(
        offsetX + 308.1 * scale,
        offsetY + 79 * scale,
        offsetX + 330.9 * scale,
        offsetY + 101.8 * scale,
        offsetX + 359 * scale,
        offsetY + 101.8 * scale
      );
      context.closePath();

      // Third part - the curved line at bottom
      context.moveTo(offsetX + 179.6 * scale, offsetY + 456.5 * scale);
      context.bezierCurveTo(
        offsetX + 99 * scale,
        offsetY + 456.5 * scale,
        offsetX + 52.2 * scale,
        offsetY + 365.9 * scale,
        offsetX + 96.9 * scale,
        offsetY + 300.4 * scale
      );
      context.lineTo(offsetX + 57.2 * scale, offsetY + 260.7 * scale);
      context.bezierCurveTo(
        offsetX + 36.4 * scale,
        offsetY + 287 * scale,
        offsetX + 24 * scale,
        offsetY + 320.3 * scale,
        offsetX + 24 * scale,
        offsetY + 356.4 * scale
      );
      context.bezierCurveTo(
        offsetX + 24 * scale,
        offsetY + 487.1 * scale,
        offsetX + 174.7 * scale,
        offsetY + 557.8 * scale,
        offsetX + 275.4 * scale,
        offsetY + 478.9 * scale
      );
      context.lineTo(offsetX + 235.7 * scale, offsetY + 439.2 * scale);
      context.bezierCurveTo(
        offsetX + 219.7 * scale,
        offsetY + 450.1 * scale,
        offsetX + 200.4 * scale,
        offsetY + 456.5 * scale,
        offsetX + 179.6 * scale,
        offsetY + 456.5 * scale
      );
      context.closePath();
    } else {
      // Regular toilet SVG path
      context.moveTo(offsetX + 24 * scale, offsetY + 0 * scale);
      context.bezierCurveTo(
        offsetX + 10.7 * scale,
        offsetY + 0 * scale,
        offsetX + 0 * scale,
        offsetY + 10.7 * scale,
        offsetX + 0 * scale,
        offsetY + 24 * scale
      );
      context.bezierCurveTo(
        offsetX + 0 * scale,
        offsetY + 37.3 * scale,
        offsetX + 10.7 * scale,
        offsetY + 48 * scale,
        offsetX + 24 * scale,
        offsetY + 48 * scale
      );
      context.lineTo(offsetX + 32 * scale, offsetY + 48 * scale);
      context.lineTo(offsetX + 32 * scale, offsetY + 196.9 * scale);
      context.bezierCurveTo(
        offsetX + 30.1 * scale,
        offsetY + 198.3 * scale,
        offsetX + 28.2 * scale,
        offsetY + 199.8 * scale,
        offsetX + 26.4 * scale,
        offsetY + 201.3 * scale
      );
      context.bezierCurveTo(
        offsetX + 10.9 * scale,
        offsetY + 214.5 * scale,
        offsetX + 0 * scale,
        offsetY + 232.9 * scale,
        offsetX + 0 * scale,
        offsetY + 256 * scale
      );
      context.bezierCurveTo(
        offsetX + 0 * scale,
        offsetY + 302.9 * scale,
        offsetX + 14.3 * scale,
        offsetY + 340.1 * scale,
        offsetX + 37 * scale,
        offsetY + 368.5 * scale
      );
      context.bezierCurveTo(
        offsetX + 51.2 * scale,
        offsetY + 386.2 * scale,
        offsetX + 68.1 * scale,
        offsetY + 399.8 * scale,
        offsetX + 85.5 * scale,
        offsetY + 410.3 * scale
      );
      context.lineTo(offsetX + 65.6 * scale, offsetY + 469.9 * scale);
      context.bezierCurveTo(
        offsetX + 62.3 * scale,
        offsetY + 479.7 * scale,
        offsetX + 64 * scale,
        offsetY + 490.4 * scale,
        offsetX + 70 * scale,
        offsetY + 498.7 * scale
      );
      context.bezierCurveTo(
        offsetX + 76 * scale,
        offsetY + 507 * scale,
        offsetX + 85.7 * scale,
        offsetY + 512 * scale,
        offsetX + 96 * scale,
        offsetY + 512 * scale
      );
      context.lineTo(offsetX + 352 * scale, offsetY + 512 * scale);
      context.bezierCurveTo(
        offsetX + 362.3 * scale,
        offsetY + 512 * scale,
        offsetX + 371.9 * scale,
        offsetY + 507.1 * scale,
        offsetX + 378 * scale,
        offsetY + 498.7 * scale
      );
      context.bezierCurveTo(
        offsetX + 384.1 * scale,
        offsetY + 490.3 * scale,
        offsetX + 385.7 * scale,
        offsetY + 479.6 * scale,
        offsetX + 382.4 * scale,
        offsetY + 469.9 * scale
      );
      context.lineTo(offsetX + 362.6 * scale, offsetY + 410.4 * scale);
      context.bezierCurveTo(
        offsetX + 380 * scale,
        offsetY + 399.9 * scale,
        offsetX + 396.9 * scale,
        offsetY + 386.3 * scale,
        offsetX + 411.1 * scale,
        offsetY + 368.5 * scale
      );
      context.bezierCurveTo(
        offsetX + 433.8 * scale,
        offsetY + 340.1 * scale,
        offsetX + 448 * scale,
        offsetY + 302.9 * scale,
        offsetX + 448 * scale,
        offsetY + 256 * scale
      );
      context.bezierCurveTo(
        offsetX + 448 * scale,
        offsetY + 232.9 * scale,
        offsetX + 437.1 * scale,
        offsetY + 214.5 * scale,
        offsetX + 421.6 * scale,
        offsetY + 201.4 * scale
      );
      context.bezierCurveTo(
        offsetX + 419.8 * scale,
        offsetY + 199.9 * scale,
        offsetX + 417.9 * scale,
        offsetY + 198.4 * scale,
        offsetX + 416 * scale,
        offsetY + 196.9 * scale
      );
      context.lineTo(offsetX + 416 * scale, offsetY + 48 * scale);
      context.lineTo(offsetX + 424 * scale, offsetY + 48 * scale);
      context.bezierCurveTo(
        offsetX + 437.3 * scale,
        offsetY + 48 * scale,
        offsetX + 448 * scale,
        offsetY + 37.3 * scale,
        offsetX + 448 * scale,
        offsetY + 24 * scale
      );
      context.bezierCurveTo(
        offsetX + 448 * scale,
        offsetY + 10.7 * scale,
        offsetX + 437.3 * scale,
        offsetY + 0 * scale,
        offsetX + 424 * scale,
        offsetY + 0 * scale
      );
      context.lineTo(offsetX + 24 * scale, offsetY + 0 * scale);
      context.closePath();

      // Water surface in the toilet
      context.moveTo(offsetX + 384 * scale, offsetY + 256.3 * scale);
      context.bezierCurveTo(
        offsetX + 384 * scale,
        offsetY + 257.3 * scale,
        offsetX + 383.7 * scale,
        offsetY + 258.9 * scale,
        offsetX + 380.2 * scale,
        offsetY + 261.9 * scale
      );
      context.bezierCurveTo(
        offsetX + 375.4 * scale,
        offsetY + 266 * scale,
        offsetX + 366.2 * scale,
        offsetY + 270.9 * scale,
        offsetX + 350.9 * scale,
        offsetY + 275.3 * scale
      );
      context.bezierCurveTo(
        offsetX + 320.5 * scale,
        offsetY + 284 * scale,
        offsetX + 276.1 * scale,
        offsetY + 288 * scale,
        offsetX + 224 * scale,
        offsetY + 288 * scale
      );
      context.bezierCurveTo(
        offsetX + 171.9 * scale,
        offsetY + 288 * scale,
        offsetX + 127.5 * scale,
        offsetY + 284 * scale,
        offsetX + 97.1 * scale,
        offsetY + 275.2 * scale
      );
      context.bezierCurveTo(
        offsetX + 81.8 * scale,
        offsetY + 270.8 * scale,
        offsetX + 72.6 * scale,
        offsetY + 265.9 * scale,
        offsetX + 67.8 * scale,
        offsetY + 261.8 * scale
      );
      context.bezierCurveTo(
        offsetX + 64.3 * scale,
        offsetY + 258.8 * scale,
        offsetX + 64 * scale,
        offsetY + 257.2 * scale,
        offsetX + 64 * scale,
        offsetY + 256.2 * scale
      );
      context.lineTo(offsetX + 64 * scale, offsetY + 255.9 * scale);
      context.bezierCurveTo(
        offsetX + 64 * scale,
        offsetY + 255.9 * scale,
        offsetX + 64 * scale,
        offsetY + 255.8 * scale,
        offsetX + 64 * scale,
        offsetY + 255.8 * scale
      );
      context.bezierCurveTo(
        offsetX + 64 * scale,
        offsetY + 254.8 * scale,
        offsetX + 64 * scale,
        offsetY + 253.3 * scale,
        offsetX + 67.8 * scale,
        offsetY + 250 * scale
      );
      context.bezierCurveTo(
        offsetX + 72.6 * scale,
        offsetY + 245.9 * scale,
        offsetX + 81.8 * scale,
        offsetY + 241 * scale,
        offsetX + 97.1 * scale,
        offsetY + 236.6 * scale
      );
      context.bezierCurveTo(
        offsetX + 127.5 * scale,
        offsetY + 228 * scale,
        offsetX + 171.9 * scale,
        offsetY + 224 * scale,
        offsetX + 224 * scale,
        offsetY + 224 * scale
      );
      context.bezierCurveTo(
        offsetX + 276.1 * scale,
        offsetY + 224 * scale,
        offsetX + 320.5 * scale,
        offsetY + 228 * scale,
        offsetX + 350.9 * scale,
        offsetY + 236.8 * scale
      );
      context.bezierCurveTo(
        offsetX + 366.2 * scale,
        offsetY + 241.2 * scale,
        offsetX + 375.4 * scale,
        offsetY + 246.1 * scale,
        offsetX + 380.2 * scale,
        offsetY + 250.2 * scale
      );
      context.bezierCurveTo(
        offsetX + 384 * scale,
        offsetY + 253.4 * scale,
        offsetX + 384 * scale,
        offsetY + 255 * scale,
        offsetX + 384 * scale,
        offsetY + 256 * scale
      );
      context.bezierCurveTo(
        offsetX + 384 * scale,
        offsetY + 256 * scale,
        offsetX + 384 * scale,
        offsetY + 256.1 * scale,
        offsetX + 384 * scale,
        offsetY + 256.1 * scale
      );
      context.lineTo(offsetX + 384 * scale, offsetY + 256.3 * scale);
      context.closePath();

      // Small rectangle at bottom left
      context.moveTo(offsetX + 328.2 * scale, offsetY + 384 * scale);
      context.lineTo(offsetX + 328 * scale, offsetY + 384.5 * scale);
      context.lineTo(offsetX + 328 * scale, offsetY + 384 * scale);
      context.lineTo(offsetX + 328.2 * scale, offsetY + 384 * scale);
      context.closePath();

      // Rectangle near top left
      context.moveTo(offsetX + 112 * scale, offsetY + 64 * scale);
      context.lineTo(offsetX + 144 * scale, offsetY + 64 * scale);
      context.bezierCurveTo(
        offsetX + 152.8 * scale,
        offsetY + 64 * scale,
        offsetX + 160 * scale,
        offsetY + 71.2 * scale,
        offsetX + 160 * scale,
        offsetY + 80 * scale
      );
      context.bezierCurveTo(
        offsetX + 160 * scale,
        offsetY + 88.8 * scale,
        offsetX + 152.8 * scale,
        offsetY + 96 * scale,
        offsetX + 144 * scale,
        offsetY + 96 * scale
      );
      context.lineTo(offsetX + 112 * scale, offsetY + 96 * scale);
      context.bezierCurveTo(
        offsetX + 103.2 * scale,
        offsetY + 96 * scale,
        offsetX + 96 * scale,
        offsetY + 88.8 * scale,
        offsetX + 96 * scale,
        offsetY + 80 * scale
      );
      context.bezierCurveTo(
        offsetX + 96 * scale,
        offsetY + 71.2 * scale,
        offsetX + 103.2 * scale,
        offsetY + 64 * scale,
        offsetX + 112 * scale,
        offsetY + 64 * scale
      );
      context.closePath();
    }

    // Fill all paths
    context.fill();
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
  group.add(circle);
  group.add(textMesh);

  // Add animation properties to the group
  (group as any).animationPhase = Math.random() * Math.PI * 2;
  (group as any).glowMesh = glow;

  return group;
};

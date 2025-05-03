import * as THREE from 'three';
import {gsap} from 'gsap';

interface WallDefinition {
  start: [number, number];
  end: [number, number];
  thickness?: number;
}

export function createFloor(walls: WallDefinition[]) {
  const group = new THREE.Group();
  group.position.z = -5;
  group.userData.isFloorPlan = true;

  if (!walls || walls.length === 0) {
    console.warn('No walls provided to createFloor');
    return null;
  }

  // Create walls with initial offset positions
  walls.forEach(({start, end}) => {
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0,
      linewidth: 3,
      depthTest: true
    });

    const vertices = new Float32Array([
      start[0],
      start[1],
      0.02,
      end[0],
      end[1],
      0.02
    ]);

    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(vertices, 3)
    );
    const line = new THREE.Line(lineGeometry, lineMaterial);

    // Random starting position offset
    const randomDirection = Math.random() * Math.PI * 2;
    const randomDistance = 1.2;
    const offsetX = Math.cos(randomDirection) * randomDistance;
    const offsetY = Math.sin(randomDirection) * randomDistance;

    line.position.set(offsetX, offsetY, 0);

    // Add metadata
    line.userData = {
      isWall: true,
      start,
      end,
      targetX: 0,
      targetY: 0
    };

    line.renderOrder = 1;
    group.add(line);

    // Animate wall appearance
    gsap.to(line.position, {
      x: 0,
      y: 0,
      duration: 1 + Math.random(), // Random duration between 1-2 seconds
      ease: 'power2.out',
      delay: Math.random() * 0.5 // Random delay up to 0.5 seconds
    });

    gsap.to(line.material, {
      opacity: 0.9,
      duration: 0.5,
      delay: Math.random() * 0.5
    });
  });

  group.renderOrder = 1;
  return group;
}

// Example usage:
/*
const walls: WallDefinition[] = [
  { start: [-5, -5], end: [5, -5] }, // North wall
  { start: [5, -5], end: [5, 5] },   // East wall
  { start: [5, 5], end: [-5, 5] },   // South wall
  { start: [-5, 5], end: [-5, -5] }, // West wall
  { start: [-2, -5], end: [-2, 2] }, // Interior wall
];

const floorPlan = createFloor(walls);
scene.add(floorPlan);
*/

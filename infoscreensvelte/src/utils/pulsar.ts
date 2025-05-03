import * as THREE from 'three';
import {createTextTexture} from './createTextTexture';
export const createMainDot = () => {
  const dotGeometry = new THREE.CircleGeometry(0.3, 32);
  const dotMaterial = new THREE.MeshBasicMaterial({
    color: 0xff3333,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.9
  });
  return new THREE.Mesh(dotGeometry, dotMaterial);
};

export const createRing = () => {
  const ringGeometry = new THREE.RingGeometry(0.3, 0.2, 32);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xff3333,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5
  });
  return new THREE.Mesh(ringGeometry, ringMaterial);
};

export const createPulse = () => {
  const pulseGeometry = new THREE.CircleGeometry(0.6, 32);
  const pulseMaterial = new THREE.MeshBasicMaterial({
    color: 0xff3333,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3
  });
  return new THREE.Mesh(pulseGeometry, pulseMaterial);
};

export const createText = () => {
  const textGeometry = new THREE.PlaneGeometry(2, 0.5);
  const textMaterial = new THREE.MeshBasicMaterial({
    map: createTextTexture('You are here'),
    transparent: true,
    opacity: 0.9
  });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);
  textMesh.position.y = -0.6;
  return textMesh;
};

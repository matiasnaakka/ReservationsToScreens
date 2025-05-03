import * as THREE from 'three';
import {getQRCodeUrl} from './getQRCodeUrl';

/**
 * Creates a Three.js canvas texture containing a QR code for the given room number
 *
 * @param roomNumber - The room number to generate QR code for
 * @returns A Three.js canvas texture with the QR code
 */
export const createQRCodeTexture = (
  roomNumber: string
): THREE.CanvasTexture => {
  const qrCanvas = document.createElement('canvas');
  const qrContext = qrCanvas.getContext('2d');
  qrCanvas.width = 150;
  qrCanvas.height = 150;

  if (!qrContext) {
    throw new Error('Failed to get canvas context for QR code');
  }

  // Create the texture immediately with empty canvas
  const qrTexture = new THREE.CanvasTexture(qrCanvas);

  // Create an Image object to load the QR code
  const qrImage = new Image();
  qrImage.crossOrigin = 'anonymous';
  qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getQRCodeUrl(roomNumber))}`;

  qrImage.onload = () => {
    if (!qrContext) return;
    qrContext.drawImage(qrImage, 0, 0, 150, 150);
    qrTexture.needsUpdate = true;
  };

  return qrTexture;
};

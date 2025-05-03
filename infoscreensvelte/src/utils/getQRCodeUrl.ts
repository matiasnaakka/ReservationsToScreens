import {convert} from './hexConverter.js';

export const getQRCodeUrl = (roomNumber: string): string => {
  const hexRoomNumber = convert(roomNumber, 'toHex');
  return `https://l14k.tuudo.fi/b004/?ix=3130303635&rx=${hexRoomNumber}`;
};

/**
 * Utility functions for converting between hex strings and text
 */

type ConversionDirection = 'toHex' | 'toText';

/**
 * Converts between hex string and text
 * @param input - The input string (hex or text)
 * @param direction - The conversion direction ('toHex' or 'toText')
 * @param prefix - Whether to include '0x' prefix for hex output (default: false)
 * @returns The converted string
 * @throws Error if the input is invalid for the specified direction
 */
export const convert = (
  input: string | undefined,
  direction: ConversionDirection,
  prefix = false
): string => {
  if (!input) return '';

  if (direction === 'toHex') {
    // Simple approach to convert text to hex
    const hex = [...input]
      .map((char) => char.charCodeAt(0).toString(16).toUpperCase())
      .join('');
    return prefix ? `0x${hex}` : hex;
  } else {
    // Remove '0x' prefix if present and ensure uppercase
    const cleanHex = input.replace(/^0x/, '').toUpperCase();

    // Validate hex string
    if (!isValidHex(cleanHex)) {
      throw new Error('Invalid hex string');
    }

    // Convert hex pairs to characters
    const pairs = cleanHex.match(/.{1,2}/g) || [];
    return pairs
      .map((pair) => String.fromCharCode(parseInt(pair, 16)))
      .join('');
  }
};

/**
 * Validates if a string is a valid hex string
 * @param hex - The hex string to validate
 * @returns boolean indicating if the string is valid hex
 */
export const isValidHex = (hex: string): boolean => {
  const cleanHex = hex.replace(/^0x/, '').toUpperCase();
  return /^[0-9A-F]*$/.test(cleanHex) && cleanHex.length % 2 === 0;
};

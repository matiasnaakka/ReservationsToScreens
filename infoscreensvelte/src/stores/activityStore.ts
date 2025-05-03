import {writable} from 'svelte/store';

/**
 * The `activityStore` is responsible for managing the activity state of the application.
 * It contains two writable stores:
 * - `isActive`: A boolean indicating whether the application is active.
 * - `INACTIVITY_TIMEOUT`: A number representing the inactivity timeout in milliseconds.
 */

export const isActive = writable(true);
export const INACTIVITY_TIMEOUT = 240000;

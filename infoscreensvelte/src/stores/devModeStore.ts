import {writable} from 'svelte/store';

export const devMode = writable<boolean>(false);

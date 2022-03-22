import { writable } from 'svelte/store';

const progress = writable<{ progress: number; status: null | string; finished?: boolean }>({ progress: 0, status: null });
const pageColor = writable<{ r: number; g: number; b: number; a: number }>({ r: 0, g: 0, b: 0, a: 0 });

const appState = writable({ isMobile: false });
export { progress, pageColor, appState };

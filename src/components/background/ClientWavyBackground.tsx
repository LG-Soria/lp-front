import { WavyCheckerboardBackground } from './WavyCheckerboardBg';

/**
 * Wrapper mantenido para no tocar los imports existentes.
 * Renderiza en SSR para que el color base y el background se descubran antes.
 */
export const ClientWavyBackground = WavyCheckerboardBackground;

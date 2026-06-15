import { WebGLRenderer } from 'three';

export function createWebGLRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
  try {
    return new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
  } catch (error) {
    throw new Error('WebGL renderer failed', { cause: error });
  }
}

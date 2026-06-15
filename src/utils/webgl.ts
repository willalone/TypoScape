import { WebGLRenderer } from 'three';

export function createWebGLRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
  let renderer: WebGLRenderer;

  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
  } catch (error) {
    throw new Error('WebGL renderer failed', { cause: error });
  }

  if (!renderer.getContext()) {
    renderer.dispose();
    throw new Error('WebGL context is unavailable');
  }

  return renderer;
}

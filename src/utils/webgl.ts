import { WebGLRenderer } from 'three';

const CONTEXT_IDS = ['webgl2', 'webgl', 'experimental-webgl'] as const;

/** Быстрая проверка без создания Three.js-рендерера */
export function probeWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    for (const id of CONTEXT_IDS) {
      const gl = canvas.getContext(id, {
        failIfMajorPerformanceCaveat: false,
        powerPreference: 'high-performance',
      });
      if (gl) return true;
    }
    return false;
  } catch {
    return false;
  }
}

/** Создаёт рендерер на реальном canvas — единственный надёжный способ проверки */
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

import { WebGLRenderer } from 'three';

type ContextId = 'webgl2' | 'webgl' | 'experimental-webgl';

const CONTEXT_IDS = ['webgl2', 'webgl', 'experimental-webgl'] as const satisfies ReadonlyArray<ContextId>;

function getWebGLContext(
  canvas: HTMLCanvasElement,
): WebGL2RenderingContext | WebGLRenderingContext | null {
  const attrs: WebGLContextAttributes = {
    alpha: false,
    antialias: true,
    powerPreference: 'high-performance',
    premultipliedAlpha: false,
    depth: true,
    stencil: false,
  };

  for (const id of CONTEXT_IDS) {
    if (id === 'webgl2') {
      const context = canvas.getContext(id, attrs);
      if (context) return context;
      continue;
    }
    const context =
      id === 'webgl'
        ? canvas.getContext(id, attrs)
        : (canvas.getContext(id, attrs) as WebGLRenderingContext | null);
    if (context) return context;
  }

  return null;
}

export function createWebGLRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
  const context = getWebGLContext(canvas);
  if (!context) {
    throw new Error('WebGL context is unavailable');
  }

  // Two-stage renderer init improves compatibility on strict GPU setups.
  const options: ConstructorParameters<typeof WebGLRenderer>[0][] = [
    {
      canvas,
      context,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    },
    {
      canvas,
      context,
      antialias: false,
      alpha: false,
      powerPreference: 'default',
    },
  ];

  let lastError: unknown = null;
  try {
    for (const params of options) {
      try {
        return new WebGLRenderer(params);
      } catch (error) {
        lastError = error;
      }
    }
    throw new Error('WebGL renderer failed', { cause: lastError });
  } catch (error) {
    throw new Error('WebGL renderer failed', { cause: error });
  }
}

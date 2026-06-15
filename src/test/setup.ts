import { vi } from 'vitest';

class WebGLRenderingContextMock {}

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn((type: string) => {
    if (type === 'webgl' || type === 'webgl2') {
      return new WebGLRenderingContextMock();
    }
    return null;
  }),
});

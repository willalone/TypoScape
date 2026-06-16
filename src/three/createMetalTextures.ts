import {
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from 'three';

export interface MetalTextureSet {
  map: Texture;
  roughnessMap: Texture;
  normalMap: Texture;
  metalnessMap: Texture;
  dispose: () => void;
}

function makeCanvas(size: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D unavailable');
  return [canvas, ctx];
}

function toTexture(canvas: HTMLCanvasElement, colorSpace?: typeof SRGBColorSpace): Texture {
  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 3);
  if (colorSpace) texture.colorSpace = colorSpace;
  texture.needsUpdate = true;
  return texture;
}

/** Процедурный шороховатый золотой металл. */
export function createBrushedMetalTextures(): MetalTextureSet {
  const size = 1024;
  const [colorCanvas, colorCtx] = makeCanvas(size);
  const [roughCanvas, roughCtx] = makeCanvas(size);
  const [normalCanvas, normalCtx] = makeCanvas(size);
  const [metalCanvas, metalCtx] = makeCanvas(size);

  const gradient = colorCtx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#8a6820');
  gradient.addColorStop(0.5, '#c8a050');
  gradient.addColorStop(1, '#6e5018');
  colorCtx.fillStyle = gradient;
  colorCtx.fillRect(0, 0, size, size);

  for (let y = 0; y < size; y += 1) {
    const brush = Math.sin(y * 0.55 + Math.sin(y * 0.02) * 3) * 0.5 + 0.5;
    colorCtx.fillStyle = `rgba(255, 220, 150, ${0.02 + brush * 0.05})`;
    colorCtx.fillRect(0, y, size, 1);
  }

  for (let i = 0; i < 14000; i += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const a = 0.03 + Math.random() * 0.08;
    colorCtx.fillStyle = `rgba(${200 + Math.random() * 55}, ${150 + Math.random() * 60}, ${60 + Math.random() * 40}, ${a})`;
    colorCtx.fillRect(x, y, 1 + Math.random() * 2, 1);
  }

  roughCtx.fillStyle = '#606060';
  roughCtx.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y += 1) {
    const wave = Math.sin(y * 0.48) * 22 + Math.random() * 14;
    const v = Math.min(255, Math.max(40, 128 + wave));
    roughCtx.fillStyle = `rgb(${v}, ${v}, ${v})`;
    roughCtx.fillRect(0, y, size, 1);
  }
  for (let i = 0; i < 8000; i += 1) {
    const v = 60 + Math.random() * 160;
    roughCtx.fillStyle = `rgb(${v}, ${v}, ${v})`;
    roughCtx.fillRect(Math.random() * size, Math.random() * size, 2, 1);
  }

  normalCtx.fillStyle = '#8080ff';
  normalCtx.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y += 1) {
    const shift = Math.sin(y * 0.5) * 14 + Math.sin(y * 0.08) * 4;
    normalCtx.fillStyle = `rgb(${128 + shift}, ${128 - shift * 0.4}, 255)`;
    normalCtx.fillRect(0, y, size, 1);
  }

  metalCtx.fillStyle = '#e8e8e8';
  metalCtx.fillRect(0, 0, size, size);
  for (let y = 0; y < size; y += 2) {
    const v = 220 + Math.sin(y * 0.45) * 25;
    metalCtx.fillStyle = `rgb(${v}, ${v}, ${v})`;
    metalCtx.fillRect(0, y, size, 2);
  }

  const map = toTexture(colorCanvas, SRGBColorSpace);
  const roughnessMap = toTexture(roughCanvas);
  const normalMap = toTexture(normalCanvas);
  const metalnessMap = toTexture(metalCanvas);

  return {
    map,
    roughnessMap,
    normalMap,
    metalnessMap,
    dispose() {
      map.dispose();
      roughnessMap.dispose();
      normalMap.dispose();
      metalnessMap.dispose();
    },
  };
}

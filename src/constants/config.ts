export const WORD = 'TYPO' as const;

export const SCENE_CONFIG = {
  letterSize: 1.2,
  letterDepth: 0.45,
  letterSpacing: 1.55,
  hoverScale: 1.18,
  cameraFov: 45,
  cameraZ: 14,
  autoRotateSpeed: 0.35,
  particleCount: 1200,
} as const;

export const COLORS = {
  background: 0x080b12,
  letterBase: 0xd4cfc4,
  letterEmissive: 0x1a1510,
  hoverEmissive: 0xff5c3a,
  accent: 0xe8a87c,
  grid: 0x1e2433,
  ambient: 0x404860,
  directional: 0xfff4e8,
  pointWarm: 0xff8a5c,
  pointCool: 0x5c8aff,
} as const;

export const FONT_PATH = '/fonts/helvetiker_bold.typeface.json';

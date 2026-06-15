export const WORD = 'TYPO' as const;

export const SCENE_CONFIG = {
  letterSize: 1.2,
  letterDepth: 0.45,
  letterSpacing: 1.55,
  hoverScale: 1.18,
  cameraFov: 45,
  cameraZ: 14,
  autoRotateSpeed: 0.35,
  particleCount: 1100,
  bloomStrength: 0.48,
  bloomRadius: 0.42,
  bloomThreshold: 0.72,
} as const;

export const COLORS = {
  background: 0x0a0c10,
  backgroundAccent: 0x1a1420,
  letterBase: 0xf2e8dc,
  letterEmissive: 0x1a1510,
  hoverEmissive: 0xff5c3a,
  accent: 0xe8a87c,
  grid: 0x2a3040,
  ambient: 0x505870,
  directional: 0xfff4e8,
  pointWarm: 0xff8a5c,
  pointCool: 0x7ca8ff,
  ring: 0xe8a87c,
} as const;

export const FONT_PATH = `${import.meta.env.BASE_URL}fonts/helvetiker_bold.typeface.json`;

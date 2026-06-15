export const WORD = 'TYPO' as const;

export const SCENE_CONFIG = {
  letterSize: 1.35,
  letterSpacing: 0.18,
  hoverScale: 1.12,
  cameraFov: 42,
  cameraZ: 11.5,
  autoRotateSpeed: 0.22,
  particleCount: 900,
  bloomStrength: 0.52,
  bloomRadius: 0.38,
  bloomThreshold: 0.78,
} as const;

export const COLORS = {
  background: 0x05070d,
  backgroundAccent: 0x12182a,
  letterFill: 0xf0ebe3,
  letterOutline: 0x2a3040,
  letterShadow: 0x1a1420,
  hoverFill: 0xff6b45,
  hoverOutline: 0xffb89a,
  accent: 0xe8a87c,
  grid: 0x1a2030,
  ambient: 0x3a4560,
  directional: 0xfff0e0,
  pointWarm: 0xff7a50,
  pointCool: 0x6088ff,
} as const;

/** Inter 700 — чистый гротеск, эталонная читаемость в SDF-рендере */
export const FONT_URL = '/fonts/inter-700.woff';

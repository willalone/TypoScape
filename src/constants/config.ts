export const WORD = 'TYPO' as const;

export const SCENE_CONFIG = {
  letterSize: 1.15,
  letterDepth: 0.32,
  letterSpacing: 1.45,
  hoverScale: 1.1,
  cameraFov: 38,
  cameraZ: 10.2,
  cameraY: 0.15,
  autoRotateSpeed: 0.12,
  particleCount: 1200,
  bloomStrength: 0.38,
  bloomRadius: 0.35,
  bloomThreshold: 0.82,
} as const;

/** Стекло + неон: тёмный фон, светлые прозрачные буквы с оттенками */
export const COLORS = {
  background: 0x04060c,
  backgroundTop: 0x0e1020,
  letterGlass: 0xe8f4ff,
  letterEmissive: 0x1a2840,
  hoverEmissive: 0xff7a45,
  hoverAccent: 0xffc090,
  accent: 0x8ec8ff,
  neonCool: 0x5eb8ff,
  neonWarm: 0xffb080,
  grid: 0x1e2438,
  gridFade: 0x0c1018,
  ambient: 0x3a4460,
  directional: 0xfff6ee,
  pointWarm: 0xffa060,
  pointCool: 0x70b0ff,
  ring: 0x6ec8ff,
} as const;

/** Лёгкий оттенок стекла у каждой буквы — читаются как единое слово, но различимы */
export const LETTER_GLASS_TINTS = [
  0xb8e8ff, // T — холодный
  0xfff0d8, // Y — тёплый
  0xffd0c0, // P — коралл
  0xd0e0ff, // O — лавандовый
] as const;

export const FONT_PATH = `${import.meta.env.BASE_URL}fonts/helvetiker_bold.typeface.json`;

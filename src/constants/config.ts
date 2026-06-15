export const WORD = 'TYPO' as const;

export const SCENE_CONFIG = {
  letterSize: 1.2,
  letterDepth: 0.48,
  letterSpacing: 1.55,
  hoverScale: 1.14,
  cameraFov: 44,
  cameraZ: 13.5,
  autoRotateSpeed: 0.28,
  particleCount: 1200,
  bloomStrength: 0.55,
  bloomRadius: 0.42,
  bloomThreshold: 0.68,
} as const;

/** Тёплая редакционная палитра: шампань + янтарь + глубокий индиго */
export const COLORS = {
  background: 0x06080f,
  backgroundTop: 0x14102a,
  letterBase: 0xf3e6d4,
  letterTint: 0xffd4a8,
  letterEmissive: 0x1c1410,
  hoverEmissive: 0xff6b3d,
  hoverAccent: 0xffb070,
  accent: 0xe8a87c,
  neonCool: 0x6ec8ff,
  grid: 0x2a2840,
  gridFade: 0x12101c,
  ambient: 0x4a5070,
  directional: 0xfff2e6,
  pointWarm: 0xff9a62,
  pointCool: 0x6898ff,
  ring: 0xe8a87c,
} as const;

export const FONT_PATH = `${import.meta.env.BASE_URL}fonts/helvetiker_bold.typeface.json`;

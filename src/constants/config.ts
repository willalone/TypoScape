export const WORD = 'TYPO' as const;

export const SCENE_CONFIG = {
  letterSize: 1.15,
  letterDepth: 0.3,
  letterSpacing: 1.42,
  hoverScale: 1.1,
  cameraFov: 36,
  cameraZ: 9.8,
  cameraZMobile: 11.5,
  cameraY: 0.1,
  autoRotateSpeed: 0.12,
  particleCount: 1200,
  bloomStrength: 0.32,
  bloomRadius: 0.3,
  bloomThreshold: 0.88,
  introStagger: 0.2,
} as const;

export const COLORS = {
  background: 0x020408,
  backgroundTop: 0x080c18,
  letterGlass: 0xffe8c8,
  letterOutline: 0x1a1020,
  letterEmissive: 0xffa040,
  hoverEmissive: 0xff6b2a,
  hoverAccent: 0xffd080,
  accent: 0xffb050,
  neonCool: 0x70c8ff,
  neonWarm: 0xff9040,
  grid: 0x181c2a,
  gridFade: 0x080a10,
  ambient: 0x303848,
  directional: 0xfff8f0,
  pointWarm: 0xffa050,
  pointCool: 0x6090ff,
  ring: 0xffb060,
} as const;

/** Золотисто-янтарные акценты — высокий контраст на тёмном фоне */
export const LETTER_TINTS = [
  0xffe0a8, // T
  0xffd890, // Y
  0xffc878, // P
  0xffe8b0, // O
] as const;

export const FONT_PATH = `${import.meta.env.BASE_URL}fonts/helvetiker_bold.typeface.json`;

export function getCameraDistance(viewportWidth: number): number {
  return viewportWidth < 768 ? SCENE_CONFIG.cameraZMobile : SCENE_CONFIG.cameraZ;
}

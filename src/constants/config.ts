export const WORD = 'TYPO' as const;

export const SCENE_CONFIG = {
  letterSize: 1.15,
  letterDepth: 0.3,
  letterSpacing: 1.42,
  hoverScale: 1.06,
  hoverDurationIn: 0.11,
  hoverDurationOut: 0.18,
  hoverLiftZ: 0.14,
  cameraFov: 36,
  cameraZ: 9.8,
  cameraZMobile: 11.5,
  cameraY: 0.1,
  autoRotateSpeed: 0.12,
  particleCount: 1200,
  bloomStrength: 0.2,
  bloomRadius: 0.32,
  bloomThreshold: 0.94,
  introStagger: 0.2,
  letterEmissiveIntensity: 0,
  letterEnvIntensity: 1.25,
} as const;

export const COLORS = {
  background: 0x020408,
  backgroundTop: 0x080c18,
  letterGlass: 0xfff0c8,
  letterHalo: 0xffa030,
  letterStroke: 0x3d2208,
  letterEmissive: 0xffb040,
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

/** Единый золотой оттенок — все буквы выглядят одинаково */
export const LETTER_TINTS = [
  0xe8c878,
  0xe8c878,
  0xe8c878,
  0xe8c878,
] as const;

export const FONT_PATH = `${import.meta.env.BASE_URL}fonts/helvetiker_bold.typeface.json`;

export function getCameraDistance(viewportWidth: number): number {
  return viewportWidth < 768 ? SCENE_CONFIG.cameraZMobile : SCENE_CONFIG.cameraZ;
}

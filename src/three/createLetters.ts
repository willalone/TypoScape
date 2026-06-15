import {
  Box3,
  Color,
  Group,
  Mesh,
  MeshPhysicalMaterial,
} from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import {
  COLORS,
  LETTER_GLASS_TINTS,
  SCENE_CONFIG,
  WORD,
} from '../constants/config';
import type { LetterObject } from './types';

const GEO_OPTIONS = {
  size: SCENE_CONFIG.letterSize,
  depth: SCENE_CONFIG.letterDepth,
  curveSegments: 6,
  bevelEnabled: true,
  bevelThickness: 0.025,
  bevelSize: 0.018,
  bevelSegments: 2,
} as const;

function createGlassMaterial(tintHex: number): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color: new Color(tintHex),
    emissive: new Color(COLORS.letterEmissive),
    emissiveIntensity: 0.12,
    metalness: 0,
    roughness: 0.04,
    transmission: 0.72,
    thickness: 0.65,
    ior: 1.48,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    transparent: true,
    attenuationColor: new Color(tintHex),
    attenuationDistance: 1.8,
  });
}

function measureChar(char: string, font: Font): number {
  const geometry = new TextGeometry(char, { font, ...GEO_OPTIONS });
  geometry.computeBoundingBox();
  const box = geometry.boundingBox ?? new Box3();
  const width = box.max.x - box.min.x;
  geometry.dispose();
  return width;
}

export function createLetters(font: Font): {
  group: Group;
  letters: LetterObject[];
} {
  const group = new Group();
  const letters: LetterObject[] = [];
  const chars = WORD.split('');

  const widths = chars.map((char) => measureChar(char, font));
  const totalWidth =
    widths.reduce((sum, width) => sum + width, 0) +
    SCENE_CONFIG.letterSpacing * (chars.length - 1);

  let cursorX = -totalWidth / 2;

  chars.forEach((char, index) => {
    const geometry = new TextGeometry(char, { font, ...GEO_OPTIONS });
    geometry.computeBoundingBox();
    const box = geometry.boundingBox ?? new Box3();
    const width = box.max.x - box.min.x;
    geometry.center();

    const tint = LETTER_GLASS_TINTS[index] ?? COLORS.letterGlass;
    const material = createGlassMaterial(tint);
    const mesh = new Mesh(geometry, material);

    const x = cursorX + width / 2;
    const y = 0;
    const z = (index - (chars.length - 1) / 2) * 0.04;

    mesh.position.set(x, y, z);
    mesh.rotation.set(0, 0, 0);

    const basePosition = mesh.position.clone();
    const baseRotation = mesh.rotation.clone();
    const baseScale = mesh.scale.x;

    group.add(mesh);
    letters.push({
      mesh,
      char,
      basePosition,
      baseRotation,
      baseScale,
      isAnimating: false,
      isHovered: false,
      hoverTween: null,
      material,
      wavePhase: index * 0.6,
      glassTint: tint,
    });

    cursorX += width + SCENE_CONFIG.letterSpacing;
  });

  return { group, letters };
}

export function getLetterMeshes(letters: LetterObject[]): Mesh[] {
  return letters.map((letter) => letter.mesh);
}

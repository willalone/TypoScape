import {
  Box3,
  Color,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  Vector2,
  type BufferGeometry,
} from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { COLORS, LETTER_TINTS, SCENE_CONFIG, WORD } from '../constants/config';
import type { LetterObject } from './types';
import type { MetalTextureSet } from './createMetalTextures';

const GEO_OPTIONS = {
  size: SCENE_CONFIG.letterSize,
  depth: SCENE_CONFIG.letterDepth,
  curveSegments: 8,
  bevelEnabled: true,
  bevelThickness: 0.026,
  bevelSize: 0.02,
  bevelSegments: 4,
} as const;

function createLetterMaterial(metalTextures: MetalTextureSet): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    map: metalTextures.map,
    roughnessMap: metalTextures.roughnessMap,
    normalMap: metalTextures.normalMap,
    metalnessMap: metalTextures.metalnessMap,
    normalScale: new Vector2(0.85, 0.85),
    color: new Color(0xd4b060),
    emissive: new Color(0x000000),
    emissiveIntensity: SCENE_CONFIG.letterEmissiveIntensity,
    metalness: 1,
    roughness: 0.44,
    clearcoat: 0.28,
    clearcoatRoughness: 0.32,
    envMapIntensity: SCENE_CONFIG.letterEnvIntensity,
    anisotropy: 0.85,
    anisotropyRotation: Math.PI * 0.5,
    fog: false,
  });
}

function prepareGeometry(geometry: BufferGeometry): void {
  geometry.computeBoundingBox();
  geometry.computeVertexNormals();
  geometry.computeTangents();
}

function buildCharGeometry(char: string, font: Font): BufferGeometry {
  const geometry = new TextGeometry(char, { font, ...GEO_OPTIONS });
  prepareGeometry(geometry);
  geometry.center();
  return geometry;
}

function measureChar(char: string, font: Font): number {
  const geometry = buildCharGeometry(char, font);
  const box = geometry.boundingBox ?? new Box3();
  const width = box.max.x - box.min.x;
  geometry.dispose();
  return width;
}

export function createLetters(
  font: Font,
  metalTextures: MetalTextureSet,
): {
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
    const source = buildCharGeometry(char, font);
    const box = source.boundingBox ?? new Box3();
    const width = box.max.x - box.min.x;

    const material = createLetterMaterial(metalTextures);
    const mesh = new Mesh(source.clone(), material);

    const letterGroup = new Group();
    const x = cursorX + width / 2;
    letterGroup.position.set(x, 0, 0);
    letterGroup.add(mesh);

    group.add(letterGroup);
    letters.push({
      group: letterGroup,
      mesh,
      char,
      basePosition: letterGroup.position.clone(),
      baseRotation: letterGroup.rotation.clone(),
      baseScale: 1,
      isAnimating: false,
      isHovered: false,
      hoverTween: null,
      material,
      wavePhase: index * 0.6,
      glassTint: LETTER_TINTS[index] ?? COLORS.letterGlass,
    });

    source.dispose();
    cursorX += width + SCENE_CONFIG.letterSpacing;
  });

  return { group, letters };
}

export function getLetterMeshes(letters: LetterObject[]): Mesh[] {
  return letters.map((letter) => letter.mesh);
}

export function disposeLetters(letters: LetterObject[]): void {
  const disposed = new Set<BufferGeometry>();
  letters.forEach((letter) => {
    letter.hoverTween?.kill();
    const geo = letter.mesh.geometry;
    if (!disposed.has(geo)) {
      geo.dispose();
      disposed.add(geo);
    }
    letter.material.dispose();
  });
}

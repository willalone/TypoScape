import {
  Box3,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
} from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { COLORS, LETTER_TINTS, SCENE_CONFIG, WORD } from '../constants/config';
import type { LetterObject } from './types';

const GEO_OPTIONS = {
  size: SCENE_CONFIG.letterSize,
  depth: SCENE_CONFIG.letterDepth,
  curveSegments: 5,
  bevelEnabled: true,
  bevelThickness: 0.022,
  bevelSize: 0.016,
  bevelSegments: 2,
} as const;

function createLetterMaterial(tintHex: number): MeshPhysicalMaterial {
  const tint = new Color(tintHex);
  return new MeshPhysicalMaterial({
    color: tint,
    emissive: tint,
    emissiveIntensity: 0.38,
    metalness: 0.28,
    roughness: 0.22,
    clearcoat: 0.85,
    clearcoatRoughness: 0.08,
  });
}

function createOutlineMaterial(): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color: new Color(COLORS.letterOutline),
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

    const tint = LETTER_TINTS[index] ?? COLORS.letterGlass;
    const material = createLetterMaterial(tint);
    const outlineMaterial = createOutlineMaterial();

    const letterGroup = new Group();
    const outlineMesh = new Mesh(geometry, outlineMaterial);
    outlineMesh.scale.setScalar(1.055);
    outlineMesh.renderOrder = 0;

    const mesh = new Mesh(geometry, material);
    mesh.renderOrder = 1;

    const x = cursorX + width / 2;
    letterGroup.position.set(x, 0, 0);

    letterGroup.add(outlineMesh, mesh);

    group.add(letterGroup);
    letters.push({
      group: letterGroup,
      mesh,
      outlineMesh,
      char,
      basePosition: letterGroup.position.clone(),
      baseRotation: letterGroup.rotation.clone(),
      baseScale: 1,
      isAnimating: false,
      isHovered: false,
      hoverTween: null,
      material,
      outlineMaterial,
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

export function disposeLetters(letters: LetterObject[]): void {
  const disposed = new Set<import('three').BufferGeometry>();
  letters.forEach((letter) => {
    letter.hoverTween?.kill();
    if (!disposed.has(letter.mesh.geometry)) {
      letter.mesh.geometry.dispose();
      disposed.add(letter.mesh.geometry);
    }
    letter.material.dispose();
    letter.outlineMaterial.dispose();
  });
}

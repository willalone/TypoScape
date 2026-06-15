import {
  Box3,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
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

function createLetterMaterial(tintHex: number): MeshStandardMaterial {
  const tint = new Color(tintHex);
  return new MeshStandardMaterial({
    color: tint,
    emissive: tint,
    emissiveIntensity: SCENE_CONFIG.letterEmissiveIntensity,
    metalness: 0.04,
    roughness: 0.42,
    fog: false,
  });
}

function createHaloMaterial(): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color: new Color(COLORS.letterHalo),
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
    fog: false,
  });
}

function createStrokeMaterial(): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color: new Color(COLORS.letterStroke),
    fog: false,
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
    const haloMaterial = createHaloMaterial();
    const strokeMaterial = createStrokeMaterial();

    const letterGroup = new Group();
    const haloMesh = new Mesh(geometry, haloMaterial);
    haloMesh.scale.setScalar(SCENE_CONFIG.letterHaloScale);
    haloMesh.renderOrder = 0;

    const strokeMesh = new Mesh(geometry, strokeMaterial);
    strokeMesh.scale.setScalar(SCENE_CONFIG.letterStrokeScale);
    strokeMesh.renderOrder = 1;

    const mesh = new Mesh(geometry, material);
    mesh.renderOrder = 2;

    const x = cursorX + width / 2;
    letterGroup.position.set(x, 0, 0);

    letterGroup.add(haloMesh, strokeMesh, mesh);

    group.add(letterGroup);
    letters.push({
      group: letterGroup,
      mesh,
      haloMesh,
      strokeMesh,
      char,
      basePosition: letterGroup.position.clone(),
      baseRotation: letterGroup.rotation.clone(),
      baseScale: 1,
      isAnimating: false,
      isHovered: false,
      hoverTween: null,
      material,
      haloMaterial,
      strokeMaterial,
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
    letter.haloMaterial.dispose();
    letter.strokeMaterial.dispose();
  });
}

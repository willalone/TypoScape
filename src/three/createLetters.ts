import {
  Box3,
  AdditiveBlending,
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
  curveSegments: 6,
  bevelEnabled: true,
  bevelThickness: 0.024,
  bevelSize: 0.018,
  bevelSegments: 3,
} as const;

function createLetterMaterial(tintHex: number): MeshPhysicalMaterial {
  const tint = new Color(tintHex);
  return new MeshPhysicalMaterial({
    color: tint,
    emissive: tint,
    emissiveIntensity: SCENE_CONFIG.letterEmissiveIntensity,
    metalness: 0.42,
    roughness: 0.14,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    reflectivity: 0.9,
    envMapIntensity: SCENE_CONFIG.letterEnvIntensity,
    sheen: 0.35,
    sheenRoughness: 0.28,
    sheenColor: new Color(0xfff8e8),
    fog: false,
  });
}

function createHaloMaterial(): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color: new Color(COLORS.letterHalo),
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    fog: false,
    blending: AdditiveBlending,
  });
}

function createStrokeMaterial(): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color: new Color(COLORS.letterStroke),
    fog: false,
  });
}

function createSheenMaterial(): MeshBasicMaterial {
  return new MeshBasicMaterial({
    color: new Color(0xfffef8),
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
    fog: false,
    blending: AdditiveBlending,
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
    const sheenMaterial = createSheenMaterial();

    const letterGroup = new Group();
    const haloMesh = new Mesh(geometry, haloMaterial);
    haloMesh.scale.setScalar(SCENE_CONFIG.letterHaloScale);
    haloMesh.renderOrder = 0;

    const strokeMesh = new Mesh(geometry, strokeMaterial);
    strokeMesh.scale.setScalar(SCENE_CONFIG.letterStrokeScale);
    strokeMesh.renderOrder = 1;

    const mesh = new Mesh(geometry, material);
    mesh.renderOrder = 2;

    const sheenMesh = new Mesh(geometry, sheenMaterial);
    sheenMesh.scale.setScalar(SCENE_CONFIG.letterSheenScale);
    sheenMesh.renderOrder = 3;

    const x = cursorX + width / 2;
    letterGroup.position.set(x, 0, 0);

    letterGroup.add(haloMesh, strokeMesh, mesh, sheenMesh);

    group.add(letterGroup);
    letters.push({
      group: letterGroup,
      mesh,
      haloMesh,
      strokeMesh,
      sheenMesh,
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
      sheenMaterial,
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
    letter.sheenMaterial.dispose();
  });
}

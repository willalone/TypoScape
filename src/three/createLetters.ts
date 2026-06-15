import {
  Box3,
  Color,
  Group,
  Mesh,
  MeshPhysicalMaterial,
} from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { COLORS, SCENE_CONFIG, WORD } from '../constants/config';
import type { LetterObject } from './types';

const ARC_RADIUS = 9;
const ARC_SPAN = 0.55;

const LETTER_TINTS = [0, 0.04, -0.03, 0.02];

function createLetterMaterial(index: number): MeshPhysicalMaterial {
  const base = new Color(COLORS.letterBase);
  const tint = new Color(COLORS.letterTint);
  base.lerp(tint, LETTER_TINTS[index] ?? 0);

  return new MeshPhysicalMaterial({
    color: base,
    emissive: new Color(COLORS.letterEmissive),
    emissiveIntensity: 0.2,
    metalness: 0.82,
    roughness: 0.18,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    reflectivity: 1,
    ior: 1.45,
    transmission: 0.06,
    thickness: 0.4,
    transparent: true,
    envMapIntensity: 1.2,
  });
}

function getLetterOffset(char: string, font: Font): number {
  const geometry = new TextGeometry(char, {
    font,
    size: SCENE_CONFIG.letterSize,
    depth: SCENE_CONFIG.letterDepth,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.028,
    bevelSegments: 3,
  });
  geometry.computeBoundingBox();
  const box = geometry.boundingBox ?? new Box3();
  const width = box.max.x - box.min.x;
  geometry.dispose();
  return width;
}

export function createLetters(font: Font): { group: Group; letters: LetterObject[] } {
  const group = new Group();
  const letters: LetterObject[] = [];
  const chars = WORD.split('');

  const widths = chars.map((char) => getLetterOffset(char, font));
  const totalWidth =
    widths.reduce((sum, width) => sum + width, 0) +
    SCENE_CONFIG.letterSpacing * (chars.length - 1);

  let cursorX = -totalWidth / 2;

  chars.forEach((char, index) => {
    const geometry = new TextGeometry(char, {
      font,
      size: SCENE_CONFIG.letterSize,
      depth: SCENE_CONFIG.letterDepth,
      curveSegments: 10,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.028,
      bevelSegments: 3,
    });

    geometry.computeBoundingBox();
    const box = geometry.boundingBox ?? new Box3();
    const width = box.max.x - box.min.x;
    geometry.center();

    const material = createLetterMaterial(index);
    const mesh = new Mesh(geometry, material);

    const t = chars.length === 1 ? 0 : index / (chars.length - 1) - 0.5;
    const angle = t * ARC_SPAN;
    const x = cursorX + width / 2;
    const y = Math.cos(angle) * 0.35 - 0.2;
    const z = Math.sin(angle) * ARC_RADIUS * 0.08;

    mesh.position.set(x, y, z);
    mesh.rotation.set(-angle * 0.35, angle * 0.9, 0);

    const basePosition = mesh.position.clone();
    const baseRotation = mesh.rotation.clone();
    const baseScale = mesh.scale.x;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

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
      wavePhase: index * 0.85,
    });

    cursorX += width + SCENE_CONFIG.letterSpacing;
  });

  group.rotation.x = -0.08;
  return { group, letters };
}

export function getLetterMeshes(letters: LetterObject[]): Mesh[] {
  return letters.map((letter) => letter.mesh);
}

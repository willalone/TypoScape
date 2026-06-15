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

const ARC_SPAN = 0.55;

function createLetterMaterial(): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color: new Color(COLORS.letterBase),
    emissive: new Color(COLORS.letterEmissive),
    emissiveIntensity: 0.18,
    metalness: 0.78,
    roughness: 0.22,
    clearcoat: 0.85,
    clearcoatRoughness: 0.12,
    reflectivity: 1,
    transparent: true,
  });
}

function measureCharWidth(char: string, font: Font): number {
  const geometry = new TextGeometry(char, {
    font,
    size: SCENE_CONFIG.letterSize,
    depth: SCENE_CONFIG.letterDepth,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.035,
    bevelSize: 0.025,
    bevelSegments: 4,
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

  const widths = chars.map((char) => measureCharWidth(char, font));
  const totalWidth =
    widths.reduce((sum, width) => sum + width, 0) +
    SCENE_CONFIG.letterSpacing * (chars.length - 1);

  let cursorX = -totalWidth / 2;

  chars.forEach((char, index) => {
    const geometry = new TextGeometry(char, {
      font,
      size: SCENE_CONFIG.letterSize,
      depth: SCENE_CONFIG.letterDepth,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.025,
      bevelSegments: 4,
    });

    geometry.computeBoundingBox();
    const box = geometry.boundingBox ?? new Box3();
    const width = box.max.x - box.min.x;
    geometry.center();

    const material = createLetterMaterial();
    const mesh = new Mesh(geometry, material);

    const t = chars.length === 1 ? 0 : index / (chars.length - 1) - 0.5;
    const angle = t * ARC_SPAN;
    const x = cursorX + width / 2;
    const y = Math.cos(angle) * 0.35 - 0.2;
    const z = Math.sin(angle) * 0.72;

    mesh.position.set(x, y, z);
    mesh.rotation.set(-angle * 0.35, angle * 0.9, 0);

    const basePosition = mesh.position.clone();
    const baseRotation = mesh.rotation.clone();
    const baseScale = mesh.scale.x;

    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.baseScale = baseScale;

    group.add(mesh);
    letters.push({
      mesh,
      char,
      basePosition,
      baseRotation,
      baseScale,
      isAnimating: false,
    });

    cursorX += width + SCENE_CONFIG.letterSpacing;
  });

  group.rotation.x = -0.08;
  return { group, letters };
}

export function disposeLetters(letters: LetterObject[]): void {
  letters.forEach((letter) => {
    letter.mesh.geometry.dispose();
    const { material } = letter.mesh;
    if (Array.isArray(material)) {
      material.forEach((item) => item.dispose());
    } else {
      material.dispose();
    }
  });
}

import type { Euler, Mesh, MeshPhysicalMaterial, Vector3 } from 'three';

export interface LetterObject {
  mesh: Mesh;
  char: string;
  basePosition: Vector3;
  baseRotation: Euler;
  baseScale: number;
  isAnimating: boolean;
  isHovered: boolean;
  hoverTween: { kill: () => void } | null;
  material: MeshPhysicalMaterial;
  wavePhase: number;
}

export interface SceneCallbacks {
  onHoverChange: (char: string | null) => void;
  onLetterClick: (char: string) => void;
}

export function getLetterMeshes(letters: LetterObject[]): Mesh[] {
  return letters.map((letter) => letter.mesh);
}

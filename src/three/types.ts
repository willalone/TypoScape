import type { Euler, Group, Mesh, MeshPhysicalMaterial, Vector3 } from 'three';

export interface LetterObject {
  group: Group;
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
  glassTint: number;
}

export interface SceneCallbacks {
  onHoverChange: (char: string | null) => void;
  onLetterClick: (char: string) => void;
  onLoadProgress: (progress: number) => void;
  onLoadComplete: () => void;
}

export function getLetterMeshes(letters: LetterObject[]): Mesh[] {
  return letters.map((letter) => letter.mesh);
}

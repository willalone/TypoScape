import type { Euler, Mesh, Vector3 } from 'three';

export interface LetterObject {
  mesh: Mesh;
  char: string;
  basePosition: Vector3;
  baseRotation: Euler;
  baseScale: number;
  isAnimating: boolean;
}

export interface SceneCallbacks {
  onHoverChange: (char: string | null) => void;
  onLetterClick: (char: string) => void;
  onLoadProgress: (progress: number) => void;
  onLoadComplete: () => void;
  onWebGLFailed: () => void;
}

export function getLetterMeshes(letters: LetterObject[]): Mesh[] {
  return letters.map((letter) => letter.mesh);
}

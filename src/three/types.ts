import type { Mesh, Vector3, Euler } from 'three';

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
}

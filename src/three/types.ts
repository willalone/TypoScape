import type { Euler, Object3D, Vector3 } from 'three';
import type { Text } from 'troika-three-text';

export interface LetterObject {
  text: Text;
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
}

export function getLetterTargets(letters: LetterObject[]): Object3D[] {
  return letters.map((letter) => letter.text);
}

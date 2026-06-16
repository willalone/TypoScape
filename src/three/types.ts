import type {
  Euler,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  Vector3,
} from 'three';

export interface LetterObject {
  group: Group;
  mesh: Mesh;
  haloMesh: Mesh;
  strokeMesh: Mesh;
  sheenMesh: Mesh;
  char: string;
  basePosition: Vector3;
  baseRotation: Euler;
  baseScale: number;
  isAnimating: boolean;
  isHovered: boolean;
  hoverTween: { kill: () => void } | null;
  material: MeshPhysicalMaterial;
  haloMaterial: MeshBasicMaterial;
  strokeMaterial: MeshBasicMaterial;
  sheenMaterial: MeshBasicMaterial;
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

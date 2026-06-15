declare module 'troika-three-text' {
  import type { Object3D } from 'three';

  export interface TextRenderInfo {
    blockBounds: [number, number, number, number];
  }

  export class Text extends Object3D {
    text: string;

    font: string;

    fontSize: number;

    color: number;

    outlineWidth: number | string;

    outlineColor: number;

    outlineOpacity: number;

    strokeWidth: number | string;

    strokeColor: number;

    strokeOpacity: number;

    fillOpacity: number;

    letterSpacing: number;

    glyphGeometryDetail: number;

    curveRadius: number;

    anchorX: string | number;

    anchorY: string | number;

    renderOrder: number;

    textRenderInfo: TextRenderInfo | null;

    sync(callback?: () => void): void;

    dispose(): void;
  }
}

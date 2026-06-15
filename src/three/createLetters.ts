import { Group } from 'three';
import { Text } from 'troika-three-text';
import { COLORS, FONT_URL, SCENE_CONFIG, WORD } from '../constants/config';
import type { LetterObject } from './types';

const ARC_SPAN = 0.42;

function syncText(text: Text): Promise<void> {
  return new Promise((resolve) => {
    text.sync(() => resolve());
  });
}

function configureText(char: string): Text {
  const text = new Text();
  text.text = char;
  text.font = FONT_URL;
  text.fontSize = SCENE_CONFIG.letterSize;
  text.anchorX = 'center';
  text.anchorY = 'middle';
  text.color = COLORS.letterFill;
  text.outlineWidth = '8%';
  text.outlineColor = COLORS.letterOutline;
  text.outlineOpacity = 0.95;
  text.strokeWidth = '2%';
  text.strokeColor = COLORS.letterShadow;
  text.strokeOpacity = 0.35;
  text.letterSpacing = 0.02;
  text.glyphGeometryDetail = 12;
  text.curveRadius = 18;
  text.renderOrder = 1;
  return text;
}

export async function createLetters(): Promise<{
  group: Group;
  letters: LetterObject[];
}> {
  const group = new Group();
  const letters: LetterObject[] = [];
  const chars = WORD.split('');

  const textObjects = chars.map((char) => configureText(char));

  await Promise.all(textObjects.map((text) => syncText(text)));

  const widths = textObjects.map((text) => {
    const bounds = text.textRenderInfo?.blockBounds;
    if (!bounds) return SCENE_CONFIG.letterSize * 0.65;
    return bounds[2] - bounds[0];
  });

  const totalWidth =
    widths.reduce((sum, width) => sum + width, 0) +
    SCENE_CONFIG.letterSpacing * (chars.length - 1);

  let cursorX = -totalWidth / 2;

  textObjects.forEach((text, index) => {
    const char = chars[index] ?? '';
    const width = widths[index] ?? SCENE_CONFIG.letterSize * 0.65;
    const t = chars.length === 1 ? 0 : index / (chars.length - 1) - 0.5;
    const angle = t * ARC_SPAN;

    const x = cursorX + width / 2;
    const y = Math.cos(angle) * 0.22;
    const z = Math.sin(angle) * 0.45;

    text.position.set(x, y, z);
    text.rotation.set(-angle * 0.25, angle * 0.55, 0);

    const basePosition = text.position.clone();
    const baseRotation = text.rotation.clone();
    const baseScale = 1;

    group.add(text);
    letters.push({
      text,
      char,
      basePosition,
      baseRotation,
      baseScale,
      isAnimating: false,
    });

    cursorX += width + SCENE_CONFIG.letterSpacing;
  });

  group.rotation.x = -0.04;
  return { group, letters };
}

export function disposeLetters(letters: LetterObject[]): void {
  letters.forEach((letter) => {
    letter.text.dispose();
  });
}

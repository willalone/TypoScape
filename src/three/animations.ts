import gsap from 'gsap';
import { Color } from 'three';
import { COLORS } from '../constants/config';
import type { LetterObject } from './types';

const HOVER_DURATION = 0.55;
const CLICK_DURATION = 1.35;

const baseFill = new Color(COLORS.letterFill);
const hoverFill = new Color(COLORS.hoverFill);
const baseOutline = new Color(COLORS.letterOutline);
const hoverOutline = new Color(COLORS.hoverOutline);

function applyTextColors(
  letter: LetterObject,
  fill: Color,
  outline: Color,
  fillOpacity: number,
): void {
  letter.text.color = fill.getHex();
  letter.text.outlineColor = outline.getHex();
  letter.text.fillOpacity = fillOpacity;
  letter.text.sync();
}

export function animateLetterHover(
  letter: LetterObject,
  isHovered: boolean,
): void {
  if (letter.isAnimating) return;

  const targetScale = isHovered
    ? letter.baseScale * 1.12
    : letter.baseScale;
  const colorState = {
    t: isHovered ? 1 : 0,
    opacity: isHovered ? 1 : 0.96,
  };

  gsap.to(letter.text.scale, {
    x: targetScale,
    y: targetScale,
    z: targetScale,
    duration: HOVER_DURATION,
    ease: 'power3.out',
  });

  gsap.to(colorState, {
    t: isHovered ? 1 : 0,
    opacity: isHovered ? 1 : 0.96,
    duration: HOVER_DURATION,
    ease: 'power3.out',
    onUpdate: () => {
      const fill = baseFill.clone().lerp(hoverFill, colorState.t);
      const outline = baseOutline.clone().lerp(hoverOutline, colorState.t);
      applyTextColors(letter, fill, outline, colorState.opacity);
    },
  });
}

export function animateLetterClick(letter: LetterObject): void {
  if (letter.isAnimating) return;

  letter.isAnimating = true;
  const opacityState = { value: 0.96 };

  const timeline = gsap.timeline({
    onComplete: () => {
      letter.isAnimating = false;
      applyTextColors(letter, baseFill, baseOutline, 0.96);
    },
  });

  timeline
    .to(letter.text.position, {
      y: letter.basePosition.y + 1.6,
      z: letter.basePosition.z + 0.35,
      duration: CLICK_DURATION * 0.38,
      ease: 'power4.out',
    })
    .to(
      letter.text.rotation,
      {
        z: letter.baseRotation.z + 0.18,
        x: letter.baseRotation.x - 0.12,
        duration: CLICK_DURATION * 0.38,
        ease: 'power3.out',
      },
      '<',
    )
    .to(
      opacityState,
      {
        value: 0.55,
        duration: CLICK_DURATION * 0.22,
        ease: 'sine.inOut',
        onUpdate: () => {
          letter.text.fillOpacity = opacityState.value;
          letter.text.sync();
        },
      },
      '<20%',
    )
    .to(letter.text.position, {
      x: letter.basePosition.x,
      y: letter.basePosition.y,
      z: letter.basePosition.z,
      duration: CLICK_DURATION * 0.55,
      ease: 'power4.inOut',
    })
    .to(
      letter.text.rotation,
      {
        x: letter.baseRotation.x,
        y: letter.baseRotation.y,
        z: letter.baseRotation.z,
        duration: CLICK_DURATION * 0.55,
        ease: 'power4.inOut',
      },
      '<',
    )
    .to(
      opacityState,
      {
        value: 0.96,
        duration: CLICK_DURATION * 0.4,
        ease: 'power2.out',
        onUpdate: () => {
          letter.text.fillOpacity = opacityState.value;
          letter.text.sync();
        },
      },
      '<35%',
    );
}

export function animateCameraReset(
  camera: { position: { x: number; y: number; z: number } },
  controls: {
    target: { x: number; y: number; z: number };
    update: () => void;
  },
  initialPosition: { x: number; y: number; z: number },
  initialTarget: { x: number; y: number; z: number },
): void {
  gsap.to(camera.position, {
    x: initialPosition.x,
    y: initialPosition.y,
    z: initialPosition.z,
    duration: 1.4,
    ease: 'power3.inOut',
    onUpdate: () => controls.update(),
  });

  gsap.to(controls.target, {
    x: initialTarget.x,
    y: initialTarget.y,
    z: initialTarget.z,
    duration: 1.4,
    ease: 'power3.inOut',
    onUpdate: () => controls.update(),
  });
}

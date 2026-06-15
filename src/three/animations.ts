import gsap from 'gsap';
import { Color, type MeshPhysicalMaterial } from 'three';
import { COLORS, SCENE_CONFIG } from '../constants/config';
import type { LetterObject } from './types';

const HOVER_DURATION = 0.45;
const CLICK_DURATION = 1.1;

export function animateLetterHover(
  letter: LetterObject,
  isHovered: boolean,
): void {
  if (letter.isAnimating) return;

  const material = letter.mesh.material as MeshPhysicalMaterial;
  const targetScale = isHovered
    ? letter.baseScale * SCENE_CONFIG.hoverScale
    : letter.baseScale;
  const targetEmissive = new Color(
    isHovered ? COLORS.hoverEmissive : COLORS.letterEmissive,
  );
  const targetIntensity = isHovered ? 0.85 : 0.18;

  gsap.to(letter.mesh.scale, {
    x: targetScale,
    y: targetScale,
    z: targetScale,
    duration: HOVER_DURATION,
    ease: 'power2.out',
  });

  gsap.to(material.emissive, {
    r: targetEmissive.r,
    g: targetEmissive.g,
    b: targetEmissive.b,
    duration: HOVER_DURATION,
    ease: 'power2.out',
  });

  gsap.to(material, {
    emissiveIntensity: targetIntensity,
    duration: HOVER_DURATION,
    ease: 'power2.out',
  });
}

export function animateLetterClick(letter: LetterObject): void {
  if (letter.isAnimating) return;

  letter.isAnimating = true;
  const material = letter.mesh.material as MeshPhysicalMaterial;

  const timeline = gsap.timeline({
    onComplete: () => {
      letter.isAnimating = false;
    },
  });

  timeline
    .to(letter.mesh.position, {
      y: letter.basePosition.y + 2.8,
      duration: CLICK_DURATION * 0.42,
      ease: 'power3.out',
    })
    .to(
      letter.mesh.rotation,
      {
        z: letter.baseRotation.z + Math.PI * 0.35,
        duration: CLICK_DURATION * 0.42,
        ease: 'power2.out',
      },
      '<',
    )
    .to(
      material,
      {
        opacity: 0.35,
        duration: CLICK_DURATION * 0.25,
        ease: 'power1.inOut',
      },
      '<35%',
    )
    .to(letter.mesh.position, {
      y: letter.basePosition.y,
      duration: CLICK_DURATION * 0.48,
      ease: 'bounce.out',
    })
    .to(
      letter.mesh.rotation,
      {
        z: letter.baseRotation.z,
        duration: CLICK_DURATION * 0.48,
        ease: 'power3.inOut',
      },
      '<',
    )
    .to(
      material,
      {
        opacity: 1,
        duration: CLICK_DURATION * 0.35,
        ease: 'power2.out',
      },
      '<',
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

import gsap from 'gsap';
import { Color } from 'three';
import { COLORS, SCENE_CONFIG } from '../constants/config';
import type { LetterObject } from './types';

const hoverColor = new Color(COLORS.hoverAccent);
const baseEmissive = new Color(COLORS.letterEmissive);
const hoverEmissive = new Color(COLORS.hoverEmissive);

function stopHoverPulse(letter: LetterObject): void {
  letter.hoverTween?.kill();
  letter.hoverTween = null;
}

export function animateLetterHover(letter: LetterObject, isHovered: boolean): void {
  if (letter.isAnimating) return;

  letter.isHovered = isHovered;
  stopHoverPulse(letter);

  const { material } = letter;
  const targetScale = isHovered
    ? letter.baseScale * SCENE_CONFIG.hoverScale
    : letter.baseScale;

  gsap.to(letter.mesh.scale, {
    x: targetScale,
    y: targetScale,
    z: targetScale,
    duration: 0.5,
    ease: 'power3.out',
  });

  gsap.to(letter.mesh.position, {
    z: letter.basePosition.z + (isHovered ? 0.22 : 0),
    duration: 0.55,
    ease: 'power3.out',
  });

  const colorState = { t: isHovered ? 1 : 0 };
  const baseColor = new Color(letter.glassTint);
  gsap.to(colorState, {
    t: isHovered ? 1 : 0,
    duration: 0.55,
    ease: 'power2.out',
    onUpdate: () => {
      const fill = baseColor.clone().lerp(hoverColor, colorState.t);
      const emissive = baseEmissive.clone().lerp(hoverEmissive, colorState.t);
      material.color.copy(fill);
      material.emissive.copy(emissive);
      material.emissiveIntensity = 0.12 + colorState.t * 0.65;
    },
  });

  if (isHovered) {
    const pulse = { intensity: material.emissiveIntensity };
    letter.hoverTween = gsap.to(pulse, {
      intensity: material.emissiveIntensity + 0.35,
      duration: 0.9,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
      onUpdate: () => {
        if (letter.isHovered) {
          material.emissiveIntensity = pulse.intensity;
        }
      },
    });
  }
}

export function animateLetterClick(letter: LetterObject): void {
  if (letter.isAnimating) return;

  letter.isAnimating = true;
  letter.isHovered = false;
  stopHoverPulse(letter);

  const { material, mesh } = letter;
  const timeline = gsap.timeline({
    onComplete: () => {
      letter.isAnimating = false;
      mesh.scale.setScalar(letter.baseScale);
      mesh.position.copy(letter.basePosition);
      mesh.rotation.copy(letter.baseRotation);
      material.opacity = 1;
      material.color.set(letter.glassTint);
      material.emissive.set(COLORS.letterEmissive);
      material.emissiveIntensity = 0.12;
    },
  });

  timeline
    .to(mesh.scale, {
      x: letter.baseScale * 1.12,
      y: letter.baseScale * 0.82,
      z: letter.baseScale * 1.08,
      duration: 0.14,
      ease: 'power2.in',
    })
    .to(mesh.scale, {
      x: letter.baseScale * 0.95,
      y: letter.baseScale * 1.18,
      z: letter.baseScale * 0.95,
      duration: 0.1,
      ease: 'power2.out',
    })
    .to(
      mesh.position,
      {
        y: letter.basePosition.y + 3.2,
        z: letter.basePosition.z + 0.6,
        duration: 0.55,
        ease: 'power4.out',
      },
      '-=0.02',
    )
    .to(
      mesh.rotation,
      {
        x: letter.baseRotation.x - 0.35,
        z: letter.baseRotation.z + Math.PI * 0.55,
        duration: 0.55,
        ease: 'power3.out',
      },
      '<',
    )
    .to(
      material,
      {
        opacity: 0.4,
        emissiveIntensity: 1.2,
        duration: 0.25,
        ease: 'sine.inOut',
      },
      '<25%',
    )
    .to(mesh.position, {
      y: letter.basePosition.y,
      z: letter.basePosition.z,
      duration: 0.65,
      ease: 'power4.inOut',
    })
    .to(
      mesh.rotation,
      {
        x: letter.baseRotation.x,
        y: letter.baseRotation.y,
        z: letter.baseRotation.z,
        duration: 0.65,
        ease: 'power4.inOut',
      },
      '<',
    )
    .to(
      mesh.scale,
      {
        x: letter.baseScale * 1.06,
        y: letter.baseScale * 0.94,
        z: letter.baseScale,
        duration: 0.12,
        ease: 'power2.in',
      },
      '-=0.18',
    )
    .to(mesh.scale, {
      x: letter.baseScale,
      y: letter.baseScale,
      z: letter.baseScale,
      duration: 0.35,
      ease: 'elastic.out(1, 0.55)',
    })
    .to(
      material,
      {
        opacity: 1,
        emissiveIntensity: 0.2,
        duration: 0.4,
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

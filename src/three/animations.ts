import gsap from 'gsap';
import { Color } from 'three';
import type { PointLight } from 'three';
import { COLORS, SCENE_CONFIG } from '../constants/config';
import { playIntroSound } from '../utils/sound';
import type { LetterObject } from './types';

const hoverColor = new Color(COLORS.hoverAccent);
const baseEmissive = new Color(COLORS.letterEmissive);
const hoverEmissive = new Color(COLORS.hoverEmissive);

function stopHoverPulse(letter: LetterObject): void {
  letter.hoverTween?.kill();
  letter.hoverTween = null;
}

function animateGroup(
  letter: LetterObject,
  props: gsap.TweenVars,
): gsap.core.Tween {
  return gsap.to(letter.group, props);
}

export function animateLetterHover(letter: LetterObject, isHovered: boolean): void {
  if (letter.isAnimating) return;

  letter.isHovered = isHovered;
  stopHoverPulse(letter);

  const { material } = letter;
  const targetScale = isHovered
    ? letter.baseScale * SCENE_CONFIG.hoverScale
    : letter.baseScale;

  animateGroup(letter, {
    scale: targetScale,
    duration: 0.5,
    ease: 'power3.out',
  });

  gsap.to(letter.group.position, {
    z: letter.basePosition.z + (isHovered ? 0.18 : 0),
    duration: 0.55,
    ease: 'power3.out',
  });

  const baseColor = new Color(letter.glassTint);
  const colorState = { t: isHovered ? 1 : 0 };
  gsap.to(colorState, {
    t: isHovered ? 1 : 0,
    duration: 0.55,
    ease: 'power2.out',
    onUpdate: () => {
      const fill = baseColor.clone().lerp(hoverColor, colorState.t);
      const emissive = baseEmissive.clone().lerp(hoverEmissive, colorState.t);
      material.color.copy(fill);
      material.emissive.copy(emissive);
      material.emissiveIntensity = 0.42 + colorState.t * 0.55;
    },
  });

  if (isHovered) {
    const pulse = { intensity: material.emissiveIntensity };
    letter.hoverTween = gsap.to(pulse, {
      intensity: material.emissiveIntensity + 0.25,
      duration: 0.85,
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

export function animateLetterClick(
  letter: LetterObject,
  flashLight?: PointLight,
): void {
  if (letter.isAnimating) return;

  letter.isAnimating = true;
  letter.isHovered = false;
  stopHoverPulse(letter);

  if (flashLight) {
    gsap.fromTo(
      flashLight,
      { intensity: 4 },
      {
        intensity: 22,
        duration: 0.12,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      },
    );
  }

  const { material, group } = letter;
  const timeline = gsap.timeline({
    onComplete: () => {
      letter.isAnimating = false;
      group.scale.setScalar(letter.baseScale);
      group.position.copy(letter.basePosition);
      group.rotation.copy(letter.baseRotation);
      material.color.set(letter.glassTint);
      material.emissive.set(COLORS.letterEmissive);
      material.emissiveIntensity = 0.38;
    },
  });

  timeline
    .to(group.scale, {
      x: letter.baseScale * 1.1,
      y: letter.baseScale * 0.84,
      z: letter.baseScale * 1.06,
      duration: 0.14,
      ease: 'power2.in',
    })
    .to(group.scale, {
      x: letter.baseScale * 0.94,
      y: letter.baseScale * 1.14,
      z: letter.baseScale * 0.94,
      duration: 0.1,
      ease: 'power2.out',
    })
    .to(
      group.position,
      {
        y: letter.basePosition.y + 3,
        z: letter.basePosition.z + 0.5,
        duration: 0.55,
        ease: 'power4.out',
      },
      '-=0.02',
    )
    .to(
      group.rotation,
      {
        x: letter.baseRotation.x - 0.3,
        z: letter.baseRotation.z + Math.PI * 0.5,
        duration: 0.55,
        ease: 'power3.out',
      },
      '<',
    )
    .to(
      material,
      {
        emissiveIntensity: 1.1,
        duration: 0.25,
        ease: 'sine.inOut',
      },
      '<25%',
    )
    .to(group.position, {
      x: letter.basePosition.x,
      y: letter.basePosition.y,
      z: letter.basePosition.z,
      duration: 0.65,
      ease: 'power4.inOut',
    })
    .to(
      group.rotation,
      {
        x: letter.baseRotation.x,
        y: letter.baseRotation.y,
        z: letter.baseRotation.z,
        duration: 0.65,
        ease: 'power4.inOut',
      },
      '<',
    )
    .to(group.scale, {
      x: letter.baseScale,
      y: letter.baseScale,
      z: letter.baseScale,
      duration: 0.35,
      ease: 'elastic.out(1, 0.55)',
    })
    .to(
      material,
      {
        emissiveIntensity: 0.85,
        duration: 0.18,
        ease: 'power2.out',
      },
      '<',
    )
    .to(material, {
      emissiveIntensity: 0.38,
      duration: 0.55,
      ease: 'power2.out',
    });
}

export function animateLettersIntro(
  letters: LetterObject[],
  flashLight: PointLight,
  onProgress: (value: number) => void,
  onComplete: () => void,
): void {
  letters.forEach((letter) => {
    letter.group.scale.setScalar(0.001);
    letter.group.position.set(
      letter.basePosition.x,
      letter.basePosition.y - 4,
      letter.basePosition.z,
    );
    letter.group.visible = false;
  });

  const timeline = gsap.timeline({
    onComplete: () => {
      try {
        playIntroSound();
      } catch {
        /* autoplay policy — не блокируем показ сцены */
      }
      onComplete();
    },
  });

  letters.forEach((letter, index) => {
    const offset = index * SCENE_CONFIG.introStagger;
    timeline.call(
      () => {
        letter.group.visible = true;
        onProgress((index + 1) / letters.length);
      },
      [],
      offset,
    );
    timeline.to(
      letter.group.scale,
      {
        x: letter.baseScale,
        y: letter.baseScale,
        z: letter.baseScale,
        duration: 0.7,
        ease: 'back.out(1.6)',
      },
      offset,
    );
    timeline.to(
      letter.group.position,
      {
        x: letter.basePosition.x,
        y: letter.basePosition.y,
        z: letter.basePosition.z,
        duration: 0.75,
        ease: 'power4.out',
      },
      offset,
    );
  });

  timeline.to(
    flashLight,
    {
      intensity: 28,
      duration: 0.15,
      ease: 'power2.out',
    },
    '-=0.2',
  );
  timeline.to(flashLight, {
    intensity: 6,
    duration: 0.8,
    ease: 'power3.inOut',
  });
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

import gsap from 'gsap';
import { Color } from 'three';
import type { PointLight } from 'three';
import { SCENE_CONFIG } from '../constants/config';
import { playIntroSound } from '../utils/sound';
import type { LetterObject } from './types';

const hoverEmissive = new Color(0x2a1a08);
const baseMaterialEmissive = new Color(0x000000);
const baseMaterialColor = new Color(0xd4b060);

function killHoverTweens(letter: LetterObject): void {
  gsap.killTweensOf(letter.group);
  gsap.killTweensOf(letter.group.scale);
  gsap.killTweensOf(letter.group.position);
  gsap.killTweensOf(letter.material);
  gsap.killTweensOf(letter.material.color);
  gsap.killTweensOf(letter.material.emissive);
}

function stopHoverPulse(letter: LetterObject): void {
  letter.hoverTween?.kill();
  letter.hoverTween = null;
}

export function animateLetterHover(letter: LetterObject, isHovered: boolean): void {
  if (letter.isAnimating) return;

  letter.isHovered = isHovered;
  stopHoverPulse(letter);
  killHoverTweens(letter);

  const { material } = letter;
  const duration = isHovered
    ? SCENE_CONFIG.hoverDurationIn
    : SCENE_CONFIG.hoverDurationOut;
  const ease = isHovered ? 'power3.out' : 'power2.out';
  const targetScale = isHovered
    ? letter.baseScale * SCENE_CONFIG.hoverScale
    : letter.baseScale;

  gsap.to(letter.group.scale, {
    x: targetScale,
    y: targetScale,
    z: targetScale,
    duration,
    ease,
    overwrite: 'auto',
  });

  gsap.to(letter.group.position, {
    z: letter.basePosition.z + (isHovered ? SCENE_CONFIG.hoverLiftZ : 0),
    duration,
    ease,
    overwrite: 'auto',
  });

  gsap.to(material.color, {
    r: isHovered ? 0.92 : baseMaterialColor.r,
    g: isHovered ? 0.82 : baseMaterialColor.g,
    b: isHovered ? 0.48 : baseMaterialColor.b,
    duration,
    ease,
    overwrite: 'auto',
  });

  gsap.to(material.emissive, {
    r: isHovered ? hoverEmissive.r : baseMaterialEmissive.r,
    g: isHovered ? hoverEmissive.g : baseMaterialEmissive.g,
    b: isHovered ? hoverEmissive.b : baseMaterialEmissive.b,
    duration,
    ease,
    overwrite: 'auto',
  });

  gsap.to(material, {
    emissiveIntensity: isHovered ? 0.04 : SCENE_CONFIG.letterEmissiveIntensity,
    envMapIntensity: isHovered
      ? SCENE_CONFIG.letterEnvIntensity + 0.2
      : SCENE_CONFIG.letterEnvIntensity,
    metalness: 1,
    roughness: isHovered ? 0.36 : 0.44,
    duration,
    ease,
    overwrite: 'auto',
  });
}

export function animateLetterClick(
  letter: LetterObject,
  flashLight?: PointLight,
): void {
  if (letter.isAnimating) return;

  letter.isAnimating = true;
  letter.isHovered = false;
  stopHoverPulse(letter);
  killHoverTweens(letter);

  const { material, group } = letter;
  const s = letter.baseScale;
  const baseY = letter.basePosition.y;
  const baseX = letter.basePosition.x;
  const baseZ = letter.basePosition.z;
  const rot = letter.baseRotation;
  const jumpHeight = 2.1;

  group.scale.set(s, s, s);
  group.rotation.copy(rot);

  if (flashLight) {
    gsap.timeline()
      .to(flashLight, { intensity: 10, duration: 0.06, ease: 'power4.out' })
      .to(flashLight, { intensity: 3, duration: 0.25, ease: 'power3.inOut' })
      .to(flashLight, { intensity: 0, duration: 0.35, ease: 'power2.inOut' });
  }

  const timeline = gsap.timeline({
    onComplete: () => {
      letter.isAnimating = false;
      group.scale.set(s, s, s);
      group.position.set(baseX, baseY, baseZ);
      group.rotation.copy(rot);
      material.color.copy(baseMaterialColor);
      material.emissive.copy(baseMaterialEmissive);
      material.emissiveIntensity = SCENE_CONFIG.letterEmissiveIntensity;
      material.envMapIntensity = SCENE_CONFIG.letterEnvIntensity;
      material.metalness = 1;
      material.roughness = 0.44;
    },
  });

  timeline
    .to(group.position, {
      y: baseY - 0.05,
      duration: 0.07,
      ease: 'power2.in',
    })
    .to(group.position, {
      y: baseY + jumpHeight,
      z: baseZ + 0.18,
      duration: 0.44,
      ease: 'power2.out',
    })
    .to(
      material,
      {
        envMapIntensity: SCENE_CONFIG.letterEnvIntensity + 0.15,
        roughness: 0.36,
        duration: 0.18,
        ease: 'sine.out',
      },
      '<35%',
    )
    .to(group.position, {
      y: baseY + jumpHeight + 0.08,
      duration: 0.07,
      ease: 'sine.inOut',
    })
    .to(group.position, {
      y: baseY,
      z: baseZ,
      duration: 0.34,
      ease: 'power2.in',
    })
    .to(group.position, {
      y: baseY + 0.38,
      duration: 0.17,
      ease: 'power2.out',
    })
    .to(group.position, {
      y: baseY,
      duration: 0.14,
      ease: 'power2.in',
    })
    .to(group.position, {
      y: baseY + 0.14,
      duration: 0.11,
      ease: 'power2.out',
    })
    .to(group.position, {
      y: baseY,
      duration: 0.09,
      ease: 'power2.in',
    })
    .to(group.position, {
      y: baseY + 0.04,
      duration: 0.08,
      ease: 'power2.out',
    })
    .to(group.position, {
      y: baseY,
      x: baseX,
      z: baseZ,
      duration: 0.07,
      ease: 'power2.in',
    })
    .to(
      material,
      {
        envMapIntensity: SCENE_CONFIG.letterEnvIntensity,
        roughness: 0.44,
        duration: 0.25,
        ease: 'power2.out',
      },
      '<',
    );
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
      intensity: 9,
      duration: 0.15,
      ease: 'power2.out',
    },
    '-=0.2',
  );
  timeline.to(flashLight, {
    intensity: 0,
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

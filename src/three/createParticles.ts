import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  PointsMaterial,
} from 'three';
import { COLORS, SCENE_CONFIG } from '../constants/config';

export function createParticleField(): Points {
  const { particleCount } = SCENE_CONFIG;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const warm = new Color(COLORS.pointWarm);
  const cool = new Color(COLORS.pointCool);
  const accent = new Color(COLORS.accent);

  for (let i = 0; i < particleCount; i += 1) {
    const radius = 8 + Math.random() * 22;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

    const mix = Math.random();
    const color = mix < 0.33 ? warm : mix < 0.66 ? cool : accent;
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(positions, 3));
  geometry.setAttribute('color', new BufferAttribute(colors, 3));

  const material = new PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    sizeAttenuation: true,
  });

  return new Points(geometry, material);
}

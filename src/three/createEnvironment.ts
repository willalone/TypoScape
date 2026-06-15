import {
  BackSide,
  Color,
  Mesh,
  ShaderMaterial,
  SphereGeometry,
} from 'three';
import { COLORS } from '../constants/config';

export function createGradientSky(): Mesh {
  const geometry = new SphereGeometry(80, 32, 32);
  const material = new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new Color(COLORS.backgroundAccent) },
      bottomColor: { value: new Color(COLORS.background) },
      accentColor: { value: new Color(COLORS.pointCool).multiplyScalar(0.15) },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform vec3 accentColor;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition).y * 0.5 + 0.5;
        vec3 col = mix(bottomColor, topColor, smoothstep(0.0, 1.0, h));
        col += accentColor * (1.0 - h) * 0.6;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  return new Mesh(geometry, material);
}

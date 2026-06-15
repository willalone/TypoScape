import {
  BackSide,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
} from 'three';
import { COLORS } from '../constants/config';

export interface EnvironmentObjects {
  sky: Mesh;
  shapes: Group;
  update: (elapsed: number) => void;
}

export function createEnvironment(): EnvironmentObjects {
  const skyMaterial = new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new Color(COLORS.backgroundTop) },
      bottomColor: { value: new Color(COLORS.background) },
      accent: { value: new Color(COLORS.neonCool).multiplyScalar(0.04) },
      time: { value: 0 },
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
      uniform vec3 accent;
      uniform float time;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition).y * 0.5 + 0.5;
        vec3 col = mix(bottomColor, topColor, smoothstep(0.0, 1.0, h));
        col += accent * (0.5 + 0.5 * sin(time * 0.25 + h * 8.0)) * 0.35;
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });

  const sky = new Mesh(new SphereGeometry(70, 40, 40), skyMaterial);

  const shapes = new Group();
  const ringMat = new MeshBasicMaterial({
    color: COLORS.ring,
    transparent: true,
    opacity: 0.07,
    wireframe: true,
  });

  const outer = new Mesh(new TorusGeometry(10.5, 0.018, 6, 128), ringMat);
  outer.rotation.x = Math.PI * 0.48;
  shapes.add(outer);

  const inner = new Mesh(new TorusGeometry(7.2, 0.012, 6, 96), ringMat.clone());
  inner.rotation.set(Math.PI * 0.62, Math.PI * 0.15, 0.2);
  shapes.add(inner);

  return {
    sky,
    shapes,
    update(elapsed: number) {
      skyMaterial.uniforms.time.value = elapsed;
      shapes.rotation.y = elapsed * 0.035;
      outer.rotation.z = elapsed * 0.05;
    },
  };
}

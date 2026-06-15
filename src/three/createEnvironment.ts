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
  const skyGeometry = new SphereGeometry(80, 48, 48);
  const skyMaterial = new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new Color(0x1a1428) },
      midColor: { value: new Color(COLORS.backgroundAccent) },
      bottomColor: { value: new Color(COLORS.background) },
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
      uniform vec3 midColor;
      uniform vec3 bottomColor;
      uniform float time;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition).y * 0.5 + 0.5;
        vec3 col = mix(bottomColor, midColor, smoothstep(0.0, 0.55, h));
        col = mix(col, topColor, smoothstep(0.45, 1.0, h));
        col += vec3(0.04, 0.02, 0.06) * sin(time * 0.3 + h * 6.0);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const sky = new Mesh(skyGeometry, skyMaterial);

  const shapes = new Group();
  const ringMaterial = new MeshBasicMaterial({
    color: COLORS.ring,
    transparent: true,
    opacity: 0.06,
    wireframe: true,
  });

  const ringLarge = new Mesh(new TorusGeometry(9, 0.015, 8, 120), ringMaterial);
  ringLarge.rotation.x = Math.PI * 0.42;
  shapes.add(ringLarge);

  const ringMid = new Mesh(new TorusGeometry(6.5, 0.012, 8, 96), ringMaterial.clone());
  ringMid.rotation.set(Math.PI * 0.55, Math.PI * 0.2, 0);
  shapes.add(ringMid);

  return {
    sky,
    shapes,
    update(elapsed: number) {
      skyMaterial.uniforms.time.value = elapsed;
      shapes.rotation.y = elapsed * 0.04;
      ringLarge.rotation.z = elapsed * 0.06;
    },
  };
}

import type { PerspectiveCamera, WebGLRenderer } from 'three';
import { Vector2 } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import type { Scene } from 'three';
import { SCENE_CONFIG } from '../constants/config';

const VignetteShader = {
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: 1.1 },
    darkness: { value: 1.35 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float offset;
    uniform float darkness;
    varying vec2 vUv;
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      vec2 uv = (vUv - 0.5) * vec2(offset);
      float vignette = 1.0 - dot(uv, uv);
      color.rgb *= smoothstep(0.0, darkness, vignette);
      gl_FragColor = color;
    }
  `,
};

export interface PostProcessingPipeline {
  composer: EffectComposer;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}

export function createPostProcessing(
  renderer: WebGLRenderer,
  scene: Scene,
  camera: PerspectiveCamera,
  width: number,
  height: number,
): PostProcessingPipeline {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const bloom = new UnrealBloomPass(
    new Vector2(width, height),
    SCENE_CONFIG.bloomStrength,
    SCENE_CONFIG.bloomRadius,
    SCENE_CONFIG.bloomThreshold,
  );
  composer.addPass(bloom);

  const vignette = new ShaderPass(VignetteShader);
  composer.addPass(vignette);

  const film = new FilmPass(0.08, false);
  composer.addPass(film);

  composer.addPass(new OutputPass());

  return {
    composer,
    resize(nextWidth: number, nextHeight: number) {
      composer.setSize(nextWidth, nextHeight);
      bloom.setSize(nextWidth, nextHeight);
    },
    dispose() {
      composer.dispose();
    },
  };
}

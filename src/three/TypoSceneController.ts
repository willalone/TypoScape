import {
  AmbientLight,
  DirectionalLight,
  FogExp2,
  GridHelper,
  Group,
  PerspectiveCamera,
  PointLight,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
  ACESFilmicToneMapping,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { COLORS, FONT_PATH, SCENE_CONFIG } from '../constants/config';
import {
  animateCameraReset,
  animateLetterClick,
  animateLetterHover,
} from './animations';
import { createEnvironment } from './createEnvironment';
import { createLetters, disposeLetters } from './createLetters';
import { createParticleField } from './createParticles';
import { createPostProcessing } from './createPostProcessing';
import type { LetterObject, SceneCallbacks } from './types';
import { getLetterMeshes } from './types';

function tryCreateRenderer(canvas: HTMLCanvasElement): WebGLRenderer | null {
  try {
    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    if (!renderer.getContext()) {
      renderer.dispose();
      return null;
    }
    return renderer;
  } catch {
    return null;
  }
}

export class TypoSceneController {
  private readonly scene: Scene;

  private readonly camera: PerspectiveCamera;

  private readonly renderer: WebGLRenderer;

  private readonly controls: OrbitControls;

  private readonly raycaster = new Raycaster();

  private readonly pointer = new Vector2();

  private letters: LetterObject[] = [];

  private letterMeshes: ReturnType<typeof getLetterMeshes> = [];

  private hoveredLetter: LetterObject | null = null;

  private animationFrameId = 0;

  private disposed = false;

  private autoRotate = true;

  private readonly callbacks: SceneCallbacks;

  private readonly particles: Group;

  private readonly canvas: HTMLCanvasElement;

  private readonly postProcessing: ReturnType<typeof createPostProcessing>;

  private readonly environment: ReturnType<typeof createEnvironment>;

  private clock = 0;

  private readonly initialCameraPosition = { x: 0, y: 1.2, z: SCENE_CONFIG.cameraZ };

  private readonly initialTarget = { x: 0, y: 0, z: 0 };

  static create(
    canvas: HTMLCanvasElement,
    callbacks: SceneCallbacks,
  ): TypoSceneController | null {
    const renderer = tryCreateRenderer(canvas);
    if (!renderer) {
      callbacks.onWebGLFailed();
      return null;
    }
    return new TypoSceneController(canvas, callbacks, renderer);
  }

  private constructor(
    canvas: HTMLCanvasElement,
    callbacks: SceneCallbacks,
    renderer: WebGLRenderer,
  ) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.renderer = renderer;
    this.scene = new Scene();
    this.scene.fog = new FogExp2(COLORS.background, 0.026);

    const aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera = new PerspectiveCamera(SCENE_CONFIG.cameraFov, aspect, 0.1, 120);
    this.camera.position.set(
      this.initialCameraPosition.x,
      this.initialCameraPosition.y,
      this.initialCameraPosition.z,
    );

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.12;

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.045;
    this.controls.minDistance = 6;
    this.controls.maxDistance = 28;
    this.controls.maxPolarAngle = Math.PI * 0.85;
    this.controls.target.set(0, 0, 0);

    this.postProcessing = createPostProcessing(
      this.renderer,
      this.scene,
      this.camera,
      canvas.clientWidth,
      canvas.clientHeight,
    );

    this.environment = createEnvironment();
    this.scene.add(this.environment.sky);
    this.scene.add(this.environment.shapes);

    this.particles = new Group();
    this.particles.add(createParticleField());
    this.scene.add(this.particles);

    this.setupLights();
    this.setupGrid();
    this.bindEvents();
    this.loadLetters();
    this.animate();
  }

  private setupLights(): void {
    this.scene.add(new AmbientLight(COLORS.ambient, 0.58));

    const keyLight = new DirectionalLight(COLORS.directional, 1.45);
    keyLight.position.set(6, 10, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    this.scene.add(keyLight);

    const fillLight = new PointLight(COLORS.pointCool, 26, 42);
    fillLight.position.set(-8, 4, 6);
    this.scene.add(fillLight);

    const rimLight = new PointLight(COLORS.pointWarm, 20, 36);
    rimLight.position.set(5, -2, -8);
    this.scene.add(rimLight);
  }

  private setupGrid(): void {
    const grid = new GridHelper(30, 40, COLORS.grid, COLORS.grid);
    grid.position.y = -2.4;
    grid.material.opacity = 0.18;
    grid.material.transparent = true;
    this.scene.add(grid);
  }

  private loadLetters(): void {
    this.callbacks.onLoadProgress(0.1);
    const loader = new FontLoader();
    loader.load(
      FONT_PATH,
      (font: Font) => {
        if (this.disposed) return;
        const { group, letters } = createLetters(font);
        this.letters = letters;
        this.letterMeshes = getLetterMeshes(letters);
        this.scene.add(group);
        this.callbacks.onLoadProgress(1);
        this.callbacks.onLoadComplete();
      },
      (event) => {
        if (event.lengthComputable) {
          const ratio = event.loaded / event.total;
          this.callbacks.onLoadProgress(0.1 + ratio * 0.85);
        }
      },
      () => {
        if (!this.disposed) this.callbacks.onLoadComplete();
      },
    );
  }

  private bindEvents(): void {
    this.canvas.addEventListener('pointermove', this.onPointerMove);
    this.canvas.addEventListener('pointerleave', this.onPointerLeave);
    this.canvas.addEventListener('click', this.onClick);
    window.addEventListener('resize', this.onResize);
  }

  private unbindEvents(): void {
    this.canvas.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.removeEventListener('pointerleave', this.onPointerLeave);
    this.canvas.removeEventListener('click', this.onClick);
    window.removeEventListener('resize', this.onResize);
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (this.letterMeshes.length === 0) return;

    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.letterMeshes, false);
    const hit = hits[0]?.object;
    const letter = this.letters.find((item) => item.mesh === hit) ?? null;

    if (letter && letter !== this.hoveredLetter) {
      if (this.hoveredLetter) animateLetterHover(this.hoveredLetter, false);
      this.hoveredLetter = letter;
      animateLetterHover(letter, true);
      this.callbacks.onHoverChange(letter.char);
      this.canvas.style.cursor = 'pointer';
      return;
    }

    if (!letter && this.hoveredLetter) {
      animateLetterHover(this.hoveredLetter, false);
      this.hoveredLetter = null;
      this.callbacks.onHoverChange(null);
      this.canvas.style.cursor = 'default';
    }
  };

  private readonly onPointerLeave = (): void => {
    if (this.hoveredLetter) {
      animateLetterHover(this.hoveredLetter, false);
      this.hoveredLetter = null;
      this.callbacks.onHoverChange(null);
    }
    this.canvas.style.cursor = 'default';
  };

  private readonly onClick = (): void => {
    if (!this.hoveredLetter) return;
    animateLetterClick(this.hoveredLetter);
    this.callbacks.onLetterClick(this.hoveredLetter.char);
  };

  private readonly onResize = (): void => {
    const { clientWidth, clientHeight } = this.canvas;
    if (clientWidth === 0 || clientHeight === 0) return;

    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight, false);
    this.postProcessing.resize(clientWidth, clientHeight);
  };

  private animate = (): void => {
    if (this.disposed) return;

    this.clock += 0.016;
    this.environment.update(this.clock);

    if (this.autoRotate) {
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = SCENE_CONFIG.autoRotateSpeed;
    } else {
      this.controls.autoRotate = false;
    }

    this.particles.rotation.y += 0.00035;
    this.controls.update();
    this.postProcessing.composer.render();
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  setAutoRotate(enabled: boolean): void {
    this.autoRotate = enabled;
  }

  resetCamera(): void {
    animateCameraReset(
      this.camera,
      this.controls,
      this.initialCameraPosition,
      this.initialTarget,
    );
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.animationFrameId);
    this.unbindEvents();
    this.controls.dispose();
    this.postProcessing.dispose();
    disposeLetters(this.letters);
    this.renderer.dispose();
  }
}

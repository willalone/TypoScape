import {
  ACESFilmicToneMapping,
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
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { COLORS, FONT_PATH, SCENE_CONFIG } from '../constants/config';
import { animateCameraReset, animateLetterClick, animateLetterHover } from './animations';
import { createEnvironment } from './createEnvironment';
import { createLetters, getLetterMeshes } from './createLetters';
import { createParticleField } from './createParticles';
import { createPostProcessing } from './createPostProcessing';
import type { LetterObject, SceneCallbacks } from './types';

function getCanvasSize(canvas: HTMLCanvasElement): { width: number; height: number } {
  const width = canvas.clientWidth || window.innerWidth;
  const height = canvas.clientHeight || window.innerHeight;
  return { width: Math.max(width, 1), height: Math.max(height, 1) };
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

  constructor(
    canvas: HTMLCanvasElement,
    callbacks: SceneCallbacks,
  ) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.scene = new Scene();
    this.scene.fog = new FogExp2(COLORS.background, 0.024);

    const { width, height } = getCanvasSize(canvas);
    const aspect = width / height;
    this.camera = new PerspectiveCamera(SCENE_CONFIG.cameraFov, aspect, 0.1, 120);
    this.camera.position.set(
      this.initialCameraPosition.x,
      this.initialCameraPosition.y,
      this.initialCameraPosition.z,
    );

    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setSize(width, height, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 6;
    this.controls.maxDistance = 26;
    this.controls.maxPolarAngle = Math.PI * 0.82;
    this.controls.rotateSpeed = 0.5;

    this.postProcessing = createPostProcessing(
      this.renderer,
      this.scene,
      this.camera,
      width,
      height,
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
    this.scene.add(new AmbientLight(COLORS.ambient, 0.5));

    const key = new DirectionalLight(COLORS.directional, 1.35);
    key.position.set(5, 9, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    this.scene.add(key);

    const cool = new PointLight(COLORS.pointCool, 24, 42);
    cool.position.set(-7, 3, 5);
    this.scene.add(cool);

    const warm = new PointLight(COLORS.pointWarm, 18, 36);
    warm.position.set(6, -1, -7);
    this.scene.add(warm);

    const accent = new PointLight(COLORS.hoverAccent, 10, 22);
    accent.position.set(0, 4, 9);
    this.scene.add(accent);
  }

  private setupGrid(): void {
    const grid = new GridHelper(28, 56, COLORS.grid, COLORS.gridFade);
    grid.position.y = -2.35;
    grid.material.opacity = 0.16;
    grid.material.transparent = true;
    this.scene.add(grid);
  }

  private loadLetters(): void {
    const loader = new FontLoader();
    loader.load(
      FONT_PATH,
      (font: Font) => {
        if (this.disposed) return;
        const { group, letters } = createLetters(font);
        this.letters = letters;
        this.letterMeshes = getLetterMeshes(letters);
        this.scene.add(group);
      },
      undefined,
      (error) => {
        console.error('Font load failed:', FONT_PATH, error);
      },
    );
  }

  private applyAmbientWave(): void {
    this.letters.forEach((letter) => {
      if (letter.isAnimating || letter.isHovered) return;
      const wave = Math.sin(this.clock * 1.1 + letter.wavePhase) * 0.06;
      letter.mesh.position.y = letter.basePosition.y + wave;
    });
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
    const { width, height } = getCanvasSize(this.canvas);
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.postProcessing.resize(width, height);
  };

  private animate = (): void => {
    if (this.disposed) return;

    this.clock += 0.016;
    this.environment.update(this.clock);
    this.applyAmbientWave();

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
    this.letters.forEach((letter) => {
      letter.hoverTween?.kill();
      letter.mesh.geometry.dispose();
      letter.material.dispose();
    });
    this.renderer.dispose();
  }
}

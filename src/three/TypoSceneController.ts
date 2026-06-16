import {
  ACESFilmicToneMapping,
  AmbientLight,
  DirectionalLight,
  FogExp2,
  GridHelper,
  Group,
  PMREMGenerator,
  PerspectiveCamera,
  PointLight,
  Raycaster,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { COLORS, FONT_PATH, SCENE_CONFIG, getCameraDistance } from '../constants/config';
import { createWebGLRenderer } from '../utils/webgl';
import {
  animateCameraReset,
  animateLetterClick,
  animateLetterHover,
  animateLettersIntro,
} from './animations';
import { createEnvironment } from './createEnvironment';
import { createLetters, disposeLetters, getLetterMeshes } from './createLetters';
import { createBrushedMetalTextures, type MetalTextureSet } from './createMetalTextures';
import { createParticleField } from './createParticles';
import { createPostProcessing } from './createPostProcessing';
import type { LetterObject, SceneCallbacks } from './types';
import { playClickSound, playHoverSound } from '../utils/sound';

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

  private autoRotate = false;

  private soundEnabled = true;

  private readonly callbacks: SceneCallbacks;

  private readonly particles: Group;

  private readonly canvas: HTMLCanvasElement;

  private readonly postProcessing: ReturnType<typeof createPostProcessing> | null;

  private readonly environment: ReturnType<typeof createEnvironment>;

  private readonly flashLight: PointLight;

  private readonly metalTextures: MetalTextureSet;

  private clock = 0;

  private useComposer = true;

  private loadCompleted = false;

  private loadTimeoutId = 0;

  private cameraZ: number;

  private readonly initialCameraPosition: { x: number; y: number; z: number };

  private readonly initialTarget = { x: 0, y: 0, z: 0 };

  constructor(
    canvas: HTMLCanvasElement,
    callbacks: SceneCallbacks,
    options?: { soundEnabled?: boolean },
  ) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.soundEnabled = options?.soundEnabled ?? true;

    const { width, height } = getCanvasSize(canvas);
    this.cameraZ = getCameraDistance(width);
    this.initialCameraPosition = {
      x: 0,
      y: SCENE_CONFIG.cameraY,
      z: this.cameraZ,
    };

    this.scene = new Scene();
    this.scene.fog = new FogExp2(COLORS.background, 0.022);

    const aspect = width / height;
    this.camera = new PerspectiveCamera(SCENE_CONFIG.cameraFov, aspect, 0.1, 120);
    this.camera.position.set(
      this.initialCameraPosition.x,
      this.initialCameraPosition.y,
      this.initialCameraPosition.z,
    );

    this.renderer = createWebGLRenderer(canvas);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.renderer.setSize(width, height, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.98;

    const pmrem = new PMREMGenerator(this.renderer);
    pmrem.compileEquirectangularShader();
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.045).texture;
    pmrem.dispose();

    this.metalTextures = createBrushedMetalTextures();

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 7;
    this.controls.maxDistance = 20;
    this.controls.maxPolarAngle = Math.PI * 0.52;
    this.controls.minPolarAngle = Math.PI * 0.42;
    this.controls.rotateSpeed = 0.35;
    this.controls.autoRotate = false;

    try {
      this.postProcessing = createPostProcessing(
        this.renderer,
        this.scene,
        this.camera,
        width,
        height,
      );
    } catch (error) {
      console.warn('TypoScape: post-processing unavailable, using direct render.', error);
      this.postProcessing = null;
      this.useComposer = false;
    }

    this.environment = createEnvironment();
    this.scene.add(this.environment.sky);
    this.scene.add(this.environment.shapes);

    this.particles = new Group();
    this.particles.add(createParticleField());
    this.scene.add(this.particles);

    this.flashLight = new PointLight(COLORS.accent, 0, 30);
    this.flashLight.position.set(0, 2, 4);
    this.scene.add(this.flashLight);

    this.setupLights();
    this.setupGrid();
    this.bindEvents();
    this.startLoadTimeout();
    this.loadLetters();
    this.animate();
  }

  private startLoadTimeout(): void {
    this.loadTimeoutId = window.setTimeout(() => {
      if (this.loadCompleted || this.disposed) return;
      console.warn('TypoScape: load timeout — revealing scene');
      this.revealLettersImmediately();
      this.finishLoading();
    }, 10000);
  }

  private revealLettersImmediately(): void {
    this.letters.forEach((letter) => {
      letter.group.visible = true;
      letter.group.scale.setScalar(letter.baseScale);
      letter.group.position.copy(letter.basePosition);
    });
  }

  private finishLoading(): void {
    if (this.loadCompleted || this.disposed) return;
    this.loadCompleted = true;
    window.clearTimeout(this.loadTimeoutId);
    this.callbacks.onLoadComplete();
  }

  private setupLights(): void {
    this.scene.add(new AmbientLight(COLORS.ambient, 0.42));

    const key = new DirectionalLight(COLORS.directional, 0.95);
    key.position.set(4, 10, 8);
    this.scene.add(key);

    const spec = new DirectionalLight(0xffffff, 0.75);
    spec.position.set(-2, 6, 10);
    this.scene.add(spec);

    const fill = new DirectionalLight(0xfff4e0, 1.15);
    fill.position.set(0, 1.5, 12);
    this.scene.add(fill);

    const rim = new DirectionalLight(COLORS.neonWarm, 0.45);
    rim.position.set(0, -2, -8);
    this.scene.add(rim);

    const cool = new PointLight(COLORS.pointCool, 6, 40);
    cool.position.set(-6, 3, 5);
    this.scene.add(cool);

    const warm = new PointLight(COLORS.pointWarm, 5, 36);
    warm.position.set(6, 0, -6);
    this.scene.add(warm);

    const front = new PointLight(COLORS.neonWarm, 7, 28);
    front.position.set(0, 0.5, 9);
    this.scene.add(front);
  }

  private setupGrid(): void {
    const grid = new GridHelper(28, 56, COLORS.grid, COLORS.gridFade);
    grid.position.y = -2.35;
    grid.material.opacity = 0.12;
    grid.material.transparent = true;
    this.scene.add(grid);
  }

  private loadLetters(): void {
    this.callbacks.onLoadProgress(0.05);
    const loader = new FontLoader();
    loader.load(
      FONT_PATH,
      (font: Font) => {
        if (this.disposed) return;
        this.callbacks.onLoadProgress(0.35);

        const { group, letters } = createLetters(font, this.metalTextures);
        this.letters = letters;
        this.letterMeshes = getLetterMeshes(letters);
        this.scene.add(group);

        try {
          animateLettersIntro(
            letters,
            this.flashLight,
            (value) => {
              this.callbacks.onLoadProgress(0.35 + value * 0.65);
            },
            () => {
              this.finishLoading();
            },
          );
        } catch (error) {
          console.error('Intro animation failed:', error);
          letters.forEach((letter) => {
            letter.group.visible = true;
            letter.group.scale.setScalar(letter.baseScale);
            letter.group.position.copy(letter.basePosition);
          });
          this.finishLoading();
        }
      },
      (event) => {
        if (event.lengthComputable) {
          const ratio = event.loaded / event.total;
          this.callbacks.onLoadProgress(0.05 + ratio * 0.25);
        }
      },
      (error) => {
        console.error('Font load failed:', FONT_PATH, error);
        this.finishLoading();
      },
    );
  }

  private applyAmbientWave(): void {
    this.letters.forEach((letter) => {
      if (letter.isAnimating || letter.isHovered) return;
      const wave = Math.sin(this.clock * 0.9 + letter.wavePhase) * 0.02;
      letter.group.position.y = letter.basePosition.y + wave;
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
    const hitMesh = hits[0]?.object;
    const letter =
      this.letters.find((item) => item.mesh === hitMesh) ?? null;

    if (letter && letter !== this.hoveredLetter) {
      if (this.hoveredLetter) animateLetterHover(this.hoveredLetter, false);
      this.hoveredLetter = letter;
      animateLetterHover(letter, true);
      this.callbacks.onHoverChange(letter.char);
      if (this.soundEnabled) playHoverSound();
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
    animateLetterClick(this.hoveredLetter, this.flashLight);
    if (this.soundEnabled) playClickSound();
    this.callbacks.onLetterClick(this.hoveredLetter.char);
  };

  private readonly onResize = (): void => {
    const { width, height } = getCanvasSize(this.canvas);
    if (width === 0 || height === 0) return;

    this.cameraZ = getCameraDistance(width);
    this.camera.position.z = this.cameraZ;
    this.initialCameraPosition.z = this.cameraZ;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.postProcessing?.resize(width, height);
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
    this.renderFrame();
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  private renderFrame(): void {
    if (this.useComposer && this.postProcessing) {
      try {
        this.postProcessing.composer.render();
        return;
      } catch (error) {
        console.warn('Post-processing failed, using direct render:', error);
        this.useComposer = false;
      }
    }

    this.renderer.render(this.scene, this.camera);
  }

  setAutoRotate(enabled: boolean): void {
    this.autoRotate = enabled;
  }

  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
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
    window.clearTimeout(this.loadTimeoutId);
    cancelAnimationFrame(this.animationFrameId);
    this.unbindEvents();
    this.controls.dispose();
    this.postProcessing?.dispose();
    disposeLetters(this.letters);
    this.metalTextures.dispose();
    this.renderer.dispose();
  }
}

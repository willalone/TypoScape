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
import { COLORS, SCENE_CONFIG } from '../constants/config';
import {
  animateCameraReset,
  animateLetterClick,
  animateLetterHover,
} from './animations';
import { createGradientSky } from './createEnvironment';
import { createLetters, disposeLetters } from './createLetters';
import { createParticleField } from './createParticles';
import { createPostProcessing } from './createPostProcessing';
import type { LetterObject, SceneCallbacks } from './types';
import { getLetterTargets } from './types';

export class TypoSceneController {
  private readonly scene: Scene;

  private readonly camera: PerspectiveCamera;

  private readonly renderer: WebGLRenderer;

  private readonly controls: OrbitControls;

  private readonly raycaster = new Raycaster();

  private readonly pointer = new Vector2();

  private letters: LetterObject[] = [];

  private letterTargets: ReturnType<typeof getLetterTargets> = [];

  private hoveredLetter: LetterObject | null = null;

  private animationFrameId = 0;

  private disposed = false;

  private autoRotate = true;

  private readonly callbacks: SceneCallbacks;

  private readonly particles: Group;

  private readonly canvas: HTMLCanvasElement;

  private readonly postProcessing: ReturnType<typeof createPostProcessing>;

  private clock = 0;

  private readonly initialCameraPosition = { x: 0, y: 0.6, z: SCENE_CONFIG.cameraZ };

  private readonly initialTarget = { x: 0, y: 0, z: 0 };

  constructor(
    canvas: HTMLCanvasElement,
    callbacks: SceneCallbacks,
  ) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.scene = new Scene();
    this.scene.fog = new FogExp2(COLORS.background, 0.022);

    const aspect = canvas.clientWidth / canvas.clientHeight;
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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.95;

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 7;
    this.controls.maxDistance = 22;
    this.controls.maxPolarAngle = Math.PI * 0.78;
    this.controls.minPolarAngle = Math.PI * 0.28;
    this.controls.rotateSpeed = 0.55;
    this.controls.zoomSpeed = 0.7;
    this.controls.target.set(0, 0, 0);

    this.postProcessing = createPostProcessing(
      this.renderer,
      this.scene,
      this.camera,
      canvas.clientWidth,
      canvas.clientHeight,
    );

    this.scene.add(createGradientSky());

    this.particles = new Group();
    this.particles.add(createParticleField());
    this.scene.add(this.particles);

    this.setupLights();
    this.setupGrid();
    this.bindEvents();
    void this.loadLetters();
    this.animate();
  }

  private setupLights(): void {
    const ambient = new AmbientLight(COLORS.ambient, 0.42);
    this.scene.add(ambient);

    const keyLight = new DirectionalLight(COLORS.directional, 1.1);
    keyLight.position.set(4, 8, 6);
    this.scene.add(keyLight);

    const fillLight = new PointLight(COLORS.pointCool, 18, 45);
    fillLight.position.set(-6, 2, 4);
    this.scene.add(fillLight);

    const rimLight = new PointLight(COLORS.pointWarm, 14, 38);
    rimLight.position.set(4, -1, -6);
    this.scene.add(rimLight);

    const accentLight = new PointLight(COLORS.accent, 8, 25);
    accentLight.position.set(0, 3, 8);
    this.scene.add(accentLight);
  }

  private setupGrid(): void {
    const grid = new GridHelper(24, 48, COLORS.grid, COLORS.grid);
    grid.position.y = -1.8;
    grid.material.opacity = 0.14;
    grid.material.transparent = true;
    this.scene.add(grid);
  }

  private async loadLetters(): Promise<void> {
    this.callbacks.onLoadProgress(0.15);
    try {
      const { group, letters } = await createLetters();
      if (this.disposed) return;

      this.letters = letters;
      this.letterTargets = getLetterTargets(letters);
      this.scene.add(group);
      this.callbacks.onLoadProgress(1);
      this.callbacks.onLoadComplete();
    } catch {
      if (!this.disposed) {
        this.callbacks.onLoadComplete();
      }
    }
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
    if (this.letterTargets.length === 0) return;

    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.letterTargets, false);
    const hitObject = hits[0]?.object;

    const letter =
      this.letters.find((item) => item.text === hitObject) ?? null;

    if (letter && letter !== this.hoveredLetter) {
      if (this.hoveredLetter) {
        animateLetterHover(this.hoveredLetter, false);
      }
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

    if (this.autoRotate) {
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = SCENE_CONFIG.autoRotateSpeed;
    } else {
      this.controls.autoRotate = false;
    }

    this.particles.rotation.y = Math.sin(this.clock * 0.08) * 0.02 + this.clock * 0.0002;
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

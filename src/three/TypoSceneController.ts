import {
  AmbientLight,
  Color,
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
import { animateLetterClick, animateLetterHover } from './animations';
import { createLetters, getLetterMeshes } from './createLetters';
import { createParticleField } from './createParticles';
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

  private hoveredMesh: LetterObject | null = null;

  private animationFrameId = 0;

  private disposed = false;

  private autoRotate = true;

  private readonly callbacks: SceneCallbacks;

  private readonly particles: Group;

  private readonly canvas: HTMLCanvasElement;

  private initialCameraPosition = { x: 0, y: 1.2, z: SCENE_CONFIG.cameraZ };

  private initialTarget = { x: 0, y: 0, z: 0 };

  constructor(
    canvas: HTMLCanvasElement,
    callbacks: SceneCallbacks,
  ) {
    this.canvas = canvas;
    this.callbacks = callbacks;
    this.scene = new Scene();
    this.scene.background = new Color(COLORS.background);
    this.scene.fog = new FogExp2(COLORS.background, 0.028);

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
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMappingExposure = 1.15;

    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.045;
    this.controls.minDistance = 6;
    this.controls.maxDistance = 28;
    this.controls.maxPolarAngle = Math.PI * 0.85;
    this.controls.target.set(0, 0, 0);

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
    const ambient = new AmbientLight(COLORS.ambient, 0.55);
    this.scene.add(ambient);

    const keyLight = new DirectionalLight(COLORS.directional, 1.4);
    keyLight.position.set(6, 10, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    this.scene.add(keyLight);

    const fillLight = new PointLight(COLORS.pointCool, 28, 40);
    fillLight.position.set(-8, 4, 6);
    this.scene.add(fillLight);

    const rimLight = new PointLight(COLORS.pointWarm, 22, 35);
    rimLight.position.set(5, -2, -8);
    this.scene.add(rimLight);
  }

  private setupGrid(): void {
    const grid = new GridHelper(30, 40, COLORS.grid, COLORS.grid);
    grid.position.y = -2.4;
    grid.material.opacity = 0.22;
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
        letters.forEach((letter) => {
          letter.mesh.userData.baseScale = letter.baseScale;
          letter.mesh.castShadow = true;
          letter.mesh.receiveShadow = true;
        });
        this.scene.add(group);
      },
      undefined,
      (error) => {
        console.error('Font load failed:', FONT_PATH, error);
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
    const rect = this.canvas.getBoundingClientRect();
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hits = this.raycaster.intersectObjects(this.letterMeshes, false);
    const hit = hits[0]?.object;

    if (hit) {
      const letter = this.letters.find((item) => item.mesh === hit) ?? null;
      if (letter && letter !== this.hoveredMesh) {
        if (this.hoveredMesh) {
          animateLetterHover(this.hoveredMesh, false);
        }
        this.hoveredMesh = letter;
        animateLetterHover(letter, true);
        this.callbacks.onHoverChange(letter.char);
        this.canvas.style.cursor = 'pointer';
      }
      return;
    }

    if (this.hoveredMesh) {
      animateLetterHover(this.hoveredMesh, false);
      this.hoveredMesh = null;
      this.callbacks.onHoverChange(null);
    }
    this.canvas.style.cursor = 'default';
  };

  private readonly onPointerLeave = (): void => {
    if (this.hoveredMesh) {
      animateLetterHover(this.hoveredMesh, false);
      this.hoveredMesh = null;
      this.callbacks.onHoverChange(null);
    }
    this.canvas.style.cursor = 'default';
  };

  private readonly onClick = (): void => {
    if (!this.hoveredMesh) return;
    animateLetterClick(this.hoveredMesh);
    this.callbacks.onLetterClick(this.hoveredMesh.char);
  };

  private readonly onResize = (): void => {
    const { width, height } = getCanvasSize(this.canvas);
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  };

  private animate = (): void => {
    if (this.disposed) return;

    if (this.autoRotate) {
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = SCENE_CONFIG.autoRotateSpeed;
    } else {
      this.controls.autoRotate = false;
    }

    this.particles.rotation.y += 0.00035;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.animationFrameId = requestAnimationFrame(this.animate);
  };

  setAutoRotate(enabled: boolean): void {
    this.autoRotate = enabled;
  }

  resetCamera(): void {
    this.camera.position.set(
      this.initialCameraPosition.x,
      this.initialCameraPosition.y,
      this.initialCameraPosition.z,
    );
    this.controls.target.set(
      this.initialTarget.x,
      this.initialTarget.y,
      this.initialTarget.z,
    );
    this.controls.update();
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.animationFrameId);
    this.unbindEvents();
    this.controls.dispose();
    this.renderer.dispose();
    this.letterMeshes.forEach((mesh) => {
      mesh.geometry.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => material.dispose());
      } else {
        mesh.material.dispose();
      }
    });
  }
}

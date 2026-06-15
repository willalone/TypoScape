import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { useSceneStore } from '../stores/sceneStore';
import { TypoSceneController } from '../three/TypoSceneController';

async function waitForCanvasSize(canvas: HTMLCanvasElement): Promise<void> {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (canvas.clientWidth > 0 && canvas.clientHeight > 0) return;
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  }
}

function createSceneController(
  canvas: HTMLCanvasElement,
  store: ReturnType<typeof useSceneStore>,
): TypoSceneController {
  return new TypoSceneController(
    canvas,
    {
      onHoverChange: (char) => store.setHoveredLetter(char),
      onLetterClick: (char) => store.setClickedLetter(char),
      onLoadProgress: (progress) => store.setLoadProgress(progress),
      onLoadComplete: () => store.setSceneReady(true),
    },
    { soundEnabled: store.soundEnabled },
  );
}

/** Инициализация Three.js-сцены (вынесена из TypoScene.vue для читаемости в GitHub). */
export function useTypoScene(canvasRef: Ref<HTMLCanvasElement | null>) {
  const showStaticPreview = ref(false);
  const store = useSceneStore();
  let controller: TypoSceneController | null = null;

  onMounted(async () => {
    await nextTick();
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    const canvas = canvasRef.value;
    if (!canvas) {
      showStaticPreview.value = true;
      store.setSceneReady(true);
      return;
    }

    await waitForCanvasSize(canvas);

    store.setSceneReady(false);
    store.setLoadProgress(0);

    try {
      controller = createSceneController(canvas, store);
      controller.setAutoRotate(store.autoRotate);
    } catch (error) {
      console.warn('TypoScene: first init attempt failed, retrying…', error);
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 120);
      });

      try {
        controller = createSceneController(canvas, store);
        controller.setAutoRotate(store.autoRotate);
      } catch (retryError) {
        console.warn('TypoScene: WebGL unavailable, showing static preview.', retryError);
        showStaticPreview.value = true;
        store.setSceneReady(true);
      }
    }
  });

  watch(
    () => store.autoRotate,
    (enabled) => {
      controller?.setAutoRotate(enabled);
    },
  );

  watch(
    () => store.soundEnabled,
    (enabled) => {
      controller?.setSoundEnabled(enabled);
    },
  );

  watch(
    () => store.resetCameraNonce,
    () => {
      controller?.resetCamera();
    },
  );

  onBeforeUnmount(() => {
    controller?.dispose();
    controller = null;
  });

  return { showStaticPreview };
}

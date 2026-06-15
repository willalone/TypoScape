import { nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { useSceneStore } from '../stores/sceneStore';
import { TypoSceneController } from '../three/TypoSceneController';

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

    store.setSceneReady(false);
    store.setLoadProgress(0);

    try {
      controller = new TypoSceneController(
        canvas,
        {
          onHoverChange: (char) => store.setHoveredLetter(char),
          onLetterClick: (char) => store.setClickedLetter(char),
          onLoadProgress: (progress) => store.setLoadProgress(progress),
          onLoadComplete: () => store.setSceneReady(true),
        },
        { soundEnabled: store.soundEnabled },
      );
      controller.setAutoRotate(store.autoRotate);
    } catch (error) {
      console.warn('TypoScene: WebGL unavailable, showing static preview.', error);
      showStaticPreview.value = true;
      store.setSceneReady(true);
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

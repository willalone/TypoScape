<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useSceneStore } from '../stores/sceneStore';
import type { TypoSceneController } from '../three/TypoSceneController';
import WebGLFallback from './WebGLFallback.vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const initError = ref<string | null>(null);
const store = useSceneStore();
let controller: TypoSceneController | null = null;

onMounted(async () => {
  await nextTick();
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

  const canvas = canvasRef.value;
  if (!canvas) {
    initError.value = 'Canvas не найден. Обновите страницу.';
    store.setSceneReady(true);
    return;
  }

  store.setSceneReady(false);
  store.setLoadProgress(0);

  try {
    const { TypoSceneController } = await import('../three/TypoSceneController');
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
    console.error('TypoScene init failed:', error);
    initError.value =
      '3D-рендер не инициализировался. Попробуйте обновить страницу или открыть демо в другом браузере.';
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
</script>

<template>
  <canvas
    ref="canvasRef"
    class="scene-canvas"
    aria-label="Интерактивная 3D-сцена TypoScape"
  />
  <WebGLFallback v-if="initError" :message="initError" />
</template>

<style scoped>
.scene-canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
}
</style>

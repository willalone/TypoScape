<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useSceneStore } from '../stores/sceneStore';
import { TypoSceneController } from '../three/TypoSceneController';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const store = useSceneStore();
let controller: TypoSceneController | null = null;

onMounted(() => {
  if (!canvasRef.value) return;

  store.setSceneReady(false);
  store.setLoadProgress(0);

  controller = TypoSceneController.create(canvasRef.value, {
    onHoverChange: (char) => store.setHoveredLetter(char),
    onLetterClick: () => undefined,
    onLoadProgress: (progress) => store.setLoadProgress(progress),
    onLoadComplete: () => store.setSceneReady(true),
    onWebGLFailed: () => store.setWebglSupported(false),
  });

  controller?.setAutoRotate(store.autoRotate);
});

watch(
  () => store.autoRotate,
  (enabled) => {
    controller?.setAutoRotate(enabled);
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
    :class="{ 'scene-canvas--ready': store.isSceneReady }"
    aria-label="Интерактивная 3D-сцена TypoScape"
  />
</template>

<style scoped>
.scene-canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
  opacity: 0;
  transition: opacity 1.1s cubic-bezier(0.22, 1, 0.36, 1);
}

.scene-canvas--ready {
  opacity: 1;
}
</style>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useSceneStore } from '../stores/sceneStore';
import { TypoSceneController } from '../three/TypoSceneController';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const store = useSceneStore();
let controller: TypoSceneController | null = null;

onMounted(async () => {
  await nextTick();
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

  if (!canvasRef.value) return;

  controller = new TypoSceneController(canvasRef.value, {
    onHoverChange: (char) => store.setHoveredLetter(char),
    onLetterClick: () => undefined,
  });

  controller.setAutoRotate(store.autoRotate);
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
    aria-label="Интерактивная 3D-сцена TypoScape"
  />
</template>

<style scoped>
.scene-canvas {
  display: block;
  width: 100%;
  height: 100%;
  touch-action: none;
}
</style>

<!--
  TypoScape — WebGL canvas.
  GitHub UI иногда не отображает Vue SFC
  Этот файл является тонкой оберткой. Вся логика вынесена в .ts модули.: логика в src/components/useTypoScene.ts
  Raw: https://github.com/willalone/TypoScape/blob/main/src/components/useTypoScene.ts
-->
<script lang="ts">
export default {
  name: 'TypoSceneView',
};
</script>

<script setup lang="ts">
import { ref } from 'vue';
import StaticPreview from './StaticPreview.vue';
import { useTypoScene } from './useTypoScene';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const { showStaticPreview } = useTypoScene(canvasRef);
</script>

<template>
  <StaticPreview v-if="showStaticPreview" />
  <canvas
    v-show="!showStaticPreview"
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

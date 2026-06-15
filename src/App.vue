<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import AppOverlay from './components/AppOverlay.vue';
import LoadingOverlay from './components/LoadingOverlay.vue';
import TypoScene from './components/TypoScene.vue';
import WebGLFallback from './components/WebGLFallback.vue';
import { useSceneStore } from './stores/sceneStore';
import { isWebGLAvailable } from './utils/webgl';

const store = useSceneStore();

function handleKeydown(event: KeyboardEvent): void {
  if (event.code === 'Space' && event.target === document.body) {
    event.preventDefault();
    store.toggleAutoRotate();
  }
}

onMounted(() => {
  store.setSceneReady(false);
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="app-shell">
    <WebGLFallback v-if="!isWebGLAvailable()" />
    <template v-else>
      <TypoScene />
      <LoadingOverlay />
      <AppOverlay />
    </template>
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

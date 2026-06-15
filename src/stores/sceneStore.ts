import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useSceneStore = defineStore('scene', () => {
  const autoRotate = ref(true);
  const hoveredLetter = ref<string | null>(null);
  const webglSupported = ref(true);
  const resetCameraNonce = ref(0);
  const loadProgress = ref(0);
  const isSceneReady = ref(false);

  const isLoading = computed(() => !isSceneReady.value);

  function toggleAutoRotate() {
    autoRotate.value = !autoRotate.value;
  }

  function setHoveredLetter(char: string | null) {
    hoveredLetter.value = char;
  }

  function setWebglSupported(supported: boolean) {
    webglSupported.value = supported;
  }

  function requestCameraReset() {
    resetCameraNonce.value += 1;
  }

  function setLoadProgress(progress: number) {
    loadProgress.value = Math.min(1, Math.max(0, progress));
  }

  function setSceneReady(ready: boolean) {
    isSceneReady.value = ready;
    if (ready) loadProgress.value = 1;
  }

  return {
    autoRotate,
    hoveredLetter,
    webglSupported,
    resetCameraNonce,
    loadProgress,
    isSceneReady,
    isLoading,
    toggleAutoRotate,
    setHoveredLetter,
    setWebglSupported,
    requestCameraReset,
    setLoadProgress,
    setSceneReady,
  };
});

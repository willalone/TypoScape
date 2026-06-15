import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useSceneStore = defineStore('scene', () => {
  const autoRotate = ref(false);
  const hoveredLetter = ref<string | null>(null);
  const clickedLetter = ref<string | null>(null);
  const resetCameraNonce = ref(0);
  const loadProgress = ref(0);
  const isSceneReady = ref(false);
  const soundEnabled = ref(true);

  const isLoading = computed(() => !isSceneReady.value);

  function toggleAutoRotate() {
    autoRotate.value = !autoRotate.value;
  }

  function toggleSound() {
    soundEnabled.value = !soundEnabled.value;
  }

  function setHoveredLetter(char: string | null) {
    hoveredLetter.value = char;
  }

  function setClickedLetter(char: string | null) {
    clickedLetter.value = char;
    if (char) {
      window.setTimeout(() => {
        if (clickedLetter.value === char) {
          clickedLetter.value = null;
        }
      }, 2400);
    }
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
    clickedLetter,
    resetCameraNonce,
    loadProgress,
    isSceneReady,
    isLoading,
    soundEnabled,
    toggleAutoRotate,
    toggleSound,
    setHoveredLetter,
    setClickedLetter,
    requestCameraReset,
    setLoadProgress,
    setSceneReady,
  };
});

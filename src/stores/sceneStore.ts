import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSceneStore = defineStore('scene', () => {
  const autoRotate = ref(true);
  const hoveredLetter = ref<string | null>(null);
  const webglSupported = ref(true);
  const resetCameraNonce = ref(0);

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

  return {
    autoRotate,
    hoveredLetter,
    webglSupported,
    resetCameraNonce,
    toggleAutoRotate,
    setHoveredLetter,
    setWebglSupported,
    requestCameraReset,
  };
});

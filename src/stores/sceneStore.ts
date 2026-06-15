import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSceneStore = defineStore('scene', () => {
  const autoRotate = ref(true);
  const hoveredLetter = ref<string | null>(null);
  const resetCameraNonce = ref(0);

  function toggleAutoRotate() {
    autoRotate.value = !autoRotate.value;
  }

  function setHoveredLetter(char: string | null) {
    hoveredLetter.value = char;
  }

  function requestCameraReset() {
    resetCameraNonce.value += 1;
  }

  return {
    autoRotate,
    hoveredLetter,
    resetCameraNonce,
    toggleAutoRotate,
    setHoveredLetter,
    requestCameraReset,
  };
});

import { onMounted, onUnmounted } from 'vue';
import { useSceneStore } from '../stores/sceneStore';

/** Корневая логика приложения (вынесена из App.vue для читаемости в GitHub). */
export function useAppShell(): void {
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
}

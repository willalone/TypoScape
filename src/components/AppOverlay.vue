<script setup lang="ts">
import { useSceneStore } from '../stores/sceneStore';

const store = useSceneStore();
</script>

<template>
  <header class="overlay">
    <div class="overlay__brand">
      <p class="overlay__eyebrow">interactive typography</p>
      <h1 class="overlay__title">TypoScape</h1>
      <p class="overlay__desc">
        Типографика как объект. Наведи — подсветка. Кликни — движение.
      </p>
    </div>

    <div class="overlay__actions">
      <button
        type="button"
        class="overlay__btn"
        @click="store.requestCameraReset()"
      >
        Сбросить камеру
      </button>
      <button
        type="button"
        class="overlay__btn overlay__btn--ghost"
        :class="{ 'overlay__btn--active': store.autoRotate }"
        @click="store.toggleAutoRotate()"
      >
        Авто-вращение
        <kbd>Space</kbd>
      </button>
    </div>

    <Transition name="hint">
      <p v-if="store.hoveredLetter" class="overlay__hint">
        {{ store.hoveredLetter }}
      </p>
    </Transition>
  </header>
</template>

<style scoped>
.overlay {
  position: fixed;
  top: clamp(1rem, 2.5vw, 2rem);
  left: clamp(1rem, 2.5vw, 2rem);
  z-index: 10;
  max-width: min(22rem, 38vw);
  pointer-events: none;
  color: #f2ece3;
  font-family: 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif;
  opacity: 0;
  transition: opacity 1s cubic-bezier(0.22, 1, 0.36, 1) 0.4s;
}

:global(.app-shell:has(.scene-canvas--ready)) .overlay {
  opacity: 1;
}

.overlay__brand {
  margin-bottom: 1.25rem;
}

.overlay__eyebrow {
  margin: 0 0 0.35rem;
  font-family: 'SF Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #e8a87c;
  opacity: 0.9;
}

.overlay__title {
  margin: 0;
  font-size: clamp(1.75rem, 3vw, 2.4rem);
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1;
}

.overlay__desc {
  margin: 0.65rem 0 0;
  font-size: 0.92rem;
  line-height: 1.45;
  color: rgba(242, 236, 227, 0.62);
}

.overlay__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  pointer-events: auto;
}

.overlay__btn {
  appearance: none;
  border: 1px solid rgba(232, 168, 124, 0.35);
  border-radius: 999px;
  padding: 0.5rem 0.95rem;
  background: rgba(8, 11, 18, 0.55);
  backdrop-filter: blur(12px);
  color: #f2ece3;
  font-family: 'SF Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    transform 0.2s ease;
}

.overlay__btn:hover {
  border-color: rgba(255, 92, 58, 0.7);
  background: rgba(255, 92, 58, 0.12);
  transform: translateY(-1px);
}

.overlay__btn--ghost {
  border-color: rgba(242, 236, 227, 0.15);
}

.overlay__btn--active {
  border-color: rgba(232, 168, 124, 0.8);
  color: #e8a87c;
}

.overlay__btn kbd {
  margin-left: 0.45rem;
  padding: 0.1rem 0.35rem;
  border-radius: 0.25rem;
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.65rem;
}

.overlay__hint {
  position: fixed;
  bottom: clamp(1.5rem, 4vw, 3rem);
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 0.45rem 1.1rem;
  border-radius: 999px;
  background: rgba(8, 11, 18, 0.72);
  border: 1px solid rgba(255, 92, 58, 0.45);
  font-family: 'SF Mono', 'Fira Code', ui-monospace, monospace;
  font-size: 1.4rem;
  letter-spacing: 0.35em;
  color: #ff6b4a;
  pointer-events: none;
}

.hint-enter-active,
.hint-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.hint-enter-from,
.hint-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(8px);
}
</style>

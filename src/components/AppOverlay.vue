<script setup lang="ts">
import { LETTER_INFO } from '../constants/letterMeta';
import { useSceneStore } from '../stores/sceneStore';

const store = useSceneStore();
</script>

<template>
  <header class="overlay">
    <div class="overlay__brand">
      <p class="overlay__eyebrow">interactive typography</p>
      <h1 class="overlay__title">TypoScape</h1>
      <p class="overlay__desc">
        Слово TYPO — объект. Наведи на букву. Кликни — она оживёт.
      </p>
    </div>

    <div class="overlay__actions">
      <button type="button" class="overlay__btn" @click="store.requestCameraReset()">
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
      <button
        type="button"
        class="overlay__btn overlay__btn--ghost"
        :class="{ 'overlay__btn--active': store.soundEnabled }"
        @click="store.toggleSound()"
      >
        Звук
      </button>
    </div>

    <Transition name="hint">
      <p v-if="store.hoveredLetter && !store.clickedLetter" class="overlay__hint">
        {{ store.hoveredLetter }}
      </p>
    </Transition>

    <Transition name="card">
      <article v-if="store.clickedLetter" class="overlay__card">
        <p class="overlay__card-char">{{ store.clickedLetter }}</p>
        <p class="overlay__card-role">
          {{ LETTER_INFO[store.clickedLetter]?.role }}
        </p>
        <p class="overlay__card-weight">
          Вес в слове: {{ LETTER_INFO[store.clickedLetter]?.weight }}
        </p>
      </article>
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
  font-family: Georgia, 'Times New Roman', serif;
}

.overlay__brand {
  margin-bottom: 1.25rem;
}

.overlay__eyebrow {
  margin: 0 0 0.35rem;
  font-family: ui-monospace, monospace;
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #ffb050;
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
  position: relative;
  border: 1px solid rgba(255, 176, 80, 0.35);
  border-radius: 999px;
  padding: 0.52rem 1rem;
  background: rgba(2, 4, 8, 0.72);
  backdrop-filter: blur(14px);
  color: #f2ece3;
  font-family: ui-monospace, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 0 0 0 rgba(255, 176, 80, 0);
  transition:
    border-color 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    color 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}

.overlay__btn::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(255, 176, 80, 0.35), rgba(255, 107, 42, 0.1));
  opacity: 0;
  transition: opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
  z-index: -1;
}

.overlay__btn:hover {
  border-color: rgba(255, 176, 80, 0.65);
  background: rgba(255, 176, 80, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 107, 42, 0.18);
}

.overlay__btn:hover::before {
  opacity: 1;
}

.overlay__btn:active {
  transform: translateY(0) scale(0.97);
  transition-duration: 0.12s;
}

.overlay__btn--ghost {
  border-color: rgba(242, 236, 227, 0.18);
  background: rgba(2, 4, 8, 0.55);
}

.overlay__btn--ghost:hover {
  border-color: rgba(242, 236, 227, 0.35);
  background: rgba(242, 236, 227, 0.06);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.overlay__btn--active {
  border-color: rgba(255, 176, 80, 0.9);
  color: #ffd080;
  background: rgba(255, 176, 80, 0.14);
  box-shadow:
    0 0 0 1px rgba(255, 176, 80, 0.25),
    0 8px 28px rgba(255, 144, 64, 0.22);
}

.overlay__btn--active::before {
  opacity: 1;
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
  padding: 0.5rem 1.25rem;
  border-radius: 999px;
  background: rgba(2, 4, 8, 0.82);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 107, 42, 0.5);
  box-shadow: 0 12px 40px rgba(255, 107, 42, 0.15);
  font-family: ui-monospace, monospace;
  font-size: 1.4rem;
  letter-spacing: 0.35em;
  color: #ff9040;
  pointer-events: none;
}

.overlay__card {
  position: fixed;
  bottom: clamp(1.5rem, 4vw, 3rem);
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  padding: 1rem 1.5rem;
  border-radius: 0.85rem;
  background: rgba(2, 4, 8, 0.88);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 176, 80, 0.45);
  box-shadow:
    0 0 0 1px rgba(255, 176, 80, 0.12),
    0 20px 50px rgba(0, 0, 0, 0.45);
  text-align: center;
  pointer-events: none;
  min-width: 12rem;
}

.overlay__card-char {
  margin: 0;
  font-family: ui-monospace, monospace;
  font-size: 2rem;
  letter-spacing: 0.2em;
  color: #ffb050;
}

.overlay__card-role {
  margin: 0.35rem 0 0;
  font-size: 0.88rem;
  color: rgba(242, 236, 227, 0.75);
}

.overlay__card-weight {
  margin: 0.25rem 0 0;
  font-family: ui-monospace, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
  color: rgba(255, 176, 80, 0.65);
}

.hint-enter-active,
.hint-leave-active,
.card-enter-active,
.card-leave-active {
  transition:
    opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.hint-enter-from,
.hint-leave-to,
.card-enter-from,
.card-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(12px) scale(0.96);
}
</style>

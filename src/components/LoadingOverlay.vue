<script setup lang="ts">
import { useSceneStore } from '../stores/sceneStore';

const store = useSceneStore();
</script>

<template>
  <Transition name="loader">
    <div v-if="store.isLoading" class="loader" role="status" aria-live="polite">
      <div class="loader__inner">
        <p class="loader__word">TYPO</p>
        <div class="loader__track">
          <div
            class="loader__bar"
            :style="{ transform: `scaleX(${store.loadProgress})` }"
          />
        </div>
        <p class="loader__percent">{{ Math.round(store.loadProgress * 100) }}%</p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: grid;
  place-items: center;
  background: #020408;
}

.loader__inner {
  width: min(14rem, 72vw);
  text-align: center;
}

.loader__word {
  margin: 0 0 1.25rem;
  font-family: Georgia, serif;
  font-size: 1.1rem;
  letter-spacing: 0.55em;
  color: #ffb050;
  text-indent: 0.55em;
}

.loader__track {
  height: 2px;
  background: rgba(255, 176, 80, 0.15);
  overflow: hidden;
  border-radius: 1px;
}

.loader__bar {
  height: 100%;
  background: linear-gradient(90deg, #ff9040, #ffd080);
  transform-origin: left center;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  box-shadow: 0 0 12px rgba(255, 144, 64, 0.6);
}

.loader__percent {
  margin: 0.65rem 0 0;
  font-family: ui-monospace, monospace;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  color: rgba(255, 208, 128, 0.5);
}

.loader-enter-active,
.loader-leave-active {
  transition: opacity 0.6s ease;
}

.loader-enter-from,
.loader-leave-to {
  opacity: 0;
}
</style>

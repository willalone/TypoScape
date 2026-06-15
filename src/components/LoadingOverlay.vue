<script setup lang="ts">
import { useSceneStore } from '../stores/sceneStore';

const store = useSceneStore();
</script>

<template>
  <Transition name="loader">
    <div v-if="store.isLoading" class="loader" role="status" aria-live="polite">
      <div class="loader__inner">
        <p class="loader__label">TypoScape</p>
        <div class="loader__track">
          <div
            class="loader__bar"
            :style="{ transform: `scaleX(${store.loadProgress})` }"
          />
        </div>
        <p class="loader__percent">
          {{ Math.round(store.loadProgress * 100) }}%
        </p>
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
  background: #05070d;
  color: #f0ebe3;
}

.loader__inner {
  width: min(16rem, 70vw);
  text-align: center;
}

.loader__label {
  margin: 0 0 1.5rem;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.5rem;
  letter-spacing: 0.08em;
  font-weight: 400;
}

.loader__track {
  height: 1px;
  background: rgba(240, 235, 227, 0.12);
  overflow: hidden;
}

.loader__bar {
  height: 100%;
  background: linear-gradient(90deg, #e8a87c, #ff6b45);
  transform-origin: left center;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.loader__percent {
  margin: 0.75rem 0 0;
  font-family: ui-monospace, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: rgba(240, 235, 227, 0.45);
}

.loader-enter-active,
.loader-leave-active {
  transition: opacity 0.7s ease;
}

.loader-enter-from,
.loader-leave-to {
  opacity: 0;
}
</style>

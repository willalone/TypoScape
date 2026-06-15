<script setup lang="ts">
defineProps<{
  message?: string;
}>();

const previewSrc = `${import.meta.env.BASE_URL}docs/preview.svg`;

function reloadPage(): void {
  window.location.reload();
}
</script>

<template>
  <section class="fallback">
    <div class="fallback__card">
      <img
        class="fallback__preview"
        :src="previewSrc"
        width="320"
        height="178"
        alt="TypoScape preview"
      />
      <p class="fallback__label">TypoScape</p>
      <h1>Сцена не запустилась</h1>
      <p>
        {{
          message ??
          'Не удалось инициализировать 3D-рендер. Обновите страницу или откройте демо в Chrome / Firefox / Safari.'
        }}
      </p>
      <button type="button" class="fallback__btn" @click="reloadPage()">
        Обновить страницу
      </button>
      <p class="fallback__hint">
        Также проверьте, что JavaScript и аппаратное ускорение включены.
      </p>
    </div>
  </section>
</template>

<style scoped>
.fallback {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
  background: #020408;
  color: #f2ece3;
}

.fallback__card {
  max-width: 28rem;
  padding: 2rem;
  border: 1px solid rgba(255, 176, 80, 0.25);
  border-radius: 1rem;
  background: rgba(8, 10, 18, 0.9);
  text-align: center;
}

.fallback__preview {
  width: min(18rem, 72vw);
  margin: 0 auto 1rem;
  opacity: 0.92;
}

.fallback__label {
  margin: 0 0 0.5rem;
  font-family: ui-monospace, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #ffb050;
}

h1 {
  margin: 0 0 0.75rem;
  font-size: 1.35rem;
  font-weight: 500;
}

p {
  margin: 0;
  line-height: 1.6;
  color: rgba(242, 236, 227, 0.7);
}

.fallback__btn {
  margin-top: 1.25rem;
  padding: 0.55rem 1.1rem;
  border: 1px solid rgba(255, 176, 80, 0.45);
  border-radius: 999px;
  background: rgba(255, 176, 80, 0.12);
  color: #ffd080;
  cursor: pointer;
}

.fallback__btn:hover {
  background: rgba(255, 176, 80, 0.22);
}

.fallback__hint {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: rgba(242, 236, 227, 0.45);
}
</style>

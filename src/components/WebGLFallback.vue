<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>

<template>
  <section class="fallback">
    <div class="fallback__card">
      <p class="fallback__label">TypoScape</p>
      <h1>WebGL недоступен</h1>
      <p>
        {{
          message ??
          'Ваш браузер не поддерживает WebGL. Попробуйте обновить браузер или включить аппаратное ускорение.'
        }}
      </p>
      <p class="fallback__hint">
        Откройте проект в Chrome, Firefox или Safari с поддержкой WebGL.
      </p>
    </div>
  </section>
</template>

<style scoped>
.fallback {
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
  font-size: 1.5rem;
  font-weight: 500;
}

p {
  margin: 0;
  line-height: 1.6;
  color: rgba(242, 236, 227, 0.7);
}

.fallback__hint {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: rgba(242, 236, 227, 0.45);
}
</style>

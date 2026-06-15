<script setup lang="ts">
const previewSrc = `${import.meta.env.BASE_URL}docs/preview.svg`;
</script>

<template>
  <section class="preview" aria-label="Статическое превью TypoScape">
    <img
      class="preview__image"
      :src="previewSrc"
      width="480"
      height="267"
      alt="TypoScape — интерактивная 3D-типографика TYPO"
    />
    <p class="preview__title">TypoScape</p>
    <p class="preview__note">
      Статическое превью. Для интерактивной 3D-сцены откройте демо в Chrome, Firefox или Safari
      с включённым WebGL.
    </p>
  </section>
</template>

<style scoped>
.preview {
  position: fixed;
  inset: 0;
  z-index: 5;
  display: grid;
  place-items: center;
  padding: 2rem;
  background: radial-gradient(circle at 50% 30%, #0a1020 0%, #020408 70%);
  text-align: center;
  color: #f2ece3;
}

.preview__image {
  width: min(28rem, 86vw);
  margin-bottom: 1.25rem;
  border-radius: 0.75rem;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
}

.preview__title {
  margin: 0 0 0.5rem;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1.5rem;
  letter-spacing: 0.08em;
  color: #ffb050;
}

.preview__note {
  max-width: 26rem;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.55;
  color: rgba(242, 236, 227, 0.65);
}
</style>

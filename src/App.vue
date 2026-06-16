<!--
  TypoScape — корневой layout.
  GitHub UI иногда не отображает Vue SFC
  Этот файл является тонкой оберткой. Вся логика вынесена в .ts модули.: логика в src/app/useAppShell.ts
  Raw: https://github.com/willalone/TypoScape/blob/main/src/app/useAppShell.ts
-->
<script lang="ts">
export default {
  name: 'AppRoot',
};
</script>

<script setup lang="ts">
import { useAppShell } from './app/useAppShell';
import AppOverlay from './components/AppOverlay.vue';
import LoadingOverlay from './components/LoadingOverlay.vue';
import TypoScene from './components/TypoScene.vue';

useAppShell();
</script>

<template>
  <div class="app-shell">
    <TypoScene />
    <LoadingOverlay />
    <AppOverlay />
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

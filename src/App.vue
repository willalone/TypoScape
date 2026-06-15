<!-- TypoScape: корневой layout. Логика — src/app/useAppShell.ts -->
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

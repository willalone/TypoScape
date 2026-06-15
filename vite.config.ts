import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const base = process.env.GITHUB_PAGES === 'true' ? '/TypoScape/' : '/';

export default defineConfig({
  base,
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap')) return 'gsap';
        },
      },
    },
  },
});

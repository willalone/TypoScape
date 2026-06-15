import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const base = process.env.GITHUB_PAGES === 'true' ? '/TypoScape/' : '/';

export default defineConfig({
  base,
  plugins: [vue()],
});

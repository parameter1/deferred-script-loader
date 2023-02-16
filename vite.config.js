/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: ['chrome64', 'edge79', 'safari11.1', 'firefox67', 'opera51', 'ios12'],
  },
});

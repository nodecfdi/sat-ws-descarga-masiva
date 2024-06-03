import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./index.ts'],
  outDir: './dist',
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  target: 'esnext',
});

import { defineConfig } from 'vite';

// Salida ESM al CDN estático del manual:  /cdn/v1/gob.js  y  /cdn/v1/components/<componente>.js
export default defineConfig({
  build: {
    outDir: '../../cdn/v1',
    emptyOutDir: false,
    target: 'es2022',
    sourcemap: false,
    minify: 'esbuild',
    lib: {
      entry: {
        gob: 'src/index.ts',
        'components/gob-mapa-magdalena': 'src/gob-mapa-magdalena.ts',
      },
      formats: ['es'],
    },
    rollupOptions: { output: { entryFileNames: '[name].js', chunkFileNames: 'chunks/[name]-[hash].js' } },
  },
});

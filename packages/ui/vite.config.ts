import { defineConfig } from 'vite';

// Salida ESM al CDN estático del manual:  /cdn/v1/gob.js  y  /cdn/v1/components/<componente>.js
export default defineConfig({
  define: { 'process.env.NODE_ENV': '"production"' },
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
        'components/gob-grafica': 'src/gob-grafica.ts',
        'components/gob-tabla': 'src/gob-tabla.ts',
        'components/gob-mensajes': 'src/gob-mensajes.ts',
        'components/gob-kpi': 'src/gob-kpi.ts',
        'components/gob-pestanas': 'src/gob-pestanas.ts',
        'components/gob-flujo': 'src/gob-flujo.ts',
        'components/gob-campos': 'src/gob-campos.ts',
        'components/gob-contenido': 'src/gob-contenido.ts',
        'components/gob-icono': 'src/gob-icono.ts',
        'components/gob-dashboard': 'src/gob-dashboard.ts',
      },
      formats: ['es'],
    },
    rollupOptions: { output: { entryFileNames: '[name].js', chunkFileNames: 'chunks/[name]-[hash].js' } },
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' faz o app funcionar em qualquer subpasta (ex.: usuario.github.io/poupi/).
export default defineConfig({
  base: './',
  plugins: [react()],
  test: { environment: 'node' },
});

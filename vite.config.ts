import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/gestor',
  plugins: [react()],
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, 'libs/utils'),
      '@domain': path.resolve(__dirname, 'libs/domain/src/lib'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@service': path.resolve(__dirname, 'src/service'),
      '@context': path.resolve(__dirname, 'src/context'),
    }
  }
});

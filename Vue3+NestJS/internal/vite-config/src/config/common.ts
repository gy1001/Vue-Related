import UnoCSS from 'unocss/vite';
import { type UserConfig } from 'vite';

const commonConfig: (mode: string) => UserConfig = (mode) => ({
  server: {
    host: true,
  },
  esbuild: {
    // 'console', 'debugger'
    drop: mode === 'production' ? [] : [],
  },
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      // TODO: Prevent memory overflow
      maxParallelFileOps: 3,
    },
  },
  plugins: [UnoCSS()],
});

export { commonConfig };

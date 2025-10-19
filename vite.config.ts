import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/stack-vue-test/' : '/',
  plugins: [
    vue(),
    tsconfigPaths(),
    Components({
      dirs: ['src/shared/ui'],
      dts: 'src/global-components.d.ts',
      directoryAsNamespace: false,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
                        @use '@app/assets/styles/helpers' as *;
                        @use '@app/assets/styles/utils' as *;
        `,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@app': resolve(__dirname, './src/app'),
      '@entities': resolve(__dirname, './src/entities'),
      '@features': resolve(__dirname, './src/features'),
      '@shared': resolve(__dirname, './src/shared'),
      '@views': resolve(__dirname, './src/views'),
      '@widgets': resolve(__dirname, './src/widgets'),
    },
  },
}));

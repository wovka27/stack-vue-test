import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths';
import Components from 'unplugin-vue-components/vite';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tsconfigPaths(),
    Components({
      dirs: ['src/shared/ui'],
      dts: 'src/global-components.d.ts',
      directoryAsNamespace: false,
    }),],
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
})

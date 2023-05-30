import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Inspect from 'vite-plugin-inspect';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      dirs: ['plugins/**'],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon',
        }),
      ],
      imports: ['vue'],
    }),
    Components({
      dirs: ['src/components', 'public'],
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({
          enabledCollections: ['ep'],
        }),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
    Inspect(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      scss: {},
    },
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8081,
    https: false,
    proxy: {
      '/chat-api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/chat-api/, '/api'),
      },
    },
  },
});

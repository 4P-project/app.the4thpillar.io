// https://nuxt.com/docs/api/configuration/nuxt-config
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  extends: ['@shuriken-ui/nuxt'],
  modules: ['@use-wagmi/nuxt', '@nuxt/image', '@pinia/nuxt'],

  css: [
    '@fontsource-variable/space-grotesk/index.css',
    '@fontsource-variable/karla/index.css',
    'vue-toastification/dist/index.css',
  ],

  runtimeConfig: {
    public: {
      walletConnectId: process.env.WALLET_CONNECT_ID,
      mailAppId: process.env.MAIL_APP_ID,
      chatAppId: process.env.CHAT_APP_ID,
      pollinationX: {
        url: process.env.POLLINATIONX_URL,
        token: process.env.POLLINATIONX_TOKEN,
      },
    },
  },

  vite: {
    resolve: {
      alias: {
        process: 'process/browser',
        util: 'util',
        stream: 'stream-browserify',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
        define: {
          global: 'globalThis',
        },
        plugins: [
          NodeGlobalsPolyfillPlugin({
            process: true,
            buffer: true,
          }),
          NodeModulesPolyfillPlugin(),
        ],
      },
    },
  },

  compatibilityDate: '2024-09-17',
});

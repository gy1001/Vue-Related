import { defineConfig } from 'vite'
import pluginVue from '@vitejs/plugin-vue'
import legacyPlugin from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    pluginVue(),
    legacyPlugin({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})

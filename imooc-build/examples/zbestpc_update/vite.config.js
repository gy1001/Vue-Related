/* eslint-disable */
import legacyPlugin from '@vitejs/plugin-legacy'
import vuePlugin from '@vitejs/plugin-vue'
import inject from '@rollup/plugin-inject'
import { createHtmlPlugin } from 'vite-plugin-html'
// @see https://cn.vitejs.dev/config/
export default ({ command, mode }) => {
  let rollupOptions = {}

  let optimizeDeps = {}

  let alias = {}

  let proxy = {}

  // todo 替换为原有变量
  let define = {
    'process.env.NODE_ENV':
      command === 'serve' ? '"development"' : '"production"',
  }

  let esbuild = {}

  return {
    base: './', // index.html文件所在位置
    root: './', // js导入的资源路径，src
    resolve: {
      alias,
    },
    define: define,
    server: {
      // 代理
      proxy,
    },
    build: {
      target: 'es2015',
      minify: 'terser', // 是否进行压缩,boolean | 'terser' | 'esbuild',默认使用terser
      manifest: false, // 是否产出maifest.json
      sourcemap: false, // 是否产出soucemap.json
      outDir: 'dist', // 产出目录
      rollupOptions,
    },
    esbuild,
    optimizeDeps,
    plugins: [
      legacyPlugin({
        targets: [
          'Android > 39',
          'Chrome >= 60',
          'Safari >= 10.1',
          'iOS >= 10.3',
          'Firefox >= 54',
          'Edge >= 15',
        ],
      }),
      vuePlugin(),
      inject({
        $: 'jquery',
        jQuery: 'jquery',
      }),
      createHtmlPlugin({
        entry: 'src/index.js',
        filname: 'index.html',
        // template: 'public/index.html',
        template: 'index-vite.html',
      }),
    ],
    css: {
      preprocessorOptions: {
        less: {
          // 支持内联 JavaScript
          javascriptEnabled: true,
        },
      },
    },
  }
}

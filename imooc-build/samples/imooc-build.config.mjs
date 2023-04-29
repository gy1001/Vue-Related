const entry = 'src/index.js'
import path from 'path'
export default {
  entry: path.isAbsolute(entry) ? entry : path.resolve(entry),
  plugins: function () {
    return [
      'imooc-build-test',
      [
        'imooc-build-test-two',
        {
          a: 1,
          b: 2,
        },
      ],
      './plugins/imooc-build-plugin-one.js',
      [
        './plugins/imooc-build-plugin-one.js',
        {
          a: 1,
          b: 2,
          c: 3,
        },
      ],
      function pluginInner(api, params) {
        const { getValue, emitHooks, log } = api
        const value = getValue('name')
        log.verbose(JSON.stringify(value))
        emitHooks('pluginHook')
      },
    ]
  },
  hooks: [
    [
      'start',
      function () {
        console.log('start')
      },
    ],
    [
      'pluginHook',
      ({ log, webpackConfig }) => {
        log.warn('this is plugin hook')
        log.info('pluginHook', webpackConfig.toConfig())
      },
    ],
  ],
}

// module.exports = {
//   entry: path.isAbsolute(entry) ? entry : path.resolve(entry),
//   plugins: [],
// }

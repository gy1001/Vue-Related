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
      function pluginInner() {
        console.log('this is a plugin inner func')
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
  ],
}

// module.exports = {
//   entry: path.isAbsolute(entry) ? entry : path.resolve(entry),
//   plugins: [],
// }

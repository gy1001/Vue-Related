const entry = 'src/index.js'
import path from 'path'
export default {
  entry: path.isAbsolute(entry) ? entry : path.resolve(entry),
  plugins: [],
  hooks: [
    [
      'created',
      function () {
        console.log('created')
      },
    ],
    [
      'configResolved',
      function () {
        console.log('configResolved')
      },
    ],
  ],
  // output: path.resolve('dist'),
}

// module.exports = {
//   entry: path.isAbsolute(entry) ? entry : path.resolve(entry),
//   plugins: [],
// }

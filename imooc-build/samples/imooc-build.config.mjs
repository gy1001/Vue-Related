const entry = 'src/index.js'
import path from 'path'
export default {
  entry: path.isAbsolute(entry) ? entry : path.resolve(entry),
  plugins: [],
  hooks: [
    [
      'start',
      function () {
        console.log('start')
      },
    ],
    [
      'configResolved',
      function () {
        console.log('configResolved')
      },
    ],
  ],
}

// module.exports = {
//   entry: path.isAbsolute(entry) ? entry : path.resolve(entry),
//   plugins: [],
// }

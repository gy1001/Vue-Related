const entry = 'src/index.js'
import path from 'path'
export default {
  entry: path.isAbsolute(entry) ? entry : path.resolve(entry),
  plugins: [],
}

// module.exports = {
//   entry: path.isAbsolute(entry) ? entry : path.resolve(entry),
//   plugins: [],
// }

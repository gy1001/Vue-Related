const fs = require('fs')
// console.log(fs.constants.S_IFLNK) // 40960
// console.log(fs.constants.S_IFREG) // 32768
// console.log(fs.constants.S_IFDIR) // 16384
module.exports = function getFileType(mode) {
  const isDirectory = (mode & fs.constants.S_IFDIR) === fs.constants.S_IFDIR
  const isFile = (mode & fs.constants.S_IFREG) === fs.constants.S_IFREG
  const isLink = (mode & fs.constants.S_IFLNK) === fs.constants.S_IFLNK

  if (isDirectory) {
    return 'd'
  } else if (isLink) {
    return 'l'
  } else if (isFile) {
    return '-'
  } else {
    return '-'
  }
}

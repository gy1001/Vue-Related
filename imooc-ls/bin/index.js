#!/usr/bin/env node
const parse = require('./parseArgs.js')
const auth = require('./auth.js')
const getFileType = require('./getFileType.js')
const getFileUser = require('./getFileUser.js')
const getFileSizeAndDate = require('./getFileSizeAndDate.js')
const { args, isAll, isList } = parse()
const fs = require('fs')
const dir = process.cwd()
let output = ''
let files = fs.readdirSync(dir)
if (!isAll) {
  files = files.filter((file) => file.indexOf('.') > 0)
}
if (!isList) {
  files.forEach((file) => (output += file + '              '))
} else {
  files.forEach((file, index) => {
    const stat = fs.statSync(file)
    const isDirectory = stat.isDirectory(file)
    let size = 1
    if (isDirectory) {
      const subDir = fs.readdirSync(file)
      size = subDir.length
    }
    const mode = stat.mode
    const authString = auth(mode)
    const fileType = getFileType(mode)
    const fileUser = getFileUser(stat)
    const fileSizeAndDate = getFileSizeAndDate(stat)
    output +=
      fileType +
      authString +
      ' ' +
      size +
      ' ' +
      fileUser +
      '\t' +
      fileSizeAndDate +
      '\t' +
      file +
      (index === files.length - 1 ? '' : '\n')
  })
}

console.log(output)

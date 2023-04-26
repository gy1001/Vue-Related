const fs = require('fs')
// 这个函数根据 mode 获得 权限组
module.exports = function auth(mode) {
  let authString = ''
  // 先判断 user 的权限 r w x
  const canUsrRead = mode & fs.constants.S_IRUSR
  const canUsrWrite = mode & fs.constants.S_IWUSR
  const canUsrExecute = mode & fs.constants.S_IXUSR
  canUsrRead ? (authString += 'r') : (authString += '-')
  canUsrWrite ? (authString += 'w') : (authString += '-')
  canUsrExecute ? (authString += 'x') : (authString += '-')
  // 接着判断 group 的权限 r w x
  const canGroupRead = mode & fs.constants.S_IRGRP
  const canGroupWrite = mode & fs.constants.S_IWGRP
  const canGroupExecute = mode & fs.constants.S_IXGRP
  canGroupRead ? (authString += 'r') : (authString += '-')
  canGroupWrite ? (authString += 'w') : (authString += '-')
  canGroupExecute ? (authString += 'x') : (authString += '-')
  // 接着判断 other 的权限 r w x
  const canOtherRead = mode & fs.constants.S_IROTH
  const canOtherWrite = mode & fs.constants.S_IWOTH
  const canOtherExecute = mode & fs.constants.S_IXOTH
  canOtherRead ? (authString += 'r') : (authString += '-')
  canOtherWrite ? (authString += 'w') : (authString += '-')
  canOtherExecute ? (authString += 'x') : (authString += '-')
  return authString
}

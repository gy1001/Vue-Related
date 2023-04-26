const cp = require('child_process')

module.exports = function getFileUser(stat) {
  const { uid, gid } = stat
  const userName = cp
    .execSync('id -un ' + uid)
    .toString()
    .trim()
  const groupIdsStr = cp
    .execSync('id -G ' + uid)
    .toString()
    .trim()
  const groupIds = groupIdsStr.split(' ')
  const groupIdsNameStr = cp
    .execSync('id -Gn ' + uid)
    .toString()
    .trim()

  const groupIdsName = groupIdsNameStr.split(' ')
  const index = groupIds.findIndex((id) => +id === +gid)
  const groupName = groupIdsName[index]

  return userName + '\t' + groupName
}

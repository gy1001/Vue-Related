module.exports = function getFileSizeAndDate(stat) {
  const { mtime, size } = stat
  const mtimes = new Date(mtime)
  const month = mtimes.getMonth() + 1
  const date = mtimes.getDate()
  const hour = mtimes.getHours()
  const minute = mtimes.getMinutes()
  return size + '\t' + month + '月' + date + '日' + hour + ':' + minute
}

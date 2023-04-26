module.exports = function parse() {
  let isAll = false // 对应 -a
  let isList = false // 对应 -l
  const args = process.argv.slice(2)
  args.forEach((arg) => {
    if (arg.indexOf('a') >= 0) {
      isAll = true
    }

    if (arg.indexOf('l') >= 0) {
      isList = true
    }
  })
  return {
    args,
    isAll,
    isList,
  }
}

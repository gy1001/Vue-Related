/**
 * 处理数组，结合 renderTemplate 实现递归，
 * 注意：这里函数接受的参数是 token 而不是 tokens
 * token 就类似于一个简单的 ['#', "students", [ ...]] 中的 第 2 个索引的值
 *
 * @param {*} token  []
 * @param {*} array []
 */
function parseArray(token, array) {
  let htmlStr = ''
  array.forEach((item) => {
    htmlStr += renderTemplate(token, { ...item, '.': item })
  })
  return htmlStr
}

const renderTemplate = (tokens, data) => {
  let htmlStr = ''
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    switch (token[0]) {
      case 'text':
        htmlStr += token[1]
        break
      case 'name':
        // 这里存在多个 . 的情况，暂不处理
        htmlStr += lookUp(token[1], data)
        // htmlStr += data[token[1]]
        break
      case '#':
        // ['#',"students", [...]]
        htmlStr += parseArray(token[2], data[token[1]])
        break
      default:
        break
    }
  }
  return htmlStr
}

/**
 * 功能是可以在 dataObj 对象中，寻找用连续点符号的 keyName 属性
 * 比如 dataObj是 {a:{b:{c:100}}}
 * 那么 lookUp('a.b.c', dataObj) 结果就是100
 */
function lookUp(keyName, data) {
  if (keyName !== '.' && keyName.indexOf('.') !== -1) {
    let temp = data
    const keysArr = keyName.split('.')
    keysArr.forEach((key) => {
      temp = temp[key]
    })
    return temp
  }
  return data[keyName]
}

export default renderTemplate

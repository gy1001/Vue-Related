import nestTokens from './nestTokens'
import Scanner from './Scanner'

const parseTemplateToTokens = (templateStr) => {
  // 实例化一个扫描器，构造时候提供一个参数，这个参数就是模板字符串，
  // 也就是这个扫描器是针对这个模板字符串工作的
  const scanner = new Scanner(templateStr)
  const tokens = []
  let words
  // 当这个 scanner 没有到头时候
  while (!scanner.eos()) {
    words = scanner.scanUtil('{{')
    if (words) {
      tokens.push(['text', words])
    }
    // 过 双大括号
    scanner.scan('{{')
    words = scanner.scanUtil('}}')
    if (words) {
      // 这个words 存在首字符是 # 或者 / 或者都不是的情况,需要做特殊处理
      if (words.indexOf('#') === 0) {
        tokens.push(['#', words.slice(1)])
      } else if (words.indexOf('/') === 0) {
        tokens.push(['/', words.slice(1)])
      } else {
        tokens.push(['name', words])
      }
    }
    // 过 双大括号
    scanner.scan('}}')
  }
  return nestTokens(tokens)
}

export default parseTemplateToTokens

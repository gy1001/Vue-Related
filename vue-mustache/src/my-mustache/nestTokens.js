export default function nestTokens(tokens) {
  // 结果数组
  const nestTokens = []
  // 收集器，收集子元素或者孙元素等,天生指向 nestTokens 数组，引用类型值，所以指向的是同一个数组
  // 收集器的指向会发生变化。当遇见 # 时候，收集器会遇到 当前token 的下标为2的新数组，
  let collector = nestTokens
  // 栈结构，存放小tokens, 栈顶(靠近端口的，最新进入的)tokens数组中前操作的这个tokens小数组
  const sections = []
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    switch (token[0]) {
      case '#':
        // 收集器放入这个token
        collector.push(token)
        // 入栈
        sections.push(token)
        // 收集器要换人了, 给token 添加下标为2的项目，并让收集器指向它
        collector = token[2] = []
        break
      case '/':
        // 出栈 pop 会返回刚刚弹出的项
        sections.pop()
        // 改变收集器为栈结构队尾(队尾就是栈顶) 那项下标为2的数组
        collector =
          sections.length > 0 ? sections[sections.length - 1][2] : nestTokens
        break
      default:
        collector.push(token)
        break
    }
  }
  return nestTokens
}

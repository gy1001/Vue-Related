// 这里不处理 文本节点 的处理，如下
/**
 <div>
    <h3>你好</h3>
    我是文本节点 
    <ul>
      <li>A</li>
      <li>B</li>
      <li>C</li>
    </ul>
  </div>
* */
export default function parse(templateString) {
  // 指针
  let index = 0
  // 开始标记
  const startRegexp = /^\<([a-z]+[0-9]?)(\s[^\<]+)?\>/
  const endRegexp = /^\<\/([a-z]+[0-9]?)\>/
  // 因为它是在 跳过开始标签 、结束标签之后的文字进行匹配，只需要判断不是以 \< 开头即可，
  const wordRegexp = /^([^\<]+)\<\/([a-z]+[0-9]?)\>/
  const stack1 = []
  const stack2 = []
  while (index < templateString.length - 1) {
    const restString = templateString.substring(index)
    // 判断这个字符是不是一个开始标签
    if (startRegexp.test(restString)) {
      const tag = restString.match(startRegexp)[1]
      const attrs = restString.match(startRegexp)[2]
      console.log('检测到开始标记<' + tag)
      // 将开始标记推入stack1中
      stack1.push(tag)
      // 将数组对象推入 stack2 中
      const parseAttrsArr = attrs ? parseAttrs(attrs) : []
      stack2.push({ tag: tag, type: 2, attrs: parseAttrsArr })
      // 这里要 +2 因为<> 也占用两个位置
      const attrsLength = attrs ? attrs.length : 0
      index += tag.length + 2 + attrsLength
    } else if (endRegexp.test(restString)) {
      // 判断这个字符是不是一个结束标签
      const tag = restString.match(endRegexp)[1]
      console.log('检测到结束标记</' + tag)
      if (tag === stack1[stack1.length - 1]) {
        stack1.pop()
        // 最后一项不能弹栈
        if (stack2.length <= 1) {
          break
        }
        const pop_obj = stack2.pop()
        if (!stack2[stack2.length - 1].children) {
          stack2[stack2.length - 1].children = []
        }
        stack2[stack2.length - 1].children.push(pop_obj)
      } else {
        throw new Error(stack1[stack1.length - 1] + '标签没有封闭!!!')
      }
      index += tag.length + 3
    } else if (wordRegexp.test(restString)) {
      const word = restString.match(wordRegexp)[1]
      if (word.trim()) {
        console.log('监测到文本:' + word)
        stack2[stack2.length - 1].text = word
        stack2[stack2.length - 1].type = 3
      }
      index += word.length
    } else {
      index++
    }
  }
  return stack2[0]
}

function parseAttrs(attrStr) {
  const attrsArr = []
  // 当前是否在引号内部
  let isInQuote = false
  let point = 0
  for (let index = 0; index < attrStr.length; index++) {
    const currentChar = attrStr[index]
    if (currentChar === '"' && isInQuote === false) {
      isInQuote = true
    } else if (currentChar === '"' && isInQuote === true) {
      const result = attrStr
        .substring(point, index + 1)
        .trim()
        .match(/^(.+)="(.+)"$/)
      attrsArr.push({
        name: result[1],
        value: result[2],
      })
      point = index + 1
      isInQuote = false
    }
  }
  return attrsArr
}

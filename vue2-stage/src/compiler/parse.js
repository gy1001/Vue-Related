const unicodeRegExp =
  /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/
// unicodeRegExp.source 用于拿到正则表达式 unicodeRegExp 的字符串。

// 第一个分组就是属性的key value就是分组3分组4分组5
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute =
  /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`

//他匹配到的分组是一个标签名 </xxx 最终匹配到的分组是开始标签名
const startTagOpen = new RegExp(`^<${qnameCapture}`)

const startTagClose = /^\s*(\/?)>/

// 匹配到的是 </xxx 最终匹配到的分组是结束标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const doctype = /^<!DOCTYPE [^>]+>/i
const comment = /^<!\--/
const conditionalComment = /^<!\[/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export function parseHTML(html) {
  // 最终需要转换成一颗抽象语法树
  const stack = []
  const ELEMENT_TYPE = 3
  const TEXT_TYPE = 1
  let currentParent // 指向栈顶
  let root

  function createASTElement(tag, attrs) {
    return {
      type: ELEMENT_TYPE,
      tag,
      attrs,
      children: [],
      parent: null,
    }
  }

  function advance(n) {
    html = html.substring(n)
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const match = {
        tagName: start[1], // 标签名字
        attrs: [],
      }
      advance(start[0].length)
      let attr, end
      // 如果不是开始标签的结束，就一直匹配
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(dynamicArgAttribute) || html.match(attribute))
      ) {
        advance(attr[0].length)
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5],
        })
      }
      if (end) {
        advance(end[0].length)
      }
      return match
    }
  }

  function start(tag, attrs) {
    console.log(tag, attrs, '开始')
    let node = createASTElement(tag, attrs)
    if (!root) {
      // 如果root 为空，则当前是树的根节点
      root = node
    }
    if (currentParent) {
      node.parent = currentParent
      currentParent.children.push(node)
    }
    stack.push(node)
    currentParent = stack[stack.length - 1]
  }
  function end(tag) {
    console.log(tag, '结束')
    stack.pop() // 遇到结束标签就弹出
    currentParent = stack[stack.length - 1]
  }
  function chars(text) {
    text = text.trim() // 去除空格
    if (text) {
      console.log(text, '文本')
      // 文本放在当前父类子元素中
      currentParent.children.push({
        text,
        type: TEXT_TYPE,
        parent: currentParent,
      })
    }
  }

  while (html) {
    // 如果索引是0，则说明这个是一个开始标签或者结束标签
    // 如果不是0，则说明是一个文本的结束位置 hello</div
    const textEnd = html.indexOf('<')
    if (textEnd === 0) {
      // 开始标签的匹配
      const startTagMatch = parseStartTag()
      // 解析到了开始标签
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }
      // 如果遇到结束标签
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        end(endTagMatch[1])
        continue
      }
    }
    if (textEnd > 0) {
      // 说明是文本开头了
      const text = html.substring(0, textEnd) // 文本内容
      if (text) {
        advance(text.length)
        chars(text)
      }
    }
  }
  return root
}

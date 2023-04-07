import { ElementTypes, NodeTypes } from './ast'

export interface ParserContext {
  source: string
}

enum TagType {
  Start,
  End
}

export interface ParserContext {
  source: string
}

function createParserContext(content: string): ParserContext {
  return {
    source: content
  }
}

export function createRoot(children) {
  return {
    type: NodeTypes.ROOT,
    children,
    loc: {}
  }
}

export function baseParse(content: string) {
  const context = createParserContext(content)
  const children = parseChildren(context, [])
  return createRoot(children) // 返回 createRoot 处理后的对象
}

function parseChildren(context: ParserContext, ancestors) {
  const nodes = []
  // while 循环，直到最后是一个结束标签
  while (!isEnd(context, ancestors)) {
    const s = context.source
    let node
    if (startsWith(s, '{{')) {
      node = parseInterpolation(context)
    } else if (s[0] === '<') {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestors)
      }
    }
    // 如果上面的判断没有进入，那node就是空的，说明此时内容是 文本
    if (!node) {
      node = parseText(context)
    }
    pushNodes(nodes, node)
  }
  return nodes
}

function parseInterpolation(context: ParserContext) {
  // {{  }}
  const [open, close] = ['{{', '}}']
  advanceBy(context, open.length)
  const closeIndex = context.source.indexOf(close, open.length)
  const preTrimContent = parseTextData(context, closeIndex)
  advanceBy(context, close.length)
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      isStatic: false,
      content: preTrimContent.trim(),
      constType: 0
    }
  }
}

// 把 node 放入 nodes
function pushNodes(nodes, node) {
  nodes.push(node)
}

// ancestors 是一个 elementNode 节点数组
function isEnd(context: ParserContext, ancestors) {
  const s = context.source
  // 如果是 </ 为开始
  if (startsWith(s, '</')) {
    // TODO: probably bad performance
    for (let i = ancestors.length - 1; i >= 0; --i) {
      if (startsWithEndTagOpen(s, ancestors[i].tag)) {
        return true
      }
    }
  }
  return !s
}

function startsWith(source: string, searchString: string): boolean {
  return source.startsWith(searchString)
}
// 是否以打开标签的结束标签为开始
function startsWithEndTagOpen(source: string, tag: string): boolean {
  return (
    startsWith(source, '</') &&
    source.slice(2, 2 + tag.length).toLowerCase() === tag.toLowerCase()
  )
}

// 处理标签节点
function parseElement(context: ParserContext, ancestors) {
  // 获得当前 tag 元素
  const element = parseTag(context, TagType.Start)
  ancestors.push(element)
  // 处理子节点
  const children = parseChildren(context, ancestors)
  ancestors.pop()
  element.children = children
  if (startsWithEndTagOpen(context.source, element.tag)) {
    parseTag(context, TagType.End)
  }
  return element
}

// 解析标签，
function parseTag(context: ParserContext, type: TagType) {
  // 通过 context.source  解析出 tag 名字
  const match: any = /^<\/?([a-z][^\r\n\t\f />]*)/i.exec(context.source)
  const tag = match[1]
  advanceBy(context, match[0].length)
  // -------------------- 属性和指令的处理 --------------------
  advanceSpaces(context)
  let props = parseAttributes(context, type)
  // ------------------------------------------------------------
  let isSelfClosing = startsWith(context.source, '/>') // 是否是自闭合标签
  // 如果是闭合标签，就需要在往后截取2位，否则就是1位
  advanceBy(context, isSelfClosing ? 2 : 1)

  return {
    type: NodeTypes.ELEMENT,
    tag: tag,
    tagType: ElementTypes.ELEMENT,
    props: props,
    children: []
  }
}

function advanceSpaces(context: ParserContext): void {
  const match = /^[\t\r\n\f ]+/.exec(context.source)
  if (match) {
    advanceBy(context, match[0].length)
  }
}

function parseAttributes(context, type) {
  const props: any = []
  const attributeNames = new Set<string>()
  while (
    context.source.length > 0 &&
    !startsWith(context.source, '>') &&
    !startsWith(context.source, '/>')
  ) {
    const attr = parseAttribute(context, attributeNames)
    if (type === TagType.Start) {
      props.push(attr)
    }
    advanceSpaces(context)
  }
  return props
}

function parseAttribute(context: ParserContext, nameSet: Set<string>) {
  const match = /^[^\t\r\n\f />][^\t\r\n\f />=]*/.exec(context.source)!
  const name = match[0]
  nameSet.add(name)
  advanceBy(context, name.length)
  let value: any = undefined
  if (/^[\t\r\n\f ]*=/.test(context.source)) {
    advanceSpaces(context)
    advanceBy(context, 1)
    advanceSpaces(context)
    value = parseAttributeValue(context)
  }
  // 属性中的指令处理
  if (/^(v-[A-Za-z0-9-]|:|\.|@|#)/.test(name)) {
    // 正则匹配指令，
    const match =
      /(?:^v-([a-z0-9-]+))?(?:(?::|^\.|^@|^#)(\[[^\]]+\]|[^\.]+))?(.+)?$/i.exec(
        name
      )!
    // 拿到指令名字
    let dirname = match[1]
    return {
      type: NodeTypes.DIRECTIVE,
      name: dirname,
      exp: value && {
        type: NodeTypes.SIMPLE_EXPRESSION,
        content: value.content,
        isStatic: false,
        loc: {},
        constType: 0
      },
      arg: undefined,
      modifiers: undefined,
      loc: {}
    }
  }
  return {
    type: NodeTypes.ATTRIBUTE,
    name,
    value: value && {
      type: NodeTypes.TEXT,
      content: value.context,
      loc: {}
    },
    loc: {}
  }
}

function parseAttributeValue(context: ParserContext) {
  let content = ''
  const quote = context.source[0] // 这里有可能是 '，也有可能是是 "
  advanceBy(context, 1)
  const endIndex = context.source.indexOf(quote)
  if (endIndex === -1) {
    content = parseTextData(context, context.source.length)
  } else {
    content = parseTextData(context, endIndex)
    advanceBy(context, 1)
  }
  return { content, loc: {}, isQuoted: true }
}

// 处理文本节点（静态文本节点），所以以 < 或者 {{ 为最后的一个位置处理，
function parseText(context: ParserContext) {
  const endTokens = ['<', '{{']
  // 先创建当前文本节点的最后索引位置是 当前字符串的长度
  let endIndex = context.source.length
  // 如果有找到 上面两种类型的索引位置，并且位置索引小于 endIndex,就更新这个最后的索引位置 endIndex
  for (let index = 0; index < endTokens.length; index++) {
    const j = context.source.indexOf(endTokens[index], 1)
    if (j !== -1 && endIndex > j) {
      endIndex = j
    }
  }
  // 截取获得当前文本
  const content = parseTextData(context, endIndex)
  return {
    type: NodeTypes.TEXT,
    content
  }
}

// 按照长度截取当前文本，把字符串进行截取
function parseTextData(context: ParserContext, length: number) {
  const rawText = context.source.slice(0, length)
  advanceBy(context, length)
  return rawText
}

// 按照长度，对当前上下文中的 source 进行截取
function advanceBy(context: ParserContext, numberOfCharacters) {
  context.source = context.source.slice(numberOfCharacters)
}

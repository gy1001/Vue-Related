import { TO_DISPLAY_STRING, helperNameMap } from './runtimeHelpers'
import { NodeTypes } from './ast'
import { getVNodeHelper } from './utils'
import { isArray, isString } from '@vue/shared'

function createCodegenContext(ast) {
  const context = {
    runtimeGlobalName: 'Vue',
    code: '',
    source: ast.loc.source,
    indentLevel: 0,
    isSSR: false,
    helper(key) {
      return `_${helperNameMap[key]}`
    },
    push(code) {
      context.code += code
    },
    newline() {
      newline(context.indentLevel)
    },
    indent() {
      newline(++context.indentLevel)
    },
    deindent() {
      newline(--context.indentLevel)
    }
  }

  function newline(n: number) {
    context.code += '\n' + ` `.repeat(n)
  }
  return context
}

const aliasHelper = (s: symbol) => {
  return `${helperNameMap[s]}: _${helperNameMap[s]}`
}

export function generate(ast) {
  const context = createCodegenContext(ast)

  const { push, newline, deindent, indent } = context
  // 前置代码
  getFunctionPreamble(context)
  // 接着是函数和参数
  const functionName = `render`
  const args = ['_ctx', '_cache']
  const signature = args.join(', ')
  push(`function ${functionName}(${signature}) {`)
  indent()
  // 新增加 with 函数 { 以及缩进
  push(`with(_ctx) {`)
  indent()

  const hasHelpers = ast.helpers.length > 0
  if (hasHelpers) {
    push(`const { ${ast.helpers.map(aliasHelper).join(', ')}} = _Vue`)
  }
  newline()
  push(`return `)
  // 再处理函数的调用以及参数的处理
  if (ast.codegenNode) {
    genNode(ast.codegenNode, context)
  } else {
    push(`null`)
  }

  // 同样的需要增加 对应的缩进以及 {
  deindent()
  push('}')

  // 处理最后的 {
  deindent()
  push('}')
  return {
    ast,
    code: context.code
  }
}

function getFunctionPreamble(context) {
  const { push, runtimeGlobalName, newline } = context
  const VueBinding = runtimeGlobalName
  push(`const _Vue = ${VueBinding}\n`)
  newline()
  push(`return `)
}

function genNode(node, context) {
  switch (node.type) {
    case NodeTypes.VNODE_CALL:
      genVNodeCall(node, context)
      break
    case NodeTypes.TEXT:
      genText(node, context)
      break
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break
    case NodeTypes.INTERPOLATION:
      genInterpolation(node, context)
      break
    case NodeTypes.COMPOUND_EXPRESSION:
      genCompoundExpression(node, context)
      break
    case NodeTypes.ELEMENT:
    case NodeTypes.IF:
      genNode(node.codegenNode, context)
      break
    // 条件表达式
    case NodeTypes.JS_CONDITIONAL_EXPRESSION:
      genConditionalExpression(node, context)
      break
    // 调用
    case NodeTypes.JS_CALL_EXPRESSION:
      genCallExpression(node, context)
      break
    default:
      break
  }
}

function genCallExpression(node, context) {
  const { push, helper } = context
  const callee = isString(node.callee) ? node.callee : helper(node.callee)
  push(callee + `(`)
  genNodeList(node.arguments, context)
  push(')')
}

function genConditionalExpression(node, context) {
  const { test, newline: needNewLine, consequent, alternate } = node
  const { push, indent, deindent, newline } = context
  if (test.type === NodeTypes.SIMPLE_EXPRESSION) {
    genExpression(test, context)
  }
  needNewLine && indent()
  context.indentLevel++
  needNewLine || push(` `)
  push(`? `)
  genNode(consequent, context)
  context.indentLevel--
  needNewLine && newline()
  needNewLine || push(` `)
  push(`: `)
  const isNested = alternate.type === NodeTypes.JS_CONDITIONAL_EXPRESSION
  if (!isNested) {
    context.indentLevel++
  }
  genNode(alternate, context)

  if (!isNested) {
    context.indentLevel--
  }
  needNewLine && deindent()
}

function genCompoundExpression(node, context) {
  for (let index = 0; index < node.children.length; index++) {
    const child = node.children[index]
    if (isString(child)) {
      context.push(child)
    } else {
      genNode(child, context)
    }
  }
}

function genInterpolation(node, context) {
  const { push, helper } = context
  push(`${helper(TO_DISPLAY_STRING)}(`)
  genNode(node.content, context)
  push(`)`)
}

function genExpression(node, context) {
  const { content, isStatic } = node
  context.push(isStatic ? JSON.stringify(content) : content)
}

function genText(node, context) {
  context.push(JSON.stringify(node.content))
}
function genVNodeCall(node, context) {
  const { push, helper } = context
  const { tag, isComponent, props, children, patchFlag, dynamicProps } = node
  const callHelper = getVNodeHelper(context.isSSR, isComponent)
  push(helper(callHelper) + `(`)

  const args = genNullableArgs([tag, props, children, patchFlag, dynamicProps])
  genNodeList(args, context)
  push(')')
}
function genNullableArgs(args: any[]) {
  let i = args.length
  while (i--) {
    // 注意这里是双不等 != 不是 !==, 要排除undefined
    if (args[i] != null) break
  }
  return args.slice(0, i + 1).map(arg => arg || `null`)
}
function genNodeList(nodes, context) {
  const { push } = context
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index]
    if (isString(node)) {
      push(node)
    } else if (isArray(node)) {
      genNodeListArray(node, context)
    } else {
      genNode(node, context)
    }
    if (index < nodes.length - 1) {
      push(`, `)
    }
  }
}
function genNodeListArray(nodes, context) {
  context.push('[')
  genNodeList(nodes, context)
  context.push(']')
}

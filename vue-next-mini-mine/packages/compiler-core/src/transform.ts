import { NodeTypes } from './ast'
import { isSingleElementRoot } from './transform/hoistStatic'
import { TO_DISPLAY_STRING } from './runtimeHelpers'
import { isArray, isString } from '@vue/shared'
export interface TransformContext {
  root
  parent: ParentNode | null
  childIndex: number
  currentNode
  helpers: Map<symbol, number>
  helper<T extends symbol>(name: T): T
  nodeTransforms: any[]
  replaceNode(node): void
}

export function createTransformContext(root, { nodeTransforms = [] }) {
  const context: TransformContext = {
    nodeTransforms,
    root,
    helpers: new Map(),
    currentNode: root,
    parent: null,
    childIndex: 0,
    helper(name) {
      const count = context.helpers.get(name) || 0
      context.helpers.set(name, count + 1)
      return name
    },
    replaceNode(node) {
      if (context.parent) {
        context.parent.children[context.childIndex] = context.currentNode = node
      }
    }
  }
  return context
}
/**
 * 根据 AST 生成 JavaScript AST
 * @param root AST
 * @param options 配置对象
 */
export function transform(root, options) {
  // 创建 transform 上下文
  const context = createTransformContext(root, options)
  // 按照深度优先依次处理 node 节点转化
  traverseNode(root, context)
  createRootCodegen(root)
  root.helpers = [...context.helpers.keys()]
  root.components = []
  root.directives = []
  root.imports = []
  root.hoists = []
  root.temps = []
  root.cached = []
}

// 深度优先
/**
 * 遍历转化节点，转化的过程中一定是深度优先的（即：孙 -> 子 -> 父) 因为当时节点的状态往往需要根据子节点的情况来确定
 * 转化的过程分为两个阶段
 * 1. 进入阶段：存储所有节点的转化函数到 exitFns 中
 * 2. 退出阶段：执行 exitFns中缓存的函数，且一定是倒序的，因为这样才能保证整个执行过程中是深度优先的
 */
function traverseNode(node, context: TransformContext) {
  context.currentNode = node
  // apply transform plugins
  const { nodeTransforms } = context
  const exitFns: any = []
  for (let index = 0; index < nodeTransforms.length; index++) {
    const onExit = nodeTransforms[index](node, context)
    if (onExit) {
      if (isArray(onExit)) {
        exitFns.push(...onExit)
      } else {
        exitFns.push(onExit)
      }
    }
    if (!context.currentNode) {
      return
    }
    node = context.currentNode
  }
  switch (node.type) {
    case NodeTypes.IF_BRANCH:
    case NodeTypes.ELEMENT:
    case NodeTypes.ROOT:
      traversChildren(node, context)
      break
    case NodeTypes.INTERPOLATION:
      // ---------- 这里处理 INTERPOLATION ----------
      context.helper(TO_DISPLAY_STRING)
      break
    case NodeTypes.IF:
      console.log('if')
      for (let i = 0; i < node.branches.length; i++) {
        traverseNode(node.branches[i], context)
      }
      break
  }
  // exit transforms
  context.currentNode = node
  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
}

function traversChildren(parent, context: TransformContext) {
  parent.children.forEach((node, index) => {
    context.parent = parent
    context.childIndex = index
    traverseNode(node, context)
  })
}

function createRootCodegen(root) {
  const { children } = root
  // vue2 仅支持单个根节点
  if (children.length === 1) {
    const child = children[0]
    if (isSingleElementRoot(root, child) && child.codegenNode) {
      root.codegenNode = child.codegenNode
    }
  }
  // vue3 支持多个根节点
}

export function createStructuralDirectiveTransform(name: string | RegExp, fn) {
  const matches = isString(name)
    ? (n: string) => n === name
    : (n: string) => name.test(n)

  return (node, context) => {
    if (node.type === NodeTypes.ELEMENT) {
      const exitFns: any = []
      const { props } = node
      for (let index = 0; index < props.length; index++) {
        const prop = props[index]
        if (prop.type === NodeTypes.DIRECTIVE && matches(prop.name)) {
          props.splice(index, 1)
          index--
          const onExit = fn(node, prop, context)
          if (onExit) exitFns.push(onExit)
        }
      }
      return exitFns
    }
  }
}

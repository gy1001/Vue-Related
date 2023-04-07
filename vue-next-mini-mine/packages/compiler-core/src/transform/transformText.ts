import { NodeTypes } from '../ast'
import { isText } from '../utils'

/**
 * 将 相邻的文本节点 和表达式 合并为一个表达式
 * 例如：
 * <div> hello {{ msg }} </div>
 * 上述模板包含两个节点：
 * 1. hello TEXT文本节点
 * 2. {{ msg }} INTERPOLATION 表达式节点
 * 这两个节点在 生成 render 函数时候，需要被合并成 "hello" + _toDisplayString(_ctx.msg)
 * 那么在合并时候需要多出来这个 + 加号
 * 例如：children: [ {TEXT 文本节点}， " + ", { INTERPOLATION 表达式节点 }]
 * @param node
 * @param context
 * @returns
 */
export function transformText(node, context) {
  if (
    node.type === NodeTypes.ROOT ||
    node.type === NodeTypes.ELEMENT ||
    node.type === NodeTypes.FOR ||
    node.type === NodeTypes.IF_BRANCH
  ) {
    return () => {
      const children = node.children
      let currentContainer
      for (let index = 0; index < children.length; index++) {
        const child = children[index]
        if (isText(child)) {
          for (let j = index + 1; j < children.length; j++) {
            const next = children[j]
            if (isText(next)) {
              if (!currentContainer) {
                currentContainer = children[index] = createCompundExpression(
                  [child],
                  child.loc
                )
              }
              currentContainer.children.push(` + `, next)
              children.splice(j, 1)
              j--
            } else {
              // 如果第一个节点是 text 第二个节点不是 text 则不需要合并
              currentContainer = undefined
              break
            }
          }
        }
      }
    }
  }
}

export function createCompundExpression(children, loc) {
  return {
    type: NodeTypes.COMPOUND_EXPRESSION,
    loc,
    children
  }
}

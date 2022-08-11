/**
 * 真正 创建节点，将 vNode 创建为dom，是孤儿节点，不进行插入，因为子节点需要递归，而子节点有没有标杆
 * @param {*} vNode
 * @param {*} pivot
 */
export default function createElement(vNode) {
  const domNode = document.createElement(vNode.sel)
  // 判断有子节点还是有文本
  if (
    (vNode.text !== '') &
    (vNode.children === undefined || vNode.children.length === 0)
  ) {
    // 它的内部是文字
    domNode.innerText = vNode.text
    // 补充 elm 属性
    vNode.elm = domNode
  } else if (Array.isArray(vNode.children) && vNode.children.length > 0) {
    console.log('这里进行处理多个子节点的循环处理')
    // 它内部是子节点，需要进行 递归创建子节点
  }

  // 返回 elm，是一个纯 DOM 节点
  return vNode.elm
}

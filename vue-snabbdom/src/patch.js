import createElement from './createElement'
import patchVNode from './patchVNode'
import vNode from './vnode'

function patch(oldVNode, newVNode) {
  // 判断第一个参数 oldVNode 是虚拟节点还是 DOM 节点
  if (oldVNode.sel === '' || oldVNode.sel === undefined) {
    // 是空，说明是 DOM 节点，需要包装为空的虚拟节点
    oldVNode = vNode(
      oldVNode.tagName.toLowerCase(),
      {},
      [],
      undefined,
      oldVNode
    )
  }
  // 判断 oldVNode 和 newVNode 是不是同一个节点
  if (oldVNode.key === newVNode.key && oldVNode.sel === newVNode.sel) {
    // '是同一个节点，需要做精细化比较'
    patchVNode(oldVNode, newVNode)
  } else {
    console.log('不是同一个节点，暴力插入新的，删除旧的')
    const newVNodeElm = createElement(newVNode)
    if (oldVNode.elm.parentNode && newVNodeElm) {
      oldVNode.elm.parentNode.insertBefore(newVNodeElm, oldVNode.elm)
    }
    // 删除 老节点
    oldVNode.elm.parentNode.removeChild(oldVNode.elm)
  }
}

export default patch

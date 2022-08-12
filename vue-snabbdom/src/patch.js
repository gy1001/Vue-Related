import createElement from './createElement'
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
    // 在内存中是不是同一个节点
    if (oldVNode === newVNode) {
      return
    }
    if (
      newVNode.text !== undefined &&
      (newVNode.children === undefined || newVNode.children.length === 0)
    ) {
      console.log('判断 newVNode 有 text 属性')
      if (newVNode.text !== oldVNode.text) {
        // 把 oldVNode.elm 中的text 变为 newVNode 中的text(即使 oldVNode 有children属性，innerText一旦改变后，老children也就没了)
        oldVNode.elm.innerText = newVNode.text
        return
      }
    } else {
      console.log('newVNode 没有 text 属性')
      // 判断 oldVNode 有没有 children
      if (oldVNode.children !== undefined && oldVNode.children.length > 0) {
        // 老的节点有 children，此时是最复杂的情况，就是新老节点都有 children
      } else {
        // 老的没有 children 新的有 children
        oldVNode.elm.innerText = ''
        newVNode.children.forEach((node) => {
          const newNodeDom = createElement(node)
          oldVNode.elm.appendChild(newNodeDom)
        })
      }
    }
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

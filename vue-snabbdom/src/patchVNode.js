import updateChildren from './updateChildren'

export default function patchVNode(oldVNode, newVNode) {
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
      console.log('最复杂')
      updateChildren(oldVNode.elm, oldVNode.children, newVNode.children)
    } else {
      // 老的没有 children 新的有 children
      oldVNode.elm.innerText = ''
      newVNode.children.forEach((node) => {
        const newNodeDom = createElement(node)
        oldVNode.elm.appendChild(newNodeDom)
      })
    }
  }
}

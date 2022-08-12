import patchVNode from './patchVNode'

function checkSameVNode(vNode1, vNode2) {
  return vNode1.sel === vNode2.sel && vNode1.key === vNode2.key
}

export default function updateChildren(parentElm, oldChildren, newChildren) {
  oldChildren.children = oldChildren.children || []
  newChildren.children = newChildren.children || []
  // 旧前、旧后、新前、新后
  let oldStartIndex = 0
  let oldEndIndex = oldChildren.length - 1
  let newStartIndex = 0
  let newEndIndex = newChildren.length - 1
  // 旧前节点、旧后节点、新前节点、新后节点
  let oldStartNode = oldChildren[oldStartIndex]
  let oldEndNode = oldChildren[oldEndIndex]
  let newStartNode = newChildren[newStartIndex]
  let newEndNode = newChildren[newEndIndex]
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    console.log(oldStartNode, newStartNode)
    if (checkSameVNode(oldStartNode, newStartNode)) {
      console.log('1旧前与新前相同')
      //  比较新旧节点
      patchVNode(oldStartNode, newStartNode)
      oldStartNode = oldChildren[++oldStartIndex]
      newStartNode = newChildren[++newStartIndex]
    } else if (checkSameVNode(oldEndNode, newEndNode)) {
      // 比较 旧后与新后
      console.log('2旧后与新后相同')
      patchVNode(oldEndNode, newEndNode)
      oldEndNode = oldChildren[--oldEndIndex]
      newEndNode = newChildren[--newEndIndex]
    } else if (checkSameVNode(oldStartNode, newEndNode)) {
      // 旧前与新后
      console.log('3新后与旧前相同')
      // 当新后与旧前命中的时候，此时需要移动节点，移动 新后 指向的这个节点到老节点的旧后的后面
      patchVNode(oldStartNode, newEndNode)
      parentElm.insertBefore(oldStartNode.elm, oldEndNode.elm.nextSibling)
      oldStartNode = oldChildren[++oldStartIndex]
      newEndNode = newChildren[--newEndIndex]
    } else if (checkSameVNode(oldEndNode, newStartNode)) {
      // 旧后与新前
      console.log('4旧后与新前相同')
      // 此时要移动节点，移动 新前 节点到老节点的旧前的前面
      patchVNode(oldEndNode, newStartNode)
      parentElm.insertBefore(oldEndNode.elm, oldStartNode.elm)
      oldEndNode = oldChildren[--oldEndIndex]
      newStartNode = newChildren[++newStartIndex]
    } else {
      console.log('四种方式均没有命中')
    }
  }
  console.log('while循环结束')
}

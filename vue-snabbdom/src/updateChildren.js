import createElement from './createElement'
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
  // 老节点中的key集合
  let keyMap
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
      if (!keyMap) {
        keyMap = {}
        for (let index = oldStartIndex; index < oldEndNode; index++) {
          const key = oldChildren[index].key
          if (key !== undefined) {
            keyMap[key] = index
          }
        }
      }
      // 寻找当期这项（newStartIndex）在keyMap中映射的位置序号
      const indexInOld = keyMap[newStartNode.key]
      if (!indexInOld) {
        console.log('我是新增的')
        // 如果不存在，说明 当前项目是全新的项,插在未处理节点 oldStartNode 的前面
        parentElm.insertBefore(createElement(newStartNode), oldStartNode.elm)
      } else {
        console.log('如果不是 undefined 说明不是全新的项目，需要移动')
        const elmToMove = oldChildren[indexInOld]
        patchVNode(elmToMove, newStartNode)
        // 把这项设置为 undefined， 表示已经处理完这项
        oldChildren[indexInOld] = undefined
        // 调用 insertBefore 把它移动到 oldStartNode 前面
        parentElm.insertBefore(elmToMove.elm, oldStartNode.elm)
      }
      newStartNode = newChildren[++newStartIndex]
    }
  }
  console.log('while循环结束')
  // 这里要做删除，<或者新增剩余节点
  if (newStartIndex <= newEndIndex) {
    console.log('新节点有剩余的，需要新增')
    const before = newChildren[newEndIndex + 1]
      ? newChildren[newEndIndex + 1].elm
      : null
    for (let index = newStartIndex; index <= newEndIndex; index++) {
      // 如果引用节点为 null，则将指定的节点添加到指定父节点的子节点列表的末尾。
      parentElm.insertBefore(createElement(newChildren[index]), before)
    }
  } else if (oldStartIndex <= oldEndIndex) {
    // 循环结束了，oldStartIndex 还是小于 oldEndIndex
    // 批量删除 oldStartIndex 和 oldEndIndex 之间的项
    for (let index = oldStartIndex; index <= oldEndIndex; index++) {
      parentElm.removeChild(oldChildren[index].elm)
    }
  }
}

/**
 * 真正 创建节点，将 vNode 创建为dom，并插入到 pivot 这个元素之前
 * @param {*} vNode
 * @param {*} pivot
 */
export default function createElement(vNode, pivot) {
  console.log('目的是把虚拟节点', vNode, '插入到标杆', pivot, '前')
  let domNode = document.createElement(vNode.sel)
  // 判断有子节点还是有文本
  if (
    (vNode.text !== '') &
    (vNode.children === undefined || vNode.children.length === 0)
  ) {
    // 它的内部是文字
    domNode.innerText = vNode.text
    console.log(domNode)
    // 将孤儿节点 插入到 元素前:让标杆节点的父元素调用 insertBefore 方法，插入到标签节点之前
    pivot.parentNode.insertBefore(domNode, pivot)
  } else if (Array.isArray(vNode.children) && vNode.children.length > 0) {
    console.log('这里进行处理多个子节点的循环处理')
  }
}

import { ShapeFlags } from 'packages/shared/src/shapeFlags'
import { createVNode, Text } from './vnode'

export function normalizeVNode(child) {
  if (typeof child === 'object') {
    return cloneIfMounted(child)
  } else {
    // strings and numbers
    return createVNode(Text, null, String(child))
  }
}

function cloneIfMounted(child) {
  return child
}

export function renderComponentRoot(instance) {
  const { vnode, render, data } = instance
  let result
  try {
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      // 获取到 result 返回值，如果 render 中使用了 this，则需要修改 this 指向
      result = normalizeVNode(render!.call(data, data || {}))
    }
  } catch (error) {
    console.log(error, 'error')
  }
  return result
}

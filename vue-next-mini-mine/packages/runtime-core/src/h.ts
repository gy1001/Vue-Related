import { isArray, isObject } from "@vue/shared"
import { createVNode, VNode, isVNode } from "./vnode"

export function h(type: any, propsOrChildren?: any, children?: any): VNode {
  const length = arguments.length
  if (length === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren],)
      }
      return createVNode(type, propsOrChildren, [])
    }
    return createVNode(type, null, propsOrChildren)
  } else {
    if (length > 3) {
      children = Array.prototype.slice.call(arguments, 2)
    } else if (length === 3 && isVNode(children)) {
      children = [children]
    }
    return createVNode(type, propsOrChildren, children)
  }
}


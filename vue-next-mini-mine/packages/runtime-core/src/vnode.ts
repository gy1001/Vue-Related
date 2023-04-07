import { isArray, isObject, isString, normalizeClass } from '@vue/shared'
import { ShapeFlags } from 'packages/shared/src/shapeFlags'

export function createVNode(type, props, children): VNode {
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : 0

  if (props) {
    let { class: klass, style } = props
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass)
    }
  }

  return createBaseVNode(type, props, children, shapeFlag)
}

export interface VNode {
  type: any
  __v_isVNode: true
  props: any
  children: any
  shapeFlag: number
  key: any
}

export function isVNode(value: any): value is VNode {
  return value && value.__v_isVNode === true
}

export function createBaseVNode(type, props, children, shapeFlag) {
  const vnode = {
    __v_isVNode: true,
    type,
    props,
    shapeFlag,
    key: props?.key || null
  } as VNode

  normalizeChildren(vnode, children)
  return vnode
}

export function normalizeChildren(vnode: VNode, children?: unknown) {
  let type = 0
  if (children == null) {
    children = null
  } else if (isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN
  } else if (typeof children === 'object') {
  } else if (isString(children)) {
    children = String(children)
    type = ShapeFlags.TEXT_CHILDREN
  }
  vnode.children = children
  vnode.shapeFlag |= type
  return vnode
}

export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')
export const Comment = Symbol('Comment')
export { createVNode as createElementVNode }
export function createCommentVNode(text) {
  return createVNode(Comment, null, text) // 注意第一个参数代表 Comment 类型
}

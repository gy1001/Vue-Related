import { extend, isString } from '@vue/shared'
import { createRenderer } from '@vue/runtime-core'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

const rendererOptions = extend({ patchProp }, nodeOps)
let renderer
function ensureRender() {
  return renderer || (renderer = createRenderer(rendererOptions))
}
export const render = (...args) => {
  ensureRender().render(...args)
}

export const createApp = (...args) => {
  const app = ensureRender().createApp(...args)
  const { mount } = app
  app.mount = (containerOrSelector: Element | string) => {
    const container = noramlizeContainer(containerOrSelector)
    if (!container) {
      console.log('容器必须存在')
      return
    }
    mount(container)
  }
  return app
}
function noramlizeContainer(container: Element | string): Element {
  if (isString(container)) {
    const res = document.querySelector(container)
    return res as Element
  }
  return container
}

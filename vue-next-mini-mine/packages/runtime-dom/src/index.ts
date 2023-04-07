import { extend } from '@vue/shared'
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

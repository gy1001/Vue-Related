import { isOn } from '@vue/shared'
import { patchClass } from './modules/class'
import { patchAttr } from './modules/attr'
import { patchDomProp } from './modules/prop'
import { patchStyle } from './modules/style'
import { patchEvent } from './modules/event'

export const patchProp = (el: Element, key, preValue, nextValue) => {
  if (key === 'class') {
    patchClass(el, nextValue)
  } else if (key === 'style') {
    patchStyle(el, preValue, nextValue)
  } else if (isOn(key)) {
    patchEvent(el, key, preValue, nextValue)
  } else if (shouldSetAsProp(el, key)) {
    patchDomProp(el, key, nextValue)
  } else {
    patchAttr(el, key, nextValue)
  }
}

function shouldSetAsProp(el: Element, key: string) {
  if (key === 'form') {
    // #1787, #2840 form 表单元素的表单属性是只读的，必须设置为属性 attribute
    return false
  }
  // #1526 <input list> 必须设置为属性 attribute
  if (key === 'list' && el.tagName === 'INPUT') {
    return false
  }
  // #2766 <textarea type> 必须设置为属性 attribute
  if (key === 'type' && el.tagName === 'TEXTAREA') {
    return false
  }
  return key in el
}

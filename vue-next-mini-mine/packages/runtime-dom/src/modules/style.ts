import { isString } from '@vue/shared'

export function patchStyle(el: Element, preValue, newValue) {
  const style = (el as HTMLElement).style
  const isCSSString = isString(newValue)
  if (newValue && !isCSSString) {
    for (const key in newValue) {
      setStyle(style, key, newValue[key])
    }
    // 遍历旧的属性对象，如果属性键在新的对象中不存在，就置为 ""
    if (preValue && !isString(preValue)) {
      for (const key in preValue) {
        if (newValue[key] === null) {
          setStyle(style, key, '')
        }
      }
    }
  }
}

function setStyle(
  style: CSSStyleDeclaration,
  key: string,
  val: string | string[]
) {
  style[key] = val
}

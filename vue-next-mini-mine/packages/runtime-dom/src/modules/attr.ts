export function patchAttr(el: Element, key: string, value: any) {
  if (value === null) {
    el.removeAttribute(key)
    return
  }
  el.setAttribute(key, value)
}

export function patchClass(el: Element, value: string | null) {
  if (value === null) {
    el.removeAttribute('class')
  } else {
    // 疑问：这里为什么不用 setAttributes
    el.className = value
  }
}

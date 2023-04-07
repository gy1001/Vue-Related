const doc = document
export const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null)
  },
  createElement: (tag: string): Element => {
    const el = doc.createElement(tag)
    return el
  },
  setElementText: (el: Element, text: string) => {
    el.textContent = text
  },
  removeElement: (el: Element) => {
    const parent = el.parentNode
    if (parent) {
      parent.removeChild(el)
    }
  },
  createText: text => doc.createTextNode(text),
  setText: (node, text) => {
    node.nodeValue = text
  },
  createComment: text => doc.createComment(text)
}

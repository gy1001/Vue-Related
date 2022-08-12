export default function vNode(sel, data, children, text, elm) {
  return {
    sel,
    data,
    key: data.key,
    children,
    text,
    elm,
  }
}

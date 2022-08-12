import { h } from 'snabbdom'
import patch from './patch'
const container = document.getElementById('container')

const vnode1 = h('ul', {}, [
  h('li', { key: 'A' }, 'A'),
  h('li', { key: 'B' }, 'B'),
  h('li', { key: 'C' }, 'C'),
  h('li', { key: 'D' }, 'D'),
  h('li', { key: 'E' }, 'E'),
])
patch(container, vnode1)

// 对于不同的节点
const vnode2 = h('ul', {}, [
  h('li', { key: 'E' }, 'EE'),
  h('li', { key: 'D' }, 'DD'),
  h('li', { key: 'C' }, 'CC'),
  h('li', { key: 'B' }, 'BB'),
  h('li', { key: 'A' }, 'AA'),
])
// const vnode2 = h('h1', { key: 'first' }, 'hello world12222')
const btn = document.createElement('button')
btn.innerText = '点击我进行内容更新'
btn.addEventListener('click', function () {
  patch(vnode1, vnode2)
})
document.body.appendChild(btn)

import { h } from 'snabbdom'
import patch from './patch'
const container = document.getElementById('container')

const vnode1 = h('ul', {}, [
  h('li', { ke: 'A' }, 'A'),
  h('li', { ke: 'B' }, 'B'),
  h('li', { ke: 'C' }, 'C'),
])
patch(container, vnode1)

// 对于不同的节点
const vnode2 = h('ul', {}, [
  h('li', { ke: 'A' }, 'A'),
  h('li', { ke: 'B' }, 'B'),
  h('li', { ke: 'M' }, 'M'),
  h('li', { ke: 'N' }, 'N'),
  h('li', { ke: 'F' }, 'D'),
  h('li', { ke: 'C' }, 'C'),
])
// const vnode2 = h('h1', { key: 'first' }, 'hello world12222')
const btn = document.createElement('button')
btn.innerText = '点击我进行内容更新'
btn.addEventListener('click', function () {
  patch(vnode1, vnode2)
})
document.body.appendChild(btn)

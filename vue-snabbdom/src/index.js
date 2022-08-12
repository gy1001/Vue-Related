import { h } from 'snabbdom'
import patch from './patch'
const container = document.getElementById('container')

const vnode1 = h('h1', { key: 'first' }, 'old hello world')
patch(container, vnode1)

// 对于不同的节点
const vnode2 = h('h1', { key: 'first' }, [
  h('h2', {}, 'hello world'),
  h('h3', {}, 'hello world'),
  h('h4', {}, 'hello world'),
  h('h5', {}, 'hello world'),
  h('h6', {}, 'hello world'),
  h('h7', {}, [
    h('ul', {}, [
      h('li', {}, 'hello world1'),
      h('li', {}, 'hello world2'),
      h('li', {}, 'hello world3'),
    ]),
  ]),
])
// const vnode2 = h('h1', { key: 'first' }, 'hello world12222')
const btn = document.createElement('button')
btn.innerText = '点击我进行内容更新'
btn.addEventListener('click', function () {
  patch(vnode1, vnode2)
})
document.body.appendChild(btn)

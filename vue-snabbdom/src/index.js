import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
} from 'snabbdom'

const patch = init([
  // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
])

const container = document.getElementById('container')

const vnode1 = h('ul', {}, [
  h('li', {}, 'A'),
  h('li', {}, 'B'),
  h('li', {}, 'C'),
  h('li', {}, 'D'),
])

patch(container, vnode1)

const vnode2 = h('ul', {}, [
  h('li', {}, 'F'),
  h('li', {}, 'A'),
  h('li', {}, 'B'),
  h('li', {}, 'C'),
  h('li', {}, 'D'),
  h('li', {}, 'E'),
])

const btn = document.createElement('button')
btn.innerHTML = '点击我更改内容'
btn.addEventListener('click', function () {
  patch(vnode1, vnode2)
})

document.body.appendChild(btn)

import { h } from 'snabbdom'
import patch from './patch'
const container = document.getElementById('container')

const vnode1 = h('h1', {}, 'hello world')
console.log(vnode1)
patch(container, vnode1)

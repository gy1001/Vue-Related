import { initMixin } from './init'

function Vue(options) {
  // options 就是用户的选项值
  this._init(options) // 默认就调用了 __init
}

initMixin(Vue) // 扩展了 init 方法

export default Vue

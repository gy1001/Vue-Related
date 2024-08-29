import { initMixin } from './init'

function Vue(options) {
  // options 就是用户的选项值
  this._init()
}

initMixin(Vue)

export default Vue

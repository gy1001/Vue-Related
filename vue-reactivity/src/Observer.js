import defineReactive from './defineReactive'
import { def } from './utis'

export default class Observer {
  constructor(value) {
    // 给实例(this,一定要注意，构造函数中的this不是类本身，而是表示实例)添加了 __ob__属性，值是这次new的实例
    def(value, '__ob__', this, false)
    this.walk(value)
  }
  // 遍历
  walk(value) {
    for (const key in value) {
      defineReactive(value, key, value[key])
    }
  }
}

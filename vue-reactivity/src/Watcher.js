import Dep from './Dep'

// parsePath的改造，返回一个函数
function parsePath(path) {
  const segments = path.split('.')
  return function (obj) {
    for (let key of segments) {
      if (!obj) return
      obj = obj[key]
    }
    return obj
  }
}

export default class Watcher {
  constructor(vm, expOrFn, cb) {
    console.log('我是Watcher类的构造器')
    this.vm = vm
    // 修改
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)
    }
    this.cb = cb
    this.value = this.get()
  }
  update() {
    console.log('我是watcher类中的update方法')
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue)
  }

  get() {
    Dep.target = this
    const result = this.getter.call(this.vm, this.vm)
    Dep.target = null
    return result
  }
}

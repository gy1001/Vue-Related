import Dep from './Dep'
import observe from './observe'

export default function defineReactive(data, key, val) {
  const dep = new Dep()
  // value 可能也是对象，所以也要进行做处理
  observe(val)
  Object.defineProperty(data, key, {
    get() {
      console.log('获取' + key + '属性')
      if (Dep.target) {
        dep.addSub(Dep.target)
      }
      return val
    },
    set(newVal) {
      console.log('设置' + key + '属性', newVal)
      if (newVal === val) {
        return
      }
      // 当设置了新值，新值也要被 observe
      observe(newVal)
      val = newVal
      dep.notify()
      return newVal
    },
  })
}

import { isArray } from '@vue/shared'

export function patchEvent(
  el: Element & { _vei?: Object },
  name: string,
  prev,
  next
) {
  const invokers = el._vei || (el._vei = {}) // 增加 事件缓存对象 属性
  const existingInvoker = invokers[name]
  if (next && existingInvoker) {
    // 更新回调
    existingInvoker.value = next
  } else {
    const rawName = parseName(name) // 处理事件属性名，
    if (next) {
      const invoker = (invokers[name] = createInvoker(next))
      el.addEventListener(rawName, invoker)
    } else if (existingInvoker) {
      el.removeEventListener(rawName, existingInvoker) // 移除事件
      invokers[name] = undefined // 缓存对象中的事件值 置为 undefined
    }
  }
}

function parseName(name: string) {
  return name.slice(2).toLowerCase() // 截取事件属性并小写
}

function createInvoker(initialValue) {
  const invoker = (e: Event) => {
    // 如果是数组类型，就需要循环执行
    if (isArray(invoker.value)) {
      invoker.value.forEach(fn => {
        fn()
      })
    } else {
      invoker.value && invoker.value()
    }
  }
  invoker.value = initialValue
  return invoker
}

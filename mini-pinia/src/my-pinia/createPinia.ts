import { markRaw, App, effectScope, reactive } from 'vue'
import { SymbolPinia } from './rootStore'
/**
 * 
 * 
为什么需要用到markRaw

有些值不应被设置为响应式的，例如复杂的第三方库

  比如一个响应式对象中，要放入axios，或者别的随机数字的第三方库
  如果不让他变成非响应式的，那么Vue就会去找到每一个层级，让其都能响应式处理
  这样的情况下，性能就会受到严重影响
  所以我们需要让其变成永远都不会成功响应式的数据，提高性能

当渲染具有不可变数据源的大列表时，跳过响应式可以提高性能

作者：李先来2分钟
链接：https://juejin.cn/post/7130812097469890597
来源：稀土掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
 */
export function createPinia() {
  // 创建一个scope独立空间
  const scope = effectScope(true)
  // run方法的返回值就是回调函数fn的返回值
  const state = scope.run(() => reactive({}))
  const pinia: any = markRaw({
    install(app: App) {
      // 将app保留一份在pinia上
      pinia._a = app
      // 将pinia实例暴露到app上，所有组件都可以inject注入使用
      app.provide(SymbolPinia, pinia)
      // 保证vue2里也可以通过$pinia使用
      app.config.globalProperties.$pinia = pinia
    },
    _a: null,
    state, // 所有的状态
    _e: scope, // 用来管理这个应用上的 effectScope
    _s: new Map(), // 记录所有的 store
  })
  return pinia
}

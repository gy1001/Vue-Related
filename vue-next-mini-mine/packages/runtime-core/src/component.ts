import { reactive } from '@vue/reactivity'
import { isFunction, isObject } from '@vue/shared'
import { onBeforeMount, onMounted } from './apiLifecycle'

let uid = 0
export function createComponentInstance(vnode) {
  const { type } = vnode
  const instance = {
    uid: uid++,
    vnode,
    type,
    subTree: null,
    effect: null,
    update: null,
    render: null,
    // 生命周期相关
    isMounted: false, // 是否挂载
    bc: null, // beforeCreate
    c: null, // created
    bm: null, // beforeMount
    m: null // mounted
  }
  return instance
}

export function setupComponent(instance) {
  setupStatefuleComponent(instance)
}

export function setupStatefuleComponent(instance) {
  const { setup } = instance.type
  if (setup) {
    console.log('执行setup函数')
    const setupResult = setup()
    handleSetupResult(instance, setupResult)
  } else {
    finishComponentSetup(instance)
  }
}

export function handleSetupResult(instance, setupResult) {
  if (isFunction(setupResult)) {
    instance.render = setupResult
  }
  finishComponentSetup(instance)
}

export function finishComponentSetup(instance) {
  const component = instance.type
  // 组件不存在 render 时，才需要重新赋值
  if (!instance.render) {
    instance.render = component.render
  }
  // 改变 options 中的 this 指向
  applyOptions(instance)
}

function applyOptions(instance: any) {
  const {
    data: dataOptions,
    beforeCreate,
    created,
    beforeMount,
    mounted
  } = instance.type
  // hooks
  if (beforeCreate) {
    //  此时 instance.data 自然是没有值的，不过没有关系
    callHook(beforeCreate, instance.data)
  }

  // 存在 data 选项时
  if (dataOptions) {
    // 触发 dataOptions 函数，拿到 data 对象
    const data = dataOptions()
    // 如果拿到的 data 是一个对象
    if (isObject(data)) {
      // 则把 data 包装成 reactiv 的响应性数据，赋值给 instance
      instance.data = reactive(data)
    }
  }

  // hooks
  if (created) {
    callHook(created, instance.data)
  }

  function registerLifecycleHook(register: Function, hook?: Function) {
    register(hook?.bind(instance.data), instance)
  }

  // 注册 hooks
  registerLifecycleHook(onBeforeMount, beforeMount)
  registerLifecycleHook(onMounted, mounted)
}

// 创建对应的 callHook：
function callHook(hook: Function, proxy) {
  hook.bind(proxy)()
}

export const enum LifecycleHooks {
  BEFORE_CREATE = 'bc',
  CREATED = 'c',
  BEFEORE_MOUNT = 'bm',
  MOUNTED = 'm'
}

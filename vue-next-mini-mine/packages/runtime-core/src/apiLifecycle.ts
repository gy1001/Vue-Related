import { LifecycleHooks } from './component'

export function injectHook(
  type: LifecycleHooks,
  hook: Function,
  instance
): Function | undefined {
  // 将hook  注册到组件实例中
  if (instance) {
    instance[type] = hook
    return hook
  }
}

export const createHook = (lifecycle: LifecycleHooks) => {
  return (hook, target) => injectHook(lifecycle, hook, target)
}

export const onBeforeMount = createHook(LifecycleHooks.BEFEORE_MOUNT)
export const onMounted = createHook(LifecycleHooks.MOUNTED)

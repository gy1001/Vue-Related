export function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable,
    writable: true,
    configurable: true,
  })
}

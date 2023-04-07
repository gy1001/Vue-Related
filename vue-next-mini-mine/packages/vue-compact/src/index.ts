import { registerRuntimeCompiler } from 'packages/runtime-core/src/component'
import { compile } from '@vue/compiler-dom'

function compileToFunction(template, options) {
  const { code } = compile(template, options)
  const render = new Function(code)()
  return render
}
registerRuntimeCompiler(compileToFunction)

export { compileToFunction as compile }

import { extend } from '@vue/shared'
import { baseParse } from './parse'
import { transform } from './transform'
import { transformElement } from './transform/transformElement'
import { transformText } from './transform/transformText'
import { generate } from './codegen'
import { transformIf } from './transform/vif'
export function baseCompile(template: string, options) {
  const ast = baseParse(template)
  transform(
    ast,
    extend(options, {
      nodeTransforms: [transformIf, transformElement, transformText]
    })
  )

  console.log(JSON.stringify(ast))
  return generate(ast)
}

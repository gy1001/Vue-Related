import { EMPTY_OBJ, isSameVNodeType, isString } from '@vue/shared'
import { ReactiveEffect } from 'packages/reactivity/src/effect'
import { ShapeFlags } from 'packages/shared/src/shapeFlags'
import { normalizeVNode, renderComponentRoot } from './commponentRenderUtis'
import { createComponentInstance, setupComponent } from './component'
import { queuePreFlushCb } from './scheduler'
import { Fragment, Text, Comment } from './vnode'

export interface RendererOptions {
  /**
   * 未指定的 element 的 props 打补丁
   */
  patchProp(el: Element, key: string, preValue: any, nextValue: any): void
  /**
   * 未指定的 element 设置 textContent
   */
  setElementText(node: Element, text: string): void
  /**
   * 插入指定的 el 到 parent 中，anchor 表示插入的位置，即：锚点
   * @param el
   * @param parent
   * @param anchor
   */
  insert(el, parent: Element, anchor?): void
  /**
   * 创建 element
   * @param type
   */
  createElement(type: string)
  removeElement(el: Element)
  createText(str: string)
  setText(node, text: string)
  createComment(text: string)
}

export function createRenderer(options: RendererOptions) {
  return baseCreateRender(options)
}

export function baseCreateRender(options: RendererOptions) {
  const {
    createElement: hostCreateElement,
    insert: hostInsert,
    patchProp: hostPatchProp,
    setElementText: hostSetElementText,
    removeElement: hostRemoveElement,
    createText: hostCreateText,
    setText: hostSetText,
    createComment: hostCreateComment
  } = options
  const processElement = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode == null) {
      // 挂载节点
      mountElement(newVNode, container, anchor)
    } else {
      //  更新节点
      patchElement(oldVNode, newVNode)
    }
  }

  const patchElement = (oldVNode, newVNode) => {
    const el = (newVNode.el = oldVNode.el)
    const oldProps = oldVNode.props || EMPTY_OBJ
    const newProps = newVNode.props || EMPTY_OBJ
    // 比较新旧节点的 children 进行更新
    patchChildren(oldVNode, newVNode, el, null)
    // 比较新旧节点的 属性 props 进行更新
    patchProps(el, newVNode, oldProps, newProps)
  }
  // patchChildren 函数需要分为多种情况
  const patchChildren = (oldVNode, newVNode, container, anchor) => {
    const c1 = oldVNode && oldVNode.children
    const prevShapeFlag = oldVNode ? oldVNode.shapeFlag : 0
    const c2 = newVNode && newVNode.children
    const { shapeFlag } = newVNode
    // 注意：子类 children 有三种可能：text array 或者 没有 children
    // 1. 当新节点的 children 是 text 类型时
    // 		1.1 如果 旧节点的 children 是 array 类型时，xxxx
    // 		1.2 否则，都是字符串类型那个，当前后不相等时候，直接调用 hostSetElementText
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // TODO 卸载旧子节点
      }
      if (c2 !== c1) {
        // 挂在新子节点的文本即可
        hostSetElementText(container, c2)
      }
    } else {
      // 2.  否则，新节点的 children 类型不是 text，又分情况
      //    2.1 当旧节点的 children 类型是 array 类型时
      // 		 	2.1.1 如果新节点 children 类型也是 array, 需要做 diff 处理
      //    	2.1.2 否则新节点不是array，也不是 text，直接卸载旧的 children 即可
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          patchKeyedChildren(c1, c2, container, anchor)
        } else {
          // TODO 卸载式操作
        }
      } else {
        // 2.2 否则，新节点 是 text 或者空
        // prev children was text OR null
        // new children is array OR null
        // 如果 旧节点是 text 类型，那么删除 旧节点 text 内容即可
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          // 删除纠结点的text
          hostSetElementText(container, '')
        }
        // 如果 新节点 children 是 array 类型
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // TODO 单独新子节点的挂载
        }
      }
    }
  }

  const patchKeyedChildren = (
    oldChildren,
    newChildren,
    container,
    parentAnchor
  ) => {
    // 索引
    let i = 0
    // 新的子节点的长度
    const newChildrenLength = newChildren.length
    // 旧的子节点最大（最后一个）下标
    let oldChildrenEnd = oldChildren.length - 1
    // 新的子节点最大（最后一个）下标
    let newChildrenEnd = newChildrenLength - 1
    while (i <= oldChildrenEnd && i <= newChildrenEnd) {
      const oldVNode = oldChildren[i]
      const newVNode = normalizeVNode(newChildren[i])
      // 如果 oldVNode 和 newVNode 被认为是同一个 vnode，则直接patch 即可
      if (isSameVNodeType(oldVNode, newVNode)) {
        patch(oldVNode, newVNode, container, null)
      } else {
        // 如果 不认为同一个 vnode,则直接跳出循环
        break
      }
      // 下标自增
      i++
      console.log('第一步')
    }
    // 2. 自后向前的 diff 对比，经过循环之后，从后开始的相同 vnode 将被处理
    while (i <= oldChildrenEnd && i <= newChildrenEnd) {
      const oldVNode = oldChildren[oldChildrenEnd]
      const newVNode = normalizeVNode(newChildren[newChildrenEnd])
      if (isSameVNodeType(oldVNode, newVNode)) {
        patch(oldVNode, newVNode, container, null)
      } else {
        break
      }
      oldChildrenEnd--
      newChildrenEnd--
      console.log('第二步')
    }
    // 3. 新节点多于旧节点的 diff 对比
    if (i > oldChildrenEnd) {
      if (i <= newChildrenEnd) {
        const nextPos = newChildrenEnd + 1
        const anchor =
          nextPos < newChildrenLength ? newChildren[nextPos].el : parentAnchor
        while (i <= newChildrenEnd) {
          patch(null, normalizeVNode(newChildren[i]), container, anchor)
          i++
          console.log('第三步')
        }
      }
    } else if (i > newChildrenEnd) {
      // 4. 旧节点多与新节点时的 diff 比对。
      while (i <= oldChildrenEnd) {
        unmount(oldChildren[i])
        i++
        console.log('第四步')
      }
    } else {
      console.log('需要乱序处理了', i, oldChildrenEnd, newChildrenEnd)
      // 旧子节点的开始索引：oldChildrenStart
      const oldStartIndex = i
      // 新子节点的开始索引：newChildrenStart
      const newStartIndex = i
      console.log(newChildren)
      const keyToNewIndexMap: Map<string | number | symbol, number> = new Map()
      for (i = newStartIndex; i <= newChildrenEnd; i++) {
        const nextChild = normalizeVNode(newChildren[i])
        if (nextChild.key) {
          if (keyToNewIndexMap.has(nextChild.key)) {
            console.warn(
              `Duplicate keys found during update:`,
              JSON.stringify(nextChild.key),
              `Make sure keys are unique.`
            )
          }
          // 把 key 和 对应的索引，放到 keyToNewIndexMap 对象中
          keyToNewIndexMap.set(nextChild.key, i)
        }
      }
      let j
      // 记录已经修复的新节点数量
      let patched = 0
      // 新节点待修补的数量 = newChildrenEnd - newStartIndex + 1
      let toBePatched = newChildrenEnd - newStartIndex + 1
      // 标记位：节点是否需要移动
      let moved = false
      // 配合 moved 进行使用，它始终保存当前最大的 index 值
      let maxNewIndexSoFar = 0
      const newIndexToOldIndexMap = new Array(toBePatched)
      for (i = 0; i < toBePatched; i++) {
        newIndexToOldIndexMap[i] = 0
      }
      for (i = oldStartIndex; i <= oldChildrenEnd; i++) {
        const prevChild = oldChildren[i]
        if (patched >= toBePatched) {
          console.log('patched 大于 toBePatched')
          continue
        }
        let newIndex
        if (prevChild.key !== null) {
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          // 旧节点的 key 不存在（无 key 节点）
          // 那么我们就遍历所有的新节点（s2 = newChildrenStart; e2 = newChildrenEnd），找到《没有找到对应旧节点的新节点，并且该新节点可以和旧节点匹配》（s2 = newChildrenStart; c2 = newChildren），如果能找到，那么 newIndex = 该新节点索引
          for (j = newStartIndex; j < newChildrenEnd; j++) {
            if (
              newIndexToOldIndexMap[j - newStartIndex] === 0 &&
              isSameVNodeType(prevChild, newChildren[j])
            ) {
              // 如果可以找到，那么 newIndex = 该节点索引
              newIndex = j
              break
            }
          }
        }
        // 如果就旧节点的key在新节点组成的keyToNewIndexMap 中没找到，说明这个节点移除了，需要卸载
        if (newIndex === undefined) {
          unmount(prevChild)
        } else {
          // 否则旧节点的key在新节点组成的keyToNewIndexMap中有找到
          // maxNewIndexSoFar 会存储当前最大的 newIndex 它应该是一个递增的，如果没有递增,则说明有节点需要移动
          newIndexToOldIndexMap[newIndex - newStartIndex] = i + 1
          if (newIndex >= maxNewIndexSoFar) {
            // 最大索引，持续递增
            maxNewIndexSoFar = newIndex
          } else {
            // 没有递增，说明需要移动，moved = true
            moved = true
          }
          // 打补丁
          patch(prevChild, newChildren[newIndex], container, null)
          // 已经处理的节点数量进行递增，进行下一个处理
          patched++
        }
      }
      const increasingNewIndexSequence = moved
        ? getSequence(newIndexToOldIndexMap)
        : []
      // j >= 0 表示：初始值为 最长递增子序列的最后下标
      // j < 0 表示：《不存在》最长递增子序列。
      j = increasingNewIndexSequence.length
      // 倒序处理，以便我们可以使用最后修补的节点作为辅助点
      console.log(
        '这里处理 移动和挂载',
        toBePatched,
        increasingNewIndexSequence
      )
      for (i = toBePatched - 1; i >= 0; i--) {
        //   // nextIndex 需要更新的新节点下标
        const nextIndex = newStartIndex + i
        const nextChild = newChildren[nextIndex]
        const anchor =
          nextIndex + 1 < newChildrenLength
            ? newChildren[nextIndex + 1].el
            : parentAnchor
        // 如果 newIndexToOldIndexMap  中保存的 value == 0 表示：新节点没有用对应的旧节点，此时需要挂载新节点
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, anchor)
        } else if (moved) {
          console.log('当前节点')
          console.log(nextChild)
          // moved 为 true 表示需要移动
          // j<0表示：不存在最长递增子序列
          // i !== increasingNewIndexSequence[j] 表示：当前节点不在最后位置，最后一位不需要移动
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor)
          } else {
            // j 随着循环地减，上面的 if 就会走往前一位的判断
            j--
          }
        }
      }
    }
  }
  const move = (vnode, container, anchor) => {
    const el = vnode.el
    hostInsert(el!, container, anchor)
  }

  /**
   * 获取最长递增子序列下标
   * 维基百科：https://en.wikipedia.org/wiki/Longest_increasing_subsequence
   * 百度百科：https://baike.baidu.com/item/%E6%9C%80%E9%95%BF%E9%80%92%E5%A2%9E%E5%AD%90%E5%BA%8F%E5%88%97/22828111
   */
  const getSequence = (arr: number[]) => {
    // 获取一个数组浅拷贝。注意 p 的元素改变并不会影响 arr
    // p 是一个最终的回溯数组，它会在最终的 result 回溯中被使用
    // 它会在每次 result 发生变化时，记录 result 更新前最后一个索引的值
    const p = arr.slice()
    // 定义返回值（最长递增子序列下标），因为下标从 0 开始，所以它的初始值为 0
    const result = [0]
    let i, j, u, v, c
    // 当前数组的长度
    const len = arr.length
    // 对数组中所有的元素进行 for 循环处理，i = 下标
    for (i = 0; i < len; i++) {
      // 根据下标获取当前对应元素
      const arrI = arr[i]
      //
      if (arrI !== 0) {
        // 获取 result 中的最后一个元素，即：当前 result 中保存的最大值的下标
        j = result[result.length - 1]
        // arr[j] = 当前 result 中所保存的最大值
        // arrI = 当前值
        // 如果 arr[j] < arrI 。那么就证明，当前存在更大的序列，那么该下标就需要被放入到 result 的最后位置
        if (arr[j] < arrI) {
          p[i] = j
          // 把当前的下标 i 放入到 result 的最后位置
          result.push(i)
          continue
        }
        // 不满足 arr[j] < arrI 的条件，就证明目前 result 中的最后位置保存着更大的数值的下标。
        // 但是这个下标并不一定是一个递增的序列，比如： [1, 3] 和 [1, 2]
        // 所以我们还需要确定当前的序列是递增的。
        // 计算方式就是通过：二分查找来进行的

        // 初始下标
        u = 0
        // 最终下标
        v = result.length - 1
        // 只有初始下标 < 最终下标时才需要计算
        while (u < v) {
          // (u + v) 转化为 32 位 2 进制，右移 1 位 === 取中间位置（向下取整）例如：8 >> 1 = 4;  9 >> 1 = 4; 5 >> 1 = 2
          // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Right_shift
          // c 表示中间位。即：初始下标 + 最终下标 / 2 （向下取整）
          c = (u + v) >> 1
          // 从 result 中根据 c（中间位），取出中间位的下标。
          // 然后利用中间位的下标，从 arr 中取出对应的值。
          // 即：arr[result[c]] = result 中间位的值
          // 如果：result 中间位的值 < arrI，则 u（初始下标）= 中间位 + 1。即：从中间向右移动一位，作为初始下标。 （下次直接从中间开始，往后计算即可）
          if (arr[result[c]] < arrI) {
            u = c + 1
          } else {
            // 否则，则 v（最终下标） = 中间位。即：下次直接从 0 开始，计算到中间位置 即可。
            v = c
          }
        }
        // 最终，经过 while 的二分运算可以计算出：目标下标位 u
        // 利用 u 从 result 中获取下标，然后拿到 arr 中对应的值：arr[result[u]]
        // 如果：arr[result[u]] > arrI 的，则证明当前  result 中存在的下标 《不是》 递增序列，则需要进行替换
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p[i] = result[u - 1]
          }
          // 进行替换，替换为递增序列
          result[u] = i
        }
      }
    }
    // 重新定义 u。此时：u = result 的长度
    u = result.length
    // 重新定义 v。此时 v = result 的最后一个元素
    v = result[u - 1]
    // 自后向前处理 result，利用 p 中所保存的索引值，进行最后的一次回溯
    while (u-- > 0) {
      result[u] = v
      v = p[v]
    }
    return result
  }

  // 比较新旧接节点的 props
  const patchProps = (el: Element, vnode, oldProps, newProps) => {
    // 如果前后节点 props 不相等
    if (oldProps !== newProps) {
      // 遍历新节点，如果 旧节点中的值与新节点的值不相等，旧更新这个 key
      for (const key in newProps) {
        const next = newProps[key]
        const prev = oldProps[key]
        if (next !== prev) {
          hostPatchProp(el, key, prev, next)
        }
      }
      // 如果旧节点不是 空对象，
      if (oldProps !== EMPTY_OBJ) {
        // 遍历旧节点，如果在新节点中这个 key 不存在，就更新此属性 key 为null
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null)
          }
        }
      }
    }
  }
  const mountElement = (vnode, container, anchor) => {
    const { type, props, children, shapeFlag } = vnode
    //  1. 创建 element
    const el = (vnode.el = hostCreateElement(type))
    //  2. 设置文本
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 新增加，我们之前已经实现过了 mountChildren 方法
      mountChildren(vnode.children, el, anchor)
    }
    //  3. 设置 props
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }
    //  4. 插入
    hostInsert(el, container, anchor)
  }

  const unmount = vnode => {
    // 删除旧节点
    hostRemoveElement(vnode.el)
  }

  const patch = (oldVNode, newVNode, container, anchor = null) => {
    if (oldVNode === newVNode) {
      return
    }
    // 接下来处理 新旧节点不一致的情况
    if (oldVNode && !isSameVNodeType(oldVNode, newVNode)) {
      // 删除旧节点
      unmount(oldVNode)
      // 旧节点置为 null,然后后续 进行 processElement 时候会重新挂载新节点
      oldVNode = null
    }
    const { type, shapeFlag } = newVNode
    switch (type) {
      case Text:
        processText(oldVNode, newVNode, container, anchor)
        break
      case Comment:
        processComment(oldVNode, newVNode, container, anchor)
        break
      case Fragment:
        processFragement(oldVNode, newVNode, container, anchor)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(oldVNode, newVNode, container, anchor)
        } else if (shapeFlag & ShapeFlags.COMPONENT) {
          processComponent(oldVNode, newVNode, container, anchor)
        }
        break
    }
  }
  // 创建 processComponent 函数：
  const processComponent = (oldVNode, newVNode, container, anchor) => {
    if (oldVNode == null) {
      mountComponent(newVNode, container, anchor)
    }
  }

  const mountComponent = (initialVNode, container, anchor) => {
    const instance = (initialVNode.component =
      createComponentInstance(initialVNode))
    setupComponent(instance)
    setupRenderEffect(instance, initialVNode, container, anchor)
  }

  const setupRenderEffect = (instance, initialVNode, container, anchor) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        // 获取 hook
        const { bm, m } = instance
        // beforeMount hook
        if (bm) {
          bm()
        }
        const subTree = (instance.subTree = renderComponentRoot(instance))
        patch(null, subTree, container, anchor)
        initialVNode.el = subTree.el
        instance.isMounted = true
        // mounted hook
        if (m) {
          m()
        }
      } else {
        //-----------新增代码-------------------
        let { next, vnode } = instance
        if (!next) {
          next = vnode
        }
        // 获取下一次的 subTree
        const nextTree = renderComponentRoot(instance)
        // 保存对应的 subTree  以便进行更新操作
        const prevTree = instance.subTree
        instance.subTree = nextTree
        // 通过 patch  进行更新操作
        patch(prevTree, nextTree, container, anchor)
        // 更新 next
        next.el = nextTree.el
      }
    }

    const effect = (instance.effect = new ReactiveEffect(
      componentUpdateFn,
      () => {
        queuePreFlushCb(update)
      }
    ))
    const update = (instance.update = () => effect.run())
    update()
  }

  const processFragement = (oldVNode, newVNode, container, anchor) => {
    if (!oldVNode) {
      mountChildren(newVNode.children, container, anchor)
    } else {
      patchChildren(oldVNode, newVNode, container, anchor)
    }
  }
  // 对children 的循环渲染
  const mountChildren = (nodeChildren, container, anchor) => {
    if (isString(nodeChildren)) {
      nodeChildren = nodeChildren.split('')
    }
    for (let index = 0; index < nodeChildren.length; index++) {
      const child = (nodeChildren[index] = normalizeVNode(nodeChildren[index]))
      patch(null, child, container, anchor)
    }
  }

  const processComment = (oldVNode, newVNode, container, anchor) => {
    if (!oldVNode) {
      const el = (newVNode.el = hostCreateComment(newVNode.children))
      hostInsert(el, container)
    } else {
      newVNode.el = oldVNode.el
    }
  }

  const processText = (oldVNode, newVNode, container, anchor) => {
    if (!oldVNode) {
      // 挂载节点操作
      const el = (newVNode.el = hostCreateText(newVNode.children))
      hostInsert(el, container, anchor)
    } else {
      // 更新操作
      const el = (newVNode.el = oldVNode.el!)
      if (newVNode.children !== oldVNode.children) {
        hostSetText(el, newVNode.children)
      }
    }
  }
  const render = (vnode, container) => {
    if (vnode == null) {
      // TODO 卸载
      // 当传入的新节点为空，但是旧节点存在
      if (container._vnode) {
        // 直接对旧节点进行 卸载 即可
        unmount(container._vnode)
      }
    } else {
      patch(container._vnode || null, vnode, container)
    }
    container._vnode = vnode
  }
  return {
    render
  }
}

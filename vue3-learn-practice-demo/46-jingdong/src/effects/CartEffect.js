import { computed } from 'vue'
import { useStore } from 'vuex'
// 购物车相关逻辑
export const useCartEffect = shopId => {
  const store = useStore()
  const cartList = store.state.cartList
  // 商品数量的增减
  const changeCartItemInfo = (
    shopId,
    productId,
    productInfo,
    num,
    shopName
  ) => {
    // 提交changeCartItemInfo事件 可以同步修改store的数据
    store.commit('changeCartItemInfo', {
      shopId,
      productId,
      productInfo,
      num,
      shopName
    })
  }

  // 购物车数据统计
  const calculations = computed(() => {
    const productList = cartList[shopId]?.productList
    let count = 0 // 商品总数
    let price = 0 // 总价
    let isCheckedAll = true // 全选
    let cartStatus = true // 购物车空状态
    if (productList) {
      for (const i in productList) {
        const product = productList[i]
        if (product.checked) {
          count += product.count
        }
        if (product.checked) {
          price += product.count * product.price
        }
        if (!productList[i].checked) {
          isCheckedAll = false
        }
        if (product.count) {
          cartStatus = false
        }
      }
    }
    return { count, price: price.toFixed(1), isCheckedAll, cartStatus }
  })

  // 商品列表
  const productList = computed(() => {
    return cartList[shopId]?.productList || []
  })

  // 商店名称
  const shopName = computed(() => {
    return cartList[shopId]?.shopName || ''
  })

  return { changeCartItemInfo, cartList, calculations, productList, shopName }
}
